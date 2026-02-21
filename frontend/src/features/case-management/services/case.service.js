import http from '@/services/http'

export const uploadCase = async (formData) => {
    return http.post('/cases', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}
