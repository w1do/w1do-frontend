#!/usr/bin/env python3
"""Build the editable AICraft audience illustration and icon collection.

Original vector artwork. Inputs live beside this script and in ../data.
Run: python3 source/build_assets.py, then node source/render_assets.cjs.
"""
from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BLUE = '#2563EB'
INK = '#16336B'
LINE = '#C5D8F5'
PALE = '#EEF5FF'
MID = '#8CB4FA'
ESC = html.escape


def rect(x, y, w, h, r=12, fill='white', stroke=LINE, sw=2, extra=''):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def path(d, stroke=BLUE, sw=3, fill='none', extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'


def circle(x, y, r, fill='white', stroke=LINE, sw=2, extra=''):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def group(inner, transform='', extra=''):
    return f'<g transform="{transform}" {extra}>{inner}</g>'


def glyph(inner, x, y, size, color=BLUE, stroke=2.9):
    return group(inner, f'translate({x} {y}) scale({size/96:.6f})', f'color="{color}" fill="none" stroke="currentColor" stroke-width="{stroke}" stroke-linecap="round" stroke-linejoin="round"')


SYMBOLS = {
    'ai-agent': '<rect x="25" y="25" width="46" height="46" rx="13"/><rect x="36" y="36" width="24" height="24" rx="7"/><path d="M36 15v10m12-10v10m12-10v10M36 71v10m12-10v10m12-10v10M15 36h10m-10 12h10m-10 12h10M71 36h10M71 48h10M71 60h10"/><path d="m42 48 5 5 9-11"/>',
    'document': '<path d="M26 14h31l15 15v53H26z"/><path d="M57 14v15h15M36 42h25M36 52h25M36 62h16"/>',
    'data-source': '<ellipse cx="48" cy="23" rx="28" ry="11"/><path d="M20 23v47c0 15 56 15 56 0V23M20 47c0 15 56 15 56 0"/>',
    'check': '<circle cx="48" cy="48" r="30"/><path d="m32 48 11 11 22-25"/>',
    'search': '<circle cx="42" cy="42" r="23"/><path d="m59 59 21 21"/>',
    'arrow-left': '<path d="M78 48H18m22-22L18 48l22 22"/>',
    'arrow-right': '<path d="M18 48h60M56 26l22 22-22 22"/>',
    'close': '<path d="m26 26 44 44m0-44L26 70"/>',
    'pause': '<path d="M35 22v52M61 22v52"/>',
    'play': '<path d="m34 20 42 28-42 28z"/>',
    'external-link': '<path d="M54 18h25v25M79 18 43 54M42 23H23v51h51V55"/>',
    'filter': '<path d="M18 24h60L55 51v24l-14-7V51z"/>',
}


def lines(x, y, w, count=4, seed=0, highlight=1, step=20):
    s = ''
    for i in range(count):
        width = round(w * (0.58 + ((seed + i*17) % 35)/100))
        s += rect(x, y+i*step, width, 7, 3.5, MID if i == highlight else '#D9E4F5', 'none', 0)
    return s


def dots(x, y, rows=4, cols=7, step=20):
    return ''.join(circle(x+j*step, y+i*step, 1.8, '#C8DCF9', 'none', 0) for i in range(rows) for j in range(cols))


def paper(x, y, w, h, seed=0, angle=0, prefix=''):
    s = rect(x,y,w,h,16, 'white',LINE,1.8, f'filter="url(#{prefix}-shadow)"')
    s += rect(x+23,y+25,42,8,4,BLUE,'none',0)
    s += lines(x+23,y+57,w-38,5,seed,2,24)
    if h>220:
        s += rect(x+23,y+194,w-46,37,8,PALE,'none',0)
        s += lines(x+35,y+207,w-75,1,seed+4,-1)
        s += lines(x+23,y+253,w-38,max(0,int((h-270)/20)),seed+8,-1)
    return group(s,f'rotate({angle} {x+w/2} {y+h/2})')


def window(x,y,w,h,prefix):
    s=rect(x,y,w,h,24,'white',LINE,2,f'filter="url(#{prefix}-shadow)"')
    s+=path(f'M{x} {y+42}H{x+w}',LINE,1.5)
    for j,c in enumerate([BLUE,'#B7D0FA','#D8E5FA']):
        s+=circle(x+24+j*15,y+21,3.5,c,'none',0)
    s+=rect(x+w-116,y+16,88,9,4.5,PALE,'none',0)
    return s


def chart(x,y,w,h,seed):
    s=''
    for i in range(4):
        s+=path(f'M{x} {y+i*h/3}H{x+w}', '#EDF2F9',1.5)
    vals=[.28,.43,.33,.55,.49,.79,.70,.91]
    pts=[(x+i*w/7, y+h-v*h) for i,v in enumerate(vals)]
    area=f'M{x} {y+h} '+ ' '.join(f'L{px:.1f} {py:.1f}' for px,py in pts)+f'L{x+w} {y+h}Z'
    s+=path(area,'none',0,'#EAF2FF')
    s+=path('M'+' L'.join(f'{px:.1f} {py:.1f}' for px,py in pts),BLUE,4)
    for i in [0,3,7]:
        px,py=pts[i];s+=circle(px,py,4.5,'white',BLUE,2.5)
    return s


def checklist(x,y,w,seed,rows=3):
    s=''
    for i in range(rows):
        yy=y+i*51
        s+=rect(x,yy,w,39,10, '#F7FAFF', '#E5EDF9',1)
        s+=circle(x+20,yy+19.5,8, '#E3EFFF','none',0)
        s+=path(f'M{x+16} {yy+19}l3 3 6-7',BLUE,2)
        s+=rect(x+41,yy+12,w-66-((i+seed)%3)*15,5,2.5, '#BCD0EE','none',0)
        s+=rect(x+41,yy+23,w-92,4,2,'#DFE8F6','none',0)
    return s


def tile_icon(icon,x,y,size,prefix,angle=0):
    s=rect(x,y,size,size,round(size*.20),'white','#B9D0F4',2,f'filter="url(#{prefix}-shadow)"')
    s+=rect(x+12,y+12,size-24,size-24,round(size*.15),'#F5F9FF','none',0)
    s+=glyph(icon,x+size*.115,y+size*.115,size*.77)
    return group(s,f'rotate({angle} {x+size/2} {y+size/2})')


def small_result(x,y,prefix,seed=0):
    s=rect(x,y,162,76,17,'white',LINE,1.8,f'filter="url(#{prefix}-shadow)"')
    s+=circle(x+34,y+38,18,'#E9F3FF','none',0)
    s+=path(f'M{x+26} {y+38}l6 6 11-13',BLUE,3)
    s+=lines(x+64,y+27,87,2,seed,-1,17)
    return s


def process_footer(prefix,seed):
    s=path('M335 530H620','#B5CDF5',2.4,extra='stroke-dasharray="5 8"')
    for j,k in enumerate(['data-source','ai-agent','check']):
        x=326+j*144
        s+=rect(x-25,505,50,50,15,'white',LINE,1.6)
        s+=glyph(SYMBOLS[k],x-18,512,36,BLUE,3.4)
    s+=path('m396 525 5 5-5 5',BLUE,2)
    s+=path('m540 525 5 5-5 5',BLUE,2)
    return s


def scene_management(icon,p,s):
    a=window(135,120,625,360,p)
    a+=rect(157,182,325,98,14,'#F3F7FF','none',0)
    for i in range(3):
        a+=rect(175+i*99,202,71,8,4,'#CADCF7','none',0)
        a+=rect(175+i*99,224,51+(i%2)*15,25,6,BLUE if i==0 else '#91B7F7','none',0)
    a+=chart(173,323,277,121,s)
    a+=checklist(506,188,221,s,4)
    a+=tile_icon(icon,626,288,200,p,3)
    return a


def scene_legal(icon,p,s):
    a=paper(154,160,230,304,s,-9,p)
    a+=paper(330,105,266,358,s+7,4,p)
    a+=path('M554 221c55 0 33 106 86 106','#96B8EF',2.5,extra='stroke-dasharray="5 7"')
    a+=tile_icon(icon,600,238,214,p,0)
    a+=small_result(143,422,p,s)
    return a


def scene_marketing(icon,p,s):
    a=window(132,120,648,348,p)
    a+=rect(156,184,239,213,18,'#EAF2FF','none',0)
    a+=path('M177 370v-39l49-59 37 34 46-72 62 81v55Z','none',0,'#C9DDFE')
    a+=circle(333,220,17,'#8EB5FA','none',0)
    a+=rect(175,205,85,10,5,'white','none',0)
    a+=rect(175,223,53,7,3.5,'white','none',0)
    a+=chart(425,198,317,116,s)
    a+=lines(423,347,223,3,s,-1,21)
    a+=tile_icon(icon,620,301,193,p,-4)
    a+=small_result(153,419,p,s)
    return a


def cube(x,y,w=80,h=66):
    return path(f'M{x} {y+18}l{w/2} -20 {w/2} 20v{h-18}l-{w/2} 23 -{w/2} -23Z', '#86ABEA',2.5,'#EAF2FF')+path(f'M{x} {y+18}l{w/2} 22 {w/2} -22M{x+w/2} {y+40}v{h+3-40}m-17-73 39 20v17', '#86ABEA',2.5)


def scene_commerce(icon,p,s):
    a=window(127,116,537,359,p)
    for r in range(2):
        for c in range(3):
            xx=152+c*162;yy=181+r*133
            a+=rect(xx,yy,143,116,13,'#F6F9FF','#DFE9F8',1.4)
            if (r+c)%3==0:a+=cube(xx+47,yy+18,48,36)
            elif (r+c)%3==1:a+=rect(xx+48,yy+20,48,51,8,'#DCEAFF','#97B9EE',2)+path(f'M{xx+57} {yy+24}v-5c0-17 30-17 30 0v5','#97B9EE',2)
            else:a+=circle(xx+72,yy+45,24,'#DCEAFF','#97B9EE',2)+path(f'M{xx+60} {yy+45}h24M{xx+72} {yy+33}v24','#97B9EE',2)
            a+=rect(xx+18,yy+88,79+(s+c)%24,6,3,'#BED3F2','none',0)
    a+=tile_icon(icon,632,182,198,p,2)
    a+=small_result(631,408,p,s)
    return a


def scene_property(icon,p,s):
    a=rect(130,120,680,358,24,'#F7FAFF',LINE,2,f'filter="url(#{p}-shadow)"')
    for x in range(151,799,27):a+=path(f'M{x} 138V460','#E4EDF9',1)
    for y in range(143,470,27):a+=path(f'M149 {y}H791','#E4EDF9',1)
    a+=rect(182,245,127,185,2,'#E2EEFF','#7DA6E9',3)
    a+=path('M171 245l75-65 75 65','#7DA6E9',3,'#E2EEFF')
    a+=rect(224,359,39,71,1,'white','#7DA6E9',2)
    for xx in [200,265]:a+=rect(xx,279,25,34,1,'white','#7DA6E9',2)
    a+=rect(354,199,176,231,2,'#EEF5FF','#7DA6E9',3)
    for xx in [375,425,475]:
        for yy in [223,274,325]:a+=rect(xx,yy,28,28,2,'white','#9DBCEB',2)
    a+=path('M164 454H549m-385-6v12m385-12v12M141 176V430m-6-254h12m-12 254h12','#88ADE6',2)
    a+=path('M547 181h78v63','#96B8ED',2.5,extra='stroke-dasharray="5 7"')
    a+=tile_icon(icon,610,230,203,p,-2)
    return a


def scene_industry(icon,p,s):
    a=path('M236 154H650q46 0 46 46v155q0 50-50 50H238','#B6CDF1',2.5,extra='stroke-dasharray="5 8"')
    a+=rect(138,314,416,105,20,'white',LINE,2,f'filter="url(#{p}-shadow)"')
    a+=rect(152,383,387,19,9,'#E8F0FD','#BCD1F0',1.5)
    for xx in range(166,530,29):a+=circle(xx,392,5,'#C4D8F8','none',0)
    a+=cube(190,298,83,65)+cube(332,285,97,78)
    a+=tile_icon(icon,184,116,198,p,-3)
    a+=window(506,142,288,190,p)
    a+=checklist(524,199,251,s,2)
    a+=small_result(612,383,p,s)
    return a


def scene_auto(icon,p,s):
    a=rect(125,127,677,350,27,'#F8FAFF',LINE,2,f'filter="url(#{p}-shadow)"')
    a+=path('M146 439H777','#CFDDF2',2)
    a+=path('M159 369v-43q0-19 27-26l49-15 49-73h142l65 76 46 17q24 9 24 34v30H159Z','#6394E5',4,'#E6F0FF')
    a+=path('M248 283l35-56h62v56h-97Zm111-56h59l47 56H359Z','#6394E5',3,'white')
    for xx in [235,470]:a+=circle(xx,369,34,'white','#6394E5',4)+circle(xx,369,15,'#DCEAFF','#6394E5',3)
    a+=path('M175 327h28M518 327h23M317 307h19M399 307h19','#6394E5',3)
    a+=tile_icon(icon,581,167,222,p,2)
    a+=small_result(570,410,p,s)
    return a


def scene_health(icon,p,s):
    a=window(140,126,402,352,p)
    a+=path('M174 193H505','#C4D8F5',2)
    for j in range(7):a+=circle(186+j*49,185,3,'#8EAFE6','none',0)
    for row in range(4):
        for col in range(7):
            xx=171+col*49;yy=214+row*54
            active=(row*7+col+s)%8==0
            a+=rect(xx,yy,33,34,8, '#DAE9FF' if active else '#F0F5FD','none',0)
            a+=circle(xx+16.5,yy+17,3.8,BLUE if active else '#C0D1ED','none',0)
    a+=path('M542 274H610','#A8C4EF',2.5,extra='stroke-dasharray="5 7"')
    a+=tile_icon(icon,600,203,213,p,1)
    a+=small_result(586,422,p,s)
    return a


def scene_education(icon,p,s):
    a=paper(485,120,271,338,s,5,p)
    a+=path('M149 227q104-43 208 0v248q-104-43-208 0V227Zm208 0q104-43 208 0v248q-104-43-208 0V227Z','#8FB1EA',3,'white')
    a+=path('M357 232v238','#8FB1EA',3)
    for i in range(6):
        yy=267+i*27
        a+=path(f'M173 {yy}q78-26 158 0M382 {yy}q78-26 158 0','#BFD3F0' if i!=2 else '#6E9CED',5)
    a+=rect(186,139,124,54,13,'white',LINE,1.8,f'filter="url(#{p}-shadow)"')
    a+=path('M205 166h85','#BBD1F2',3)
    for x in [212,247,283]:a+=circle(x,166,7,'#E2EDFF',BLUE,2)
    a+=tile_icon(icon,614,275,199,p,-2)
    return a


def map_art(x,y,w,h,seed):
    a=rect(x,y,w,h,18,'#EEF5FE','#BED3F2',1.8)
    for i in range(3):
        a+=path(f'M{x+45+i*92} {y+8}l-17 {h-16}','white',11)
    for i in range(3):
        a+=path(f'M{x+9} {y+42+i*79}l{w-18} -11','white',11)
    d=f'M{x+56} {y+h-49}V{y+150}q0-16 17-16h90q19 0 19-20V{y+53}h{w-242}'
    a+=path(d,'#82A9EA',4,extra='stroke-dasharray="6 7"')
    a+=circle(x+56,y+h-49,10,'white',BLUE,3)
    a+=circle(x+w-60,y+53,12,BLUE,'white',4)
    return a


def scene_hospitality(icon,p,s):
    a=group(map_art(141,155,397,307,s),'rotate(-5 339 308)')
    a+=window(482,117,294,302,p)
    a+=rect(505,177,247,92,12,'#EAF2FF','none',0)
    a+=path('M526 246v-34l48-21 47 21v34h-95Z','#9EBDEC',2.5,'white')
    a+=rect(546,220,16,26,2,'#D6E5FC','none',0)
    a+=lines(637,194,104,3,s,-1,22)
    a+=checklist(506,291,245,s,2)
    a+=tile_icon(icon,605,310,201,p,3)
    return a


def scene_it(icon,p,s):
    a=window(129,116,671,366,p)
    a+=dots(155,190,11,26,22)
    a+=path('M275 257H361q20 0 20 22v74q0 20 22 20h101M275 257h86q20 0 20-22v-21q0-17 20-17h104','#9ABCEE',3)
    for x,y,k in [(167,211,'data-source'),(470,153,'document'),(470,329,'ai-agent')]:
        a+=rect(x,y,115,91,17,'white',LINE,1.8)
        a+=glyph(SYMBOLS[k],x+27,y+15,61,BLUE,3.5)
    a+=path('M588 199h44v117M588 375h44v-59','#9ABCEE',3)
    a+=tile_icon(icon,626,266,190,p,-3)
    return a


def scene_local(icon,p,s):
    a=map_art(127,130,425,346,s)
    a+=window(520,135,284,342,p)
    a+=checklist(539,197,246,s,4)
    a+=tile_icon(icon,173,208,208,p,-3)
    a+=path('M385 303h115','#7AA3E7',3,extra='stroke-dasharray="5 7"')
    a+=circle(499,303,5,BLUE,'white',2)
    return a


SCENES=[scene_management,scene_legal,scene_marketing,scene_commerce,scene_property,scene_industry,scene_auto,scene_health,scene_education,scene_hospitality,scene_it,scene_local]


def illustration(a,gi,icon,brief):
    p=a['slug']
    s=int(hashlib.sha256(p.encode()).hexdigest()[:8],16)
    title=f"{a['label']}: {brief['scene_title']}"
    desc=f"{brief['subject']}. {a['example_process']}"
    defs=f'<defs><linearGradient id="{p}-wash" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F3F8FF"/><stop offset="1" stop-color="#E3EEFF"/></linearGradient><filter id="{p}-shadow" x="-25%" y="-25%" width="150%" height="165%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="9" stdDeviation="12" flood-color="#4774BC" flood-opacity=".11"/></filter></defs>'
    bg=rect(80,78,800,484,55,f'url(#{p}-wash)','none',0)
    bg+=circle(791,128,70,'#DFECFF','none',0)
    bg+=dots(79,441,4,5,18)+dots(797,194,5,4,18)
    bg+=path('M54 188h26q22 0 22-22v-19q0-19 20-19h25','#B6CDF3',1.8)
    bg+=rect(76,183,8,8,1.5,'#E1EDFF','#8AB0ED',1.2)
    bg+=path('M808 491h45q22 0 22-22v-14h31','#B6CDF3',1.8)
    bg+=rect(871,465,8,8,1.5,'#E1EDFF','#8AB0ED',1.2)
    artwork=SCENES[gi](icon,p,s)+process_footer(p,s)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640" role="img" aria-labelledby="{p}-title {p}-desc"><title id="{p}-title">{ESC(title)}</title><desc id="{p}-desc">{ESC(desc)}</desc>{defs}{bg}{artwork}</svg>'


def icon_svg(slug,label,inner):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" color="{BLUE}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-labelledby="{slug}-title"><title id="{slug}-title">{ESC(label)}</title>{inner}</svg>'


SERVICES={
 'agents':{'title':'Разработка ИИ-агентов','href':'https://w1do.ru/ai-agents'},
 'chatbots':{'title':'ИИ-ассистенты и чат-боты','href':'https://w1do.ru/services/ai-assistants-chatbots'},
 'crm':{'title':'Интеграция с 1С и CRM','href':'https://w1do.ru/services/ai-integration-1c-crm'},
 'marketing':{'title':'Автоматизация маркетинга и контента','href':'https://w1do.ru/services/ai-marketing-content'},
 'integration':{'title':'Внедрение ИИ в бизнес-процессы','href':'https://w1do.ru/services/ai-integration'},
 'architecture':{'title':'Архитектура ИИ-систем','href':'https://w1do.ru/services/ai-solution-architecture'},
}
FACETS={'rag':'chatbots','chatbot':'chatbots','documents':'agents','crm':'crm','analytics':'integration','agents':'agents','local_models':'architecture'}


def card_links(a,gi):
    keys=(['marketing'] if gi==2 else [])+[FACETS[x] for x in a['related_services']]
    if len(set(keys))<3:keys+=['agents','architecture','integration']
    unique=list(dict.fromkeys(keys))[:3]
    return [dict(id=k,**SERVICES[k]) for k in unique]


def main():
    data=json.loads((ROOT/'data/audiences-source.json').read_text())
    icons=json.loads((ROOT/'source/icons.json').read_text())
    raw_briefs=json.loads((ROOT/'data/visual-briefs.json').read_text())
    if isinstance(raw_briefs,list):briefs={b['slug']:b for b in raw_briefs}
    elif 'briefs' in raw_briefs:briefs={b['slug']:b for b in raw_briefs['briefs']}
    elif 'audiences' in raw_briefs:briefs={b['slug']:b for b in raw_briefs['audiences']}
    else:briefs=raw_briefs
    for folder in ['illustrations/svg','illustrations/png','illustrations/webp','icons/svg','icons/png','common','data','preview']:
        (ROOT/folder).mkdir(parents=True,exist_ok=True)
    audiences=[]
    for gi,g in enumerate(data['groups']):
        for ai,a in enumerate(g['audiences']):
            slug=a['slug'];icon=icons[slug]['svg'];brief=briefs[slug]
            svg=illustration(a,gi,icon,brief)
            ET.fromstring(svg)
            (ROOT/f'illustrations/svg/{slug}.svg').write_text(svg)
            (ROOT/f'icons/svg/{slug}.svg').write_text(icon_svg(slug,a['label'],icon))
            audiences.append({**a,'group_id':g['id'],'group_label':g['label'],'index':len(audiences)+1,
              'scene':brief,'alt':f"ИИ-агент для направления «{a['label']}»: {brief['scene_title'].lower()}",
              'assets':{'illustration_svg':f'illustrations/svg/{slug}.svg','illustration_png':f'illustrations/png/{slug}.png','illustration_webp':f'illustrations/webp/{slug}.webp','icon_svg':f'icons/svg/{slug}.svg','icon_png':f'icons/png/{slug}.png'},
              'links':card_links(a,gi),'industry_page':{'href':None,'suggested_path':f'/solutions/{slug}/','status':'proposal_not_published'}})
    for k,v in SYMBOLS.items():
        (ROOT/f'common/{k}.svg').write_text(icon_svg('common-'+k,k,v))
    (ROOT/'common/dot-grid.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">'+dots(8,8,8,8,16)+'</svg>')
    (ROOT/'common/connector-corner.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160">'+path('M8 140H112q40 0 40-40V60q0-40 40-40h120','#C3D8F9',1.5)+rect(148,91,8,8,1,'#E8F1FF','#91B6F1',1)+'</svg>')
    manifest={
      'version':'1.0.0','brand':'AICraft Agency','created_at':'2026-11-27','status':'design_assets_and_content_ready_not_deployed',
      'art_direction':'Светлые предметные векторные иллюстрации: белые поверхности, синие линии, связки данных и результата. Текст вынесен в HTML.',
      'counts':{'audiences':len(audiences),'groups':len(data['groups']),'illustration_svg':120,'illustration_png':120,'illustration_webp':120,'icon_svg':120,'icon_png':120,'common_svg':14},
      'formats':{'illustrations':{'svg_viewbox':'0 0 960 640','png_pixels':[1440,960],'webp_pixels':[960,640],'background':'transparent_outside_the_scene'},'icons':{'svg_viewbox':'0 0 96 96','png_pixels':[96,96],'background':'transparent'}},
      'palette':{'blue':BLUE,'ink':INK,'pale':PALE,'line':LINE,'surface':'#FFFFFF'},
      'section':data['section'],
      'interaction':{'row_directions':['left','left','right','right'],'hover':'Pause the hovered row without resetting its position. Show Подробнее without changing chip width.','details':'Open one stable detail panel on click; close on explicit action.','search':'Show a static filtered grid.','mobile':'Swipeable rows, single-tap opening, no hover dependency.','keyboard':'Pause on focus-within; real buttons; Escape closes; restore focus.','motion':'Persistent global pause; respect prefers-reduced-motion.','clones':'No duplicate ids or focusable controls hidden from assistive technology.'},
      'seo':{'heading_tag':'h2','intro_and_links':'Render as ordinary crawlable HTML; do not require hover or click for the only copy of important content.','links':'Real a[href] links with descriptive anchors.','direction_pages':'Publish only useful substantive pages; suggested paths are not live links.','image_alt':'Use the supplied alt when the illustration adds meaning; use an empty alt if adjacent text fully duplicates it.'},
      'service_catalog':SERVICES,'services_verified_at':'2026-11-27','groups':[{'id':g['id'],'label':g['label'],'count':len(g['audiences'])} for g in data['groups']],
      'audiences':audiences,
      'references':['https://developers.google.com/search/docs/crawling-indexing/links-crawlable','https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics','https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html']
    }
    assert len(audiences)==120 and len({x['slug'] for x in audiences})==120
    (ROOT/'data/audiences.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    (ROOT/'data/design-tokens.json').write_text(json.dumps({'colors':manifest['palette'],'radius':{'chip':999,'card':24,'image_panel':32},'stroke':{'icon':3,'illustration':2},'font':'Manrope, Inter, system-ui, sans-serif'},ensure_ascii=False,indent=2))
    print(json.dumps({'illustrations':120,'icons':120,'common':14,'cards':len(audiences)},ensure_ascii=False))


if __name__=='__main__':main()
