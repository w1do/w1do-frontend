#!/usr/bin/env python3
"""Build the standalone, offline asset catalogue from data/audiences.json.

No third-party dependencies. Run from any directory:
    python source/build_catalog.py
Only index.html is written. Asset paths stay relative to the pack root.
"""
from __future__ import annotations

import argparse
import html
import json
from pathlib import Path

TEMPLATE = r'''<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="description" content="120 направлений применения ИИ-агентов AICraft: иллюстрации, иконки, сценарии работы и связанные услуги.">
  <title>AICraft / 120 направлений</title>
  <style>
    :root{--blue:#2563eb;--blue-dark:#1d4ed8;--ink:#16336b;--text:#243b64;--muted:#617594;--line:#dce7f5;--pale:#eef5ff;--surface:#fff;--canvas:#f5f8fd;--radius:22px;--shadow:0 10px 32px rgba(30,67,126,.06);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:var(--text);background:var(--canvas);font-synthesis:none}
    *{box-sizing:border-box}
    body{margin:0;line-height:1.5;-webkit-font-smoothing:antialiased}
    body.modal-open{overflow:hidden}
    button,input,select{font:inherit}
    button,a,input,select{-webkit-tap-highlight-color:transparent}
    button{color:inherit}
    button,a{touch-action:manipulation}
    button{cursor:pointer}
    a{color:var(--blue);text-underline-offset:3px}
    a:hover{text-decoration-thickness:2px}
    :focus-visible{outline:3px solid #80aaff;outline-offset:4px}
    [hidden]{display:none!important}
    .shell{width:min(1360px,calc(100% - 64px));margin:0 auto}
    .topbar{border-bottom:1px solid rgba(197,216,245,.65);background:rgba(255,255,255,.85)}
    .topbar-inner{min-height:76px;display:flex;justify-content:space-between;align-items:center;gap:24px}
    .brand{display:flex;align-items:center;gap:11px;font-size:19px;font-weight:750;letter-spacing:-.6px;color:var(--ink)}
    .brand-mark{width:33px;height:33px;border-radius:10px;background:var(--blue);display:grid;place-items:center;color:#fff;font-size:21px;font-weight:800;box-shadow:0 4px 12px #2563eb24}
    .brand-note{font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;border-left:1px solid var(--line);padding-left:16px;margin-left:7px;font-weight:500}
    .top-links{display:flex;align-items:center;gap:22px;font-size:13px;font-weight:600}
    .top-links a{text-decoration:none;display:flex;gap:7px;align-items:center}
    .icon-16{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .hero{padding:58px 0 40px;position:relative}
    .eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:var(--blue);font-weight:750;display:flex;align-items:center;gap:8px;margin-bottom:15px}
    .eyebrow::before{content:"";width:6px;height:6px;background:var(--blue);border-radius:50%}
    h1{font-size:clamp(32px,3.7vw,52px);line-height:1.12;letter-spacing:-2.1px;color:var(--ink);font-weight:750;margin:0 0 19px}
    h1 span{color:var(--blue)}
    .hero-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:32px}
    .hero p{font-size:16px;line-height:1.75;margin:0;color:var(--muted);max-width:680px}
    .summary{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;flex:none;padding-bottom:4px}
    .summary span{font-size:11px;letter-spacing:.04em;font-weight:650;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:100px;padding:8px 12px;white-space:nowrap}
    .toolbar{background:var(--surface);border:1px solid var(--line);border-radius:18px;box-shadow:0 7px 22px rgba(30,67,126,.035);padding:17px 18px;display:grid;grid-template-columns:minmax(220px,1fr) minmax(220px,300px) auto;gap:16px;align-items:end}
    .control-label{display:block;font-size:10px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 7px 2px}
    .search-wrap{position:relative}
    .search-wrap>.icon-16{position:absolute;left:14px;top:16px;width:18px;height:18px;color:#7c94b6;pointer-events:none}
    .search{display:block;width:100%;height:49px;border:1px solid var(--line);border-radius:11px;padding:0 44px 0 42px;background:#f9fbff;color:var(--ink);font-size:14px;transition:border-color .15s,box-shadow .15s}
    .search::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none}
    .search::placeholder{color:#899ab3}
    .search:focus{border-color:#89b1f7;outline:none;box-shadow:0 0 0 3px #2563eb0e}
    .clear-search{position:absolute;right:7px;top:8px;width:33px;height:33px;border:0;border-radius:8px;background:transparent;color:var(--muted);display:grid;place-items:center}
    .clear-search:hover{background:var(--pale);color:var(--blue)}
    .group-select{height:49px;width:100%;border:1px solid var(--line);border-radius:11px;background:#f9fbff;color:var(--ink);padding:0 34px 0 14px;font-size:13px;cursor:pointer}
    .view-switch{display:flex;border:1px solid var(--line);background:#f4f7fc;border-radius:11px;padding:4px;gap:3px;min-height:49px}
    .view-switch button{display:flex;align-items:center;justify-content:center;gap:7px;border:0;background:transparent;border-radius:7px;padding:8px 12px;font-size:12px;color:var(--muted);font-weight:650;white-space:nowrap}
    .view-switch button[aria-pressed="true"]{background:#fff;color:var(--blue);box-shadow:0 2px 7px #16336b0c}
    .results-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:30px 0 19px}
    .results-heading h2{font-size:19px;line-height:1.35;margin:0;color:var(--ink);letter-spacing:-.3px}
    .result-count{font-size:12px;color:var(--muted);white-space:nowrap}
    .result-count strong{color:var(--ink);font-weight:700}
    .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
    .card{appearance:none;display:block;text-align:left;width:100%;border:1px solid var(--line);background:#fff;border-radius:var(--radius);padding:0;overflow:hidden;box-shadow:0 3px 12px #16336b02;transition:transform .2s,border-color .2s,box-shadow .2s;position:relative}
    .card:hover{transform:translateY(-4px);border-color:#a5c2f2;box-shadow:var(--shadow)}
    .card:active{transform:translateY(-1px)}
    .card-art{position:relative;display:flex;align-items:center;justify-content:center;aspect-ratio:3/2;background:linear-gradient(160deg,#f4f8ff,#fbfdff);overflow:hidden;border-bottom:1px solid #edf2fa}
    .card-art::before{content:"";position:absolute;inset:0;background-image:radial-gradient(#c5d8f57a .65px,transparent .65px);background-size:14px 14px;opacity:.4;pointer-events:none}
    .card-art img{position:relative;display:block;object-fit:contain;width:100%;height:100%;padding:3px 8px}
    .is-icons .card-art img{width:112px;height:112px;padding:0;filter:drop-shadow(0 8px 14px #2563eb0c)}
    .card-number{position:absolute;top:13px;left:15px;color:#7590b6;font-size:10px;font-weight:650;letter-spacing:.07em;z-index:1}
    .card-expand{position:absolute;right:12px;top:11px;width:27px;height:27px;border:1px solid #dbe7f8;border-radius:50%;display:grid;place-items:center;color:#7c99c3;background:#ffffffcf;z-index:1;transition:color .2s,background .2s,border-color .2s}
    .card:hover .card-expand{background:var(--blue);border-color:var(--blue);color:#fff}
    .card-expand .icon-16{width:13px;height:13px}
    .card-copy{display:block;padding:17px 18px 18px;min-height:107px}
    .card-title{display:block;font-size:15px;line-height:1.4;letter-spacing:-.15px;font-weight:700;color:var(--ink);margin-bottom:6px}
    .card-scene{display:block;color:var(--muted);font-size:12px;line-height:1.5}
    .empty{border:1px dashed #bfd2ed;border-radius:22px;background:#fff;text-align:center;padding:62px 24px;margin-bottom:20px}
    .empty-symbol{width:60px;height:60px;border-radius:19px;background:var(--pale);display:grid;place-items:center;color:var(--blue);margin:0 auto 17px}
    .empty-symbol svg{width:25px;height:25px}
    .empty h3{font-size:21px;color:var(--ink);margin:0 0 7px}
    .empty p{color:var(--muted);font-size:14px;margin:0 0 22px}
    .button-primary{border:0;background:var(--blue);color:#fff;border-radius:10px;padding:11px 17px;font-size:13px;font-weight:650}
    .button-primary:hover{background:var(--blue-dark)}
    .footer{display:flex;justify-content:space-between;align-items:flex-start;gap:28px;padding:35px 0 42px;margin-top:32px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}
    .footer p{max-width:650px;margin:0;line-height:1.75}
    .footer strong{font-weight:650;color:var(--ink)}
    .footer-links{display:flex;gap:18px;white-space:nowrap}
    .footer a{text-decoration:none;font-weight:600}
    .noscript{padding:16px;border:1px solid var(--line);border-radius:12px;margin-top:20px;background:#fff}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    dialog{width:min(1130px,calc(100% - 48px));max-height:calc(100dvh - 48px);padding:0;border:1px solid #d7e5f8;border-radius:27px;background:#fff;color:var(--text);box-shadow:0 30px 110px #0b214a45;overflow:auto;overscroll-behavior:contain}
    dialog::backdrop{background:rgba(14,34,69,.45);backdrop-filter:blur(6px)}
    .dialog-top{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:15px 23px;border-bottom:1px solid #e8eef8;background:rgba(255,255,255,.97)}
    .dialog-group{font-size:11px;color:var(--muted);font-weight:650;display:flex;align-items:center;gap:9px}
    .dialog-group .dot{width:5px;height:5px;background:#92b7f5;border-radius:50%}
    .close-button{display:flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;border-radius:9px;color:var(--muted);padding:8px 11px;font-size:11px;font-weight:600}
    .close-button:hover{background:var(--pale);color:var(--blue)}
    .dialog-title{padding:27px 30px 22px}
    .dialog-title h2{font-size:31px;line-height:1.2;letter-spacing:-.9px;color:var(--ink);margin:0 0 9px}
    .dialog-subtitle{font-size:14px;color:var(--muted);margin:0}
    .dialog-layout{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:29px;padding:0 30px 30px}
    .detail-art{aspect-ratio:3/2;border:1px solid var(--line);border-radius:19px;background:linear-gradient(145deg,#f0f6ff,#fbfdff);overflow:hidden;display:flex;justify-content:center;align-items:center}
    .detail-art img{width:100%;height:100%;display:block;object-fit:contain}
    .flow-labels{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin:14px 0 22px}
    .flow-box{min-width:0;background:#f6f9fe;border:1px solid var(--line);border-radius:10px;padding:10px 12px}
    .flow-box small{font-size:9px;letter-spacing:.08em;text-transform:uppercase;display:block;color:#7890b2;margin-bottom:3px;font-weight:650}
    .flow-box span{font-size:12px;line-height:1.4;display:block;color:var(--ink);font-weight:600}
    .flow-arrow{color:#8fadd9}
    .download-heading{font-size:10px;text-transform:uppercase;letter-spacing:.09em;font-weight:700;color:var(--muted);margin:0 0 10px}
    .downloads{display:flex;flex-wrap:wrap;gap:7px}
    .download-link{display:inline-flex;gap:5px;align-items:center;padding:8px 10px;border:1px solid #cbdcf5;border-radius:8px;color:var(--blue);text-decoration:none;font-size:10px;line-height:1.3;font-weight:700;background:#fff}
    .download-link:hover{border-color:#90b6f4;background:var(--pale);text-decoration:none}
    .download-link .icon-16{width:13px;height:13px}
    .format-note{font-size:10px;color:#8294af;line-height:1.6;margin:11px 0 0}
    .detail-section{margin-bottom:20px}
    .detail-section:last-child{margin-bottom:0}
    .detail-section h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--blue);margin:0 0 9px;font-weight:750}
    .detail-section p{font-size:13px;line-height:1.7;margin:0;color:#4b617f}
    .workflow{list-style:none;padding:0;margin:0;counter-reset:steps;display:grid;gap:11px}
    .workflow li{counter-increment:steps;display:grid;grid-template-columns:24px 1fr;gap:10px;align-items:start;font-size:12px;line-height:1.65;color:#4b617f}
    .workflow li::before{content:counter(steps);width:24px;height:24px;display:grid;place-items:center;background:var(--pale);color:var(--blue);border:1px solid #dae7fb;border-radius:8px;font-size:10px;line-height:1;font-weight:750}
    .result-box{background:#f0f6ff;border:1px solid #dbe8fc;border-radius:13px;padding:15px 16px}
    .result-box h3{margin-bottom:7px}
    .result-box p{color:var(--ink);font-weight:550}
    .service-links{list-style:none;padding:0;margin:0;display:grid;gap:8px}
    .service-links a{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:12px;line-height:1.4;text-decoration:none;padding:9px 0;border-bottom:1px solid #edf2f9;font-weight:600}
    .service-links a:hover{color:var(--blue-dark)}
    .service-links a .icon-16{width:13px;height:13px}
    @media(min-width:1550px){.shell{width:min(1450px,calc(100% - 96px))}.grid{gap:24px}.card-title{font-size:17px}.card-copy{padding:19px 20px 21px}}
    @media(max-width:1120px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.hero-bottom{align-items:flex-start;flex-direction:column;gap:20px}.summary{justify-content:flex-start}.toolbar{grid-template-columns:minmax(200px,1fr) minmax(220px,1fr)}.view-control{grid-column:1/-1}.view-switch{display:inline-flex}.dialog-layout{gap:22px;padding-left:24px;padding-right:24px}.dialog-title{padding-left:24px;padding-right:24px}}
    @media(max-width:760px){.shell{width:calc(100% - 36px)}.topbar-inner{min-height:67px}.brand-note{display:none}.top-links{gap:13px;font-size:11px}.top-links .icon-16{display:none}.hero{padding:35px 0 26px}h1{font-size:35px;letter-spacing:-1.4px;max-width:450px}.hero p{font-size:14px}.summary span{font-size:10px;padding:7px 10px}.toolbar{grid-template-columns:1fr;gap:12px;padding:15px}.view-control{grid-column:auto}.view-switch{display:flex}.view-switch button{flex:1}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.card{border-radius:17px}.card-copy{padding:13px 12px 15px;min-height:100px}.card-title{font-size:13px}.card-scene{font-size:11px}.card-number{top:9px;left:11px;font-size:9px}.card-expand{top:7px;right:8px;width:23px;height:23px}.results-heading{margin-top:25px;align-items:flex-start}.results-heading h2{font-size:17px}.result-count{font-size:11px;padding-top:3px}.is-icons .card-art img{width:88px;height:88px}.footer{flex-direction:column;margin-top:24px;padding-top:26px;gap:18px}.footer-links{gap:20px}dialog{width:calc(100% - 20px);max-height:calc(100dvh - 20px);border-radius:20px}.dialog-top{padding:12px 15px}.dialog-group{font-size:10px}.dialog-title{padding:23px 19px 19px}.dialog-title h2{font-size:26px}.dialog-subtitle{font-size:13px}.dialog-layout{grid-template-columns:1fr;padding:0 19px 24px;gap:25px}.detail-art{max-height:320px}.flow-labels{margin-bottom:18px}.detail-section p{font-size:14px}.workflow li,.service-links a{font-size:13px}.download-link{font-size:11px;padding:9px 11px}}
    @media(max-width:390px){.shell{width:calc(100% - 28px)}h1{font-size:31px}.top-links a:last-child{display:none}.grid{gap:10px}.card-title{font-size:12px}.card-scene{font-size:10px}.card-copy{padding:12px 10px}.card-art img{padding:3px}.card-expand{width:20px;height:20px}.summary{gap:5px}.summary span{font-size:9px;padding:6px 8px}.dialog-group .dot,.dialog-number{display:none}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}.card:hover,.card:active{transform:none}}
  </style>
</head>
<body>
  <header class="topbar">
    <div class="shell topbar-inner">
      <div class="brand"><span class="brand-mark" aria-hidden="true">A</span>AICraft<span class="brand-note">Направления и сценарии</span></div>
      <nav class="top-links" aria-label="Файлы каталога">
        <a href="data/audiences.json" download>Данные JSON<svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><path d="M10 3v9m-3-3 3 3 3-3M4 13v4h12v-4"/></svg></a>
        <a href="preview/overview-120.jpg" target="_blank" rel="noopener">Общий обзор<svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><path d="M7 4h9v9M16 4 4 16"/></svg></a>
      </nav>
    </div>
  </header>
  <main class="shell">
    <section class="hero" aria-labelledby="page-title">
      <div class="eyebrow">Кому подходят ИИ-агенты</div>
      <h1 id="page-title">AICraft / <span>120 направлений</span></h1>
      <div class="hero-bottom">
        <p>Выберите свою сферу. В каждой карточке — конкретная задача,<br class="desktop-break"> сценарий работы ИИ-агента и иллюстрации для вашего проекта.</p>
        <div class="summary" aria-label="Состав каталога"><span>120 сценариев</span><span>12 групп</span><span>SVG · PNG · WebP</span></div>
      </div>
    </section>
    <section aria-label="Поиск и фильтры">
      <div class="toolbar">
        <div>
          <label class="control-label" for="search">Найдите направление</label>
          <div class="search-wrap">
            <svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m12.5 12.5 4 4"/></svg>
            <input id="search" class="search" type="search" autocomplete="off" placeholder="Юристы, маркетинг, документы…" aria-controls="cards" spellcheck="false">
            <button id="clear-search" class="clear-search" type="button" aria-label="Очистить поиск" hidden><svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15"/></svg></button>
          </div>
        </div>
        <div>
          <label class="control-label" for="group">Сфера деятельности</label>
          <select id="group" class="group-select" aria-controls="cards"><option value="all">Все 12 групп</option>__GROUP_OPTIONS__</select>
        </div>
        <div class="view-control">
          <span class="control-label" id="view-label">Вид каталога</span>
          <div class="view-switch" role="group" aria-labelledby="view-label">
            <button id="view-illustrations" type="button" aria-pressed="true" aria-controls="cards"><svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2"/><circle cx="7.5" cy="7.5" r="1.1"/><path d="m4 15 5-5 3 3 2-2 3 3"/></svg>Иллюстрации</button>
            <button id="view-icons" type="button" aria-pressed="false" aria-controls="cards"><svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg>Иконки</button>
          </div>
        </div>
      </div>
    </section>
    <section aria-labelledby="results-title">
      <div class="results-heading"><h2 id="results-title">Все направления</h2><div id="result-count" class="result-count" role="status" aria-live="polite"><strong>120</strong> из 120</div></div>
      <div id="cards" class="grid"></div>
      <div id="empty" class="empty" hidden>
        <div class="empty-symbol"><svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m12.5 12.5 4 4"/></svg></div>
        <h3>Направление не найдено</h3><p>Попробуйте другое название, задачу или сферу деятельности.</p><button id="reset-filters" class="button-primary" type="button">Сбросить фильтры</button>
      </div>
      <noscript><p class="noscript">Для поиска и открытия карточек включите JavaScript. Все сценарии доступны в <a href="data/audiences.json">файле данных</a>, а изображения — в <a href="preview/overview-120.jpg">общем обзоре</a>.</p></noscript>
    </section>
    <footer class="footer"><p><strong>От задачи к понятному сценарию.</strong> 120 направлений показывают возможные применения ИИ-агентов. Конкретный процесс и результат внедрения определяются после разбора задачи.</p><div class="footer-links"><a href="data/audiences.json" download>Все данные JSON</a><a href="preview/overview-120.jpg" target="_blank" rel="noopener">Обзор 120 иллюстраций ↗</a></div></footer>
  </main>
  <dialog id="detail" aria-labelledby="detail-title" aria-describedby="detail-subtitle">
    <div class="dialog-top"><div class="dialog-group"><span id="detail-group"></span><span class="dot" aria-hidden="true"></span><span id="detail-number" class="dialog-number"></span></div><button id="close-detail" class="close-button" type="button" aria-label="Закрыть карточку"><span>Закрыть</span><svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15"/></svg></button></div>
    <div class="dialog-title"><h2 id="detail-title"></h2><p id="detail-subtitle" class="dialog-subtitle"></p></div>
    <div class="dialog-layout">
      <div>
        <div class="detail-art"><img id="detail-image" alt="" width="960" height="640" decoding="async"></div>
        <div class="flow-labels"><div class="flow-box"><small>На входе</small><span id="detail-input"></span></div><svg class="icon-16 flow-arrow" aria-hidden="true" viewBox="0 0 20 20"><path d="M3 10h14m-5-5 5 5-5 5"/></svg><div class="flow-box"><small>На выходе</small><span id="detail-output"></span></div></div>
        <p class="download-heading">Скачать ассеты</p><div id="downloads" class="downloads"></div><p class="format-note">Иллюстрация: SVG, PNG 1440 × 960, WebP 960 × 640.<br>Иконка: SVG и PNG 96 × 96.</p>
      </div>
      <div>
        <section class="detail-section"><h3>Какая задача</h3><p id="detail-pain"></p></section>
        <section class="detail-section"><h3>Как работает ИИ-агент</h3><ol id="detail-workflow" class="workflow"></ol></section>
        <section class="detail-section result-box"><h3>Что получает команда</h3><p id="detail-outcome"></p></section>
        <section class="detail-section"><h3>Связанные услуги</h3><ul id="detail-links" class="service-links"></ul></section>
      </div>
    </div>
  </dialog>
  <script id="audiences-data" type="application/json">__INLINE_DATA__</script>
  <script>
  (() => {
    'use strict';
    const data = JSON.parse(document.getElementById('audiences-data').textContent);
    const items = data.audiences;
    const bySlug = new Map(items.map(item => [item.slug, item]));
    const byGroup = new Map(data.groups.map(group => [group.id, group.label]));
    const normalize = value => String(value || '').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').trim();
    const searchText = new Map(items.map(item => [item.slug, normalize([item.label, item.group_label, item.scene.scene_title, item.pain, item.example_process].join(' '))]));
    const escapeHTML = value => String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
    const elements = {
      search: document.getElementById('search'), group: document.getElementById('group'),
      clear: document.getElementById('clear-search'), cards: document.getElementById('cards'),
      count: document.getElementById('result-count'), title: document.getElementById('results-title'),
      empty: document.getElementById('empty'), dialog: document.getElementById('detail'),
      illustrations: document.getElementById('view-illustrations'), icons: document.getElementById('view-icons')
    };
    const arrow = '<svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><path d="M7 4h9v9M16 4 4 16"/></svg>';
    const downloadIcon = '<svg class="icon-16" aria-hidden="true" viewBox="0 0 20 20"><path d="M10 3v9m-3-3 3 3 3-3M4 13v4h12v-4"/></svg>';
    let view = 'illustrations';
    let lastFocusedCard = null;

    function render() {
      const words = normalize(elements.search.value).split(/\s+/).filter(Boolean);
      const selectedGroup = elements.group.value;
      const filtered = items.filter(item => (selectedGroup === 'all' || item.group_id === selectedGroup) && words.every(word => searchText.get(item.slug).includes(word)));
      elements.clear.hidden = !elements.search.value;
      elements.cards.classList.toggle('is-icons', view === 'icons');
      elements.illustrations.setAttribute('aria-pressed', String(view === 'illustrations'));
      elements.icons.setAttribute('aria-pressed', String(view === 'icons'));
      elements.title.textContent = selectedGroup === 'all' ? (words.length ? 'Результаты поиска' : 'Все направления') : byGroup.get(selectedGroup);
      elements.count.innerHTML = '<strong>' + filtered.length + '</strong> из ' + items.length;
      elements.empty.hidden = filtered.length !== 0;
      elements.cards.hidden = filtered.length === 0;
      elements.cards.innerHTML = filtered.map(item => {
        const src = view === 'icons' ? item.assets.icon_svg : (item.assets.illustration_webp || item.assets.illustration_svg);
        const size = view === 'icons' ? 'width="96" height="96"' : 'width="960" height="640"';
        return '<button class="card" type="button" data-slug="' + escapeHTML(item.slug) + '" aria-haspopup="dialog" aria-label="' + escapeHTML(item.label + ' — ' + item.scene.scene_title + '. Подробнее') + '">' +
          '<span class="card-art"><span class="card-number" aria-hidden="true">' + String(item.index).padStart(3, '0') + '</span><span class="card-expand" aria-hidden="true">' + arrow + '</span><img src="' + escapeHTML(src) + '" alt="" ' + size + ' loading="lazy" decoding="async"></span>' +
          '<span class="card-copy"><span class="card-title">' + escapeHTML(item.label) + '</span><span class="card-scene">' + escapeHTML(item.scene.scene_title) + '</span></span></button>';
      }).join('');
    }

    function setText(id, value) { document.getElementById(id).textContent = value || ''; }

    function openDetail(item, trigger) {
      lastFocusedCard = trigger;
      setText('detail-group', item.group_label);
      setText('detail-number', String(item.index).padStart(3, '0') + ' / ' + items.length);
      setText('detail-title', item.label);
      setText('detail-subtitle', item.scene.scene_title);
      setText('detail-input', item.scene.input_label);
      setText('detail-output', item.scene.output_label);
      setText('detail-pain', item.pain);
      setText('detail-outcome', item.outcome);
      const image = document.getElementById('detail-image');
      image.src = item.assets.illustration_svg;
      image.alt = item.alt || item.scene.subject || item.scene.scene_title;
      const workflow = document.getElementById('detail-workflow');
      workflow.replaceChildren(...item.workflow.map(step => {
        const li = document.createElement('li'); li.textContent = step; return li;
      }));
      const services = document.getElementById('detail-links');
      services.replaceChildren(...item.links.slice(0, 3).map(link => {
        const li = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = link.href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
        anchor.innerHTML = '<span>' + escapeHTML(link.title) + '</span>' + arrow;
        li.appendChild(anchor); return li;
      }));
      const formats = [
        ['illustration_svg','SVG'], ['illustration_png','PNG'], ['illustration_webp','WebP'],
        ['icon_svg','Иконка SVG'], ['icon_png','Иконка PNG']
      ];
      document.getElementById('downloads').replaceChildren(...formats.filter(([key]) => item.assets[key]).map(([key, label]) => {
        const anchor = document.createElement('a');
        anchor.className = 'download-link'; anchor.href = item.assets[key];
        const extension = key.split('_').pop();
        anchor.download = item.slug + (key.startsWith('icon_') ? '-icon' : '') + '.' + extension;
        anchor.setAttribute('aria-label', 'Скачать ' + label + ': ' + item.label);
        anchor.innerHTML = downloadIcon + '<span>' + label + '</span>';
        return anchor;
      }));
      document.body.classList.add('modal-open');
      elements.dialog.showModal();
      elements.dialog.scrollTop = 0;
      document.getElementById('close-detail').focus({preventScroll:true});
    }

    elements.search.addEventListener('input', render);
    elements.group.addEventListener('change', render);
    elements.clear.addEventListener('click', () => { elements.search.value = ''; render(); elements.search.focus(); });
    elements.illustrations.addEventListener('click', () => { view = 'illustrations'; render(); });
    elements.icons.addEventListener('click', () => { view = 'icons'; render(); });
    document.getElementById('reset-filters').addEventListener('click', () => {
      elements.search.value = ''; elements.group.value = 'all'; render(); elements.search.focus();
    });
    elements.cards.addEventListener('click', event => {
      const button = event.target.closest('button[data-slug]');
      if (!button || !elements.cards.contains(button)) return;
      const item = bySlug.get(button.dataset.slug);
      if (item) openDetail(item, button);
    });
    document.getElementById('close-detail').addEventListener('click', () => elements.dialog.close());
    elements.dialog.addEventListener('click', event => {
      if (event.target !== elements.dialog) return;
      const rect = elements.dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) elements.dialog.close();
    });
    elements.dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (lastFocusedCard && lastFocusedCard.isConnected) lastFocusedCard.focus({preventScroll:true});
    });
    render();
  })();
  </script>
</body>
</html>
'''


def build(root: Path) -> Path:
    data_path = root / 'data' / 'audiences.json'
    data = json.loads(data_path.read_text(encoding='utf-8'))
    audiences = data['audiences']
    assert len(audiences) == 120, f'Expected 120 audiences, got {len(audiences)}'
    assert len(data['groups']) == 12, 'Expected 12 audience groups'
    assert len({item['slug'] for item in audiences}) == len(audiences), 'Duplicate slug'
    for item in audiences:
        assert len(item['workflow']) == 3, f'Expected three steps: {item["slug"]}'
        assert 2 <= len(item['links']) <= 3, f'Expected two or three service links: {item["slug"]}'
        assert all(link['href'].startswith('https://aicraft.agency/') for link in item['links'])
    options = ''.join(
        f'<option value="{html.escape(group["id"], quote=True)}">{html.escape(group["label"])} · {group["count"]}</option>'
        for group in data['groups']
    )
    inline_data = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    inline_data = inline_data.replace('<', r'\u003c').replace('>', r'\u003e').replace('&', r'\u0026')
    inline_data = inline_data.replace('\u2028', r'\u2028').replace('\u2029', r'\u2029')
    page = TEMPLATE.replace('__GROUP_OPTIONS__', options).replace('__INLINE_DATA__', inline_data)
    output = root / 'index.html'
    output.write_text(page, encoding='utf-8')
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1], help='Asset pack root')
    args = parser.parse_args()
    output = build(args.root.resolve())
    print(json.dumps({'catalog': str(output), 'bytes': output.stat().st_size, 'audiences': 120}, ensure_ascii=False))


if __name__ == '__main__':
    main()
