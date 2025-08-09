<template>
  <div class="verse-container">
    <!-- Arabic Verse -->
    <div class="arabic-verse" :class="{ 'animate': showVerse }">
      <div class="verse-line primary">
        <span class="word" v-for="(word, index) in verse.arabic" :key="`arabic-${index}`" 
              :style="{ animationDelay: `${index * 0.3}s` }">
          {{ word }}
        </span>
      </div>
    </div>
    
    <!-- Transliteration -->
    <div class="transliteration" :class="{ 'animate': showTransliteration }">
      <span class="word" v-for="(word, index) in verse.transliteration" :key="`trans-${index}`" 
            :style="{ animationDelay: `${(index * 0.2) + 2}s` }">
        {{ word }}
      </span>
    </div>
    
    <!-- English Translation -->
    <div class="translation" :class="{ 'animate': showTranslation }">
      {{ verse.translation }}
    </div>
    
    <!-- Decorative flourishes -->
    <div class="flourish left" :class="{ 'animate': showFlourishes }"></div>
    <div class="flourish right" :class="{ 'animate': showFlourishes }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Verse {
  arabic: string[]
  transliteration: string[]
  translation: string
}

const verse: Verse = {
  arabic: ['معرفة', 'اللغات', 'مدخل', 'إلى', 'الحكمة'],
  transliteration: ['ma\'rifat', 'al-lughat', 'madkhal', 'ila', 'al-hikma'],
  translation: 'Knowledge of languages is the doorway to wisdom.'
}

const showVerse = ref(false)
const showTransliteration = ref(false)
const showTranslation = ref(false)
const showFlourishes = ref(false)

onMounted(() => {
  setTimeout(() => { showVerse.value = true }, 200)
  setTimeout(() => { showTransliteration.value = true }, 2000)
  setTimeout(() => { showTranslation.value = true }, 3500)
  setTimeout(() => { showFlourishes.value = true }, 4000)
})
</script>

<style scoped>
.verse-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.02), rgba(52, 211, 153, 0.02));
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.arabic-verse {
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.arabic-verse.animate {
  opacity: 1;
  transform: translateY(0);
}

.verse-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  direction: rtl;
}

.arabic-verse .word {
  font-family: 'Amiri', 'Scheherazade New', 'Noto Sans Arabic', 'Times New Roman', serif;
  font-size: 2.5rem;
  font-weight: 500;
  color: transparent;
  background: linear-gradient(135deg, #f87171, #fbbf24, #34d399, #fb7185, #10d9c4);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: modernGradient 8s ease-in-out infinite, wordReveal 0.8s ease-out both;
  text-shadow: 0 0 25px rgba(248, 113, 113, 0.1);
  position: relative;
  letter-spacing: 0.08em;
  font-feature-settings: 'liga' on, 'calt' on;
}

.arabic-verse .word::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #f87171, #fbbf24, transparent);
  animation: underlineGrow 0.6s ease-out both;
  animation-delay: inherit;
  border-radius: 1px;
  opacity: 0.6;
}

.transliteration {
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.transliteration.animate {
  opacity: 1;
  transform: translateY(0);
}

.transliteration .word {
  font-size: 1.1rem;
  color: #64748b;
  font-style: italic;
  font-weight: 400;
  margin: 0 0.4rem;
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.translation {
  font-size: 1.3rem;
  color: #475569;
  text-align: center;
  font-weight: 400;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  max-width: 500px;
  line-height: 1.7;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
}

.translation.animate {
  opacity: 1;
  transform: translateY(0);
}

.flourish {
  position: absolute;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #f87171, #34d399, transparent);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.8s ease-out;
}

.flourish.animate {
  opacity: 0.6;
  transform: scaleX(1);
}

.flourish.left {
  left: 0;
  top: 50%;
  transform-origin: right;
}

.flourish.right {
  right: 0;
  top: 50%;
  transform-origin: left;
}

/* Keyframe Animations */
@keyframes modernGradient {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 0%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 100%; }
  100% { background-position: 0% 50%; }
}

@keyframes wordReveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes underlineGrow {
  0% { width: 0; }
  100% { width: 100%; }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover Effects */
.verse-container:hover .arabic-verse .word {
  animation-duration: 5s;
  text-shadow: 0 0 30px rgba(248, 113, 113, 0.2);
  letter-spacing: 0.12em;
}

.verse-container:hover .flourish {
  opacity: 0.8;
  background: linear-gradient(90deg, transparent, #fbbf24, #34d399, transparent);
  width: 100px;
}

/* Responsive Design */
@media (max-width: 640px) {
  .verse-container {
    padding: 1rem;
    min-height: 150px;
  }
  
  .arabic-verse .word {
    font-size: 2rem;
  }
  
  .verse-line {
    gap: 0.5rem;
  }
  
  .flourish {
    width: 40px;
  }
}
</style>