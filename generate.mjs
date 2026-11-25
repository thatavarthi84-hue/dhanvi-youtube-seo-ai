// Netlify serverless function: keeps the Gemini API key on the server.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST method only" }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Netlify environment variable GEMINI_API_KEY is missing." }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await req.json();
    const { title, channel = "Dhanvi Podcast", type = "Auto", audience = "Telugu audience", tone = "Engaging" } = body || {};
    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Valid video title is required." }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }
    const prompt = `You are an expert YouTube SEO strategist and Telugu content writer. Create metadata for a YouTube video.
Video title: ${title}
Channel: ${channel}
Category preference: ${type}
Target audience: ${audience}
Description tone: ${tone}

Requirements:
- Understand the title and infer the correct subject; do not invent video events or factual claims not supplied.
- Write a natural, compelling Telugu-first description with relevant English search phrases where useful. First two lines must be engaging and accurately describe the video.
- Include a concise call to action to like, comment, share and subscribe to ${channel}.
- Generate 30-40 highly relevant tags, comma-separated, mixing Telugu and English naturally. Avoid irrelevant, repetitive or misleading tags.
- Generate 3-5 relevant hashtags.
- Generate 8-12 search keywords/phrases, comma-separated.
- Suggest one engaging pinned comment in Telugu.
- Do not promise ranking, virality or views.
Return ONLY valid JSON with exactly these string fields: description, tags, hashtags, keywords, pinned. No markdown fences.`;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=" + encodeURIComponent(apiKey);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      const msg = payload?.error?.message || "Gemini API returned an error.";
      return new Response(JSON.stringify({ error: msg }), {
        status: response.status, headers: { "Content-Type": "application/json" }
      });
    }
    const raw = payload?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
    if (!raw) throw new Error("Gemini returned an empty response. Try again.");
    let result;
    try { result = JSON.parse(raw); }
    catch { 
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      result = JSON.parse(cleaned);
    }
    const output = {};
    for (const key of ["description", "tags", "hashtags", "keywords", "pinned"]) {
      output[key] = typeof result[key] === "string" ? result[key] : "";
    }
    return new Response(JSON.stringify(output), {
      status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unexpected server error." }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};