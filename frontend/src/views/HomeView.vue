<template>
  <div class="home animate-fade-in">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <div class="inline-block mb-6">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl mb-4 mx-auto animate-bounce-subtle">
          <span class="text-white font-bold text-3xl">ن</span>
        </div>
      </div>
      
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-shadow">
        An-Nahwi
        <span class="arabic-large text-primary-600 block mt-2">النحوي</span>
      </h1>
      
      <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Master Arabic dialects through interactive texts, vocabulary management, and intelligent annotations
      </p>
      
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton 
          tag="router-link" 
          to="/texts" 
          size="lg" 
          class="animate-slide-up"
          style="animation-delay: 0.1s"
        >
          Start Learning
        </BaseButton>
        
        <BaseButton 
          tag="router-link" 
          to="/vocabulary" 
          variant="outline" 
          size="lg"
          class="animate-slide-up"
          style="animation-delay: 0.2s"
        >
          Explore Vocabulary
        </BaseButton>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      <FeatureCard
        v-for="(feature, index) in features"
        :key="feature.title"
        :feature="feature"
        :delay="index * 0.1"
        class="animate-slide-up"
        :style="{ 'animation-delay': `${0.3 + index * 0.1}s` }"
      />
    </div>

    <!-- Sample Text Section -->
    <BaseCard variant="elevated" class="mb-12 animate-slide-up" style="animation-delay: 0.8s">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900 mb-0">Sample Arabic Text</h3>
          <BaseBadge variant="primary">Interactive</BaseBadge>
        </div>
      </template>
      
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-100">
          <p class="arabic-large text-gray-900 mb-4 leading-loose">
            مرحباً بكم في تطبيق النحوي! هذا التطبيق يساعدكم على تعلّم اللهجات العربية بطريقة تفاعلية وممتعة.
          </p>
          
          <div class="text-gray-600 space-y-2">
            <p class="italic text-lg">
              Marhaban bikum fi tatbiq an-nahwi! Hadha al-tatbiq yusa'idukum 'ala ta'allum al-lahjat al-'arabiyya bi-tariqa tafa'uliyya wa mumti'a.
            </p>
            
            <p class="text-gray-700 text-lg font-medium">
              Welcome to the An-Nahwi application! This app helps you learn Arabic dialects in an interactive and enjoyable way.
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

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style="animation-delay: 1s">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :stat="stat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import FeatureCard from '../components/home/FeatureCard.vue'
import StatCard from '../components/home/StatCard.vue'

const features = [
  {
    title: 'Interactive Texts',
    description:
      'Create and manage Arabic texts with real-time transliteration and translation support.',
    icon: 'document-text',
    color: 'primary',
    link: '/texts',
  },
  {
    title: 'Smart Vocabulary',
    description:
      'Build your vocabulary with root analysis, frequency tracking, and contextual learning.',
    icon: 'book-open',
    color: 'secondary',
    link: '/vocabulary',
  },
  {
    title: 'Advanced Search',
    description: 'Powerful search across texts and vocabulary with Arabic root pattern matching.',
    icon: 'magnifying-glass',
    color: 'accent',
    link: '/search',
  },
  {
    title: 'Multi-Dialect Support',
    description: 'Learn various Arabic dialects including Tunisian, Moroccan, Egyptian, and MSA.',
    icon: 'globe',
    color: 'primary',
    link: '/texts',
  },
  {
    title: 'Rich Annotations',
    description: 'Add grammar, vocabulary, cultural, and pronunciation notes to enhance learning.',
    icon: 'annotation',
    color: 'secondary',
    link: '/texts',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and progress insights.',
    icon: 'chart',
    color: 'accent',
    link: '/analytics',
  },
]

const sampleTags = [
  { text: 'Beginner', variant: 'success' },
  { text: 'MSA', variant: 'primary' },
  { text: 'Interactive', variant: 'secondary' },
  { text: 'Tutorial', variant: 'warning' },
]

const stats = [
  {
    value: '500+',
    label: 'Arabic Texts',
    icon: 'document-text',
  },
  {
    value: '10K+',
    label: 'Vocabulary Words',
    icon: 'book-open',
  },
  {
    value: '4',
    label: 'Dialects Supported',
    icon: 'globe',
  },
  {
    value: '95%',
    label: 'Learning Success',
    icon: 'chart',
  },
]
</script>
