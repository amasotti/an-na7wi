<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <div class="inline-block mb-6">
        <ArabicCalligraphy />
      </div>
      
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
        An-Na7wi
      </h1>
      <h2 class="text-3xl md:text-4xl font-semibold text-primary-700 mb-6">
        النحوي
      </h2>
      
      <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
        My Companion for Arabic language and its wonderful dialects
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/texts" class="inline-block">
          <BaseButton size="lg" class="w-full sm:w-auto p-4">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" stroke="currentColor" viewBox="0 0 24 24">
                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>Begin Study Session</span>
            </div>
          </BaseButton>
        </NuxtLink>
        
        <NuxtLink to="/words" class="inline-block">
          <BaseButton variant="outline" size="lg" class="w-full sm:w-auto p-4">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" stroke="currentColor" viewBox="0 0 24 24">
                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span>Browse Vocabulary</span>
            </div>
          </BaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="mb-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Study Tools</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Organized resources for your Arabic learning journey</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :feature="feature"
        />
      </div>
    </div>

    <!-- Sample Text Section -->
    <BaseCard class="mb-12">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900 mb-0">Study Example</h3>
          <BaseBadge variant="primary">Practice Text</BaseBadge>
        </div>
      </template>
      
      <div class="space-y-6">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <p class="text-2xl text-gray-900 mb-4 arabic-text">
            مرحباً بكم في تطبيق النحوي! هذا التطبيق يساعدكم على تعلّم اللهجات العربية.
          </p>
          
          <div class="space-y-3">
            <p class="text-gray-600 italic">
              Marhaban bikum fi tatbiq an-nahwi! Hadha al-tatbiq yusa'idukum 'ala ta'allum al-lahjat al-'arabiyya.
            </p>
            
            <p class="text-gray-800 font-medium">
              Welcome to An-Nahwi! This is your personal study companion for exploring Arabic language and dialects.
            </p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <BaseBadge v-for="tag in sampleTags" :key="tag.text" :variant="tag.variant">
            {{ tag.text }}
          </BaseBadge>
        </div>
      </div>
    </BaseCard>

    <!-- Study Overview -->
    <div class="mb-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Your Study Collection</h2>
        <p class="text-lg text-gray-600">Current resources in your personal Arabic library</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          v-for="stat in stats"
          :key="stat.label"
          :stat="stat"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArabicCalligraphy from '~/components/common/ArabicCalligraphy.vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseCard from '~/components/common/BaseCard.vue'
import FeatureCard, {type Feature} from '~/components/home/FeatureCard.vue'
import StatCard from '~/components/home/StatCard.vue'



const features: Feature[] = [
  {
    title: 'Flashcard Practice',
    description: 'Master your vocabulary with interactive flashcards and track your progress.',
    icon: 'cards',
    color: 'primary',
    link: '/flashcards',
  },
  {
    title: 'Text Library',
    description: 'Collect and organize Arabic texts with transliteration and personal notes.',
    icon: 'document-text',
    color: 'secondary',
    link: '/texts',
  },
  {
    title: 'Vocabulary Journal',
    description: 'Build your personal dictionary with root analysis and usage examples.',
    icon: 'book-open',
    color: 'accent',
    link: '/words',
  },
  {
    title: 'Root Deep-Dive',
    description: 'Explore Arabic word roots and discover related words across different forms.',
    icon: 'cube-transparent',
    color: 'primary',
    link: '/roots',
  },
  {
    title: 'Dialect Studies',
    description: 'Explore different Arabic dialects: Tunisian, Moroccan, Egyptian, and MSA.',
    icon: 'globe',
    color: 'secondary',
    link: '/texts',
  },
  {
    title: 'Study Progress',
    description: 'Track your learning path and see how your Arabic knowledge grows over time.',
    icon: 'chart',
    color: 'accent',
    link: '/analytics',
  },
]

const sampleTags = [
  { text: 'Beginner', variant: 'success' },
  { text: 'MSA', variant: 'primary' },
  { text: 'Study Note', variant: 'secondary' },
  { text: 'Practice', variant: 'warning' },
]

const stats = [
  {
    value: '24',
    label: 'Saved Texts',
    icon: 'document-text',
  },
  {
    value: '312',
    label: 'Words Studied',
    icon: 'book-open',
  },
  {
    value: '3',
    label: 'Dialects Explored',
    icon: 'globe',
  },
  {
    value: '18',
    label: 'Study Sessions',
    icon: 'chart',
  },
]
</script>
