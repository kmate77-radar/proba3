export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { postText } = req.body;

    if (!postText || postText.trim().length < 10) {
      return res.status(400).json({ error: "Missing or too short post text" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
Elemezd az alábbi magyar közéleti Facebook-posztot önkormányzati döntéshozói szempontból.

Add vissza JSON formában:
{
  "summary": "3 mondatos összefoglaló",
  "topics": ["téma1", "téma2", "téma3"],
  "sentiment": "pozitív / semleges / negatív / vegyes",
  "priority": "alacsony / közepes / magas",
  "recommended_actions": ["teendő1", "teendő2", "teendő3"]
}

Poszt:
${postText}
`
      })
    });

    const data = await response.json();

    const text = data.output?.[0]?.content?.[0]?.text || "";

    res.status(200).json({ result: text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
