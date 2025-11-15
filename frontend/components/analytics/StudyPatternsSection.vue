<template>
  <section class="study-patterns-section">
    <div v-if="loading" class="patterns-skeleton">
      <div v-for="i in 3" :key="i" class="pattern-skeleton" />
    </div>

    <div v-else-if="studyPatterns" class="patterns-grid">
      <BaseCard class="review-schedule-card">
        <h3 class="card-title">Review Schedule</h3>
        <div class="schedule-items">
          <div class="schedule-item">
            <span class="schedule-label">Due Today</span>
            <span class="schedule-count due-today">{{ studyPatterns.reviewSchedule.due }}</span>
          </div>
          <div class="schedule-item">
            <span class="schedule-label">Overdue</span>
            <span class="schedule-count overdue">{{ studyPatterns.reviewSchedule.overdue }}</span>
          </div>
          <div class="schedule-item">
            <span class="schedule-label">Upcoming</span>
            <span class="schedule-count upcoming">{{ studyPatterns.reviewSchedule.upcoming }}</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="study-streak-card">
        <h3 class="card-title">Study Streak</h3>
        <div class="text-center">
          <div class="streak-number">{{ studyPatterns.studyStreak }}</div>
          <p class="streak-label">{{ studyPatterns.studyStreak === 1 ? 'day' : 'days' }} in a row</p>
        </div>
      </BaseCard>

      <BaseCard class="topics-card">
        <h3 class="card-title">Most Studied Topics</h3>
        <div class="topics-content">
          <BaseBadge 
            v-for="topic in studyPatterns.mostStudiedTopics" 
            :key="topic" 
            variant="primary"
            class="topic-badge"
          >
            {{ topic }}
          </BaseBadge>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseCard from '~/components/common/BaseCard.vue'

const analyticsStore = useAnalyticsStore()
const { loading, studyPatterns } = storeToRefs(analyticsStore)
</script>


<style scoped>
.study-patterns-section {
  @apply mb-8;
}

.patterns-skeleton {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse;
}

.pattern-skeleton {
  @apply h-32 bg-gray-200 rounded-lg;
}

.patterns-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

.review-schedule-card,
.study-streak-card,
.topics-card {
  @apply p-6;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.schedule-items {
  @apply space-y-3;
}

.schedule-item {
  @apply flex justify-between items-center;
}

.schedule-label {
  @apply text-gray-600;
}

.schedule-count {
  @apply font-semibold;
}

.due-today {
  @apply text-red-600;
}

.overdue {
  @apply text-orange-600;
}

.upcoming {
  @apply text-green-600;
}


.streak-number {
  @apply text-4xl font-bold text-green-600 mb-2;
}

.streak-label {
  @apply text-gray-600;
}

.topics-content {
  @apply flex flex-wrap gap-2;
}

.topic-badge {
  @apply inline-block;
}
</style>
