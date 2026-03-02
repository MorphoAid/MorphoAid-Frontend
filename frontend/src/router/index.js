import { createRouter, createWebHistory } from 'vue-router'

import publicRoutes from './public_rout'
import adminRoutes from './admin_rout'
import dataPrepRoutes from './dataPrep_rout'
import dataUseRoutes from './dataUse_rout'

const routes = [
    {
        path: '/',
        name: 'Root',
        redirect: '/login'
    },
    ...publicRoutes,
    ...adminRoutes,
    ...dataPrepRoutes,
    ...dataUseRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
