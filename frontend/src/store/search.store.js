import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
    state: () => ({
        query: '',
        globalCases: []
    }),
    actions: {
        setQuery(q) {
            this.query = q;
        },
        setGlobalCases(cases) {
            // Eagerly populated by CaseListTest.vue upon fetching API Cases
            this.globalCases = cases;
        },
        clear() {
            this.query = '';
        }
    }
});
