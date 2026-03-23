import http from './http';

export const systemService = {
  async getAiStatus() {
    const response = await http.get('/system/status/ai');
    return response.data;
  },

  async toggleAiStatus() {
    const response = await http.post('/system/status/ai/toggle');
    return response.data;
  }
};
