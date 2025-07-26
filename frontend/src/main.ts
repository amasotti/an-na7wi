import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import './assets/main.css'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      app: {
        title: 'An-Nahwi',
        subtitle: 'Arabic Learning Application',
      },
      nav: {
        home: 'Home',
        texts: 'Texts',
        vocabulary: 'Vocabulary',
        settings: 'Settings',
      },
    },
    ar: {
      app: {
        title: 'النحوي',
        subtitle: 'تطبيق تعلم اللغة العربية',
      },
      nav: {
        home: 'الرئيسية',
        texts: 'النصوص',
        vocabulary: 'المفردات',
        settings: 'الإعدادات',
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
