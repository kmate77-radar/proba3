export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { postsText } = req.body;

    if (!postsText || postsText.trim().length < 20) {
      return res.status(400).json({ error: "Missing or too short posts text" });
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
Elemezd az alábbi több magyar közéleti Facebook-posztot önkormányzati döntéshozói szempontból.

A posztok elválasztása lehet --- vagy egyszerű sortörés.

Kizárólag érvényes JSON-t adj vissza, magyarázó szöveg nélkül, ebben a struktúrában:

{
  "executive_summary": "5-6 mondatos vezetői összefoglaló",
  "top_issues": [
    {
      "issue": "ügy neve",
      "why_it_matters": "miért fontos",
      "priority": "alacsony / közepes / magas"
    }
  ],
  "common_topics": ["téma1", "téma2", "téma3"],
  "overall_sentiment": "pozitív / semleges / negatív / vegyes",
  "urgent_alerts": ["riasztás1", "riasztás2"],
  "recommended_actions": ["teendő1", "teendő2", "teendő3"],
  "individual_post_analysis": [
    {
      "post_number": 1,
      "summary": "rövid összefoglaló",
      "topics": ["téma1", "téma2"],
      "sentiment": "pozitív / semleges / negatív / vegyes",
      "priority": "alacsony / közepes / magas"
    }
  ]
}

Posztok:
${postsText}
`
      })
    });

    const data = await response.json();

    const text = data.output?.[0]?.content?.[0]?.text || "";

    return res.status(200).json({ result: text });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
