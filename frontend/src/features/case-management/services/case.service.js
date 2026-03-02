import http from '@/services/http'

export const uploadCase = async (formData) => {
    return http.post('/cases', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export const uploadCaseImageToS3 = async (caseId, formData) => {
    return http.post(`/cases/${caseId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export const analyzeCase = async (caseId) => {
    return http.post(`/cases/${caseId}/analyze`)
}

export const fetchCases = async () => {
    return http.get('/cases')
}

export const getCaseById = async (caseId) => {
    return http.get(`/cases/${caseId}`)
}
