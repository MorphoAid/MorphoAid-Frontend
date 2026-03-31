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
        <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="selected = null">
          <Transition name="scale">
            <div v-if="selected" data-testid="approval-modal" class="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <!-- Modal Header -->
              <div class="bg-gradient-to-br from-[#48B7CB] via-[#3FA6B9] to-[#2F8EA2] px-8 py-8 relative overflow-hidden">
                <!-- Abstract decorations -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div class="relative">
                    <img v-if="selected.profilePictureUrl" :src="selected.profilePictureUrl" class="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-lg" />
                    <div v-else class="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-3xl border-2 border-white/30 shadow-lg">
                      {{ initials(selected) }}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div class="text-center md:text-left flex-1">
                    <h2 class="text-2xl font-black text-white leading-tight uppercase tracking-tight">{{ fullName(selected) }}</h2>
                    <p class="text-white/80 font-medium">{{ selected.email }}</p>
                    <div class="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                      <span class="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                        {{ selected.role?.replace('_', ' ') }}
                      </span>
                    </div>
                  </div>
                  <button @click="selected = null" class="absolute top-2 right-2 text-white/50 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <!-- Modal Content (Scrollable) -->
              <div class="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Personal Info Section -->
                  <div class="space-y-4">
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Personal Information</h3>
                    <div class="space-y-3">
                      <div class="bg-gray-50 rounded-2xl p-4 transition-all hover:bg-gray-100/80 border border-transparent hover:border-gray-200">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">First Name</p>
                        <p class="font-bold text-gray-800">{{ selected.firstName || '—' }}</p>
                      </div>
                      <div class="bg-gray-50 rounded-2xl p-4 transition-all hover:bg-gray-100/80 border border-transparent hover:border-gray-200">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last Name</p>
                        <p class="font-bold text-gray-800">{{ selected.lastName || '—' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Professional Info Section -->
                  <div class="space-y-4">
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Professional Details</h3>
                    <div class="space-y-3">
                      <div class="bg-gray-50 rounded-2xl p-4 transition-all hover:bg-gray-100/80 border border-transparent hover:border-gray-200">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Medical Title</p>
                        <p class="font-bold text-gray-800">{{ selected.title || 'Doctor' }}</p>
                      </div>
                      <div class="bg-gray-50 rounded-2xl p-4 transition-all hover:bg-gray-100/80 border border-transparent hover:border-gray-200">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">License Number</p>
                        <p class="font-bold text-gray-800">{{ selected.licenseNumber || '—' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Workplace Section -->
                  <div class="md:col-span-2 space-y-4">
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Workplace & Affiliation</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div class="bg-gray-50 rounded-2xl p-4 flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hospital</p>
                          <p class="font-bold text-gray-800">{{ selected.hospital || '—' }}</p>
                        </div>
                      </div>
                      <div class="bg-gray-50 rounded-2xl p-4 flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Organization</p>
                          <p class="font-bold text-gray-800">{{ selected.organization || '—' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Verification Document Section -->
                  <div class="md:col-span-2 space-y-4 pt-2">
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Medical Identity Verification</h3>
                    <div v-if="selected.verificationDocumentUrl" class="relative group">
                      <div v-if="!verificationDocUrl" class="w-full h-48 md:h-64 bg-gray-100 animate-pulse rounded-3xl border border-gray-200 flex items-center justify-center">
                        <svg class="animate-spin h-8 w-8 text-[#48B7CB]" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      </div>
                      <img v-else :src="verificationDocUrl" class="w-full h-48 md:h-64 object-cover rounded-3xl border border-gray-200 cursor-pointer transition-all hover:brightness-95 shadow-sm" @click="window.open(verificationDocUrl, '_blank')" />
                      <div v-if="verificationDocUrl" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div class="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          Open Document
                        </div>
                      </div>
                    </div>
                    <div v-else class="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col items-center justify-center text-center">
                      <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      </div>
                      <p class="text-amber-800 font-bold text-sm">No verification document provided</p>
                      <p class="text-amber-600 text-[11px] mt-1">Manual background check may be required.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button
                  @click="reject(selected)"
                  :disabled="processing"
                  class="flex-1 h-14 rounded-2xl border-2 border-red-200 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm active:scale-95"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  Reject Request
                </button>
                <button
                  @click="approve(selected)"
                  :disabled="processing"
                  class="flex-[1.5] h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 active:scale-95"
                >
                  <svg v-if="processing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Approve Account
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
import { ref, onMounted, watch, onUnmounted } from 'vue'
import api from '@/services/http'
import { adminService } from '@/services/admin.service'

const pendingUsers = ref([])
const selected = ref(null)
const loading = ref(false)
const processing = ref(false)
const approvedCount = ref(0)
const rejectedCount = ref(0)
const verificationDocUrl = ref(null)

async function fetchVerificationDocument(user) {
  if (!user?.verificationDocumentUrl) {
    verificationDocUrl.value = null
    return
  }

  try {
    const response = await api.get(user.verificationDocumentUrl, { responseType: 'blob' })
    if (verificationDocUrl.value) {
      URL.revokeObjectURL(verificationDocUrl.value)
    }
    verificationDocUrl.value = URL.createObjectURL(response.data)
  } catch (e) {
    console.error('Failed to fetch verification document', e)
    verificationDocUrl.value = null
  }
}

watch(selected, (newUser) => {
  if (newUser) {
    fetchVerificationDocument(newUser)
  } else {
    if (verificationDocUrl.value) {
      URL.revokeObjectURL(verificationDocUrl.value)
      verificationDocUrl.value = null
    }
  }
})

onUnmounted(() => {
  if (verificationDocUrl.value) {
    URL.revokeObjectURL(verificationDocUrl.value)
  }
})

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
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-enter-active, .scale-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>
