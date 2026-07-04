# Sköldbondens schack

Ett komplett, spelbart schackspel i webbläsaren — byggt efter en konceptbild
där drottningen är den högsta pjäsen (för hon är farligast) och bonden bär
sköld, högrep och rep.

## Spela

Öppna `index.html` i valfri webbläsare. Inget behöver installeras.

- **Två spelare** — turas om vid samma dator.
- **Mot datorn** — välj färg och svårighetsgrad (Lätt / Medel / Svår).

Alla schackregler gäller: rockad, en passant, bondeförvandling (du väljer
pjäs), schackmatt, patt, trefaldig upprepning, 50-dragsregeln och remi vid
otillräckligt material. Reglerna sköts av [chess.js](https://github.com/jhlywa/chess.js)
(ligger lokalt i `lib/`).

## Design

- Ljusa sidan: polerad mässing/guld med pärlemor
- Mörka sidan: patinerad brons med mörkt trä
- Bräde i valnöt och lönn med koordinater i guld
- **Designregel:** drottningen är alltid högre än kungen

## Filer

| Fil | Vad den gör |
|---|---|
| `index.html` | Sidan och dialogerna |
| `style.css` | Brädet, färgerna, markeringarna |
| `pieces.js` | Pjäserna, ritade som SVG |
| `ai.js` | Datormotståndaren (minimax med alfa-beta) |
| `game.js` | Spellogik: klick, drag, status, draglista |
| `lib/chess.js` | Regelbiblioteket |
