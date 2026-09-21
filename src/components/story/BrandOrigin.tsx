/**
 * Origin — an original, abstract globe drawn as inline SVG (orthographic
 * graticule + halftone field, no external map, no landmass data). The only
 * geographic mark is a single dot for Việt Nam; no other country is shown,
 * so nothing implies markets, distribution or milestones. The three "numbers"
 * beneath are brand concepts, not company metrics.
 */

const VB_W = 800;
const VB_H = 640;
const CX = 470;
const CY = 350;
const R = 250;
const LON0 = 100; // globe is turned so Việt Nam sits upper-right of centre
const LAT0 = 8;

const rad = (d: number) => (d * Math.PI) / 180;

function project(lat: number, lon: number) {
  const phi = rad(lat);
  const lam = rad(lon - LON0);
  const phi0 = rad(LAT0);
  const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam);
  const x = Math.cos(phi) * Math.sin(lam);
  const y = Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam);
  return { x: CX + R * x, y: CY - R * y, visible: cosc >= 0 };
}

/** Polyline through (lat, lon) samples, broken wherever the far side of the globe begins. */
function trace(samples: Array<[number, number]>) {
  let d = "";
  let pen = false;
  for (const [lat, lon] of samples) {
    const p = project(lat, lon);
    if (!p.visible) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    pen = true;
  }
  return d;
}

const GRATICULE = (() => {
  const paths: string[] = [];
  for (let lat = -60; lat <= 80; lat += 20) {
    const s: Array<[number, number]> = [];
    for (let lon = -180; lon <= 180; lon += 6) s.push([lat, lon]);
    paths.push(trace(s));
  }
  for (let lon = -180; lon < 180; lon += 20) {
    const s: Array<[number, number]> = [];
    for (let lat = -90; lat <= 90; lat += 6) s.push([lat, lon]);
    paths.push(trace(s));
  }
  return paths.filter(Boolean).join(" ");
})();

const VN = project(16, 108);
const LABEL_X = VN.x + 98;
const LABEL_Y = VN.y - 58;

const CONCEPTS = [
  { index: "01", title: "DOPA + MIND", body: "Hai ý niệm tạo nên một tên gọi." },
  { index: "02", title: "15:00", body: "Một khoảng thời gian dành cho bạn." },
  { index: "03", title: "MIND–SKIN CARE", body: "Một góc nhìn kết nối skincare và trải nghiệm." },
] as const;

export function BrandOrigin() {
  return (
    <section
      aria-labelledby="bs-origin-title"
      className="bg-[color-mix(in_srgb,var(--color-lavender)_26%,var(--color-cloud-milk))] py-[clamp(72px,8vw,120px)]"
    >
      <div className="bs-wrap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-[clamp(32px,4vw,64px)] xl:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] xl:gap-[clamp(40px,4.5vw,80px)]">
          {/* Copy */}
          <div className="bs-cq max-w-[38rem] md:max-w-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs">
              TỪ VIỆT NAM, KỂ MỘT CÂU CHUYỆN MỚI
            </p>
            <h2
              id="bs-origin-title"
              className="mt-5 font-serif text-[clamp(1.9rem,10.5cqi,3.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-charcoal"
            >
              <span className="block">Từ Việt Nam,</span>
              <span className="block">kể một câu chuyện</span>
              <span className="bs-accent block italic">Mind–Skin Care.</span>
            </h2>
            <p className="mt-7 text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
              DOPAMIND được xây dựng với mong muốn tạo nên một trải nghiệm chăm sóc da hiện đại —
              nơi sản phẩm, cảm xúc và khoảng thời gian dành cho bản thân cùng tồn tại trong một
              ngôn ngữ thống nhất.
            </p>
            <p className="mt-4 text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
              Hành trình phía trước sẽ được viết bằng những sản phẩm, câu chuyện và khoảnh khắc
              thật.
            </p>
          </div>

          {/* Atmospheric globe */}
          <div
            className="bs-sweep relative aspect-[5/4] rounded-[12px]"
            style={{
              backgroundImage:
                "radial-gradient(90% 80% at 68% 44%, rgb(255 255 255 / 0.9), transparent 62%), linear-gradient(160deg, color-mix(in srgb, var(--color-lavender) 60%, var(--color-cloud-milk)), var(--color-cloud-milk) 78%)",
            }}
          >
            <svg
              aria-hidden
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <defs>
                <radialGradient id="bo-globe" cx="0.38" cy="0.32" r="0.8">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="0.6" stopColor="#D8D2FF" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#9688FF" stopOpacity="0.22" />
                </radialGradient>
                <radialGradient id="bo-fade" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask id="bo-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                  <circle cx={CX} cy={CY} r={R} fill="url(#bo-fade)" />
                </mask>
                <pattern id="bo-dots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1.1" fill="#9688FF" fillOpacity="0.5" />
                </pattern>
              </defs>

              {/* Orbits behind + a pearl bead */}
              <ellipse
                cx={CX}
                cy={CY}
                rx={R * 1.2}
                ry={R * 0.4}
                transform={`rotate(-24 ${CX} ${CY})`}
                stroke="#9688FF"
                strokeOpacity="0.28"
                strokeWidth="1"
              />
              <ellipse
                cx={CX}
                cy={CY}
                rx={R * 1.42}
                ry={R * 0.56}
                transform={`rotate(-24 ${CX} ${CY})`}
                stroke="#9688FF"
                strokeOpacity="0.16"
                strokeWidth="1"
                strokeDasharray="2 7"
              />

              {/* Globe body */}
              <circle cx={CX} cy={CY} r={R} fill="url(#bo-globe)" />
              <circle cx={CX} cy={CY} r={R} fill="url(#bo-dots)" mask="url(#bo-mask)" />
              <path d={GRATICULE} stroke="#25252B" strokeOpacity="0.12" strokeWidth="1" />
              <circle cx={CX} cy={CY} r={R} stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" />
              <circle cx={CX} cy={CY} r={R} stroke="#9688FF" strokeOpacity="0.3" strokeWidth="1" />

              {/* Việt Nam — the only marked place */}
              <circle cx={VN.x} cy={VN.y} r="16" stroke="#9688FF" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx={VN.x} cy={VN.y} r="9" fill="#9688FF" fillOpacity="0.22" />
              <circle cx={VN.x} cy={VN.y} r="4" fill="#9688FF" />
              <path
                d={`M${VN.x + 11} ${VN.y - 11} L${VN.x + 42} ${LABEL_Y} L${LABEL_X - 8} ${LABEL_Y}`}
                stroke="#25252B"
                strokeOpacity="0.4"
                strokeWidth="1"
              />

              {/* Near-side pearl on the orbit */}
              <circle cx={CX - R * 1.05} cy={CY + R * 0.2} r="6" fill="#fff" stroke="#9688FF" strokeOpacity="0.4" />
            </svg>

            <p
              className="absolute -translate-y-1/2 pl-1 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/80 sm:text-[11px]"
              style={{ left: `${(LABEL_X / VB_W) * 100}%`, top: `${(LABEL_Y / VB_H) * 100}%` }}
            >
              VIỆT NAM
            </p>
            <p className="absolute left-[5%] top-[7%] text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-[11px]">
              FROM VIETNAM
            </p>
            <p className="absolute bottom-[7%] left-[5%] text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-[11px]">
              A NEW MIND–SKIN STORY
            </p>
          </div>
        </div>

        {/* Brand concepts — where the reference shows milestones, we show ideas */}
        <ol className="mt-[clamp(40px,5vw,72px)] grid border-t border-charcoal/15 md:grid-cols-3">
          {CONCEPTS.map((c) => (
            <li
              key={c.index}
              className="border-b border-charcoal/10 py-6 last:border-b-0 md:border-b-0 md:border-l md:px-[clamp(20px,3vw,48px)] md:py-8 md:first:border-l-0 md:first:pl-0"
            >
              <p className="text-[11px] font-medium tracking-[0.2em] text-charcoal/60">
                <span className="text-purple">{c.index}</span>
              </p>
              <p className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-charcoal">
                {c.title}
              </p>
              <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-charcoal/70">{c.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
