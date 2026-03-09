import React, { useState } from 'react';
import { Loader2, X, MapPin, CheckCircle2 } from 'lucide-react';

const SIGNED_KEY = 'trwop_signed';
const SIGN_FUNCTION_URL = 'https://loujgwxhiajdqkjcuhed.supabase.co/functions/v1/sign';

const SignatureModal = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alreadySigned, setAlreadySigned] = useState(() => !!localStorage.getItem(SIGNED_KEY));

    const handleSign = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic email validation if provided
        const trimmedEmail = email.trim();
        if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            let latitude, longitude, country = 'Earth';

            try {
                if (!navigator.geolocation) throw new Error('Geolocation not supported');

                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 30000,
                        maximumAge: 0
                    });
                });

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`);
                    const data = await res.json();
                    if (data?.address?.country) country = data.address.country;
                } catch {
                    console.warn('Reverse geocoding failed, defaulting to Earth');
                }

            } catch (geoError) {
                console.warn('Browser geolocation failed, falling back to IP:', geoError);
                try {
                    const ipRes = await fetch('https://ipapi.co/json/');
                    if (!ipRes.ok) throw new Error('IP Geolocation failed');
                    const ipData = await ipRes.json();
                    if (ipData.error) throw new Error(ipData.reason);
                    latitude = ipData.latitude;
                    longitude = ipData.longitude;
                    country = ipData.country_name || 'Earth';
                } catch (ipError) {
                    console.error("IP fallback also failed:", ipError);
                    throw geoError;
                }
            }

            const response = await fetch(SIGN_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim() || 'Anonymous',
                    lat: latitude,
                    lng: longitude,
                    country,
                    email: trimmedEmail || null,
                }),
            });

            if (response.status === 409) {
                localStorage.setItem(SIGNED_KEY, '1');
                setAlreadySigned(true);
                return;
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server error ${response.status}`);
            }

            localStorage.setItem(SIGNED_KEY, '1');
            onSuccess();

        } catch (err) {
            console.error('Signature error:', err);
            if (err instanceof GeolocationPositionError) {
                if (err.code === 1) setError("Location access denied. We need your location to place your dot on the map.");
                else if (err.code === 2) setError("Location unavailable. Please check your device settings or try another browser.");
                else if (err.code === 3) setError("Location request timed out. Please try again.");
                else setError(`Location Error: ${err.message}`);
            } else {
                setError(`Error: ${err.message || JSON.stringify(err)}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Already Signed State ───────────────────────────────────────────────
    if (alreadySigned) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="relative w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 text-center">
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">You've already signed</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Your light is already shining on the map. Thank you for standing for peace. ✌️
                        </p>
                        <button onClick={onClose} className="mt-4 px-8 py-3 bg-amber-500 text-slate-950 font-bold rounded-full hover:bg-amber-400 transition-all">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Signature Form ─────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">

                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                        <MapPin className="w-6 h-6 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Leave your mark</h2>
                    <p className="text-slate-400">
                        We will use your location to place a soft light on the world map.
                    </p>
                </div>

                <form onSubmit={handleSign} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                            Your Name <span className="text-slate-500">(optional)</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Maria from Rome"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                            Your Email <span className="text-slate-500">(optional)</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="to stay updated on the movement"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                        />
                        <p className="mt-1.5 text-xs text-slate-500">
                            We'll only use your email to keep you informed. No spam, ever.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Finding your location...
                            </>
                        ) : (
                            'Add My Light'
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default SignatureModal;
