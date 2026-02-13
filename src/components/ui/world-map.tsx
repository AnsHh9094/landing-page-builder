import { useRef, useEffect, useCallback, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface Dot {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
}

interface WorldMapProps {
    dots?: Dot[];
    lineColor?: string;
}

function latLngToXY(lat: number, lng: number, width: number, height: number) {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
}

function getQuadraticPoint(
    sx: number, sy: number,
    cx: number, cy: number,
    ex: number, ey: number,
    t: number
) {
    const x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
    const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
    return { x, y };
}

interface Pulse {
    lineIndex: number;
    t: number;
    speed: number;
    size: number;
    opacity: number;
}

// Detailed continent polygons (simplified lat/lng boundary points)
// Each continent is defined as a polygon of [lat,lng] pairs
const CONTINENT_POLYGONS: [number, number][][] = [
    // North America
    [
        [70, -165], [72, -140], [70, -100], [65, -90], [60, -80], [55, -65], [50, -55],
        [45, -60], [43, -65], [40, -70], [35, -75], [30, -80], [25, -80], [25, -85],
        [20, -87], [15, -85], [15, -90], [18, -95], [20, -100], [25, -105], [30, -110],
        [32, -115], [35, -120], [40, -125], [48, -125], [50, -128], [55, -133],
        [58, -140], [60, -148], [60, -160], [65, -168], [70, -165],
    ],
    // South America
    [
        [12, -70], [10, -75], [5, -77], [0, -78], [-5, -80], [-5, -75], [-10, -75],
        [-15, -75], [-18, -70], [-22, -70], [-30, -70], [-35, -70], [-40, -65],
        [-45, -68], [-48, -72], [-50, -74], [-53, -70], [-55, -68], [-55, -65],
        [-50, -58], [-45, -55], [-40, -50], [-35, -50], [-30, -48], [-25, -45],
        [-20, -40], [-15, -38], [-10, -35], [-5, -35], [0, -50], [5, -55],
        [8, -60], [10, -65], [12, -70],
    ],
    // Europe
    [
        [70, -10], [72, 20], [70, 30], [65, 30], [60, 30], [55, 28],
        [50, 30], [48, 25], [45, 28], [43, 25], [40, 25], [38, 22],
        [36, 22], [36, -5], [38, -8], [40, -10], [43, -8], [45, -2],
        [48, -5], [50, -5], [55, 8], [57, 5], [58, 8], [60, 5],
        [63, -5], [65, -10], [70, -10],
    ],
    // Africa
    [
        [37, -10], [35, 10], [33, 12], [30, 32], [25, 35], [20, 38],
        [15, 42], [12, 45], [10, 50], [5, 42], [0, 42], [-5, 40],
        [-10, 40], [-15, 38], [-20, 35], [-25, 33], [-30, 30], [-33, 28],
        [-35, 20], [-34, 18], [-30, 18], [-25, 15], [-20, 12], [-15, 12],
        [-10, 14], [-5, 10], [0, 10], [5, 5], [5, -5], [10, -15],
        [15, -17], [20, -17], [25, -15], [30, -10], [35, -5], [37, -10],
    ],
    // Asia
    [
        [70, 30], [72, 50], [70, 70], [72, 90], [73, 110], [72, 130],
        [70, 140], [65, 145], [60, 150], [55, 140], [50, 135],
        [45, 140], [40, 140], [35, 130], [30, 120], [25, 120],
        [22, 115], [20, 110], [15, 105], [10, 105], [5, 100],
        [0, 105], [-5, 105], [-8, 115], [-5, 120], [-2, 115],
        [5, 98], [10, 100], [15, 100], [20, 95], [25, 90],
        [22, 88], [20, 85], [15, 75], [20, 70], [25, 65],
        [28, 60], [25, 55], [22, 55], [15, 50], [12, 45],
        [15, 42], [20, 38], [25, 35], [30, 35], [35, 35],
        [40, 45], [42, 50], [45, 50], [50, 55], [55, 60],
        [60, 60], [65, 60], [60, 40], [55, 30], [60, 30],
        [65, 30], [70, 30],
    ],
    // Australia
    [
        [-12, 130], [-15, 125], [-20, 118], [-25, 114], [-30, 115],
        [-35, 117], [-37, 140], [-38, 145], [-35, 150], [-30, 153],
        [-25, 153], [-20, 148], [-15, 145], [-12, 142], [-10, 135],
        [-12, 130],
    ],
    // Greenland
    [
        [82, -35], [82, -20], [78, -18], [72, -20], [68, -25],
        [65, -40], [68, -50], [72, -55], [76, -60], [80, -50],
        [82, -35],
    ],
    // UK/Ireland
    [
        [58, -7], [57, -2], [54, 0], [51, 1], [50, -5], [52, -6],
        [53, -10], [55, -8], [58, -7],
    ],
    // Japan
    [
        [45, 145], [43, 143], [40, 140], [35, 137], [33, 131],
        [31, 131], [33, 135], [35, 140], [38, 142], [42, 145],
        [45, 145],
    ],
    // Indonesia/Malaysia
    [
        [-2, 100], [-5, 105], [-7, 108], [-8, 112], [-7, 115],
        [-5, 115], [-3, 110], [-1, 105], [-2, 100],
    ],
    [
        [-1, 120], [-3, 125], [-5, 130], [-3, 135], [-1, 135],
        [0, 130], [0, 125], [-1, 120],
    ],
    // New Zealand
    [
        [-35, 173], [-38, 175], [-42, 172], [-46, 167], [-45, 167],
        [-42, 172], [-38, 177], [-35, 173],
    ],
    // Madagascar
    [
        [-12, 49], [-16, 47], [-20, 44], [-24, 44], [-25, 47],
        [-22, 49], [-18, 50], [-14, 50], [-12, 49],
    ],
];

// Point-in-polygon test using ray casting
function isPointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const yi = polygon[i][0], xi = polygon[i][1];
        const yj = polygon[j][0], xj = polygon[j][1];
        const intersect = (yi > lat) !== (yj > lat) &&
            (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function isLand(lat: number, lng: number): boolean {
    for (const polygon of CONTINENT_POLYGONS) {
        if (isPointInPolygon(lat, lng, polygon)) return true;
    }
    return false;
}

// Pre-compute land dot positions for a given resolution
function computeLandDots(w: number, h: number, spacing: number): { x: number; y: number }[] {
    const dots: { x: number; y: number }[] = [];
    for (let px = 0; px < w; px += spacing) {
        for (let py = 0; py < h; py += spacing) {
            // Convert pixel to lat/lng
            const lng = (px / w) * 360 - 180;
            const lat = 90 - (py / h) * 180;
            if (isLand(lat, lng)) {
                dots.push({ x: px, y: py });
            }
        }
    }
    return dots;
}

export function WorldMap({ dots = [], lineColor = "hsl(220, 15%, 45%)" }: WorldMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const pulsesRef = useRef<Pulse[]>([]);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const [hoveredLine, setHoveredLine] = useState<number | null>(null);
    const linesRef = useRef<Array<{
        sx: number; sy: number;
        cx: number; cy: number;
        ex: number; ey: number;
    }>>([]);
    const landDotsRef = useRef<{ x: number; y: number }[]>([]);
    const lastSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        }

        const w = rect.width;
        const h = rect.height;

        // Re-compute land dots if size changed
        if (lastSizeRef.current.w !== Math.round(w) || lastSizeRef.current.h !== Math.round(h)) {
            lastSizeRef.current = { w: Math.round(w), h: Math.round(h) };
            const spacing = Math.max(4, Math.round(w / 230)); // Dense dots
            landDotsRef.current = computeLandDots(w, h, spacing);
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const time = Date.now() / 1000;

        // Draw land dots
        const mx = mouseRef.current?.x ?? -1000;
        const my = mouseRef.current?.y ?? -1000;

        landDotsRef.current.forEach(({ x, y }) => {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let alpha = isDark ? 0.18 : 0.4;
            let radius = isDark ? 1.2 : 1.6;

            // Interactive glow near cursor
            if (dist < 120) {
                const factor = 1 - dist / 120;
                alpha = (isDark ? 0.18 : 0.4) + 0.5 * factor;
                radius = (isDark ? 1.2 : 1.6) + 0.8 * factor;
            }

            ctx.fillStyle = isDark
                ? `rgba(180, 195, 220, ${alpha})`
                : `rgba(20, 30, 60, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Compute line geometries
        const lines = dots.map((dot) => {
            const start = latLngToXY(dot.start.lat, dot.start.lng, w, h);
            const end = latLngToXY(dot.end.lat, dot.end.lng, w, h);
            const midX = (start.x + end.x) / 2;
            const midY = Math.min(start.y, end.y) - 50 - Math.abs(start.x - end.x) * 0.1;
            return { sx: start.x, sy: start.y, cx: midX, cy: midY, ex: end.x, ey: end.y };
        });
        linesRef.current = lines;

        // Draw connection lines with animated wave
        lines.forEach((line, i) => {
            const isHovered = hoveredLine === i;
            const segments = 80;

            for (let s = 0; s < segments; s++) {
                const t1 = s / segments;
                const t2 = (s + 1) / segments;
                const p1 = getQuadraticPoint(line.sx, line.sy, line.cx, line.cy, line.ex, line.ey, t1);
                const p2 = getQuadraticPoint(line.sx, line.sy, line.cx, line.cy, line.ex, line.ey, t2);

                const wave = Math.sin((t1 * 8 - time * 2 + i * 1.5)) * 0.3 + 0.5;
                const baseAlpha = isHovered ? 0.8 : 0.35;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = lineColor;
                ctx.globalAlpha = baseAlpha * wave;
                ctx.lineWidth = isHovered ? 2.5 : 1.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            // Endpoint dots with pulse
            const startPulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
            const endPulse = Math.sin(time * 2 + i + Math.PI) * 0.3 + 0.7;

            // Start dot
            ctx.beginPath();
            ctx.arc(line.sx, line.sy, isHovered ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.globalAlpha = startPulse;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Start glow ring
            ctx.beginPath();
            ctx.arc(line.sx, line.sy, isHovered ? 9 : 6, 0, Math.PI * 2);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = 0.15 * startPulse;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;

            // End dot
            ctx.beginPath();
            ctx.arc(line.ex, line.ey, isHovered ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.globalAlpha = endPulse;
            ctx.fill();
            ctx.globalAlpha = 1;

            // End glow ring
            ctx.beginPath();
            ctx.arc(line.ex, line.ey, isHovered ? 9 : 6, 0, Math.PI * 2);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = 0.15 * endPulse;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
        });

        // Draw traveling pulses
        pulsesRef.current.forEach((pulse) => {
            const line = lines[pulse.lineIndex];
            if (!line) return;

            const pos = getQuadraticPoint(line.sx, line.sy, line.cx, line.cy, line.ex, line.ey, pulse.t);

            // Outer glow
            const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pulse.size * 5);
            gradient.addColorStop(0, isDark ? `rgba(255, 255, 255, ${pulse.opacity * 0.8})` : `rgba(30, 40, 80, ${pulse.opacity * 0.8})`);
            gradient.addColorStop(0.4, isDark ? `rgba(200, 220, 255, ${pulse.opacity * 0.2})` : `rgba(50, 70, 120, ${pulse.opacity * 0.2})`);
            gradient.addColorStop(1, isDark ? `rgba(200, 220, 255, 0)` : `rgba(50, 70, 120, 0)`);

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pulse.size * 5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pulse.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${pulse.opacity})` : `rgba(30, 40, 80, ${pulse.opacity})`;
            ctx.fill();

            // Trail
            for (let trail = 1; trail <= 6; trail++) {
                const trailT = pulse.t - trail * 0.012 * (pulse.speed > 0 ? 1 : -1);
                if (trailT < 0 || trailT > 1) continue;
                const tp = getQuadraticPoint(line.sx, line.sy, line.cx, line.cy, line.ex, line.ey, trailT);
                const trailAlpha = pulse.opacity * (1 - trail / 7);
                ctx.beginPath();
                ctx.arc(tp.x, tp.y, pulse.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? `rgba(200, 220, 255, ${trailAlpha * 0.4})` : `rgba(40, 60, 110, ${trailAlpha * 0.4})`;
                ctx.fill();
            }
        });

        // Update pulses
        pulsesRef.current = pulsesRef.current
            .map((p) => ({ ...p, t: p.t + p.speed }))
            .filter((p) => p.t >= -0.05 && p.t <= 1.05);

        // Spawn new pulses
        if (Math.random() < 0.04 && lines.length > 0) {
            const lineIndex = Math.floor(Math.random() * lines.length);
            const forward = Math.random() > 0.5;
            pulsesRef.current.push({
                lineIndex,
                t: forward ? 0 : 1,
                speed: (forward ? 1 : -1) * (0.003 + Math.random() * 0.004),
                size: 2 + Math.random() * 2,
                opacity: 0.7 + Math.random() * 0.3,
            });
        }

        ctx.restore();
        animFrameRef.current = requestAnimationFrame(draw);
    }, [dots, lineColor, hoveredLine, isDark]);

    useEffect(() => {
        // Seed initial pulses
        pulsesRef.current = dots.map((_, i) => ({
            lineIndex: i,
            t: Math.random(),
            speed: (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.003),
            size: 2 + Math.random() * 2,
            opacity: 0.7 + Math.random() * 0.3,
        }));

        animFrameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [draw, dots]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        let closest = -1;
        let closestDist = 30;

        linesRef.current.forEach((line, i) => {
            for (let t = 0; t <= 1; t += 0.05) {
                const p = getQuadraticPoint(line.sx, line.sy, line.cx, line.cy, line.ex, line.ey, t);
                const dist = Math.sqrt((e.clientX - rect.left - p.x) ** 2 + (e.clientY - rect.top - p.y) ** 2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = i;
                }
            }
        });

        setHoveredLine(closest >= 0 ? closest : null);
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let closestLine = -1;
        let closestDist = 60;
        let fromStart = true;

        linesRef.current.forEach((line, i) => {
            const dStart = Math.sqrt((mx - line.sx) ** 2 + (my - line.sy) ** 2);
            const dEnd = Math.sqrt((mx - line.ex) ** 2 + (my - line.ey) ** 2);
            if (dStart < closestDist) { closestDist = dStart; closestLine = i; fromStart = true; }
            if (dEnd < closestDist) { closestDist = dEnd; closestLine = i; fromStart = false; }
        });

        if (closestLine >= 0) {
            for (let j = 0; j < 4; j++) {
                pulsesRef.current.push({
                    lineIndex: closestLine,
                    t: fromStart ? 0 : 1,
                    speed: (fromStart ? 1 : -1) * (0.004 + Math.random() * 0.006),
                    size: 2.5 + Math.random() * 2,
                    opacity: 0.8 + Math.random() * 0.2,
                });
            }
        } else {
            linesRef.current.forEach((_, i) => {
                pulsesRef.current.push({
                    lineIndex: i,
                    t: Math.random() > 0.5 ? 0 : 1,
                    speed: (Math.random() > 0.5 ? 1 : -1) * (0.005 + Math.random() * 0.005),
                    size: 2 + Math.random() * 2,
                    opacity: 0.8,
                });
            });
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full aspect-[2/1] relative"
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
                style={{ display: "block" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { mouseRef.current = null; setHoveredLine(null); }}
                onClick={handleClick}
            />
        </motion.div>
    );
}
