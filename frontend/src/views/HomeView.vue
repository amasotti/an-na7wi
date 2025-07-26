<template>
  <div class="home animate-fade-in relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
      <div class="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-secondary-200 to-accent-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
    </div>
    
    <!-- Hero Section -->
    <div class="relative z-10 text-center mb-20">
      <div class="inline-block mb-8">
        <div class="relative">
          <div class="w-28 h-28 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-2xl mb-4 mx-auto animate-bounce-subtle transform hover:scale-110 transition-transform duration-300">
            <span class="text-white font-bold text-4xl drop-shadow-lg">ن</span>
          </div>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          <div class="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div class="space-y-6">
        <h1 class="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 mb-4 text-shadow-lg leading-tight">
          An-Nahwi
        </h1>
        <h2 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-primary-500 arabic leading-relaxed">
          النحوي
        </h2>
      </div>
      
      <p class="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed mt-8 font-light">
        Master Arabic dialects through 
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 font-semibold">interactive texts</span>, 
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-600 font-semibold">vocabulary management</span>, 
        and <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-primary-600 font-semibold">intelligent annotations</span>
      </p>
      
      <div class="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
        <BaseButton 
          tag="router-link" 
          to="/texts" 
          size="lg" 
          class="animate-slide-up transform hover:scale-105 shadow-2xl"
          style="animation-delay: 0.1s"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Start Learning
        </BaseButton>
        
        <BaseButton 
          tag="router-link" 
          to="/vocabulary" 
          variant="outline" 
          size="lg"
          class="animate-slide-up border-2 border-gradient shadow-xl backdrop-blur-sm bg-white/10"
          style="animation-delay: 0.2s"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          Explore Vocabulary
        </BaseButton>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="relative z-10 mb-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Powerful Features</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to master Arabic dialects in one comprehensive platform</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          v-for="(feature, index) in features"
          :key="feature.title"
          :feature="feature"
          :delay="index * 0.1"
          class="animate-slide-up transform hover:scale-105 transition-all duration-300"
          :style="{ 'animation-delay': `${0.3 + index * 0.1}s` }"
        />
      </div>
    </div>

    <!-- Sample Text Section -->
    <div class="relative z-10 mb-20">
      <div class="max-w-6xl mx-auto">
        <BaseCard variant="elevated" class="animate-slide-up backdrop-blur-xl bg-white/20 border-2 border-white/30 shadow-2xl overflow-hidden" style="animation-delay: 0.8s">
          <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-200/30 to-secondary-200/30 rounded-full -translate-y-32 translate-x-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full translate-y-24 -translate-x-24"></div>
          
          <template #header>
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 class="text-3xl font-bold text-gray-900 mb-0">Interactive Arabic Text</h3>
              </div>
              <div class="flex space-x-2">
                <BaseBadge variant="primary" class="animate-pulse">Live Demo</BaseBadge>
                <BaseBadge variant="success">Interactive</BaseBadge>
              </div>
            </div>
          </template>
          
          <div class="relative z-10 space-y-8">
            <div class="bg-gradient-to-br from-white/80 via-primary-50/50 to-secondary-50/50 p-8 rounded-3xl border border-white/50 backdrop-blur-sm shadow-inner transform hover:scale-[1.02] transition-transform duration-300">
              <div class="text-center mb-6">
                <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full text-sm font-semibold text-primary-800 mb-4">
                  <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span>Modern Standard Arabic</span>
                </div>
              </div>
              
              <p class="text-4xl text-gray-900 mb-6 leading-loose text-center arabic font-bold">
                مرحباً بكم في تطبيق النحوي!
              </p>
              
              <p class="text-2xl text-gray-900 mb-4 leading-loose text-center arabic">
                هذا التطبيق يساعدكم على تعلّم اللهجات العربية
              </p>
              
              <div class="space-y-4 mt-8">
                <div class="bg-white/60 p-6 rounded-2xl">
                  <p class="text-lg text-gray-700 italic leading-relaxed">
                    Marhaban bikum fi tatbiq an-nahwi! Hadha al-tatbiq yusa'idukum 'ala ta'allum al-lahjat al-'arabiyya
                  </p>
                </div>
                
                <div class="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-200">
                  <p class="text-lg text-gray-800 font-medium leading-relaxed">
                    Welcome to the An-Nahwi application! This app helps you learn Arabic dialects in an interactive and enjoyable way.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap justify-center gap-3">
              <BaseBadge v-for="tag in sampleTags" :key="tag.text" :variant="tag.variant" class="text-sm px-4 py-2 shadow-lg">
                {{ tag.text }}
              </BaseBadge>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="relative z-10">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Learn with Confidence</h2>
        <p class="text-xl text-gray-600">Join thousands of Arabic learners on their journey</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style="animation-delay: 1s">
        <StatCard
          v-for="(stat, index) in stats"
          :key="stat.label"
          :stat="stat"
          class="transform hover:scale-110 transition-all duration-300 hover:shadow-2xl"
          :style="{ 'animation-delay': `${1 + index * 0.1}s` }"
        />
      </div>
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
