"use client";

import { useEffect, useRef } from "react";

/** WebGL ink-bleed shader — Hot Metal Proof living texture (seed-driven palette). */
export function InkShader({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const vs = `
      attribute vec2 a;
      void main(){ gl_Position = vec4(a,0.0,1.0); }
    `;
    const fs = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_t;
      // Hot Metal: bone, ink, acid, rose
      vec3 bone = vec3(0.949, 0.929, 0.890);
      vec3 ink  = vec3(0.067, 0.075, 0.102);
      vec3 acid = vec3(0.855, 0.886, 0.471);
      vec3 rose = vec3(0.624, 0.341, 0.384);

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p); vec2 f=fract(p);
        float a=hash(i); float b=hash(i+vec2(1.,0.));
        float c=hash(i+vec2(0.,1.)); float d=hash(i+vec2(1.,1.));
        vec2 u=f*f*(3.-2.*f);
        return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v=0.; float a=.5;
        for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.05; a*=.55; }
        return v;
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = (gl_FragCoord.xy - .5*u_res.xy) / min(u_res.x,u_res.y);
        float t = u_t * 0.15;
        float blot = fbm(p*2.2 + vec2(t, -t*0.7));
        float ring = smoothstep(0.55, 0.2, length(p*1.1 + 0.15*sin(t+p.yx*3.0)) - blot*0.35);
        float grain = noise(gl_FragCoord.xy * 0.6 + t*10.0);
        vec3 col = mix(bone, ink, ring * (0.75 + 0.25*grain));
        float spark = smoothstep(0.72, 0.9, fbm(p*3.0 - t));
        col = mix(col, acid, spark * ring * 0.55);
        float edge = smoothstep(0.35, 0.55, blot) * (1.0-ring);
        col = mix(col, rose, edge * 0.35);
        float alpha = 0.55 + ring * 0.35;
        gl_FragColor = vec4(col, alpha);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");

    let raf = 0;
    const start = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
