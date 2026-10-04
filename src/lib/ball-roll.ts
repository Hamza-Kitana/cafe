/* Sphere maths for billiard balls: the print lives on the ball, the light stays put. */

type V3 = [number, number, number];
/** Row-major 3×3 rotation matrix. */
export type Orient = number[];

const R = 49;
const STRIPE_W = 23 / R;
const DISC_W = Math.cos(Math.asin(20 / R));

export const identity = (): Orient => [1, 0, 0, 0, 1, 0, 0, 0, 1];
const col = (m: Orient, i: number): V3 => [m[i]!, m[3 + i]!, m[6 + i]!];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const f = (n: number) => (50 + R * n).toFixed(2);

/** Rotate `m` as if the ball rolled (dx, dy) on the table; `radius` is in the same units. */
export function roll(m: Orient, dx: number, dy: number, radius: number): Orient {
  const d = Math.hypot(dx, dy);
  if (d < 1e-6) return m;
  const k: V3 = [-dy / d, dx / d, 0];
  const th = d / radius;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const t = 1 - c;
  const [x, y, z] = k;
  const r = [
    t * x * x + c,
    t * x * y - s * z,
    t * x * z + s * y,
    t * x * y + s * z,
    t * y * y + c,
    t * y * z - s * x,
    t * x * z - s * y,
    t * y * z + s * x,
    t * z * z + c,
  ];
  const out: Orient = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      out.push(r[i * 3]! * m[j]! + r[i * 3 + 1]! * m[3 + j]! + r[i * 3 + 2]! * m[6 + j]!);
  // re-orthonormalise so long scrubs don't drift
  const a = norm(col(out, 0));
  const b = norm(cross(col(out, 2), a));
  const cz = cross(a, b);
  return [a[0], b[0], cz[0], a[1], b[1], cz[1], a[2], b[2], cz[2]];
}

/** Visible part of the spherical cap {p · axis > w}, projected top-down, as an SVG path. */
function cap(axis: V3, w: number): string {
  const N = 44;
  const t: V3 = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = norm(cross(axis, t));
  const v = cross(axis, u);
  const rho = Math.sqrt(1 - w * w);
  const pts: V3[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const c = Math.cos(a) * rho;
    const s = Math.sin(a) * rho;
    pts.push([
      axis[0] * w + u[0] * c + v[0] * s,
      axis[1] * w + u[1] * c + v[1] * s,
      axis[2] * w + u[2] * c + v[2] * s,
    ]);
  }
  const front = pts.map((p) => p[2] > 0);
  if (front.every(Boolean)) return `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L")}Z`;
  if (!front.some(Boolean)) return "";
  let s0 = front.findIndex((on, i) => on && !front[(i - 1 + N) % N]);
  const run: V3[] = [];
  const edge = (a: V3, b: V3) => {
    const k = a[2] / (a[2] - b[2]);
    const x = a[0] + (b[0] - a[0]) * k;
    const y = a[1] + (b[1] - a[1]) * k;
    const l = Math.hypot(x, y) || 1;
    return [x / l, y / l, 0] as V3;
  };
  run.push(edge(pts[(s0 - 1 + N) % N]!, pts[s0]!));
  while (front[s0 % N]) run.push(pts[s0++ % N]!);
  run.push(edge(pts[(s0 - 1) % N]!, pts[s0 % N]!));
  const pe = run[run.length - 1]!;
  const ps = run[0]!;
  const ae = Math.atan2(pe[1], pe[0]);
  let delta = (Math.atan2(ps[1], ps[0]) - ae + Math.PI * 4) % (Math.PI * 2);
  const mid = ae + delta / 2;
  if (axis[0] * Math.cos(mid) + axis[1] * Math.sin(mid) < w) delta -= Math.PI * 2;
  for (let i = 1; i < 12; i++) {
    const a = ae + (delta * i) / 12;
    run.push([Math.cos(a), Math.sin(a), 0]);
  }
  return `M${run.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L")}Z`;
}

/** Paint ball `n` at orientation `m` into its rendered <svg>. */
export function orientBall(svg: SVGSVGElement, n: number, m: Orient) {
  const q = (s: string) => svg.querySelector<SVGElement>(s);
  q(".bp-static")?.setAttribute("display", "none");
  if (n > 8) {
    const a = col(m, 1);
    q(".bp-cap0")?.setAttribute("d", cap(a, STRIPE_W));
    q(".bp-cap1")?.setAttribute("d", cap([-a[0], -a[1], -a[2]], STRIPE_W));
  }
  if (n > 0) {
    const p = col(m, 2);
    const e1 = col(m, 0);
    const e2 = col(m, 1);
    q(".bp-disc")?.setAttribute("d", cap(p, DISC_W));
    const num = q(".bp-num");
    if (num) {
      num.setAttribute(
        "transform",
        `matrix(${e1[0].toFixed(3)} ${e1[1].toFixed(3)} ${e2[0].toFixed(3)} ${e2[1].toFixed(3)} ${f(p[0])} ${f(p[1])})`,
      );
      num.setAttribute("opacity", p[2] > 0.08 ? "1" : "0");
    }
  }
}
