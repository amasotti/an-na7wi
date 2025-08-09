<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <div @click="toggleDropdown">
      <slot name="trigger" :open="isOpen" />
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="dropdown-menu"
        :class="menuClasses"
      >
        <div class="py-1">
          <slot name="content" :close="closeDropdown" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  width?: 'auto' | 'trigger' | string
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-start',
  width: 'auto',
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const menuClasses = computed(() => {
  const baseClasses =
    'absolute z-50 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'

  const placementClasses = {
    'bottom-start': 'mt-1 left-0 origin-top-left',
    'bottom-end': 'mt-1 right-0 origin-top-right',
    'top-start': 'mb-1 bottom-full left-0 origin-bottom-left',
    'top-end': 'mb-1 bottom-full right-0 origin-bottom-right',
  }

  const widthClasses = {
    auto: 'min-w-max',
    trigger: 'w-full',
  }

  return [
    baseClasses,
    placementClasses[props.placement],
    typeof props.width === 'string' && widthClasses[props.width as keyof typeof widthClasses]
      ? widthClasses[props.width as keyof typeof widthClasses]
      : props.width,
  ]
    .filter(Boolean)
    .join(' ')
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-menu {
  min-width: 160px;
}
</style>