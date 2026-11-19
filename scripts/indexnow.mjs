import { readFile } from "node:fs/promises";

const KEY_FILE = "7882fe25e2e46ffa5a479c756b0a39f3.txt";
const HOST = "aicraft.agency";
const KEY_LOCATION = `https://${HOST}/${KEY_FILE}`;

const key = (await readFile(new URL(`../public/${KEY_FILE}`, import.meta.url), "utf8")).trim();

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).slice(0, 10000);
if (!urls.length) throw new Error("Sitemap is empty or unavailable");

const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation: KEY_LOCATION, urlList: urls }),
});
console.log(`IndexNow: ${response.status} ${response.statusText}, URLs: ${urls.length}`);
if (!response.ok) process.exit(1);
