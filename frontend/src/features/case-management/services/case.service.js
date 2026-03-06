import http from '@/services/http'

export const uploadCase = async (formData) => {
    return http.post('/cases', formData)
}

export const uploadCaseImageToS3 = async (caseId, formData) => {
    return http.post(`/cases/${caseId}/images`, formData)
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

export const fetchNextPatientCode = async () => {
    return http.get('/cases/next-patient-code')
}
