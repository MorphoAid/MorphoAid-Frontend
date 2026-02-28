import http from '@/services/http';

/**
 * Upload a case image
 * @param {number|string} caseId
 * @param {number|string} uploaderId
 * @param {File} file
 * @returns {Promise<Object>} The server response data
 */
export const uploadCaseImage = async (caseId, uploaderId, file) => {
    const formData = new FormData();
    formData.append('uploaderId', uploaderId);
    formData.append('image', file);

    const response = await http.post(`/cases/${caseId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

/**
 * Fetch the binary blob of a case image
 * @param {number|string} caseId
 * @param {number|string} imageId
 * @returns {Promise<Blob>} The image Blob instance
 */
export const fetchCaseImageBlob = async (caseId, imageId) => {
    const response = await http.get(`/cases/${caseId}/images/${imageId}/content`, {
        responseType: 'blob'
    });
    return response.data;
};
