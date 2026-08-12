import glob
with open('_partials/nav.html',encoding='utf-8') as f: NAV=f.read()
with open('_partials/footer.html',encoding='utf-8') as f: FOOTER=f.read()
NS='<!-- PARTIAL:NAV:START -->'; NE='<!-- PARTIAL:NAV:END -->'
FS='<!-- PARTIAL:FOOTER:START -->'; FE='<!-- PARTIAL:FOOTER:END -->'
def build(html):
    for s,e,p in [(NS,NE,NAV),(FS,FE,FOOTER)]:
        i=html.find(s); j=html.find(e)
        if i!=-1 and j!=-1: html=html[:i+len(s)]+chr(10)+p+chr(10)+html[j:]
    return html
files=[f for f in glob.glob('**/*.html',recursive=True) if not f.startswith('_')]
n=0
for fn in files:
    h=open(fn,encoding='utf-8').read(); nh=build(h)
    if nh!=h: open(fn,'w',encoding='utf-8').write(nh); print('updated:',fn); n+=1
print(n,'files updated')