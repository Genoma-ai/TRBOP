import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

        const systemPrompt = `You are an expert geopolitical analyst and data API. Produce the most comprehensive, exhaustive list of ALL currently active armed conflicts, wars, insurgencies, civil wars, and significant armed clashes in the world RIGHT NOW.

Include EVERY region:
- Middle East: Israel-Gaza War, West Bank violence, Lebanon-Hezbollah, Yemen Civil War, Syrian Civil War, Iraq ISIS insurgency
- Europe: Russia-Ukraine War
- Africa: Sudan Civil War (RSF vs SAF), DR Congo (M23), Ethiopia, South Sudan, Mali, Burkina Faso, Niger, Nigeria (Boko Haram), Mozambique, Central African Republic, Somalia, Cameroon, Libya
- Asia: Myanmar Civil War, Kashmir, Afghanistan, Pakistan (Balochistan, TTP), Philippines (NPA/MILF), Papua/Indonesia
- Latin America: Colombia (ELN), Mexico (cartels), Haiti, Venezuela

Return ONLY a raw JSON array. No markdown, no explanation. Keep descriptions to 2 sentences max. Aim for 45-55 entries.
Format: [{"name": "Conflict Name", "description": "Short 2 sentence description.", "lat": 12.34, "lng": 56.78}]`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: 'Generate the complete exhaustive list of all active global conflicts now in JSON array format.' }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            return new Response(JSON.stringify({ error: err }), { status: 500 });
        }

        const result = await response.json();
        let textContent = result.content[0].text;

        // Clean up potential markdown formatting from Claude
        textContent = textContent.replace(/```json/g, '').replace(/```/g, '').trim();

        let conflicts: { name: string, description: string, lat: number, lng: number }[] = [];
        try {
            conflicts = JSON.parse(textContent);
        } catch (e) {
            return new Response(JSON.stringify({ error: 'Failed to parse JSON', content: textContent }), { status: 500 });
        }

        // Upsert conflicts utilizing the fuzzy-match database function
        for (const conflict of conflicts) {
            if (!conflict.name || !conflict.description) continue; // Skip malformed rows

            const { error: upsertError } = await supabase
                .rpc('upsert_conflict', {
                    p_name: conflict.name,
                    p_description: conflict.description,
                    p_lat: conflict.lat || 0,
                    p_lng: conflict.lng || 0
                });

            if (upsertError) {
                console.error('Error upserting conflict:', conflict.name, upsertError);
                // Continue instead of failing the whole batch
            }
        }

        return new Response(JSON.stringify({ success: true, count: conflicts.length }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
});
