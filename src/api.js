const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getSessionId() {
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
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
};
