import http from "@/services/http";

const ClinicalService = {
    uploadCase(formData) {
        return http.post("/clinical/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getCase(id) {
        return http.get(`/clinical/cases/${id}`);
    },

    getNotes(caseId) {
        return http.get(`/clinical/cases/${caseId}/notes`);
    },

    addNote(caseId, note) {
        return http.post(`/clinical/cases/${caseId}/notes`, { note });
    },

    updateNote(caseId, noteId, note) {
        return http.patch(`/clinical/cases/${caseId}/notes/${noteId}`, { note });
    },

    exportPdf(caseId) {
        return http.get(`/clinical/cases/${caseId}/export`, {
            responseType: "blob",
        });
    },

    updatePatientInfo(caseId, payload) {
        return http.patch(`/clinical/cases/${caseId}/patient-info`, payload);
    },
};

export default ClinicalService;
