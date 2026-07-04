/*
 * Kommentatorn: beskriver det som just hände på brädet — med glimten i ögat,
 * men utan att någonsin avslöja vad någon spelare borde göra härnäst.
 * Helt regelstyrd: rätt replik triggas av rätt ögonblick.
 */

const PJASNAMN = {
  p: 'bonden', n: 'springaren', b: 'löparen',
  r: 'tornet', q: 'drottningen', k: 'kungen'
};

// obestämd form, för "Vits bonde", "Svarts torn" osv.
const PJASNAMN_OBEST = {
  p: 'bonde', n: 'springare', b: 'löpare',
  r: 'torn', q: 'drottning', k: 'kung'
};

let senasteReplik = '';

function valj(repliker) {
  // undvik att säga samma sak två gånger i rad
  let r = repliker[Math.floor(Math.random() * repliker.length)];
  if (repliker.length > 1) {
    let forsok = 0;
    while (r === senasteReplik && forsok++ < 5) {
      r = repliker[Math.floor(Math.random() * repliker.length)];
    }
  }
  senasteReplik = r;
  return r;
}

/**
 * @param {object} m       draget (verbose-resultat från chess.js)
 * @param {object} game    partiet efter draget
 * @param {number} vinst   materialvinst i centibönder för den som drog (0 om inget slogs)
 * @returns {string}
 */
function kommentera(m, game, vinst) {
  const namn = m.color === 'w' ? 'Vit' : 'Svart';
  const motst = m.color === 'w' ? 'Svart' : 'Vit';
  const pjas = PJASNAMN[m.piece];
  const dragNr = Math.ceil(game.history().length / 2);

  // -- partiets slut --
  if (game.in_checkmate()) {
    return valj([
      `Schackmatt! ${namn} sänker ridån — vilken avslutning!`,
      `Där satt den. Schackmatt, och ${motst}s kung har ingenstans att ta vägen.`,
      `Schackmatt! ${namn} kan resa sig och buga.`
    ]);
  }
  if (game.in_stalemate()) {
    return valj([
      `Patt! Ingen kan röra sig, ingen vinner — remi, mina damer och herrar.`,
      `Och där tar det stopp: patt. Ett oavgjort med ett leende på läpparna.`
    ]);
  }
  if (game.in_threefold_repetition()) {
    return valj([`Samma ställning för tredje gången — spelarna dansar i cirklar. Remi!`]);
  }
  if (game.in_draw()) {
    return valj([`Remi! Brädet har sagt sitt.`]);
  }

  // -- särskilda drag --
  if (m.flags.includes('e')) {
    return valj([
      `En passant! Regelbokens mest eleganta fotnot, utförd med bravur.`,
      `Där kom den — en passant! Det draget ser man inte varje dag.`
    ]);
  }
  if (m.flags.includes('p')) {
    return valj([
      `Bonden har vandrat hela vägen och stiger nu upp i adeln!`,
      `Förvandling! Sköld och högrep byts mot finare attiralj.`
    ]);
  }
  if (m.flags.includes('k') || m.flags.includes('q')) {
    return valj([
      `${namn} rockerar — kungen kryper i trygghet bakom muren.`,
      `Rockad av ${namn}. Kungen tackar tornet för skjutsen.`
    ]);
  }

  // -- schack --
  if (game.in_check()) {
    return valj([
      `Schack! ${motst}s kung får det hett om öronen.`,
      `Schack! Nu darrar det i ${motst}s läger.`,
      `${namn} säger schack — kungen måste svara.`
    ]);
  }

  // -- slag --
  if (m.captured) {
    const byte = PJASNAMN[m.captured];
    if (vinst >= 250) {
      return valj([
        `Där rök ${byte}! Det där kommer att svida länge för ${motst}.`,
        `${namn} kammar hem ${byte} — en riktig skräll!`,
        `Aj aj aj. ${motst} vinkar farväl till ${byte}.`
      ]);
    }
    return valj([
      `${namn}s ${PJASNAMN_OBEST[m.piece]} plockar ${byte}. Byteshandeln är igång.`,
      `Där byttes det pjäser — ${byte} lämnar brädet.`,
      `Klirr i kassan för ${namn}: ${byte} åker av brädet.`
    ]);
  }

  // -- bondedrag: sköldbonden får sin stund --
  if (m.piece === 'p' && Math.random() < 0.4) {
    return valj([
      `Sköldbonden marscherar framåt, högrepen i högsta hugg.`,
      `En liten bonde, ett litet steg — men skölden blänker.`,
      `${namn}s bonde traskar vidare. Repet gnisslar, skölden skramlar.`
    ]);
  }

  // -- utveckling i öppningen --
  if (dragNr <= 8 && (m.piece === 'n' || m.piece === 'b')) {
    return valj([
      `${namn} väcker ${pjas} — pjäserna sträcker på sig inför slaget.`,
      `Ut på fältet med ${pjas}. ${namn} riggar sitt lag.`,
      `${namn} utvecklar ${pjas}. Uppställningen tar form.`
    ]);
  }

  // -- drottningen, alltid värd en kommentar --
  if (m.piece === 'q' && Math.random() < 0.5) {
    return valj([
      `Drottningen själv kliver fram — den högsta pjäsen, den farligaste.`,
      `Där rör sig ${namn}s drottning, och hela brädet håller andan.`
    ]);
  }

  // -- lugna drag --
  return valj([
    `Ett lugnt drag av ${namn}. Ställningen andas.`,
    `${namn} flyttar ${pjas} till ${m.to}. Spänningen stiger sakta.`,
    `Båda arméerna mäter varandra. Vem blinkar först?`,
    `${namn} tar sig en funderare och väljer det stillsamma spåret.`,
    `Inget blod den här gången — men brädet mullrar under ytan.`
  ]);
}

function visaKommentar(text) {
  const el = document.getElementById('commentary');
  if (el) el.innerHTML = `<span class="mic">🎙️</span>${text}`;
}
