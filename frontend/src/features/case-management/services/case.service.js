import http from '@/services/http'

// Longer timeout for requests that involve file upload + S3 + AI processing
const LONG_TIMEOUT = 120000 // 120 seconds

export const uploadCase = async (formData) => {
    return http.post('/cases', formData, { timeout: LONG_TIMEOUT })
}

export const uploadDataPrepCase = async (formData) => {
    return http.post('/dataprep/cases', formData, { timeout: LONG_TIMEOUT })
}

export const uploadCaseImageToS3 = async (caseId, formData) => {
    return http.post(`/cases/${caseId}/images`, formData, { timeout: LONG_TIMEOUT })
}

export const analyzeCase = async (caseId) => {
    return http.post(`/cases/${caseId}/analyze`, null, { timeout: LONG_TIMEOUT })
}

export const fetchCases = async () => {
    return http.get('/cases')
}

export const getCaseById = async (caseId) => {
    return http.get(`/cases/${caseId}`)
}

export const fetchNextPatientCode = async () => {
    return http.get('/cases/next-patient-code')
}

export const deleteCase = async (caseId) => {
    return http.delete(`/cases/${caseId}`)
}

export const fetchAiResult = async (caseId) => {
    return http.get(`/cases/${caseId}/ai-result`)
}
