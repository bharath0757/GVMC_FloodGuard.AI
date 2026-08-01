import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { wardFillColor } from './flood-simulation-engine';
// ─── Convert lat/lng → canvas pixel (matches Leaflet map projection) ─────────
function latLngToPoint(map, lat, lng) {
    const pt = map.latLngToContainerPoint([lat, lng]);
    return { x: pt.x, y: pt.y };
}
export const FloodSimOverlay = ({ map, simState, active }) => {
    const canvasRef = React.useRef(null);
    const rafRef = React.useRef(0);
    // Resize canvas to match map container
    React.useEffect(() => {
        if (!canvasRef.current || !map)
            return;
        const container = map.getContainer();
        const resize = () => {
            if (!canvasRef.current)
                return;
            canvasRef.current.width = container.clientWidth;
            canvasRef.current.height = container.clientHeight;
        };
        resize();
        map.on('resize', resize);
        map.on('move', () => { });
        return () => { map.off('resize', resize); };
    }, [map]);
    // ─── RAF draw loop ──────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!canvasRef.current || !map || !active) {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx)
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            return;
        }
        const canvas = canvasRef.current;
        const draw = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ── 1. Ward fill overlays ─────────────────────────────────────────
            Object.values(simState.wards).forEach((ward) => {
                if (ward.fillLevel < 0.02)
                    return;
                const color = wardFillColor(ward.fillLevel);
                ctx.save();
                ctx.beginPath();
                ward.bounds.forEach(([lat, lng], i) => {
                    const pt = latLngToPoint(map, lat, lng);
                    if (i === 0)
                        ctx.moveTo(pt.x, pt.y);
                    else
                        ctx.lineTo(pt.x, pt.y);
                });
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                // Stroke border
                ctx.strokeStyle = color.replace('0.', '0.7').replace('rgba', 'rgba');
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.restore();
                // Water depth label at centroid
                if (ward.waterDepthCm > 5) {
                    const cpt = latLngToPoint(map, ward.lat, ward.lng);
                    ctx.save();
                    ctx.font = 'bold 10px monospace';
                    ctx.fillStyle = 'rgba(255,255,255,0.90)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 4;
                    ctx.fillText(`💧 ${ward.waterDepthCm}cm`, cpt.x, cpt.y + 16);
                    ctx.restore();
                }
            });
            // ── 2. Road flood zones ───────────────────────────────────────────
            simState.roadFloodZones.forEach((rz) => {
                if (rz.intensity < 0.05)
                    return;
                const pt = latLngToPoint(map, rz.lat, rz.lng);
                const w = Math.max(4, rz.width);
                ctx.save();
                const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, w * 2.5);
                grad.addColorStop(0, `rgba(33,150,243,${0.45 * rz.intensity})`);
                grad.addColorStop(1, 'rgba(33,150,243,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(pt.x, pt.y, w * 2.5, w * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
                // Road status badge
                if (rz.intensity > 0.4) {
                    ctx.font = 'bold 9px monospace';
                    ctx.fillStyle = rz.intensity > 0.65 ? '#EF4444' : '#F59E0B';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'rgba(0,0,0,0.9)';
                    ctx.shadowBlur = 3;
                    ctx.fillText(rz.intensity > 0.65 ? '🔴 FLOODED' : '🟡 WARNING', pt.x, pt.y - w - 2);
                }
                ctx.restore();
            });
            // ── 3. Overflow hotspot pulses ────────────────────────────────────
            simState.overflowPoints.forEach((op) => {
                if (op.intensity < 0.05)
                    return;
                const pt = latLngToPoint(map, op.lat, op.lng);
                const r = Math.max(6, op.radius);
                const t = Date.now() / 800;
                const pulse = 0.6 + 0.4 * Math.sin(t);
                ctx.save();
                // Outer glow ring
                const grad = ctx.createRadialGradient(pt.x, pt.y, r * 0.2, pt.x, pt.y, r);
                grad.addColorStop(0, `rgba(239,68,68,${0.6 * op.intensity * pulse})`);
                grad.addColorStop(0.6, `rgba(249,115,22,${0.3 * op.intensity})`);
                grad.addColorStop(1, 'rgba(239,68,68,0)');
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                // Core dot
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(239,68,68,${0.9 * pulse})`;
                ctx.fill();
                ctx.restore();
            });
            // ── 4. Water particles ────────────────────────────────────────────
            simState.particles.forEach((p) => {
                const pt = latLngToPoint(map, p.lat, p.lng);
                ctx.save();
                if (p.type === 'flow') {
                    // Small blue teardrop
                    const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.radius);
                    grad.addColorStop(0, `rgba(147,210,255,${p.alpha})`);
                    grad.addColorStop(1, `rgba(59,130,246,0)`);
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();
                }
                else if (p.type === 'pool') {
                    // Translucent expanding pool
                    const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.radius);
                    grad.addColorStop(0, `rgba(33,150,243,${p.alpha * 0.7})`);
                    grad.addColorStop(1, `rgba(33,150,243,0)`);
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();
                }
                else {
                    // Ripple ring
                    const lifeRatio = p.age / p.maxAge;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, p.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(59,130,246,${p.alpha * (1 - lifeRatio)})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                ctx.restore();
            });
            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(rafRef.current); };
    }, [map, simState, active]);
    if (!active)
        return null;
    return (_jsx("canvas", { ref: canvasRef, className: "absolute inset-0 pointer-events-none z-10", style: { mixBlendMode: 'screen' } }));
};
//# sourceMappingURL=flood-simulation-overlay.js.map