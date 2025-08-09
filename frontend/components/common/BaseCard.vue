<template>
  <article :class="cardClasses">
    <header v-if="$slots.header" class="card-header">
      <slot name="header" />
    </header>
    
    <section :class="bodyClasses">
      <slot />
    </section>
    
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {CardPadding, CardVariants} from "~/styles/components/cards";

interface Props {
  variant?: CardVariants
  padding?: CardPadding
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: true,
})

const cardClasses = computed(() => {
  const base = 'card-base overflow-hidden'

  const variants = {
    default: '',
    elevated: 'card-elevated',
    glass: 'card-glass',
  }

  const hover = props.hover ? 'card-hover' : ''

  return [base, variants[props.variant], hover].filter(Boolean).join(' ')
})

const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'card-padding-sm',
    md: 'card-padding',
    lg: 'card-padding-lg',
  }

  return paddings[props.padding]
})
</script>
