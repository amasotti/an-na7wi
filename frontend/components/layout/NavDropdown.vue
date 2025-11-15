<template>
  <div class="nav-dropdown group relative" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- Trigger Button -->
    <button
      :class="triggerClasses"
      class="relative flex items-center transition-colors duration-200"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <!-- Icon -->
      <div v-if="icon" class="flex-shrink-0 mr-3">
        <BaseIcon :size="mobile ? 'md' : 'sm'" class="transition-colors">
          <path
            v-if="icon === 'DocumentTextIcon'"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </BaseIcon>
      </div>

      <!-- Text -->
      <span class="font-medium">{{ label }}</span>

      <!-- Chevron -->
      <BaseIcon size="xs" class="ml-1 transition-transform duration-200" :class="{ 'rotate-180': isOpen }">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </BaseIcon>

      <!-- Active indicator (desktop only) -->
      <div
        v-if="!mobile"
        class="absolute -bottom-4 left-1/2 w-1 h-1 bg-primary-500 rounded-full transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        :class="{ 'opacity-100': isChildActive }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        :class="dropdownClasses"
        @click.stop
      >
        <NuxtLink
          v-for="child in children"
          :key="child.name"
          :to="child.to"
          class="dropdown-item"
          @click="handleChildClick"
        >
          {{ child.label }}
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from '../common/BaseIcon.vue'

interface ChildNavItem {
  name: string
  label: string
  to: string
}

interface Props {
  label: string
  icon?: string
  children: ChildNavItem[]
  mobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
})

const emit = defineEmits<{
  childClick: []
}>()

const route = useRoute()
const isOpen = ref(false)

const isChildActive = computed(() => {
  return props.children.some(child => {
    if (child.to === '/') {
      return route.path === '/'
    }
    return route.path.startsWith(child.to)
  })
})

const triggerClasses = computed(() => {
  const base = props.mobile ? 'px-4 py-3 rounded-xl w-full' : 'px-4 py-2 rounded-xl'

  const active = isChildActive.value
    ? 'bg-primary-100 text-primary-700'
    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'

  return `${base} ${active}`
})

const dropdownClasses = computed(() => {
  if (props.mobile) {
    return 'ml-4 mt-1 space-y-1'
  }
  return 'absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleMouseEnter = () => {
  if (!props.mobile) {
    isOpen.value = true
  }
}

const handleMouseLeave = () => {
  if (!props.mobile) {
    isOpen.value = false
  }
}

const handleChildClick = () => {
  isOpen.value = false
  emit('childClick')
}
</script>

<style scoped>
.nav-dropdown {
  @apply inline-block;
}

.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors rounded-md mx-1 font-medium;
}

/* Mobile styles */
@media (max-width: 768px) {
  .dropdown-item {
    @apply px-4 py-2.5 text-base;
  }
}
</style>
