<template>
  <BaseCard class="group relative overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">

    <!-- Actions Menu - Top Right Corner -->
    <div class="absolute top-3 right-3 z-10">
      <HamburgerCardMenu @click="toggleDropdown"/>

      <!-- Hamburger Menu options: TODO: move them to a separate component (see also TextCard)     -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-2"
      >
        <div
          v-if="dropdownOpen"
          class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20"
        >
          <ActionMenuItem @click="viewText" icon="eye">
            View Text
          </ActionMenuItem>
          <ActionMenuItem @click="editText" icon="pencil">
            Edit Text
          </ActionMenuItem>
          <hr class="my-2 border-gray-100 dark:border-gray-700">
          <ActionMenuItem @click="deleteText" icon="trash" danger>
            Delete
          </ActionMenuItem>
        </div>
      </Transition>
    </div>

    <!-- Card Content -->
    <div class="pr-10">
      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-700 transition-colors mb-2">
        {{ text.title }}
      </h3>

      <!-- Dialect Badge -->
      <div class="mb-4">
        <BaseBadge :variant="dialectColor" size="sm">{{ dialectLabel }}</BaseBadge>
      </div>

      <!-- Description Preview -->
      <div v-if="text.description" class="mb-4">
        <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {{ text.description }}
        </p>
      </div>
    </div>

    <!-- Footer - Always at bottom -->
    <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between text-xs">

        <!-- Sentence Count -->
        <span class="flex items-center text-gray-500 dark:text-gray-400">
          <BaseIcon size="xs" class="mr-1">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </BaseIcon>
          {{ text.sentenceCount || 0 }} {{ text.sentenceCount === 1 ? 'sentence' : 'sentences' }}
        </span>

        <!-- Update Date -->
        <span class="flex items-center text-gray-500 dark:text-gray-400">
          <BaseIcon size="xs" class="mr-1">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </BaseIcon>
          {{ formattedDate }}
        </span>

        <!-- Open Link -->
        <ViewFooterIcon @view="viewText"/>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import ActionMenuItem from '@/components/text/ActionMenuItem.vue'
import type { InterlinearText } from '@/types'
import { Dialect } from '@/types'
import HamburgerCardMenu from '~/components/common/HamburgerCardMenu.vue'
import ViewFooterIcon from '~/components/common/ViewFooterIcon.vue'
import { dialectToLabel } from '~/utils/arabicDialects'
import { formatDate } from '~/utils/dateUtils'

interface Props {
  text: InterlinearText
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [textId: string]
}>()

const dropdownOpen = ref(false)

const interlinearStore = useInterlinearStore()

const dialectLabel = computed(() => dialectToLabel[props.text.dialect])

const dialectColor = computed(() => dialectToColor[props.text.dialect])

const formattedDate = computed(() => formatDate(props.text.createdAt))

// Methods
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const viewText = () => {
  interlinearStore.openTextDetailPage(props.text.id)
}

const editText = (textId: string) => {
  navigateTo(`/interlinear-texts/${textId}/edit-metadata`)
}

const deleteText = () => {
  dropdownOpen.value = false
  emit('delete', props.text.id)
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative') && dropdownOpen.value) {
      dropdownOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
