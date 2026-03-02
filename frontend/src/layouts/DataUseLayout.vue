<template>
    <div class="layout data-use bg-[#F8F8F8] min-h-screen flex flex-col font-sans text-[#2E2E2E]">
        <!-- Topbar -->
        <header class="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
            <div class="text-[#48B7CB] text-2xl font-bold tracking-tight">
                MorphoAids
            </div>
            <div class="flex items-center gap-4">
                <div
                    class="w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center text-[#5C5C5C] shadow-sm">
                    <!-- Notification Placeholder -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                        </path>
                    </svg>
                </div>
                <div
                    class="w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center text-[#5C5C5C] shadow-sm overflow-hidden border border-gray-200">
                    <!-- Profile Placeholder -->
                    <svg class="w-6 h-6 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col ">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</div>

                <SidebarItem to="/data-use/dashboard" label="Dashboard" :active-matches="['/data-use/dashboard']">
                    <template #icon>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                            </path>
                        </svg>
                    </template>
                </SidebarItem>

                <SidebarItem to="/data-use/cases/new" label="Upload" :active-matches="['/data-use/cases/new']">
                    <template #icon>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                    </template>
                </SidebarItem>

                <SidebarItem to="/data-use/cases" label="Cases"
                    :active-matches="['/data-use/cases', '/data-use/cases/']">
                    <template #icon>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                            </path>
                        </svg>
                    </template>
                </SidebarItem>

                <div class="mt-8 mb-4 border-t border-gray-100"></div>

                <SidebarItem label="Insight" disabled>
                    <template #icon>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                            </path>
                        </svg>
                    </template>
                </SidebarItem>

                <SidebarItem label="Setting" disabled>
                    <template #icon>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </template>
                </SidebarItem>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 overflow-auto bg-[#F8F8F8]">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import SidebarItem from '@/components/layout/SidebarItem.vue';
</script>