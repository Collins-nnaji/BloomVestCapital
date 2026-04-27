const getApiBase = () => {
  const configured = process.env.REACT_APP_API_URL || '';
  if (configured) return `${configured.replace(/\/$/, '')}/api`;
  return '/api';
};

const API_BASE = getApiBase();

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
  const res = await fetch(`${API_BASE}${path}`, {
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
        ? 'API route returned HTML instead of JSON. Set REACT_APP_API_URL or run the API implementation.'
        : 'Request failed';

    throw new Error((typeof err === 'object' && err?.error) || fallbackMessage);
  }

  if (!isJson) {
    const text = await res.text().catch(() => '');
    if (text.trim().startsWith('<')) {
      throw new Error('API route returned HTML instead of JSON. Set REACT_APP_API_URL or run the API implementation.');
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

  async getScenarioAdvice(action, scenarioTitle, details, portfolio, objectives) {
    return request('/scenario/advisor', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: getSessionId(),
        action,
        scenarioTitle,
        details,
        portfolio,
        objectives,
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
};
