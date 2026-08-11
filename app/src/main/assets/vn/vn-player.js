(() => {
  'use strict';

  const root = document.getElementById('canvas-fan-page');
  const screen = root?.querySelector('[data-app-screen]');
  if (!root || !screen) return;

  const SAVE_KEY = 'weijin.visualNovelSaves.v1';
  const TYPE_INTERVAL = 20;
  const MOODS = ['is-warm', 'is-cold', 'is-dream', 'is-danger'];

  const overlay = document.createElement('div');
  overlay.className = 'vn-overlay';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="vn-backdrop" aria-hidden="true">
      <div class="vn-art-layer" data-vn-art="0"></div>
      <div class="vn-art-layer" data-vn-art="1"></div>
      <div class="vn-art-shade"></div>
      <div class="vn-atmosphere"></div>
    </div>
    <header class="vn-header">
      <button class="vn-header-button" type="button" data-vn-exit aria-label="退出剧情游戏">‹</button>
      <div class="vn-title-copy">
        <strong data-vn-title></strong>
        <span data-vn-chapter></span>
      </div>
      <span class="vn-save-state" data-vn-save>自动存档</span>
    </header>
    <div class="vn-route-mark" data-vn-route><i></i><span data-vn-route-copy></span></div>

    <section class="vn-start-card" data-vn-start-card>
      <span class="vn-start-eyebrow">原创互动影游</span>
      <h2 data-vn-start-title></h2>
      <p data-vn-start-copy></p>
      <div class="vn-start-actions" data-vn-start-actions></div>
    </section>

    <section class="vn-dialogue-deck" data-vn-dialogue-deck hidden>
      <div class="vn-dialogue-card" data-vn-dialogue-card>
        <span class="vn-speaker" data-vn-speaker></span>
        <div class="vn-dialogue-text" data-vn-text aria-live="polite"></div>
        <span class="vn-tap-hint" data-vn-tap-hint>轻触展开全文</span>
      </div>
      <div class="vn-choices" data-vn-choices></div>
    </section>

    <section class="vn-ending-card" data-vn-ending-card hidden>
      <span class="vn-ending-eyebrow">抵达结局</span>
      <h2 data-vn-ending-title></h2>
      <p data-vn-ending-copy></p>
      <div class="vn-ending-route" data-vn-ending-route></div>
      <div class="vn-ending-actions">
        <button class="vn-action" type="button" data-vn-restart>再走一条路</button>
        <button class="vn-action is-primary" type="button" data-vn-ending-exit>回到画板</button>
      </div>
    </section>

    <div class="vn-toast" data-vn-toast hidden></div>
  `;
  screen.appendChild(overlay);

  const refs = {
    arts: [...overlay.querySelectorAll('[data-vn-art]')],
    exit: overlay.querySelector('[data-vn-exit]'),
    title: overlay.querySelector('[data-vn-title]'),
    chapter: overlay.querySelector('[data-vn-chapter]'),
    save: overlay.querySelector('[data-vn-save]'),
    route: overlay.querySelector('[data-vn-route]'),
    routeCopy: overlay.querySelector('[data-vn-route-copy]'),
    startCard: overlay.querySelector('[data-vn-start-card]'),
    startTitle: overlay.querySelector('[data-vn-start-title]'),
    startCopy: overlay.querySelector('[data-vn-start-copy]'),
    startActions: overlay.querySelector('[data-vn-start-actions]'),
    dialogueDeck: overlay.querySelector('[data-vn-dialogue-deck]'),
    dialogueCard: overlay.querySelector('[data-vn-dialogue-card]'),
    speaker: overlay.querySelector('[data-vn-speaker]'),
    text: overlay.querySelector('[data-vn-text]'),
    tapHint: overlay.querySelector('[data-vn-tap-hint]'),
    choices: overlay.querySelector('[data-vn-choices]'),
    endingCard: overlay.querySelector('[data-vn-ending-card]'),
    endingTitle: overlay.querySelector('[data-vn-ending-title]'),
    endingCopy: overlay.querySelector('[data-vn-ending-copy]'),
    endingRoute: overlay.querySelector('[data-vn-ending-route]'),
    restart: overlay.querySelector('[data-vn-restart]'),
    endingExit: overlay.querySelector('[data-vn-ending-exit]'),
    toast: overlay.querySelector('[data-vn-toast]')
  };

  let gameKey = '';
  let game = null;
  let nodes = {};
  let state = null;
  let currentNode = null;
  let activeArt = 0;
  let typingTimer = 0;
  let typingText = '';
  let typingIndex = 0;
  let toastTimer = 0;

  const getLibrary = () => window.WEIJIN_VISUAL_NOVELS || {};

  const readSaves = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  };

  const writeSave = () => {
    if (!gameKey || !state) return;
    const all = readSaves();
    state.updatedAt = Date.now();
    all[gameKey] = state;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(all));
      refs.save.textContent = '已自动存档';
    } catch (_) {
      refs.save.textContent = '本次未存档';
    }
  };

  const newState = () => ({
    nodeId: game?.start || Object.keys(nodes)[0] || '',
    values: {},
    flags: {},
    history: [],
    choices: [],
    endings: [],
    finished: false,
    updatedAt: Date.now()
  });

  const normalizeState = (raw) => {
    const fresh = newState();
    if (!raw || typeof raw !== 'object' || !nodes[raw.nodeId]) return fresh;
    return {
      ...fresh,
      ...raw,
      values: raw.values && typeof raw.values === 'object' ? raw.values : {},
      flags: raw.flags && typeof raw.flags === 'object' ? raw.flags : {},
      history: Array.isArray(raw.history) ? raw.history.filter((id) => nodes[id]) : [],
      choices: Array.isArray(raw.choices) ? raw.choices.slice(-16) : [],
      endings: Array.isArray(raw.endings) ? raw.endings : []
    };
  };

  const showToast = (message) => {
    clearTimeout(toastTimer);
    refs.toast.textContent = message;
    refs.toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      refs.toast.hidden = true;
    }, 1250);
  };

  const sceneConfig = (sceneName) => {
    const raw = game?.scenes?.[sceneName] || {};
    if (typeof raw === 'string') return { position: raw };
    return raw;
  };

  const setScene = (sceneName, immediate = false) => {
    const scene = sceneConfig(sceneName || game?.coverScene);
    const image = scene.image || game?.sceneSheet || '';
    const target = refs.arts[activeArt ? 0 : 1];
    const previous = refs.arts[activeArt];
    activeArt = activeArt ? 0 : 1;
    target.style.backgroundImage = image ? `url("${image}")` : '';
    target.style.backgroundPosition = scene.position || '0% 0%';
    MOODS.forEach((mood) => target.classList.remove(mood));
    if (scene.mood && MOODS.includes(`is-${scene.mood}`)) {
      target.classList.add(`is-${scene.mood}`);
    }
    if (immediate) {
      previous.classList.remove('is-active');
      target.classList.add('is-active');
      return;
    }
    target.classList.add('is-active');
    window.setTimeout(() => previous.classList.remove('is-active'), 730);
  };

  const applyEffects = (effects) => {
    if (!effects || typeof effects !== 'object') return;
    Object.entries(effects).forEach(([key, value]) => {
      if (key === 'flags' || key === 'set') {
        if (value && typeof value === 'object') Object.assign(state.flags, value);
        return;
      }
      if (typeof value === 'number') {
        state.values[key] = Number(state.values[key] || 0) + value;
      } else {
        state.flags[key] = value;
      }
    });
  };

  const requirementMet = (requirements) => {
    if (!requirements || typeof requirements !== 'object') return true;
    return Object.entries(requirements).every(([key, expected]) => {
      const actual = key in state.values ? state.values[key] : state.flags[key];
      if (typeof expected === 'number') return Number(actual || 0) >= expected;
      return actual === expected;
    });
  };

  const stopTyping = () => {
    window.clearInterval(typingTimer);
    typingTimer = 0;
  };

  const routeTags = () => {
    const values = Object.entries(state?.values || {})
      .filter(([, value]) => typeof value === 'number' && value !== 0)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 3);
    if (!values.length) return ['你的选择已被故事记住'];
    return values.map(([key, value]) => {
      const label = game?.valueLabels?.[key] || key;
      return `${label} ${value > 0 ? '+' : ''}${value}`;
    });
  };

  const showEnding = () => {
    stopTyping();
    const endingId = typeof currentNode.ending === 'string' ? currentNode.ending : currentNode.id;
    const endingInfo = game?.endings?.[endingId] || {};
    const title = currentNode.endingTitle || endingInfo.title || '故事在这里回望你';
    const copy = currentNode.endingCopy || endingInfo.copy || currentNode.text;
    if (!state.endings.includes(endingId)) state.endings.push(endingId);
    state.finished = true;
    writeSave();
    refs.dialogueDeck.hidden = true;
    refs.endingTitle.textContent = title;
    refs.endingCopy.textContent = copy;
    refs.endingRoute.replaceChildren(...routeTags().map((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
    refs.endingCard.hidden = false;
  };

  const renderChoices = () => {
    if (!currentNode) return;
    refs.choices.replaceChildren();
    refs.tapHint.textContent = '选择会改变故事走向';
    const choices = Array.isArray(currentNode.choices)
      ? currentNode.choices.filter((choice) => requirementMet(choice.requires))
      : [];

    if (currentNode.ending) {
      const button = document.createElement('button');
      button.className = 'vn-choice';
      button.type = 'button';
      button.textContent = '看看这个选择把你带到了哪里';
      button.addEventListener('click', showEnding, { once: true });
      refs.choices.appendChild(button);
      return;
    }

    const available = choices.length ? choices : (currentNode.next ? [{ text: '继续', next: currentNode.next }] : []);
    available.forEach((choice) => {
      const button = document.createElement('button');
      button.className = 'vn-choice';
      button.type = 'button';
      button.textContent = choice.text || '继续';
      button.addEventListener('click', () => {
        applyEffects(choice.effects);
        state.choices.push(choice.text || '继续');
        if (choice.next && nodes[choice.next]) showNode(choice.next);
        else showEnding();
      }, { once: true });
      refs.choices.appendChild(button);
    });

    if (!available.length) showEnding();
  };

  const finishTyping = () => {
    if (!currentNode) return;
    stopTyping();
    typingIndex = typingText.length;
    refs.text.textContent = typingText;
    renderChoices();
  };

  const typeDialogue = (text) => {
    stopTyping();
    typingText = String(text || '……');
    typingIndex = 0;
    refs.text.textContent = '';
    refs.choices.replaceChildren();
    refs.tapHint.textContent = '轻触展开全文';
    typingTimer = window.setInterval(() => {
      const step = /[，。！？；：…]/.test(typingText[typingIndex] || '') ? 1 : 2;
      typingIndex = Math.min(typingText.length, typingIndex + step);
      refs.text.textContent = typingText.slice(0, typingIndex);
      if (typingIndex >= typingText.length) finishTyping();
    }, TYPE_INTERVAL);
  };

  function showNode(nodeId, options = {}) {
    const nextNode = nodes[nodeId];
    if (!nextNode) {
      showToast('这一页暂时找不到了');
      return;
    }
    currentNode = nextNode;
    state.nodeId = nodeId;
    state.finished = false;
    if (!state.history.includes(nodeId)) state.history.push(nodeId);
    refs.startCard.hidden = true;
    refs.endingCard.hidden = true;
    refs.dialogueDeck.hidden = false;
    refs.speaker.textContent = nextNode.speaker || '旁白';
    refs.chapter.textContent = nextNode.chapter || game.subtitle || '故事正在发生';
    const progress = Math.max(5, Math.min(100, Math.round((new Set(state.history).size / Math.max(1, Object.keys(nodes).length)) * 100)));
    refs.route.style.setProperty('--vn-progress', `${progress}%`);
    refs.routeCopy.textContent = `已阅 ${new Set(state.history).size} 段 · ${state.endings.length}/${Object.keys(game.endings || {}).length || 3} 个结局`;
    setScene(nextNode.scene || game.coverScene, Boolean(options.immediate));
    writeSave();
    typeDialogue(nextNode.text);
  }

  const beginNew = () => {
    state = newState();
    showNode(state.nodeId, { immediate: true });
  };

  const continueStory = () => {
    if (!state?.nodeId || !nodes[state.nodeId]) return beginNew();
    if (state.finished) {
      currentNode = nodes[state.nodeId];
      setScene(currentNode.scene || game.coverScene, true);
      return showEnding();
    }
    showNode(state.nodeId, { immediate: true });
  };

  const renderStart = () => {
    stopTyping();
    refs.dialogueDeck.hidden = true;
    refs.endingCard.hidden = true;
    refs.startCard.hidden = false;
    refs.startTitle.textContent = game.title;
    refs.startCopy.textContent = game.description || '每一次选择都会改变你所看见的真相。';
    refs.startActions.replaceChildren();

    const hasProgress = Boolean(state?.history?.length);
    const primary = document.createElement('button');
    primary.className = 'vn-action is-primary';
    primary.type = 'button';
    primary.textContent = hasProgress ? (state.finished ? '查看上次结局' : '继续故事') : '进入故事';
    primary.addEventListener('click', hasProgress ? continueStory : beginNew);

    const secondary = document.createElement('button');
    secondary.className = 'vn-action';
    secondary.type = 'button';
    secondary.textContent = hasProgress ? '从头开始' : '暂时返回';
    secondary.addEventListener('click', hasProgress ? beginNew : close);

    refs.startActions.append(primary, secondary);
  };

  function close() {
    stopTyping();
    clearTimeout(toastTimer);
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    screen.classList.remove('is-game-active');
    refs.arts.forEach((art) => art.classList.remove('is-active'));
    currentNode = null;
  }

  const open = (key) => {
    const nextGame = getLibrary()[key];
    if (!nextGame) {
      showToast('这段故事还没有装好');
      return false;
    }
    gameKey = key;
    game = nextGame;
    nodes = Array.isArray(game.nodes)
      ? Object.fromEntries(game.nodes.map((node) => [node.id, node]))
      : (game.nodes || {});
    state = normalizeState(readSaves()[gameKey]);
    overlay.style.setProperty('--vn-accent', game.accent || '#d98a68');
    overlay.style.setProperty('--vn-accent-soft', game.accentSoft || '#f0c799');
    refs.title.textContent = game.title;
    refs.chapter.textContent = game.subtitle || '原创互动影游';
    refs.routeCopy.textContent = '选择会留下不同的回声';
    refs.route.style.setProperty('--vn-progress', '5%');
    setScene(game.coverScene || Object.keys(game.scenes || {})[0], true);
    screen.classList.add('is-game-active');
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    renderStart();
    return true;
  };

  refs.dialogueCard.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    if (typingTimer) finishTyping();
  });
  refs.exit.addEventListener('click', close);
  refs.endingExit.addEventListener('click', close);
  refs.restart.addEventListener('click', beginNew);
  overlay.addEventListener('pointerdown', (event) => event.stopPropagation());
  overlay.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('visibilitychange', () => {
    if (!overlay.hidden && document.hidden) writeSave();
  });

  window.WeijinVN = { open, close };
})();
