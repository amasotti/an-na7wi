<template>
  <nav class="glass sticky top-0 z-50 border-b border-white/20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <router-link 
          to="/" 
          class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-lg">ن</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900 mb-0">An-Nahwi</h1>
            <p class="text-xs text-gray-600 -mt-1">النحوي</p>
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
          class="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          :class="{ 'bg-white/10': mobileMenuOpen }"
          aria-label="Toggle navigation menu"
        >
          <BaseIcon size="md" class="transition-transform duration-200" :class="{ 'rotate-90': mobileMenuOpen }">
            <path
              v-if="!mobileMenuOpen"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </BaseIcon>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-3 border-t border-white/20">
          <div class="space-y-1 max-h-80 overflow-y-auto">
            <NavLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.to"
              :icon="item.icon"
              mobile
              @click="closeMobileMenu"
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
import { JSX } from 'vue/jsx-runtime'
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
