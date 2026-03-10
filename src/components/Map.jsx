import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import MapboxMap, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../lib/supabase';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = ({ showConflicts, onConflictClick, onLightCountChange, onMapReady, onWarCountChange }) => {
    const mapRef = useRef(null);

    const handleMapLoad = useCallback((evt) => {
        mapRef.current = evt.target;
        if (onMapReady) {
            onMapReady(() => {
                if (!mapRef.current) return null;
                const mapCanvas = mapRef.current.getCanvas();
                return mapCanvas ? mapCanvas.toDataURL('image/png') : null;
            });
        }
    }, [onMapReady]);
    const [signatures, setSignatures] = useState([]);
    const [conflicts, setConflicts] = useState([]);

    useEffect(() => {
        // Initial fetch of all existing signatures
        const fetchSignatures = async () => {
            // Fetch markers (up to 1000 for display)
            const { data, error } = await supabase
                .from('signatures')
                .select('*');

            if (error) {
                console.error('Error fetching signatures:', error);
            } else if (data) {
                setSignatures(data);
            }

            // Fetch exact total count separately (no row limit)
            const { count, error: countError } = await supabase
                .from('signatures')
                .select('*', { count: 'exact', head: true });

            if (!countError && count !== null && onLightCountChange) {
                onLightCountChange(count);
            }
        };

        fetchSignatures();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'signatures',
                },
                (payload) => {
                    setSignatures((prev) => {
                        const updated = [...prev, payload.new];
                        if (onLightCountChange) onLightCountChange(updated.length);
                        return updated;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        // Fetch conflicts
        const fetchConflicts = async () => {
            const { data, error } = await supabase
                .from('conflicts')
                .select('*');

            if (error) {
                console.error('Error fetching conflicts:', error);
            } else if (data) {
                setConflicts(data);
                if (onWarCountChange) onWarCountChange(data.length);
            }
        };

        fetchConflicts();
    }, []);

    const markers = useMemo(() => signatures.map((sig) => ({
        type: 'signature',
        key: sig.id || `sig-${sig.lat}-${sig.lng}`,
        data: sig,
        longitude: sig.lng,
        latitude: sig.lat
    })), [signatures]);

    const conflictMarkers = useMemo(() => conflicts.map((conf) => ({
        type: 'conflict',
        key: conf.id,
        data: conf,
        longitude: conf.lng,
        latitude: conf.lat
    })), [conflicts]);

    return (
        <div className="w-full h-full absolute inset-0 bg-slate-950 flex items-center justify-center">
            <MapboxMap
                initialViewState={{
                    longitude: 0,
                    latitude: 20,
                    zoom: 1.5
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                projection="mercator"
                style={{ width: '100%', height: '100%' }}
                preserveDrawingBuffer={true}
                onLoad={handleMapLoad}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        anchor="center"
                    >
                        {/* Tiny, intense glowing dot implementation */}
                        <div className="relative flex items-center justify-center">
                            {/* Inner bright core */}
                            <div className="w-1 h-1 bg-amber-200 rounded-full absolute z-10 shadow-[0_0_8px_rgba(251,191,36,1)]"></div>
                            {/* Outer soft aura */}
                            <div className="w-3 h-3 bg-amber-400/30 rounded-full absolute animate-pulse"></div>
                            {/* Very faint wide ring */}
                            <div className="w-5 h-5 rounded-full border border-amber-400 opacity-20"></div>
                        </div>
                    </Marker>
                ))}

                {showConflicts && conflicts.map((conflict) => (
                    <Marker
                        key={conflict.id}
                        longitude={conflict.lng}
                        latitude={conflict.lat}
                        anchor="center"
                    >
                        {/* Red pulsating conflict marker */}
                        <div
                            className="relative flex items-center justify-center group cursor-pointer z-20"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onConflictClick) onConflictClick(conflict);
                            }}
                        >
                            {/* Inner bright core */}
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute shadow-[0_0_10px_rgba(239,68,68,1)] transition-transform group-hover:scale-150"></div>
                            {/* Outer soft aura */}
                            <div className="w-4 h-4 bg-red-600/40 rounded-full absolute animate-ping"></div>
                            {/* Warning ring */}
                            <div className="w-6 h-6 rounded-full border border-red-500 opacity-30"></div>

                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full mb-3 w-48 p-3 bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-50">
                                <h3 className="text-white text-xs font-bold mb-1">{conflict.name}</h3>
                                <p className="text-slate-400 text-[10px] leading-relaxed">{conflict.description}</p>
                            </div>
                        </div>
                    </Marker>
                ))}
            </MapboxMap>
        </div>
    );
};

export default Map;
