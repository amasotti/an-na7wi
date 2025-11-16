<template>
  <div class="space-md">
    <!-- Header with Action Buttons -->
    <div v-if="hasSelection" class="form-actions">
      <BaseButton
        variant="outline"
        size="sm"
        @click="$emit('clear-selection')"
      >
        Clear Selection
      </BaseButton>

      <EditButton
        v-if="singleSelection"
        @click="$emit('edit-alignment')"
      />

      <BaseButton
        v-if="singleSelection"
        variant="outline"
        size="sm"
        @click="$emit('link-to-vocabulary')"
      >
        <BaseIcon size="xs" class="icon-inline">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </BaseIcon>
        Link to Vocabulary
      </BaseButton>
    </div>

    <!-- Alignments Grid -->
    <div class="alignments-grid" dir="rtl">
      <InteractiveGlossa
        v-for="(alignment, index) in alignments"
        :key="alignment.id || `temp-${index}`"
        :alignment="alignment"
        :index="index"
        :is-selected="selectedIndices.includes(index)"
        @toggle-selection="$emit('toggle-selection', $event)"
      />
    </div>

    <!-- Helper Text -->
    <p v-if="!hasSelection" class="form-help">
      Click an alignment to select it. Use Cmd/Ctrl+click to select multiple, or Shift+click to select a range.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import EditButton from '~/components/common/EditButton.vue'
import InteractiveGlossa from '~/components/interlinear/alignment/InteractiveGlossa.vue'
import type { WordAlignment } from '~/types'

type AlignmentGridProps = {
  alignments: WordAlignment[]
  selectedIndices: number[]
}

const props = defineProps<AlignmentGridProps>()

defineEmits<{
  'toggle-selection': [index: number, event: MouseEvent]
  'clear-selection': []
  'edit-alignment': []
  'link-to-vocabulary': []
}>()

const hasSelection = computed(() => props.selectedIndices.length > 0)
const singleSelection = computed(() => props.selectedIndices.length === 1)
</script>

<style scoped>
.alignments-grid {
  @apply grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3;
}

.icon-inline {
  @apply mr-1;
}
</style>
