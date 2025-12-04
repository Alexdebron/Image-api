import axios from "axios";
import { load } from "cheerio";

// Configuration disini ye males banget ngetik ulang
const QUERY = "kafuu chino hentai";
const MAX = 20; // bebas atur sesuka lu yang penting ga lebih dari infinite karena gila

const run = async () => {
  const res = await axios.get(
    "https://www.google.com/search",
    { params: { tbm: "isch", q: QUERY, safe: "off" } }
  );

  const $ = load(res.data);
  const s = new Set();

  $("img").each((_, e) => {
    const x = $(e).attr("src");
    if (x && x.startsWith("http")) {
      s.add(x);
    }
  });

  const imgs = [...s].slice(0, MAX);

  console.log(JSON.stringify({
    status: res.status,
    query: QUERY,
    count: imgs.length,
    safeSearch: false,
    images: imgs
    
  }, null, 2));
};

run();
