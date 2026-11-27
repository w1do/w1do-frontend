#!/usr/bin/env python3
"""Build preview sheets of the original vector/raster collection. Requires Pillow."""
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data/audiences.json').read_text())
REGULAR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def font(size,bold=False):
    try:return ImageFont.truetype(BOLD if bold else REGULAR,size)
    except OSError:return ImageFont.load_default(size=size)


def fit_text(draw,text,max_w,size=23,bold=False):
    while size>12 and draw.textlength(text,font=font(size,bold))>max_w:size-=1
    return font(size,bold)


def wrap(draw,text,max_w,f):
    lines=[];line=''
    for word in text.split():
        test=f'{line} {word}'.strip()
        if draw.textlength(test,font=f)>max_w and line:
            lines.append(line);line=word
        else:line=test
    if line:lines.append(line)
    return lines


def contact(items,cols,cell_w,cell_h,title,subtitle,out):
    gap=18;pad=34;head=130
    rows=math.ceil(len(items)/cols)
    width=pad*2+cols*cell_w+(cols-1)*gap
    height=head+rows*cell_h+(rows-1)*gap+pad
    canvas=Image.new('RGB',(width,height),'#F5F8FD')
    draw=ImageDraw.Draw(canvas)
    draw.text((pad,26),title,font=font(36,True),fill='#16336B')
    draw.text((pad,79),subtitle,font=font(19),fill='#61738E')
    for i,a in enumerate(items):
        x=pad+(i%cols)*(cell_w+gap);y=head+(i//cols)*(cell_h+gap)
        draw.rounded_rectangle((x,y,x+cell_w,y+cell_h),radius=18,fill='white',outline='#D8E4F4',width=1)
        img=Image.open(ROOT/a['assets']['illustration_png']).convert('RGBA')
        target_w=cell_w-12;target_h=round(target_w*2/3)
        img=img.resize((target_w,target_h),Image.Resampling.LANCZOS)
        canvas.paste(img,(x+6,y+4),img)
        text_y=y+target_h-5
        f=fit_text(draw,a['label'],cell_w-28,21,True)
        draw.text((x+14,text_y),a['label'],font=f,fill='#16336B')
        desc=a['scene']['scene_title']
        for j,line in enumerate(wrap(draw,desc,cell_w-28,font(15))[:2]):
            draw.text((x+14,text_y+30+j*19),line,font=font(15),fill='#6D819F')
    canvas.save(ROOT/out,quality=92,subsampling=0)
    return {'file':out,'pixels':canvas.size,'items':len(items)}


def icon_board():
    items=DATA['audiences'];cols=10;cw=176;ch=154;gap=12;pad=28;head=110
    width=pad*2+cols*cw+(cols-1)*gap;height=head+12*ch+11*gap+pad
    im=Image.new('RGB',(width,height),'#F5F8FD');d=ImageDraw.Draw(im)
    d.text((pad,24),'AICraft / 120 предметных иконок',font=font(34,True),fill='#16336B')
    d.text((pad,70),'Одна строка — одна группа направлений',font=font(18),fill='#6D819F')
    for i,a in enumerate(items):
        x=pad+(i%cols)*(cw+gap);y=head+(i//cols)*(ch+gap)
        d.rounded_rectangle((x,y,x+cw,y+ch),radius=16,fill='white',outline='#D8E4F4')
        icon=Image.open(ROOT/a['assets']['icon_png']).convert('RGBA')
        im.paste(icon,(x+(cw-96)//2,y+9),icon)
        for j,line in enumerate(wrap(d,a['label'],cw-18,font(13))[:2]):
            tw=d.textlength(line,font=font(13));d.text((x+(cw-tw)/2,y+111+j*16),line,font=font(13),fill='#354A69')
    im.save(ROOT/'preview/icons-120.jpg',quality=93,subsampling=0)


def main():
    examples=['business-owners','lawyers','marketers','online-stores','property-developers','logistics-companies','auto-repair-shops','medical-clinics','online-schools','hotels','crm-integrators','farms']
    by_slug={a['slug']:a for a in DATA['audiences']}
    print(contact([by_slug[s] for s in examples],4,380,330,'AICraft / Иллюстрации для каждой сферы','12 примеров из полного комплекта на 120 направлений','preview/selected-12.jpg'))
    print(contact(DATA['audiences'],6,300,285,'AICraft / Все 120 направлений','Предметные иллюстрации • SVG / PNG / WebP • Единая система оформления','preview/overview-120.jpg'))
    for g in DATA['groups']:
        items=[a for a in DATA['audiences'] if a['group_id']==g['id']]
        contact(items,5,310,282,g['label'],'10 направлений / AICraft Agency',f"preview/{g['id']}.jpg")
    icon_board()


if __name__=='__main__':main()
