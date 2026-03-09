import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ConflictModal = ({ conflict, onClose }) => {
    const [opinions, setOpinions] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch existing opinions
    useEffect(() => {
        if (!conflict?.id) return;

        const fetchOpinions = async () => {
            const { data, error } = await supabase
                .from('opinions')
                .select('*')
                .eq('conflict_id', conflict.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching opinions:', error);
            } else if (data) {
                setOpinions(data);
            }
        };

        fetchOpinions();

        // Subscribe to real-time additions for this conflict
        const channel = supabase
            .channel(`opinions-${conflict.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'opinions',
                    filter: `conflict_id=eq.${conflict.id}`
                },
                (payload) => {
                    setOpinions((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conflict]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Please write an opinion before submitting.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const { error: insertError } = await supabase
            .from('opinions')
            .insert({
                conflict_id: conflict.id,
                author_name: name.trim() || 'Anonymous',
                content: content.trim()
            });

        if (insertError) {
            console.error('Error submitting opinion:', insertError);
            setError(`Failed to submit your opinion: ${insertError.message || insertError.details || 'Unknown error'}`);
        } else {
            // Success! The real-time subscription will update the list
            setName('');
            setContent('');
        }

        setIsSubmitting(false);
    };

    if (!conflict) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{conflict.name}</h2>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{conflict.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

                    {/* New Opinion Form */}
                    <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Share your perspective</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name (optional)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                                    maxLength={50}
                                />
                            </div>
                            <div>
                                <textarea
                                    required
                                    placeholder="What are your thoughts on resolving this conflict?"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm resize-none"
                                    maxLength={1000}
                                />
                            </div>

                            {error && <p className="text-red-400 text-xs">{error}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="self-end px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold rounded-lg text-sm shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)] hover:shadow-[0_0_20px_-3px_rgba(251,191,36,0.6)] disabled:shadow-none transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Opinion'}
                            </button>
                        </form>
                    </div>

                    {/* Opinions List */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Public Forum</h3>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{opinions.length}</span>
                        </div>

                        {opinions.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl px-4">
                                <p className="text-slate-500 text-sm">No opinions have been shared yet. Be the first to start the conversation.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {opinions.map((opinion) => (
                                    <div key={opinion.id} className="bg-slate-800/30 rounded-xl p-4 border border-slate-800/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-amber-50 text-sm">
                                                {opinion.author_name}
                                            </span>
                                            <span className="text-slate-500 text-xs">
                                                {new Date(opinion.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{opinion.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConflictModal;
