/*
  GUESS THE JOB — come funziona il gioco
  I lavori, i luoghi e le azioni sono in jobs.js.
*/
(function (root) {
  'use strict';

  /* Common English words that must never be "corrected" into a game word. */
  const STOPWORDS = new Set((
    'about after again always another anything around because before being better between bike bikes ' +
    'black bring brown child children clear clever close clothes color colour could couch doing dress drink ' +
    'during every everybody everyone father first friend friends games going great green hands happy ' +
    'hello horse horses hours inside learn little lives maker marker markers money morning mother never ' +
    'night number often other outside paper party place places point purse really right round share ' +
    'short small smart smile sorry start still stories story strong sweet table teeth thank thanks their there these ' +
    'thick thing things those three today together under uniform until using water where which while ' +
    'white whole woman women work worked working works world would write writer writers wrong years young yours'
  ).split(' '));

  const YES = { do: 'Yes, I do!', am: 'Yes, I am!', is: 'Yes, it is!', can: 'Yes, I can!' };
  const NO = { do: "No, I don't.", am: "No, I'm not.", is: "No, it isn't.", can: "No, I can't." };

  const UNKNOWN = [
    "Hmm, I don't understand. 🤔 Try a question like: Do you work in a school?",
    'Sorry, can you ask in a different way? For example: Do you cook?',
    "I'm not sure... Ask me about a place (Do you work in a hospital?) or an action (Do you drive?)."
  ];

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[’‘`´]/g, "'")
      .replace(/\bt\.v\.?/g, 'tv')
      .replace(/'s\b/g, '')
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\bu\b/g, 'you')
      .replace(/\bur\b/g, 'your')
      .replace(/\br\b/g, 'are')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Edit distance that counts swapped letters as one mistake ("nruse" → "nurse"). */
  function distance(a, b) {
    const d = [];
    for (let i = 0; i <= a.length; i++) d[i] = [i];
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }

  /* true when b is a with two neighbouring letters swapped */
  function isSwap(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length - 1; i++) {
      if (a[i] !== b[i]) {
        return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
      }
    }
    return false;
  }

  function withArticle(word) {
    return (/^[aeiou]/i.test(word) ? 'an ' : 'a ') + word;
  }

  function buildIndex(list) {
    list.sort((a, b) => b.size - a.size || b.phrase.length - a.phrase.length);
    return list;
  }

  /* Finds every known phrase in the text, longest phrases first, each piece of text used once. */
  function scan(text, index) {
    let work = ' ' + text + ' ';
    const found = [];
    index.forEach(entry => {
      const needle = ' ' + entry.phrase + ' ';
      let at = work.indexOf(needle);
      while (at !== -1) {
        found.push(Object.assign({ pos: at }, entry));
        work = work.slice(0, at + 1) + '#'.repeat(entry.phrase.length) + work.slice(at + 1 + entry.phrase.length);
        at = work.indexOf(needle);
      }
    });
    return found.sort((a, b) => a.pos - b.pos);
  }

  function createEngine(data, random) {
    random = random || Math.random;
    const jobsById = {};
    data.jobs.forEach(job => { jobsById[job.id] = job; });

    const entries = [];
    function add(type, id, words) {
      words.forEach(word => {
        const phrase = normalize(word);
        if (phrase) entries.push({ type: type, id: id, phrase: phrase, size: phrase.split(' ').length });
      });
    }
    Object.keys(data.places).forEach(id => add('place', id, data.places[id].words));
    Object.keys(data.verbs).forEach(id => add('verb', id, data.verbs[id].words));
    Object.keys(data.topics).forEach(id => add('topic', id, data.topics[id].words));
    data.jobs.forEach(job => add('job', job.id, [job.name].concat(job.words || [])));
    (data.generic || []).forEach((g, i) => add('generic', i, g.words));
    buildIndex(entries);

    const vocab = new Set();
    entries.forEach(e => e.phrase.split(' ').forEach(w => vocab.add(w)));
    const vocabList = Array.from(vocab).filter(w => w.length >= 4);

    const italian = buildIndex(Object.keys(data.italian || {}).map(it => {
      const phrase = normalize(it);
      return { phrase: phrase, size: phrase.split(' ').length, en: data.italian[it] };
    }));

    function correctTypos(text) {
      return text.split(' ').map(token => {
        if (token.length < 5 || vocab.has(token) || STOPWORDS.has(token) || /\d/.test(token)) return token;
        const max = token.length >= 8 ? 2 : 1;
        let best = null;
        let bestDist = Infinity;
        vocabList.forEach(word => {
          const diff = word.length - token.length;
          if (Math.abs(diff) > max) return;
          /* short words: never drop a letter ("cards" is not "cars") */
          if (token.length <= 5 && diff < 0) return;
          /* a different first letter is accepted only if it was left out ("ospital") */
          const sameStart = word[0] === token[0];
          if (!sameStart && (token.length < 7 || diff === 0)) return;
          const dist = distance(token, word);
          if (dist > (sameStart ? max : 1)) return;
          if (dist === 2 && Math.abs(diff) > 1) return;
          /* short words: no changed letters, only swapped ones ("shoes" is not "shops") */
          if (dist === 1 && diff === 0 && token.length < 6 && !isSwap(token, word)) return;
          if (dist < bestDist) {
            best = word;
            bestDist = dist;
          }
        });
        return best || token;
      }).join(' ');
    }

    function questionForm(t) {
      if (/^(do|dont) you\b/.test(t)) return 'do';
      if (/^(are|arent) you\b/.test(t) || /^you are\b/.test(t)) return 'am';
      if (/^(is|isnt) (it|this|that)\b/.test(t) || /^it is\b/.test(t)) return 'is';
      if (/^(can|cant) you\b/.test(t)) return 'can';
      if (/^you\b/.test(t)) return 'do';
      return null;
    }

    let state = null;

    function newGame(forcedId) {
      let job = forcedId ? jobsById[forcedId] : null;
      if (!job) {
        const groups = Array.from(new Set(data.jobs.map(j => j.group)));
        const pool = state && groups.length > 1 ? groups.filter(g => g !== state.job.group) : groups;
        const group = pool[Math.floor(random() * pool.length)];
        const members = data.jobs.filter(j => j.group === group);
        job = members[Math.floor(random() * members.length)];
      }
      state = {
        job: job,
        questions: 0,
        hints: 0,
        letterStep: 0,
        knowsPlace: false,
        knowsAction: false,
        asked: new Set(),
        unknown: 0,
        ended: false,
        won: false
      };
      return state;
    }

    function guessReply(job, form) {
      const s = state;
      if (job.id === s.job.id) {
        s.ended = true;
        s.won = true;
        const yes = form === 'is' ? 'Yes, it is!' : 'Yes, I am!';
        return { text: yes + " I'm " + withArticle(job.name) + '! ' + job.emoji + ' Well done!', end: 'win' };
      }
      if (job.group === s.job.group) {
        if (!s.job.clue) s.knowsAction = true;
        return { text: "So close! 😮 I'm not " + withArticle(job.name) + ', but my job is similar. ' + (s.job.clue || s.job.does) };
      }
      const no = form === 'is' ? "No, it isn't." : "No, I'm not.";
      return { text: no + " I'm not " + withArticle(job.name) + '. Keep trying! 💪' };
    }

    function genericReply(g, form) {
      if (g.jobs.indexOf(state.job.id) !== -1) {
        const yes = form === 'is' ? 'Yes, it is!' : 'Yes, I am!';
        return { text: yes + " I'm " + withArticle(g.name) + '. ' + g.follow };
      }
      const no = form === 'is' ? "No, it isn't." : "No, I'm not.";
      return { text: no + " I'm not " + withArticle(g.name) + '.' };
    }

    function factsReply(facts, form) {
      const s = state;
      const job = s.job;
      const seen = new Set();
      const yes = [];
      const no = [];
      const neutral = [];
      let allAsked = true;

      facts.forEach(m => {
        const key = m.type + ':' + m.id;
        if (seen.has(key)) return;
        seen.add(key);
        if (!s.asked.has(key)) allAsked = false;
        s.asked.add(key);

        if (m.type === 'place') {
          const place = data.places[m.id];
          if (job.places.indexOf(m.id) !== -1) {
            yes.push('I work ' + place.say + '.');
            s.knowsPlace = true;
          } else {
            no.push("I don't work " + place.say + '.');
          }
        } else if (m.type === 'verb') {
          const verb = data.verbs[m.id];
          if (job.verbs.indexOf(m.id) !== -1) {
            yes.push(job.does);
            s.knowsAction = true;
          } else if (verb.general) {
            neutral.push(verb.general);
          } else {
            no.push("I don't " + (verb.neg || verb.label) + '.');
          }
        } else if (m.type === 'topic') {
          const topic = data.topics[m.id];
          const answer = topic.yes[job.id];
          if (answer) {
            yes.push(answer === true ? job.does : answer);
            s.knowsAction = true;
          } else {
            no.push(topic.no);
          }
        }
      });

      const yesText = Array.from(new Set(yes)).join(' ');
      const noText = Array.from(new Set(no)).join(' ');
      let text;
      if (yesText && noText) text = 'Yes and no! ' + yesText + ' But ' + noText;
      else if (yesText) text = (YES[form] || 'Yes!') + ' ' + yesText;
      else if (noText) text = (NO[form] || 'No.') + ' ' + noText;
      else text = neutral[0] + ' But that is not my job. Try another action! 😊';

      if (allAsked) text = 'You asked me that already! 😉 ' + text;
      return { text: text };
    }

    function exampleFor(en) {
      const m = scan(normalize(en), entries)[0];
      if (!m) return 'Do you work in a school?';
      if (m.type === 'place') return 'Do you work ' + data.places[m.id].say + '?';
      if (m.type === 'verb') {
        const verb = data.verbs[m.id];
        return 'Do you ' + (verb.neg || verb.label) + '?';
      }
      if (m.type === 'job') return 'Are you ' + withArticle(jobsById[m.id].name) + '?';
      if (m.type === 'generic') return 'Are you ' + withArticle(data.generic[m.id].name) + '?';
      return 'Do you work with ' + en + '?';
    }

    function otherReply(t) {
      const words = t.split(' ');
      const has = list => words.some(w => list.indexOf(w) !== -1);

      const it = scan(t, italian);
      if (it.length) {
        const pairs = it.slice(0, 2).map(p => '"' + p.phrase + '" = "' + p.en + '"').join(', ');
        return { text: 'In English, please! 😊 ' + pairs + '. Try: ' + exampleFor(it[0].en) };
      }
      if (/^(hi|hello|hey|hiya|good morning|good afternoon|buongiorno|salve)\b/.test(t)) {
        return { text: 'Hello! 👋 Ask me a question about my job.' };
      }
      if (/^ciao\b/.test(t)) {
        return { text: 'Ciao! In English we say: Hello! 👋 Ask me a question about my job.' };
      }
      if (/\b(thank you|thanks|thank|grazie)\b/.test(t)) {
        return { text: "You're welcome! 😊 Ask me another question." };
      }
      if (has(['man', 'woman', 'men', 'women', 'boy', 'girl', 'male', 'female'])) {
        return { text: 'I can be a man or a woman! 😊 Ask me about my job.' };
      }
      if (/^(what|whats|where|wheres|who|whos|which|how|why|when)\b/.test(t)) {
        return { text: "That's a secret! 🤫 Ask me yes/no questions, like: Do you work in a hospital?" };
      }
      if (has(['work', 'works', 'working', 'job', 'jobs'])) {
        if (has(['like', 'love'])) return { text: 'I love my job! 😊 Can you guess what it is?' };
        return { text: 'Yes, I work every day! 💪 But where? Ask me: Do you work in a...?' };
      }
      if (has(['sei', 'lavori', 'lavora', 'fai', 'una', 'uno', 'che', 'cosa', 'dove', 'chi', 'hai', 'nel', 'nella', 'della', 'del', 'perche', 'anche'])) {
        return { text: 'In English, please! 😊 Try: Do you work in a hospital?' };
      }
      const text = UNKNOWN[state.unknown % UNKNOWN.length];
      state.unknown++;
      return { text: text };
    }

    function answer(raw) {
      if (!state) newGame();
      const s = state;
      if (s.ended) return { text: 'The game is over! Press Play again for a new mystery job. 😊' };
      const t0 = normalize(raw);
      if (!t0) return null;
      s.questions++;

      if (/^(please )?(help|help me|can you help me|i need help|aiuto|aiutami)( please)?$/.test(t0)) {
        return { text: "Press 💡 Hint and I'll give you a clue!" };
      }

      const t = correctTypos(t0);
      const matches = scan(t, entries);
      const form = questionForm(t);

      const guessIds = Array.from(new Set(matches.filter(m => m.type === 'job').map(m => m.id)));
      if (guessIds.length > 1) return { text: 'One job at a time, please! 😊' };
      if (guessIds.length === 1) return guessReply(jobsById[guessIds[0]], form);

      const generic = matches.filter(m => m.type === 'generic');
      if (generic.length) return genericReply(data.generic[generic[0].id], form);

      const facts = matches.filter(m => m.type === 'place' || m.type === 'verb' || m.type === 'topic');
      if (facts.length) return factsReply(facts, form);

      return otherReply(t0);
    }

    function letters(name, keep) {
      return name.toUpperCase().split(' ').map(word =>
        word.split('').map((ch, i) => (keep(i, word.length) ? ch : '_')).join(' ')
      ).join('   ');
    }

    function hint() {
      const s = state;
      if (!s || s.ended) return null;
      const job = s.job;
      if (!s.knowsPlace) {
        s.knowsPlace = true;
        s.hints++;
        return { text: '💡 Hint: I work ' + data.places[job.places[0]].say + '.' };
      }
      if (!s.knowsAction) {
        s.knowsAction = true;
        s.hints++;
        return { text: '💡 Hint: ' + job.does };
      }
      s.letterStep++;
      if (s.letterStep === 1) {
        s.hints++;
        return { text: '💡 Hint: my job starts with the letter ' + job.name[0].toUpperCase() + '.' };
      }
      if (s.letterStep === 2) {
        s.hints++;
        return { text: '💡 Hint: my job looks like this: ' + letters(job.name, (i, n) => i === 0 || i === n - 1) };
      }
      if (s.letterStep === 3) {
        s.hints++;
        return { text: '💡 Last hint: ' + letters(job.name, (i, n) => i % 2 === 0 || i === n - 1) };
      }
      return { text: 'No more hints! 😊 Make a guess, or press I give up.' };
    }

    function giveUp() {
      const s = state;
      if (!s || s.ended) return null;
      s.ended = true;
      const job = s.job;
      return {
        text: "I'm " + withArticle(job.name) + '! ' + job.emoji + ' ' + job.does + ' I work ' + data.places[job.places[0]].say + '.',
        end: 'giveup'
      };
    }

    function summary() {
      const job = state.job;
      return {
        name: job.name,
        emoji: job.emoji,
        actions: job.verbs.map(id => data.verbs[id].label).filter(Boolean),
        places: job.places.map(id => data.places[id].label).filter(Boolean),
        questions: state.questions,
        hints: state.hints,
        won: state.won
      };
    }

    return {
      newGame: newGame,
      answer: answer,
      hint: hint,
      giveUp: giveUp,
      summary: summary,
      normalize: normalize,
      get state() { return state; }
    };
  }

  /* ---------------- page ---------------- */

  function initPage() {
    const data = root.GUESS_THE_JOB;
    if (!data) return;
    const engine = createEngine(data);
    const $ = sel => document.querySelector(sel);

    const chat = $('#chat');
    const form = $('#ask-form');
    const input = $('#question');
    const error = $('#ask-error');
    const tools = $('#tools');
    const starters = $('#starters');
    const endBox = $('#end');
    const qCount = $('#q-count');
    const hCount = $('#h-count');

    const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    let voice = null;
    let gameId = 0;

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices();
      voice = voices.find(v => /^en[-_]GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || null;
    }

    function speak(text) {
      const clean = text
        .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = voice ? voice.lang : 'en-GB';
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    if (canSpeak) {
      pickVoice();
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }

    function scrollDown() {
      chat.scrollTop = chat.scrollHeight;
    }

    function addMessage(who, text) {
      const row = document.createElement('div');
      row.className = 'msg ' + who;

      if (who === 'bot') {
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = '❓';
        row.appendChild(avatar);
      }

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = who === 'bot' ? 'Mystery job: ' : 'You: ';
      const p = document.createElement('p');
      p.textContent = text;
      p.prepend(label);
      bubble.appendChild(p);

      if (who === 'bot' && canSpeak) {
        const listen = document.createElement('button');
        listen.type = 'button';
        listen.className = 'speak';
        listen.setAttribute('aria-label', 'Listen');
        listen.title = 'Listen';
        listen.textContent = '🔊';
        listen.addEventListener('click', () => speak(text));
        bubble.appendChild(listen);
      }

      row.appendChild(bubble);
      chat.appendChild(row);
      scrollDown();
      return row;
    }

    function addTyping() {
      const row = document.createElement('div');
      row.className = 'msg bot typing';
      row.setAttribute('aria-hidden', 'true');
      row.innerHTML = '<div class="avatar">❓</div><div class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
      chat.appendChild(row);
      scrollDown();
      return row;
    }

    function botSay(text, then) {
      const myGame = gameId;
      const typing = addTyping();
      setTimeout(() => {
        typing.remove();
        if (myGame !== gameId) return;
        addMessage('bot', text);
        if (then) then();
      }, 450 + Math.random() * 400);
    }

    function updateStats() {
      qCount.textContent = engine.state.questions;
      hCount.textContent = engine.state.hints;
    }

    function plural(n, word) {
      return n + ' ' + word + (n === 1 ? '' : 's');
    }

    function showEnd(kind) {
      const info = engine.summary();
      $('#end-stamp').textContent = kind === 'win' ? 'Well done!' : 'Next time!';
      $('#end-stamp').className = 'stamp' + (kind === 'win' ? '' : ' stamp-blue');
      $('#end-emoji').textContent = info.emoji;
      $('#end-name').textContent = info.name;
      $('#end-actions').textContent = info.actions.join(', ');
      $('#end-places').textContent = info.places.join(', ');
      $('#end-score').textContent = kind === 'win'
        ? 'You found it with ' + plural(info.questions, 'question') + ' and ' + plural(info.hints, 'hint') + '.'
        : 'Try again with a new mystery job!';
      tools.hidden = true;
      form.hidden = true;
      starters.hidden = true;
      endBox.hidden = false;
      $('#play-again').focus({ preventScroll: true });
      endBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function start() {
      gameId++;
      engine.newGame();
      chat.innerHTML = '';
      endBox.hidden = true;
      tools.hidden = false;
      form.hidden = false;
      starters.hidden = false;
      input.value = '';
      hideError();
      updateStats();
      botSay("Hello! 👋 I'm a mystery job. Can you guess who I am? Ask me questions, like: Do you work in a school? or Do you cook?");
    }

    function hideError() {
      error.hidden = true;
      input.removeAttribute('aria-invalid');
    }

    function putCaretAtEnd() {
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const text = input.value.trim();
      if (!engine.normalize(text)) {
        error.hidden = false;
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      addMessage('me', text);
      input.value = '';
      const reply = engine.answer(text);
      updateStats();
      botSay(reply.text, reply.end ? () => showEnd(reply.end) : null);
    });

    input.addEventListener('input', hideError);

    $('#hint-btn').addEventListener('click', () => {
      const reply = engine.hint();
      if (!reply) return;
      addMessage('me', 'Hint, please! 💡');
      updateStats();
      botSay(reply.text);
    });

    $('#giveup-btn').addEventListener('click', () => {
      const reply = engine.giveUp();
      if (!reply) return;
      addMessage('me', 'I give up!');
      botSay(reply.text, () => showEnd('giveup'));
    });

    $('#new-game').addEventListener('click', start);
    $('#play-again').addEventListener('click', start);

    starters.querySelectorAll('[data-insert]').forEach(button => {
      button.addEventListener('click', () => {
        input.value = button.getAttribute('data-insert');
        hideError();
        putCaretAtEnd();
      });
    });

    function fillBank(id, words) {
      const box = $(id);
      words.forEach(word => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = word;
        chip.addEventListener('click', () => {
          const value = input.value;
          input.value = value + (value && !/\s$/.test(value) ? ' ' : '') + word;
          hideError();
          putCaretAtEnd();
        });
        box.appendChild(chip);
      });
    }

    fillBank('#wb-places', Object.keys(data.places).map(id => data.places[id].label).filter(Boolean));
    fillBank('#wb-verbs', Object.keys(data.verbs).map(id => data.verbs[id].label).filter(Boolean));
    fillBank('#wb-jobs', data.jobs.map(job => job.name));

    start();
  }

  const api = { createEngine: createEngine, normalize: normalize };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.GuessTheJob = api;
  }
  if (typeof document !== 'undefined') initPage();
})(typeof window !== 'undefined' ? window : this);
