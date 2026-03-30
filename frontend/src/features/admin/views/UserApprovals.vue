<template>
  <div class="p-8 max-w-5xl mx-auto w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
      <div>
        <h1 class="text-3xl font-bold text-[#2E2E2E] mb-1">User Approvals</h1>
        <p class="text-[#5C5C5C] text-sm">Review and manage new user registration requests.</p>
      </div>
      <button @click="load" :disabled="loading" data-testid="refresh-btn" class="flex items-center gap-2 bg-white border border-gray-200 text-[#2E2E2E] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
        <svg :class="{ 'animate-spin': loading }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-5 mb-8">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p class="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Pending</p>
        <p class="text-3xl font-bold text-amber-500">{{ pendingUsers.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p class="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Approved Today</p>
        <p class="text-3xl font-bold text-emerald-500">{{ approvedCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p class="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Rejected Today</p>
        <p class="text-3xl font-bold text-red-500">{{ rejectedCount }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-[#48B7CB]" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>

    <!-- Empty -->
    <div v-else-if="pendingUsers.length === 0" data-testid="empty-state" class="bg-white rounded-xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
      <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 class="text-lg font-bold text-[#2E2E2E] mb-1">All clear!</h3>
      <p class="text-[#5C5C5C] text-sm">No pending registrations to review.</p>
    </div>

    <!-- User List -->
    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-50">
        <div
          v-for="user in pendingUsers"
          :key="user.id"
          class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
          data-testid="user-row"
          @click="openDetail(user)"
        >
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-[#48B7CB]/15 flex items-center justify-center text-[#48B7CB] font-bold text-sm flex-shrink-0">
            {{ initials(user) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-[#2E2E2E] truncate">{{ fullName(user) || '—' }}</p>
            <p class="text-sm text-[#5C5C5C] truncate">{{ user.email }}</p>
          </div>

          <!-- Role Badge -->
          <span class="hidden md:inline text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">{{ user.role?.replace('_', ' ') }}</span>

          <!-- Date -->
          <span class="hidden lg:inline text-xs text-[#5C5C5C]">{{ fmtDate(user.createdAt) }}</span>

          <!-- Chevron -->
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="selected = null">
          <Transition name="scale">
            <div v-if="selected" data-testid="approval-modal" class="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
              <!-- Modal Header -->
              <div class="bg-gradient-to-r from-[#48B7CB] to-[#2F8EA2] px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {{ initials(selected) }}
                  </div>
                  <div>
                    <p class="text-white font-bold text-lg">{{ fullName(selected) || '—' }}</p>
                    <p class="text-white/80 text-sm">{{ selected.email }}</p>
                  </div>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="px-6 py-5 space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Role</p>
                    <p class="font-semibold text-[#2E2E2E]">{{ selected.role?.replace('_', ' ') }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Registered</p>
                    <p class="font-semibold text-[#2E2E2E]">{{ fmtDate(selected.createdAt) }}</p>
                  </div>
                  <div class="bg-amber-50 rounded-xl p-4 col-span-2 flex items-center gap-3">
                    <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    <p class="text-sm text-amber-700 font-medium" data-testid="status-text">Awaiting admin verification</p>
                  </div>
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="px-6 pb-6 flex gap-3">
                <button
                  @click="reject(selected)"
                  :disabled="processing"
                  class="flex-1 h-12 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="reject-btn"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  Reject
                </button>
                <button
                  @click="approve(selected)"
                  :disabled="processing"
                  class="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="approve-btn"
                >
                  <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Approve
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/http'
import { adminService } from '@/services/admin.service'

const pendingUsers = ref([])
const selected = ref(null)
const loading = ref(false)
const processing = ref(false)
const approvedCount = ref(0)
const rejectedCount = ref(0)

function initials(user) {
  const f = user.firstName?.[0] || ''
  const l = user.lastName?.[0] || ''
  return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
}

function fullName(user) {
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
  return user.fullName || user.email
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function load() {
  loading.value = true
  try {
    const res = await adminService.getPendingUsers?.() || await api.get('/admin/users/pending')
    pendingUsers.value = res.data || []
  } catch (e) {
    console.error('Failed to load pending users', e)
    alert("Unable to load approval requests. Please try again later.");
  } finally {
    loading.value = false
  }
}

function openDetail(user) {
  selected.value = user
}

async function approve(user) {
  processing.value = true
  try {
    await adminService.approveUser(user.id)
    selected.value = null
    // SRS-160: Auto-refresh by pulling fresh data
    await load()
    approvedCount.value++
    alert("Doctor account approved successfully.")
  } catch (e) {
    console.error('Failed to approve user', e)
    if (e.status === 404 || e.response?.status === 404) {
      alert("This approval request is no longer available.")
    } else {
      alert("Unable to update doctor approval status. Please try again later.")
    }
  } finally {
    processing.value = false
  }
}

async function reject(user) {
  if (!confirm(`Reject and remove ${fullName(user)}? This cannot be undone.`)) return
  processing.value = true
  try {
    await adminService.rejectUser(user.id)
    selected.value = null
    // SRS-160: Auto-refresh by pulling fresh data
    await load()
    rejectedCount.value++
    alert("Doctor account rejected successfully.")
  } catch (e) {
    console.error('Failed to reject user', e)
    if (e.status === 404 || e.response?.status === 404) {
      alert("This approval request is no longer available.")
    } else {
      alert("Unable to update doctor approval status. Please try again later.")
    }
  } finally {
    processing.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-enter-active, .scale-leave-active { transition: all 0.2s ease; }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.95); }
</style>
