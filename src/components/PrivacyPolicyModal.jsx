import React from 'react';
import { X } from 'lucide-react';

const PrivacyPolicyModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0">
                    <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto px-8 py-6 space-y-6 text-slate-300 text-sm leading-relaxed">

                    <p className="text-slate-400 text-xs">Last updated: March 2026</p>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">1. Data Controller</h3>
                        <p>
                            The data controller responsible for this website is:<br />
                            <span className="text-amber-400 font-medium">Marco Andriolo</span><br />
                            Email:{' '}
                            <a href="mailto:marco@genoma-group.com" className="text-amber-400 underline hover:text-amber-300 transition-colors">
                                marco@genoma-group.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">2. What Data We Collect</h3>
                        <p>When you sign the Board of Peace, we may collect:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Name</strong> — optional, used only to display on the map.</li>
                            <li><strong>Email address</strong> — optional, used only to send updates about the peace movement. You may unsubscribe at any time.</li>
                            <li><strong>Geographic location (latitude &amp; longitude)</strong> — used to place a light on the world map representing your signature.</li>
                            <li><strong>Country</strong> — derived from your coordinates via a reverse-geocoding service.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">3. Legal Basis for Processing</h3>
                        <p>
                            Processing is based on your <strong>consent</strong> (Art. 6(1)(a) GDPR), which you give by choosing to sign the Board of Peace. You may withdraw it at any time by contacting us.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">4. How We Use Your Data</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>To display an anonymous light on the interactive world map.</li>
                            <li>To send you occasional updates about the movement (only if you provide your email).</li>
                            <li>To prevent duplicate signatures from the same device.</li>
                        </ul>
                        <p className="mt-2">We do <strong>not</strong> sell, rent, or share your data with third parties for commercial purposes.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">5. Third-Party Services</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Supabase</strong> — our database and serverless backend (EU region). Privacy policy: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">supabase.com/privacy</a></li>
                            <li><strong>Mapbox</strong> — interactive map rendering. Privacy policy: <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">mapbox.com/legal/privacy</a></li>
                            <li><strong>Nominatim / OpenStreetMap</strong> — reverse geocoding of coordinates. Privacy policy: <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">osmfoundation.org</a></li>
                            <li><strong>ipapi.co</strong> — fallback IP-based geolocation. Privacy policy: <a href="https://ipapi.co/privacy/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">ipapi.co/privacy</a></li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">6. Data Retention</h3>
                        <p>
                            Your data is stored for as long as the Board of Peace remains active. You may request deletion at any time by contacting <a href="mailto:marco@genoma-group.com" className="text-amber-400 underline hover:text-amber-300">marco@genoma-group.com</a>.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">7. Your Rights (GDPR)</h3>
                        <p>Under applicable law, you have the right to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Access your personal data.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request erasure of your data ("right to be forgotten").</li>
                            <li>Withdraw consent at any time without affecting the lawfulness of prior processing.</li>
                            <li>Lodge a complaint with a supervisory authority.</li>
                        </ul>
                        <p className="mt-2">To exercise any of these rights, contact: <a href="mailto:marco@genoma-group.com" className="text-amber-400 underline hover:text-amber-300">marco@genoma-group.com</a>.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-semibold text-base mb-2">8. Contact</h3>
                        <p>
                            For any privacy-related questions, please contact:<br />
                            <a href="mailto:marco@genoma-group.com" className="text-amber-400 underline hover:text-amber-300">marco@genoma-group.com</a>
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

export default PrivacyPolicyModal;
