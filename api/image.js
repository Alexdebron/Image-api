import axios from "axios";
import { load } from "cheerio";

export default async function handler(req, res) {
  try {
    const QUERY = req.query.q || "anime wallpaper"; // safe default
    const MAX = 20;

    const google = await axios.get("https://www.google.com/search", {
      params: {
        tbm: "isch",
        q: QUERY,
        safe: "off"
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const $ = load(google.data);
    const s = new Set();

    $("img").each((_, e) => {
      const x = $(e).attr("src");
      if (x && x.startsWith("http")) s.add(x);
    });

    const images = [...s].slice(0, MAX);

    const result = {
      creator: "Chamod Nimsara",
      status: true,
      query: QUERY,
      count: images.length,
      images
    };

    // output format: ?format=html
    if (req.query.format === "html") {
      return res.send(`
        <html>
        <head>
          <title>Image Search – ${QUERY}</title>
          <style>
            body { background:#000; color:#0f0; font-family:monospace; }
            img { width:200px; margin:10px; border-radius:10px; }
          </style>
        </head>
        <body>
          <h1>Results for: ${QUERY}</h1>
          <p>Creator: Chamod Nimsara</p>
          <div>
            ${images.map(i => `<img src="${i}"/>`).join("")}
          </div>
        </body>
        </html>
      `);
    }

    return res.json(result);
  } catch (err) {
    return res.json({ creator: "Chamod Nimsara", status: false, error: err.message });
  }
}
