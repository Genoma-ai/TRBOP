import React from 'react';

const Manifesto = ({ onSign, hasSigned }) => {
    return (
        <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            <div className="space-y-4 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-500 pb-2">
                    The Peace Manifesto
                </h2>
            </div>

            <div className="prose prose-invert prose-lg text-slate-300 space-y-6 leading-relaxed bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800/50 shadow-2xl backdrop-blur-md">
                <p>
                    We are many. We span across oceans, continents, and borders drawn by history rather than humanity.
                    We rise not with weapons, but with a united voice, bound by the most profound force of all: Love.
                </p>
                <p>
                    Love is the founding value of our existence, the invisible thread that connects every beating heart. We reject the narrative of inevitable conflict and refuse to inherit the animosities of the past.
                    This board stands as a digital monument to an undeniable truth: the overwhelming majority of humanity simply desires peace, rooted in compassion for one another.
                </p>
                <p className="font-semibold text-slate-200">
                    By signing this manifesto, I add my light to the world. I declare my commitment to love, and I demand peace.
                </p>
            </div>

            <div className="pt-6">
                {hasSigned ? (
                    <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-700">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-emerald-400 font-medium">Your light has been added to the board.</p>
                    </div>
                ) : (
                    <button
                        onClick={onSign}
                        className="group relative px-8 py-4 bg-slate-50 text-slate-900 font-bold rounded-full text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            I agree / Sign the manifesto
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors z-0" />
                    </button>
                )}
            </div>

        </div>
    );
};

export default Manifesto;
