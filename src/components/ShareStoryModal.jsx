import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';

/**
 * Draws a 1080×1920 (9:16) peace story card on the provided canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {number|null} lightCount
 * @param {string} signerName
 * @param {HTMLImageElement|null} mapImage  — pre-loaded map screenshot
 */
async function drawCard(canvas, lightCount, signerName, mapImage) {
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');

    // ── Background ──────────────────────────────────────────────────────────
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);

    // ── Map image — smoother fade over 45% of height ────────────────────────
    const MAP_H = Math.round(H * 0.45);   // ~864 px
    if (mapImage) {
        ctx.drawImage(mapImage, 0, 0, W, MAP_H);

        // Smoother, longer gradient
        const mapFade = ctx.createLinearGradient(0, MAP_H * 0.15, 0, MAP_H);
        mapFade.addColorStop(0, 'rgba(2,6,23,0)');
        mapFade.addColorStop(0.5, 'rgba(2,6,23,0.7)');
        mapFade.addColorStop(0.85, 'rgba(2,6,23,0.98)');
        mapFade.addColorStop(1, 'rgba(2,6,23,1)');
        ctx.fillStyle = mapFade;
        ctx.fillRect(0, 0, W, MAP_H);

        // Subtle amber glow
        const glow = ctx.createRadialGradient(W / 2, MAP_H * 0.3, 0, W / 2, MAP_H * 0.3, 500);
        glow.addColorStop(0, 'rgba(251,191,36,0.12)');
        glow.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, MAP_H);
    } else {
        // Fallback globe emoji
        ctx.save();
        ctx.font = '160px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌍', W / 2, Math.round(H * 0.2));
        ctx.restore();
    }

    // ── Thin horizontal rule helper ──────────────────────────────────────────
    const drawRule = (y) => {
        ctx.strokeStyle = 'rgba(148,163,184,0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(W - 80, y);
        ctx.stroke();
    };

    // ── Centered text helper ─────────────────────────────────────────────────
    const text = (str, x, y, opts = {}) => {
        ctx.save();
        ctx.font = `${opts.weight || 'normal'} ${opts.size || 40}px ${opts.family || 'Georgia, serif'}`;
        ctx.fillStyle = opts.color || '#f1f5f9';
        ctx.textAlign = opts.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = opts.glow || 0;
        ctx.shadowColor = opts.glowColor || 'transparent';
        if (opts.maxWidth) {
            ctx.fillText(str, x, y, opts.maxWidth);
        } else {
            ctx.fillText(str, x, y);
        }
        ctx.restore();
    };

    const cx = W / 2;

    // ── Layout constants ─────────────────────────────────────────────────────
    const HEADLINE_Y = Math.round(H * 0.30);  // 576
    const PEACE_Y = HEADLINE_Y + 118;         // 694
    const TOP_RULE_Y = PEACE_Y + 105;         // 799
    // Move bottom rule up to reduce the empty space
    const BOTTOM_RULE_Y = Math.round(H * 0.67); // 1286

    const displayName = signerName && signerName.trim() ? signerName.trim() : null;
    const NAME_Y = TOP_RULE_Y + 75;

    // Declaration text — perfectly centred in section between the two rules
    const lines = [
        'I believe in a world without war.',
        'I stand with every human being',
        'fighting for their right to live in peace.',
    ];
    const LINE_H = 78;
    const blockH = (lines.length - 1) * LINE_H;
    const secMid = (TOP_RULE_Y + BOTTOM_RULE_Y) / 2;
    const nameShift = displayName ? 70 : 0;
    const TEXT_Y = Math.round(secMid - blockH / 2 + nameShift);

    // ── Draw headline ────────────────────────────────────────────────────────
    text('I signed for', cx, HEADLINE_Y, {
        size: 64,
        weight: '300',
        family: "'Georgia', serif",
        color: '#94a3b8',
    });

    text('PEACE', cx, PEACE_Y, {
        size: 140,
        weight: 'bold',
        family: "'Georgia', serif",
        color: '#f8fafc',
        glow: 20,
        glowColor: 'rgba(255,255,255,0.06)',
    });

    drawRule(TOP_RULE_Y);

    if (displayName) {
        text(displayName, cx, NAME_Y, {
            size: 66,
            weight: '600',
            family: "'Georgia', serif",
            color: '#fbbf24',
            maxWidth: W - 120,
        });
    }

    // ── Declaration copy ─────────────────────────────────────────────────────
    lines.forEach((line, i) => {
        text(line, cx, TEXT_Y + i * LINE_H, {
            size: 46,
            weight: '400',
            family: "'Georgia', serif",
            color: '#64748b',
            maxWidth: W - 140,
        });
    });

    drawRule(BOTTOM_RULE_Y);

    // ── Lights count ─────────────────────────────────────────────────────────
    if (lightCount !== null && lightCount !== undefined) {
        const countStr = Number(lightCount).toLocaleString('en-US');
        text(`● ${countStr} lights lit for peace`, cx, BOTTOM_RULE_Y + 110, {
            size: 46,
            weight: '500',
            family: "'Georgia', serif",
            color: '#fbbf24',
        });
    }

    // ── Date ─────────────────────────────────────────────────────────────────
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    text(dateStr, cx, BOTTOM_RULE_Y + 200, {
        size: 38,
        weight: '300',
        family: "'Georgia', serif",
        color: '#475569',
    });

    // ── Site URL ─────────────────────────────────────────────────────────────
    text('www.trbop.com', cx, BOTTOM_RULE_Y + 300, {
        size: 46,
        weight: '500',
        family: "'Georgia', serif",
        color: '#64748b',
    });

    // ── Bottom branding ──────────────────────────────────────────────────────
    text('The Real Board of Peace', cx, BOTTOM_RULE_Y + 440, {
        size: 34,
        weight: '300',
        family: "'Georgia', serif",
        color: '#334155',
    });
    text('A declaration by the people, for the people', cx, BOTTOM_RULE_Y + 490, {
        size: 28,
        weight: '300',
        family: "'Georgia', serif",
        color: '#1e293b',
    });
}

// ─── helper: load a data URL into an Image ───────────────────────────────────
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// ────────────────────────────────────────────────────────────────────────────

const ShareStoryModal = ({ onClose, lightCount, signerName, getMapSnapshot }) => {
    const canvasRef = useRef(null);
    const [sharing, setSharing] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const render = async () => {
            if (!canvasRef.current) return;
            // Try to get a map snapshot
            let mapImage = null;
            if (getMapSnapshot && getMapSnapshot.current) {
                try {
                    const dataUrl = getMapSnapshot.current();
                    if (dataUrl) mapImage = await loadImage(dataUrl);
                } catch (e) {
                    console.warn('Map snapshot failed:', e);
                }
            }
            if (!cancelled) {
                await drawCard(canvasRef.current, lightCount, signerName, mapImage);
                setReady(true);
            }
        };
        render();
        return () => { cancelled = true; };
    }, [lightCount, signerName, getMapSnapshot]);

    const getBlob = () =>
        new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png'));

    const handleDownload = async () => {
        const blob = await getBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'i-signed-for-peace.png';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        setSharing(true);
        try {
            const blob = await getBlob();
            const file = new File([blob], 'i-signed-for-peace.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'I signed for peace',
                    text: 'Join me on The Real Board of Peace — www.trbop.com',
                });
            } else {
                await handleDownload();
            }
        } catch (err) {
            if (err.name !== 'AbortError') console.error('Share failed:', err);
        } finally {
            setSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-xs mx-4 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300 max-h-screen overflow-y-auto py-6">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="sticky top-0 self-end z-10 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="text-center -mt-2">
                    <h2 className="text-xl font-bold text-white">Share your story</h2>
                    <p className="text-slate-400 text-sm mt-1">Save and share this card on your stories</p>
                </div>

                {/* Card preview */}
                <div
                    className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative"
                    style={{ aspectRatio: '9/16' }}
                >
                    {!ready && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ imageRendering: 'auto', display: ready ? 'block' : 'none' }}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={handleDownload}
                        disabled={!ready}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-full text-sm font-medium hover:bg-slate-700 transition-all disabled:opacity-40"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={sharing || !ready}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-slate-950 font-bold rounded-full text-sm shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)] hover:bg-amber-400 hover:scale-105 transition-all disabled:opacity-60"
                    >
                        <Share2 className="w-4 h-4" />
                        {sharing ? 'Sharing…' : 'Share'}
                    </button>
                </div>

                <p className="text-xs text-slate-600 text-center pb-2">
                    Long-press the card on mobile to save it directly
                </p>
            </div>
        </div>
    );
};

export default ShareStoryModal;
