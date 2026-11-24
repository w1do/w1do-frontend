import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const TARGETS = ["src/pages", "src/components", "src/content", "src/layouts"];
const PATTERNS = [
    { re: /разработчик_ии/g, message: "служебная подстановка «разработчик_ии»" },
    { re: /AI Agency/g, message: "старое имя бренда «AI Agency»" },
    { re: /2022-2024/g, message: "устаревший диапазон копирайта" },
    { re: /Claude 4\.8/g, message: "неподтверждённая версия модели Claude 4.8" },
    { re: /Gemini 1\.5/g, message: "устаревшая модель Gemini 1.5" },
    {
        re: /(?:\b(?:title|subTitle)\s*[:=]\s*["'`]|<h[1-6]\b[^>]*>\s*|<span\b[^>]*section-sub-title[^>]*>\s*)(?:как я разрабатываю|где я показываю|что я предлагаю)(?![а-яё])/iu,
        message: "заголовок от лица одного специалиста. Сформулируйте его от имени команды AiCRAFT",
    },
];
const ALLOW = new Set(["src/layouts/Layout.astro"]);

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...await walk(path));
        else if (/\.(astro|md|mdx|ts|tsx|html)$/.test(entry.name)) files.push(path);
    }
    return files;
}

const errors = [];
for (const target of TARGETS) {
    let files;
    try {
        files = await walk(target);
    } catch {
        continue;
    }
    for (const file of files) {
        const rel = relative(ROOT, file).replaceAll("\\", "/");
        if (ALLOW.has(rel)) continue;
        const content = await readFile(file, "utf8");
        for (const { re, message } of PATTERNS) {
            if (re.test(content)) errors.push(`${rel}: ${message}`);
            re.lastIndex = 0;
        }
    }
}

if (errors.length) {
    console.error("Проверка контента не пройдена:");
    for (const error of errors) console.error(" - " + error);
    process.exit(1);
}
console.log("Проверка контента пройдена.");
