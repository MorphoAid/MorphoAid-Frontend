import http from '@/services/http';

export const visualizationService = {
    /**
     * Fetches the mock heatmap data from the backend.
     * @returns {Promise<Array<{provinceNameEn: string, provinceNameTh: string, value: number}>>}
     */
    async getHeatmapData() {
        const response = await http.get('/visualization/heatmap');
        return response.data;
    },

    async getTrendData(days = 30, groupBy = 'day') {
        const response = await http.get('/visualization/trend', {
            params: { days, groupBy }
        });
        return response.data;
    },

    async getAiConfidenceData() {
        const response = await http.get('/visualization/ai-confidence');
        return response.data;
    },

    async getSummary() {
        const response = await http.get('/visualization/summary');
        return response.data;
    },
};
