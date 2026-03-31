/**
 * Lab module API service.
 * Uses the shared http.js axios instance which automatically attaches
 * the JWT Bearer token via its request interceptor.
 */
import http from '@/services/http.js'

/**
 * GET /lab/review
 * Returns list of LabReviewDto (ANALYZED cases, DATA_PREP only).
 */
export function listLabReviews() {
    return http.get('/lab/review')
}

/**
 * GET /lab/review/{caseId}
 * Returns single LabReviewDto.
 */
export function getLabReviewDetail(caseId) {
    return http.get(`/lab/review/${caseId}`)
}

/**
 * GET /cases/{caseId}/images/{imageId}
 * Returns raw image binary as a Blob so we can create an objectURL
 * (required because <img src> cannot send Authorization headers).
 */
export function fetchCaseImageBlob(caseId, imageId) {
    return http.get(`/cases/${caseId}/images/${imageId}`, {
        responseType: 'blob',
    })
}

/**
 * POST /lab/export
 * Backend streams application/zip.
 * responseType:'blob' captures the binary stream so we can save it locally.
 */
export function exportLabZip() {
    return http.post('/lab/export', null, {
        responseType: 'blob',
        timeout: 120000, // large exports can take time
    })
}
