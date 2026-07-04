# Sköldbondens schack

Ett komplett, spelbart schackspel i webbläsaren — byggt efter en konceptbild
där drottningen är den högsta pjäsen (för hon är farligast) och bonden bär
sköld, högrep och rep.

## Spela

**Allt ligger i en enda fil: `index.html`.** Dubbelklicka på den så spelar du.
Inget behöver installeras, ingen internetuppkoppling behövs.

Landningssidan guidar dig genom valen:

1. **Vem vill du möta?** En kompis (turas om vid samma dator) eller datorn
2. **Din färg** (bara mot datorn)
3. **Svårighetsgrad** — Lätt / Medel / Svår

Alla schackregler gäller: rockad, en passant, bondeförvandling (du väljer
pjäs), schackmatt, patt, trefaldig upprepning, 50-dragsregeln och remi vid
otillräckligt material. Reglerna sköts av [chess.js](https://github.com/jhlywa/chess.js).

## Publicera på nätet (Cloudflare Pages)

Sajten är helt statisk — inget byggsteg behövs.

1. Pusha det här repot till GitHub.
2. I Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** och välj repot.
3. Inställningar: Framework preset **None**, Build command **tom**,
   Build output directory **/** (roten).
4. Klart — sajten hamnar på `<namn>.pages.dev`.

## Ändra i spelet

Källkoden ligger uppdelad i `src/` (lättare att läsa och ändra).
Efter en ändring, kör:

```
./bygg.sh
```

så bakas allt ihop till en ny `index.html`.

| Fil | Vad den gör |
|---|---|
| `src/sida.html` | Sidans uppbyggnad: landningssida, bräde, dialoger |
| `src/style.css` | Utseendet: brädet, färgerna, landningssidan |
| `src/pieces.js` | Pjäserna, ritade som SVG |
| `src/ai.js` | Datormotståndaren (minimax med alfa-beta) |
| `src/game.js` | Spellogik: klick, drag, status, draglista |
| `src/chess.js` | Regelbiblioteket (chess.js 0.13.4, anpassat för webbläsare) |

## Design

- Ljusa sidan: polerad mässing/guld med pärlemor
- Mörka sidan: patinerad brons med mörkt trä
- Bräde i valnöt och lönn med koordinater i guld
- **Designregel:** drottningen är alltid högre än kungen
