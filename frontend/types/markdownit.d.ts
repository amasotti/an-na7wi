import type MarkdownIt from 'markdown-it'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $markdownit: MarkdownIt
  }
}

declare module '#app' {
  interface NuxtApp {
    $markdownit: MarkdownIt
  }
}