"use client";

import type { ComponentType } from "react";

import { createShader } from "./shader-canvas";

/**
 * Nine fragment shaders, one per card design. Frequencies are kept low on
 * purpose: these render inside a ~336x211px card, so large soft shapes read
 * far better than fine detail.
 *
 * Every shader gets `u_time`, `u_resolution`, plus `hash/noise/fbm/centered()`
 * from GLSL_PRELUDE in ./shader-canvas.
 */

// 0 — Aurora: slow vertical curtains of teal and violet
const AURORA = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.18;
  float band = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float y = 0.5
      + 0.22 * sin(uv.x * 2.6 + t * (1.0 + fi * 0.35) + fi * 2.1)
      + 0.10 * sin(uv.x * 5.3 - t * 1.7 + fi);
    band += 0.055 / abs(uv.y - y);
  }
  vec3 teal = vec3(0.05, 0.85, 0.72);
  vec3 violet = vec3(0.42, 0.24, 0.92);
  vec3 col = mix(violet, teal, clamp(uv.y + 0.15 * sin(t), 0.0, 1.0));
  col *= clamp(band, 0.0, 2.4);
  col += vec3(0.02, 0.03, 0.07);
  gl_FragColor = vec4(col, 1.0);
}
`;

// 1 — Liquid metal: domain-warped fbm with a chrome ramp
const LIQUID_METAL = `
void main() {
  vec2 p = centered() * 1.3;
  float t = u_time * 0.12;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.2, 1.7) - t));
  float v = fbm(p + 1.8 * q + t * 0.4);
  float shine = pow(clamp(v, 0.0, 1.0), 1.6);
  vec3 col = mix(vec3(0.07, 0.07, 0.09), vec3(0.86, 0.88, 0.95), shine);
  col += vec3(0.25) * pow(smoothstep(0.55, 1.0, v), 6.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

// 2 — Plasma: classic interfering sines, magenta to amber
const PLASMA = `
void main() {
  vec2 p = centered();
  float t = u_time * 0.5;
  float v = sin(p.x * 3.0 + t)
    + sin(p.y * 3.4 - t * 0.8)
    + sin((p.x + p.y) * 2.6 + t * 1.3)
    + sin(length(p * 2.4) * 3.0 - t * 1.1);
  v *= 0.25;
  vec3 a = vec3(0.98, 0.18, 0.42);
  vec3 b = vec3(1.00, 0.68, 0.16);
  vec3 c = vec3(0.16, 0.06, 0.24);
  vec3 col = mix(c, mix(a, b, 0.5 + 0.5 * sin(v * 3.14159 + t * 0.4)), 0.35 + 0.65 * (0.5 + 0.5 * v));
  gl_FragColor = vec4(col, 1.0);
}
`;

// 3 — Mesh gradient: four drifting radial blobs, blue / indigo
const MESH_GRADIENT = `
vec3 blob(vec2 p, vec2 c, vec3 col, float r) {
  return col * (r / (r + dot(p - c, p - c) * 3.0));
}
void main() {
  vec2 p = centered();
  float t = u_time * 0.28;
  vec3 col = vec3(0.03, 0.04, 0.10);
  col += blob(p, vec2(sin(t) * 0.6, cos(t * 0.8) * 0.4), vec3(0.16, 0.42, 1.00), 0.34);
  col += blob(p, vec2(cos(t * 1.1) * 0.7, sin(t * 0.7) * 0.5), vec3(0.45, 0.22, 0.95), 0.30);
  col += blob(p, vec2(sin(t * 0.6 + 2.0) * 0.5, cos(t + 1.0) * 0.6), vec3(0.06, 0.78, 0.90), 0.22);
  col += blob(p, vec2(cos(t * 0.9 + 3.5) * 0.8, sin(t * 1.3) * 0.3), vec3(0.92, 0.30, 0.70), 0.18);
  gl_FragColor = vec4(col, 1.0);
}
`;

// 4 — Silk: layered stacked waves in champagne gold
const SILK = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.22;
  float acc = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float phase = fi * 0.9;
    float y = 0.5 + 0.18 * sin(uv.x * 3.2 + t + phase) + 0.07 * sin(uv.x * 7.1 - t * 1.4 + phase);
    acc += smoothstep(0.012, 0.0, abs(uv.y - y)) * (0.6 + 0.4 * sin(phase));
  }
  vec3 base = mix(vec3(0.09, 0.07, 0.04), vec3(0.32, 0.24, 0.10), uv.y);
  vec3 gold = vec3(1.00, 0.84, 0.48);
  gl_FragColor = vec4(base + gold * acc * 0.75, 1.0);
}
`;

// 5 — Nebula: two octave-scaled fbm clouds over deep space
const NEBULA = `
void main() {
  vec2 p = centered() * 1.1;
  float t = u_time * 0.06;
  float cloud = fbm(p * 1.6 + vec2(t, -t * 0.7));
  float wisp = fbm(p * 3.1 - vec2(t * 1.4, t));
  float d = clamp(cloud * 1.2 - wisp * 0.4, 0.0, 1.0);
  vec3 deep = vec3(0.02, 0.02, 0.07);
  vec3 mid = vec3(0.36, 0.12, 0.62);
  vec3 hot = vec3(0.98, 0.42, 0.72);
  vec3 col = mix(deep, mid, smoothstep(0.25, 0.7, d));
  col = mix(col, hot, pow(smoothstep(0.6, 1.0, d), 2.0));
  // sparse stars
  float star = step(0.9975, hash(floor(gl_FragCoord.xy * 0.75)));
  col += star * (0.6 + 0.4 * sin(u_time * 3.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

// 6 — Caustics: water light patterns, emerald
const CAUSTICS = `
void main() {
  vec2 p = centered() * 2.0;
  float t = u_time * 0.35;
  float acc = 0.0;
  vec2 q = p;
  for (int i = 0; i < 4; i++) {
    float fi = float(i) + 1.0;
    q += vec2(sin(q.y * 1.7 + t * fi * 0.4), cos(q.x * 1.9 - t * fi * 0.3)) * 0.35;
    acc += 1.0 / (abs(sin(q.x + q.y + t * 0.5)) * 6.0 + 0.55);
  }
  acc *= 0.16;
  vec3 deep = vec3(0.01, 0.10, 0.11);
  vec3 lit = vec3(0.35, 1.00, 0.78);
  gl_FragColor = vec4(mix(deep, lit, clamp(acc, 0.0, 1.0)), 1.0);
}
`;

// 7 — Sunset ribbons: warm horizontal folds
const SUNSET = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.25;
  float fold = sin(uv.x * 4.0 + t) * 0.12
    + sin(uv.x * 9.0 - t * 1.6) * 0.05
    + fbm(vec2(uv.x * 2.0, t * 0.3)) * 0.18;
  float g = clamp(uv.y + fold, 0.0, 1.0);
  vec3 col = mix(vec3(0.55, 0.05, 0.25), vec3(1.00, 0.55, 0.15), smoothstep(0.0, 0.6, g));
  col = mix(col, vec3(1.00, 0.88, 0.62), smoothstep(0.65, 1.0, g));
  col *= 0.85 + 0.25 * sin(g * 22.0 + t * 2.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

// 8 — Carbon flow: dark graphite with a slow moving specular sweep
const CARBON_FLOW = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = centered();
  float t = u_time * 0.3;
  float weave = sin(uv.x * 90.0) * sin(uv.y * 90.0);
  float grain = noise(gl_FragCoord.xy * 0.9) * 0.06;
  float base = 0.09 + 0.035 * weave + grain;
  float sweep = smoothstep(0.45, 0.0, abs(p.x * 0.7 + p.y * 0.4 - sin(t) * 1.2));
  vec3 col = vec3(base) + vec3(0.30, 0.34, 0.42) * sweep * 0.9;
  col += vec3(0.10, 0.45, 0.95) * sweep * sweep * 0.35;
  gl_FragColor = vec4(col, 1.0);
}
`;

// Typed as possibly-undefined entries so consumers can keep their solid-color
// fallback branch (`ShaderComponent ? ... : CARD_COLORS[...]`) meaningful.
export const SHADERS_MAP: Array<ComponentType | undefined> = [
  createShader(AURORA),
  createShader(LIQUID_METAL),
  createShader(PLASMA),
  createShader(MESH_GRADIENT),
  createShader(SILK),
  createShader(NEBULA),
  createShader(CAUSTICS),
  createShader(SUNSET),
  createShader(CARBON_FLOW),
];

export default SHADERS_MAP;
