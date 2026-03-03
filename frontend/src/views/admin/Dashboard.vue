<template>
  <div class="bg-[#F8F8F8] text-[#2E2E2E] font-poppins min-h-screen p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Area (Optional based on layout, but included for completeness) -->
      <div class="pb-2">
        <h1 class="text-2xl font-semibold text-[#368998]">Overview</h1>
        <p class="text-sm text-[#5C5C5C]">System metrics and activity monitor</p>
      </div>

      <!-- SECTION 1 — Top Metrics (4 Cards Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Users -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <h3 class="text-sm font-medium text-[#5C5C5C] mb-2">Total Users</h3>
          <p class="text-3xl font-semibold text-[#2E2E2E]">1,248</p>
          <p class="text-xs text-[#407533] mt-2">+12 this week</p>
        </div>
        <!-- Active Cases -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <h3 class="text-sm font-medium text-[#5C5C5C] mb-2">Active Cases</h3>
          <p class="text-3xl font-semibold text-[#2E2E2E]">342</p>
          <p class="text-xs text-[#5C5C5C] mt-2">Steady</p>
        </div>
        <!-- Pending Review -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <h3 class="text-sm font-medium text-[#5C5C5C] mb-2">Pending Review</h3>
          <p class="text-3xl font-semibold text-[#2E2E2E]">28</p>
          <p class="text-xs text-[#FF4C38] mt-2">Requires attention</p>
        </div>
        <!-- Failed AI Analyses -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <h3 class="text-sm font-medium text-[#5C5C5C] mb-2">Failed AI Analyses</h3>
          <p class="text-3xl font-semibold text-[#2E2E2E]">3</p>
          <p class="text-xs text-[#A92222] mt-2">-2 since yesterday</p>
        </div>
      </div>

      <!-- Main Two-Column Layout -->
      <div class="flex flex-col lg:flex-row gap-6">
        
        <!-- Main Content (70%) -->
        <div class="w-full lg:w-[70%] space-y-6">
          
          <!-- SECTION 2 — User Role Distribution -->
          <div class="bg-white rounded-xl border border-[#368998]/20 p-6">
            <h2 class="text-lg font-medium text-[#368998] mb-6">User Role Distribution</h2>
            <div class="space-y-5">
              <!-- ADMIN -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-[#5C5C5C]">ADMIN</span>
                  <span class="text-[#2E2E2E] font-semibold">5%</span>
                </div>
                <div class="w-full bg-[#F8F8F8] rounded-full h-2">
                  <div class="bg-[#368998] h-2 rounded-full" style="width: 5%"></div>
                </div>
              </div>
              <!-- DATA_PREP -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-[#5C5C5C]">DATA_PREP</span>
                  <span class="text-[#2E2E2E] font-semibold">35%</span>
                </div>
                <div class="w-full bg-[#F8F8F8] rounded-full h-2">
                  <div class="bg-[#368998] h-2 rounded-full opacity-80" style="width: 35%"></div>
                </div>
              </div>
              <!-- DATA_USE -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-[#5C5C5C]">DATA_USE</span>
                  <span class="text-[#2E2E2E] font-semibold">60%</span>
                </div>
                <div class="w-full bg-[#F8F8F8] rounded-full h-2">
                  <div class="bg-[#368998] h-2 rounded-full opacity-60" style="width: 60%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3 — Recent System Activity Table -->
          <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden">
            <div class="p-6 border-b border-[#368998]/10">
              <h2 class="text-lg font-medium text-[#368998]">Recent System Activity</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-[#F8F8F8] text-[#5C5C5C] border-b border-[#368998]/10">
                  <tr>
                    <th class="py-3 px-6 font-medium whitespace-nowrap">Timestamp</th>
                    <th class="py-3 px-6 font-medium whitespace-nowrap">User</th>
                    <th class="py-3 px-6 font-medium whitespace-nowrap">Role</th>
                    <th class="py-3 px-6 font-medium whitespace-nowrap">Action</th>
                    <th class="py-3 px-6 font-medium whitespace-nowrap">Target</th>
                    <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#368998]/10 text-[#2E2E2E]">
                  <!-- Row 1 (Success) -->
                  <tr class="hover:bg-[#F8F8F8]/50 transition-colors">
                    <td class="py-3 px-6 text-[#5C5C5C]">10:45 AM</td>
                    <td class="py-3 px-6 font-medium">dr.smith@example.com</td>
                    <td class="py-3 px-6">
                      <span class="px-2 py-1 bg-[#368998]/10 text-[#368998] rounded-md text-xs font-medium">DATA_USE</span>
                    </td>
                    <td class="py-3 px-6">Case Analysis</td>
                    <td class="py-3 px-6 text-[#5C5C5C]">Case #8902</td>
                    <td class="py-3 px-6">
                      <span class="text-[#407533] font-medium flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#407533]"></span> Success
                      </span>
                    </td>
                  </tr>
                  <!-- Row 2 (Success) -->
                  <tr class="hover:bg-[#F8F8F8]/50 transition-colors">
                    <td class="py-3 px-6 text-[#5C5C5C]">10:30 AM</td>
                    <td class="py-3 px-6 font-medium">admin@example.com</td>
                    <td class="py-3 px-6">
                      <span class="px-2 py-1 bg-[#368998]/10 text-[#368998] rounded-md text-xs font-medium">ADMIN</span>
                    </td>
                    <td class="py-3 px-6">Role Update</td>
                    <td class="py-3 px-6 text-[#5C5C5C]">User #124</td>
                    <td class="py-3 px-6">
                      <span class="text-[#407533] font-medium flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#407533]"></span> Success
                      </span>
                    </td>
                  </tr>
                  <!-- Row 3 (Warning) -->
                  <tr class="hover:bg-[#F8F8F8]/50 transition-colors">
                    <td class="py-3 px-6 text-[#5C5C5C]">09:15 AM</td>
                    <td class="py-3 px-6 font-medium">prep.team@example.com</td>
                    <td class="py-3 px-6">
                      <span class="px-2 py-1 bg-[#368998]/10 text-[#368998] rounded-md text-xs font-medium">DATA_PREP</span>
                    </td>
                    <td class="py-3 px-6">Batch Upload</td>
                    <td class="py-3 px-6 text-[#5C5C5C]">Dataset Vol.4</td>
                    <td class="py-3 px-6">
                      <span class="text-[#FF4C38] font-medium flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#FF4C38]"></span> Warning
                      </span>
                    </td>
                  </tr>
                  <!-- Row 4 (Failed) -->
                  <tr class="hover:bg-[#F8F8F8]/50 transition-colors">
                    <td class="py-3 px-6 text-[#5C5C5C]">08:00 AM</td>
                    <td class="py-3 px-6 font-medium">system</td>
                    <td class="py-3 px-6">
                      <span class="px-2 py-1 bg-[#5C5C5C]/10 text-[#5C5C5C] rounded-md text-xs font-medium">SYSTEM</span>
                    </td>
                    <td class="py-3 px-6">Nightly Sync</td>
                    <td class="py-3 px-6 text-[#5C5C5C]">External DB</td>
                    <td class="py-3 px-6">
                      <span class="text-[#A92222] font-medium flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#A92222]"></span> Failed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        <!-- Right Column (30%) -->
        <div class="w-full lg:w-[30%] space-y-6">
          
          <!-- SECTION 4 — Attention Panel -->
          <div class="bg-white rounded-xl border border-[#368998]/20 p-6">
            <h2 class="text-lg font-medium text-[#368998] mb-6 border-b border-[#368998]/10 pb-4">Attention Panel</h2>
            <div class="space-y-4">
              
              <!-- Locked Accounts -->
              <div class="p-4 rounded-lg bg-[#F8F8F8] border border-[#368998]/10 transition-colors hover:border-[#368998]/30">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-medium text-[#2E2E2E]">Locked Accounts</h4>
                  <span class="px-2 py-0.5 bg-[#FF4C38]/10 text-[#FF4C38] rounded text-xs font-semibold">2</span>
                </div>
                <p class="text-xs text-[#5C5C5C] leading-relaxed">Multiple failed login attempts. Verification required.</p>
                <div class="mt-3">
                  <button class="text-xs font-medium text-[#368998] hover:text-[#2B6E7A] transition-colors">Review accounts &rarr;</button>
                </div>
              </div>

              <!-- Stuck Cases -->
              <div class="p-4 rounded-lg bg-[#F8F8F8] border border-[#368998]/10 transition-colors hover:border-[#368998]/30">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-medium text-[#2E2E2E]">Stuck Cases (>24h)</h4>
                  <span class="px-2 py-0.5 bg-[#A92222]/10 text-[#A92222] rounded text-xs font-semibold">5</span>
                </div>
                <p class="text-xs text-[#5C5C5C] leading-relaxed">AI analysis queued for unusually long time.</p>
                <div class="mt-3">
                  <button class="text-xs font-medium text-[#368998] hover:text-[#2B6E7A] transition-colors">Investigate queue &rarr;</button>
                </div>
              </div>

              <!-- Storage Notice -->
              <div class="p-4 rounded-lg bg-[#F8F8F8] border border-[#368998]/10 transition-colors hover:border-[#368998]/30">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-medium text-[#2E2E2E]">Storage Notice</h4>
                  <span class="px-2 py-0.5 bg-[#368998]/10 text-[#368998] rounded text-xs font-semibold">Info</span>
                </div>
                <p class="text-xs text-[#5C5C5C] leading-relaxed">System storage at 82% capacity. Routine cleanup recommended.</p>
                <div class="mt-3">
                  <button class="text-xs font-medium text-[#368998] hover:text-[#2B6E7A] transition-colors">View storage metrics &rarr;</button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Admin Dashboard Component Phase: Visual layout only
</script>
