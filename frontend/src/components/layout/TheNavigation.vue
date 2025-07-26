<template>
  <nav class="glass sticky top-0 z-50 border-b border-white/30 backdrop-blur-2xl bg-white/10 shadow-2xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo/Brand -->
        <router-link 
          to="/" 
          class="flex items-center space-x-4 hover:scale-105 transition-all duration-300 group"
        >
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform duration-300">
              <span class="text-white font-bold text-xl drop-shadow-lg">ن</span>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mb-0 group-hover:scale-105 transition-transform duration-300">An-Nahwi</h1>
            <p class="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-accent-500 -mt-1 arabic">النحوي</p>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2">
          <NavLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            :icon="item.icon"
          >
            {{ item.label }}
          </NavLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-3 rounded-2xl hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-300 flex-shrink-0 border border-white/20 backdrop-blur-sm transform hover:scale-110"
          :class="{ 'bg-gradient-to-r from-primary-500/30 to-secondary-500/30 shadow-lg': mobileMenuOpen }"
          aria-label="Toggle navigation menu"
        >
          <BaseIcon size="md" class="transition-all duration-300 text-gray-700" :class="{ 'rotate-180 text-primary-600': mobileMenuOpen }">
            <path
              v-if="!mobileMenuOpen"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </BaseIcon>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-6 border-t border-white/30 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-xl">
          <div class="space-y-2 max-h-80 overflow-y-auto">
            <NavLink
              v-for="(item, index) in navItems"
              :key="item.name"
              :to="item.to"
              :icon="item.icon"
              mobile
              @click="closeMobileMenu"
              class="animate-slide-up"
              :style="{ 'animation-delay': `${index * 0.1}s` }"
            >
              {{ item.label }}
            </NavLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BaseIcon from '../common/BaseIcon.vue'
import NavLink from './NavLink.vue'

const mobileMenuOpen = ref(false)

const navItems = [
  {
    name: 'home',
    label: 'Home',
    to: '/',
    icon: 'HomeIcon',
  },
  {
    name: 'texts',
    label: 'Texts',
    to: '/texts',
    icon: 'DocumentTextIcon',
  },
  {
    name: 'vocabulary',
    label: 'Vocabulary',
    to: '/vocabulary',
    icon: 'BookOpenIcon',
  },
  {
    name: 'search',
    label: 'Search',
    to: '/search',
    icon: 'MagnifyingGlassIcon',
  },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('nav') && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
