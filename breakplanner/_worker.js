export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const method = request.method;

        // Route API paths to database logic
        if (url.pathname === "/api/data") {
            // Safety fallback check to ensure database binding is attached
            if (!env.DB) {
                return new Response(JSON.stringify({ error: "D1 Database Binding (DB) is missing in Cloudflare settings!" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
                });
            }

            // CORS preflight handling for mobile browser flexibility
            if (method === "OPTIONS") {
                return new Response(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    }
                });
            }

            // GET REQUEST: Load all data from D1 SQL table
            if (method === "GET") {
                try {
                    const { results } = await env.DB.prepare("SELECT username, slots FROM scheduler_data").all();
                    
                    const structuredData = {};
                    results.forEach(row => {
                        try {
                            structuredData[row.username] = JSON.parse(row.slots);
                        } catch(e) {
                            structuredData[row.username] = [];
                        }
                    });

                    const userCount = Object.keys(structuredData).filter(k => !k.startsWith("__") && structuredData[k].length > 0).length;

                    return new Response(JSON.stringify({ data: structuredData, userCount }), {
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
                    });
                } catch (err) {
                    return new Response(JSON.stringify({ error: err.message }), {
                        status: 500,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
                    });
                }
            }

            // POST REQUEST: Overwrite user selections into D1
            if (method === "POST") {
                try {
                    const body = await request.json();
                    const { username, selectedSlots } = body;

                    if (!username) {
                        return new Response(JSON.stringify({ error: "Missing identity key parameter" }), { status: 400 });
                    }

                    const stringifiedSlots = JSON.stringify(selectedSlots || []);

                    await env.DB.prepare(`
                        INSERT INTO scheduler_data (username, slots) 
                        VALUES (?, ?)
                        ON CONFLICT(username) DO UPDATE SET slots = excluded.slots
                    `).bind(username, stringifiedSlots).run();

                    return new Response(JSON.stringify({ success: true }), {
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
                    });
                } catch (err) {
                    return new Response(JSON.stringify({ error: err.message }), {
                        status: 500,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
                    });
                }
            }
            return new Response("Method not allowed", { status: 405 });
        }

        // Otherwise, serve your static index.html file safely
        return env.ASSETS.fetch(request);
    }
};
