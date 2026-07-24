import re, os

# 1. Logo: 48px -> 72px
with open('css/style.css', 'r', encoding='utf-8') as f: css = f.read()
count = css.count('height: 48px;')
with open('css/style.css', 'w', encoding='utf-8') as f: f.write(css.replace('height: 48px;', 'height: 72px;'))
print(f'✓ css/style.css  ({count} change(s))')

# 2. Remove nav text from all 6 pages
p = re.compile(r'\s*<span class="nav-logo-text">WRIGHT\s*<span>Carpentry</span></span>')
for fn in ['index.html','about.html','gallery.html','services.html','contact.html','service-areas.html']:
    with open(fn, 'r', encoding='utf-8') as f: html = f.read()
    new = p.sub('', html)
    with open(fn, 'w', encoding='utf-8') as f: f.write(new)
    print(f'{"✓" if html != new else "–"} {fn}')

print('\nDone! Now: git add -A && git commit -m "Logo 50% larger, remove nav text" && git push')
