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
};
