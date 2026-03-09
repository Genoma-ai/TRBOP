import React from 'react';
import { X } from 'lucide-react';

const CookiePolicyModal = ({ onClose, onOpenPrivacy }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0">
                    <h2 className="text-xl font-bold text-white">Cookie Policy</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto px-8 py-6 space-y-6 text-slate-300 text-sm leading-relaxed">

                    <p className="text-slate-400 text-xs">Last updated: March 2026</p>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">1. What Are Cookies?</h3>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. This site also uses
                            browser <strong>localStorage</strong>, which operates similarly but has no expiry date unless cleared manually.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">2. Cookies We Use</h3>

                        <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-slate-300">
                                        <th className="px-3 py-2 rounded-tl-lg">Name</th>
                                        <th className="px-3 py-2">Type</th>
                                        <th className="px-3 py-2">Purpose</th>
                                        <th className="px-3 py-2 rounded-tr-lg">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-slate-800">
                                        <td className="px-3 py-2 font-mono text-amber-400/80">trwop_signed</td>
                                        <td className="px-3 py-2">localStorage</td>
                                        <td className="px-3 py-2">Remembers that you have already signed, to prevent duplicate entries.</td>
                                        <td className="px-3 py-2">Until browser data is cleared</td>
                                    </tr>
                                    <tr className="border-t border-slate-800">
                                        <td className="px-3 py-2 font-mono text-amber-400/80">trwop_cookie_consent</td>
                                        <td className="px-3 py-2">localStorage</td>
                                        <td className="px-3 py-2">Remembers that you have accepted this cookie notice.</td>
                                        <td className="px-3 py-2">Until browser data is cleared</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">3. Third-Party Cookies</h3>
                        <p>
                            <strong>Mapbox GL JS</strong> powers our interactive map. Mapbox may set cookies or use browser storage for map
                            tile caching and performance. Please review{' '}
                            <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">
                                Mapbox's Privacy Policy
                            </a>{' '}
                            for details.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">4. No Analytics or Advertising</h3>
                        <p>
                            We do <strong>not</strong> use analytics cookies (e.g. Google Analytics) or advertising/tracking cookies of any kind.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">5. Managing Cookies</h3>
                        <p>
                            You can clear localStorage and cookies at any time through your browser settings. Note that clearing
                            <span className="font-mono text-amber-400/80 mx-1">trwop_signed</span>
                            will allow you to sign again from the same device.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">6. More Information</h3>
                        <p>
                            For details on how we handle your personal data, please read our{' '}
                            <button onClick={() => { onClose(); onOpenPrivacy(); }} className="text-amber-400 underline hover:text-amber-300 transition-colors">
                                Privacy Policy
                            </button>.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-800 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicyModal;
