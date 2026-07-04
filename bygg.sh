#!/bin/sh
# Bakar ihop källfilerna i src/ till en enda självständig index.html.
# Kör:  ./bygg.sh
cd "$(dirname "$0")"
python3 - <<'EOF'
from pathlib import Path

html = Path('src/sida.html').read_text()
for marker, fil in [
    ('/*__STYLE__*/',  'src/style.css'),
    ('/*__CHESS__*/',  'src/chess.js'),
    ('/*__PIECES__*/', 'src/pieces.js'),
    ('/*__AI__*/',     'src/ai.js'),
    ('/*__GAME__*/',   'src/game.js'),
]:
    innehall = Path(fil).read_text()
    assert marker in html, f'markören {marker} saknas i sida.html'
    html = html.replace(marker, innehall)

Path('index.html').write_text(html)
print(f'index.html byggd ({len(html)//1024} kB) — öppna den i webbläsaren!')
EOF
