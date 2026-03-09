import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'trwop_cookie_consent';

const CookieBanner = ({ onOpenPrivacy, onOpenCookies }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(CONSENT_KEY)) {
            // Small delay so it slides in after the page loads
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, '1');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 p-4 flex justify-center"
            style={{ animation: 'slideUp 0.4s ease-out' }}
        >
            <div className="w-full max-w-3xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
                {/* Cookie icon */}
                <span className="text-2xl shrink-0">🍪</span>

                {/* Text */}
                <p className="text-slate-300 text-sm text-center sm:text-left flex-1">
                    We use essential cookies and localStorage to make this site work.{' '}
                    <button
                        onClick={onOpenPrivacy}
                        className="text-amber-400 underline hover:text-amber-300 transition-colors"
                    >
                        Privacy Policy
                    </button>
                    {' · '}
                    <button
                        onClick={onOpenCookies}
                        className="text-amber-400 underline hover:text-amber-300 transition-colors"
                    >
                        Cookie Policy
                    </button>
                </p>

                {/* Accept button */}
                <button
                    onClick={accept}
                    className="shrink-0 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full text-sm transition-all hover:scale-105"
                >
                    Got it
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
