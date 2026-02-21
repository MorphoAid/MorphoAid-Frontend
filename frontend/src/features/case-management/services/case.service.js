import http from '@/services/http'

export const uploadCase = async (formData) => {
    return http.post('/cases', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export const analyzeCase = async (id) => {
    return http.post(`/cases/${id}/analyze`)
}

export const fetchAiResult = async (id) => {
    return http.get(`/cases/${id}/ai-result`)
}
