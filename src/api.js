const LOCAL_API_STORAGE_KEY = 'bloomvest_api_base_v1';

function isLocalhostHostname() {
  if (typeof window === 'undefined') return false;
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function abortAfter(ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

/** Ports to try when the API runs on localhost (not the React port). Order: env list first, then defaults. */
function localApiPortsToProbe() {
  const raw = (process.env.REACT_APP_API_PORT || '').trim();
  if (raw) {
    return raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  }
  return ['5000', '5001', '3001', '3000', '8080'];
}

async function probeLocalApiBase() {
  const ports = localApiPortsToProbe();
  const tryBase = async (base) => {
    const r = await fetch(`${base}/health`, { method: 'GET', signal: abortAfter(900) });
    if (!r.ok) return false;
    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('json')) return false;
    await r.json().catch(() => null);
    return true;
  };

  const storageGet = (k) => {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(k) : null;
    } catch {
      return null;
    }
  };
  const storageSet = (k, v) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      /* private mode */
    }
  };
  const storageRemove = (k) => {
    try {
      sessionStorage.removeItem(k);
    } catch {
      /* private mode */
    }
  };

  const cached = storageGet(LOCAL_API_STORAGE_KEY);
  if (cached && /^http:\/\/127\.0\.0\.1:\d+\/api$/.test(cached)) {
    try {
      if (await tryBase(cached)) return cached;
    } catch {
      /* re-probe */
    }
    storageRemove(LOCAL_API_STORAGE_KEY);
  }

  for (const p of ports) {
    const base = `http://127.0.0.1:${p}/api`;
    try {
      if (await tryBase(base)) {
        storageSet(LOCAL_API_STORAGE_KEY, base);
        return base;
      }
    } catch {
      /* next port */
    }
  }

  storageRemove(LOCAL_API_STORAGE_KEY);
  return `http://127.0.0.1:${ports[0] || '5000'}/api`;
}

let apiBaseCache;
let apiBaseInflight = null;

/**
 * Resolves API base URL. Dev: `/api` (CRA proxy). Localhost + production build: probes 127.0.0.1 ports.
 * Deployed: `/api` or REACT_APP_API_URL.
 */
export async function ensureApiBase() {
  if (apiBaseCache !== undefined) return apiBaseCache;
  apiBaseInflight =
    apiBaseInflight ||
    (async () => {
      const configured = (process.env.REACT_APP_API_URL || '').trim();
      if (configured) {
        return `${configured.replace(/\/$/, '')}/api`;
      }
      if (typeof window === 'undefined') {
        return '/api';
      }
      if (process.env.NODE_ENV === 'development') {
        return '/api';
      }
      if (process.env.NODE_ENV === 'production' && isLocalhostHostname()) {
        return probeLocalApiBase();
      }
      return '/api';
    })();
  try {
    const base = await apiBaseInflight;
    apiBaseCache = base;
    return base;
  } catch (e) {
    apiBaseInflight = null;
    throw e;
  }
}

/**
 * Sync read — accurate after the first `ensureApiBase()` or request; until then uses same heuristics as before first fetch.
 */
export function getApiBase() {
  if (apiBaseCache !== undefined) return apiBaseCache;
  const configured = (process.env.REACT_APP_API_URL || '').trim();
  if (configured) {
    return `${configured.replace(/\/$/, '')}/api`;
  }
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    return '/api';
  }
  return '/api';
}

let _authSessionId = null; // When user is logged in, this is their email (persists to DB per user)

export function setAuthSession(user) {
  _authSessionId = user ? (user.email || user.id || null) : null;
}

function getSessionId() {
  // Use logged-in user email so session data saves to their account
  if (_authSessionId) return `auth:${_authSessionId}`;
  let sid = localStorage.getItem('bloomvest_session');
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem('bloomvest_session', sid);
  }
  return sid;
}

async function request(path, options = {}) {
  const base = await ensureApiBase();
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    const err = isJson
      ? await res.json().catch(() => ({ error: 'Request failed' }))
      : await res.text().catch(() => '');

    const fallbackMessage =
      typeof err === 'string' && err.trim().startsWith('<')
        ? 'API route returned HTML instead of JSON. Run `npm run dev`, or set REACT_APP_API_URL. On a local production build, start the API and optionally set REACT_APP_API_PORT (comma-separated ports to try).'
        : 'Request failed';

    throw new Error((typeof err === 'object' && err?.error) || fallbackMessage);
  }

  if (!isJson) {
    const text = await res.text().catch(() => '');
    if (text.trim().startsWith('<')) {
      throw new Error(
        'API route returned HTML instead of JSON. Run `npm run dev`, start the API on localhost, or set REACT_APP_API_URL.'
      );
    }
    throw new Error('API route returned a non-JSON response.');
  }

  return res.json();
}

export const api = {
  getSessionId,

  async chat(message) {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId(), message }),
    });
  },

  async getChatHistory() {
    return request(`/ai/history?sessionId=${getSessionId()}`);
  },

  async clearChatHistory() {
    return request('/ai/history', {
      method: 'DELETE',
      body: JSON.stringify({ sessionId: getSessionId() }),
    });
  },

  async getDailyBrief(options = {}) {
    const q = options.refresh ? '?refresh=1' : '';
    return request(`/ai/daily-brief${q}`);
  },

  async getPortfolio() {
    return request(`/portfolio?sessionId=${getSessionId()}`);
  },

  async trade(type, symbol, shares, price) {
    return request('/portfolio/trade', {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId(), type, symbol, shares, price }),
    });
  },

  async resetPortfolio() {
    return request('/portfolio/reset', {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId() }),
    });
  },

  async getProgress() {
    return request(`/progress?sessionId=${getSessionId()}`);
  },

  async completeLesson(lessonId, quizScore) {
    return request('/progress/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId(), lessonId, quizScore }),
    });
  },

  async getCourses() {
    return request(`/courses?sessionId=${getSessionId()}`);
  },

  async getCourse(courseId) {
    return request(`/courses/${courseId}?sessionId=${getSessionId()}`);
  },

  async getLesson(lessonId) {
    return request(`/courses/lessons/${lessonId}?sessionId=${getSessionId()}`);
  },

  async completeLessonV2(lessonId, quizScore) {
    return request(`/courses/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId(), quizScore }),
    });
  },

  async getCourseProgress() {
    return request(`/courses/progress?sessionId=${getSessionId()}`);
  },

  async getScenarioAdvice(action, scenarioTitle, details, portfolio, objectives, extras = {}) {
    return request('/scenario/advisor', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: getSessionId(),
        action,
        scenarioTitle,
        details,
        portfolio,
        objectives,
        conversation: extras.conversation,
        optionsSummary: extras.optionsSummary,
        scenarioKind: extras.scenarioKind,
      }),
    });
  },

  async getCustomScenarios() {
    return request(`/scenario/custom?sessionId=${getSessionId()}`);
  },

  async saveCustomScenario(scenario) {
    return request('/scenario/custom/save', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: getSessionId(),
        scenario,
      }),
    });
  },

  async generateCustomScenario(builder) {
    return request('/scenario/custom/generate', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: getSessionId(),
        builder,
      }),
    });
  },

  async runDeepAnalysis(preferences = {}) {
    const { batchIndex = 1, totalBatches = 1, ...prefs } = preferences;
    return request('/ai/deep-analysis', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: getSessionId(),
        batchIndex,
        totalBatches,
        ...prefs,
      }),
    });
  },

  async submitLead(data) {
    return request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async analyseHeadline(title, source) {
    return request('/ai/analyse-headline', {
      method: 'POST',
      body: JSON.stringify({ title, source }),
    });
  },

  async journalAssist(noteContent, action) {
    return request('/ai/journal-assist', {
      method: 'POST',
      body: JSON.stringify({ noteContent, action }),
    });
  },

  async saveAnalysis(payload, preferences) {
    return request('/ai/analysis/save', {
      method: 'POST',
      body: JSON.stringify({ sessionId: getSessionId(), payload, preferences }),
    });
  },

  async getSavedAnalysis() {
    return request(`/ai/analysis/saved?sessionId=${getSessionId()}`);
  },

  async analyseDocument(text, docType = 'general', question = '') {
    return request('/ai/analyse-document', {
      method: 'POST',
      body: JSON.stringify({ text, docType, question }),
    });
  },

  async getQuote(symbol) {
    return request(`/ai/quote/${encodeURIComponent(symbol)}`);
  },
};
