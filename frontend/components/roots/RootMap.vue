<template><div ref="container"></div></template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {useRootStore} from "#imports";
import type {RootWithWords, WordSummary} from "~/types";

interface TreeNode {
  id: string
  arabic: string
  transliteration: string
  meaning: string
  children: TreeNode[]
}

const container = ref<HTMLElement | null>(null)
const store = useRootStore();

const { currentRootWithWords } = storeToRefs(store)

const wordToNode = (word: WordSummary): TreeNode => ({
  id: word.id,
  arabic: word.arabic,
  transliteration: word.transliteration || 'N/A',
  meaning: word.translation || 'N/A',
  children: [],
})


function buildTree(root: RootWithWords, words: WordSummary[]): TreeNode {
  const wordMap = new Map(words.map(w => [w.id, w]))

  function buildSubtree(wordId: string): TreeNode {
    const word = wordMap.get(wordId)
    if (!word) {
      throw new Error(`Word with ID ${wordId} not found`)
    }

    const node = wordToNode(word)

    // Find all children of this word
    const children = words.filter(w => w.derivedFromId === wordId)
    node.children = children.map(child => buildSubtree(child.id))

    return node
  }

  const rootNode: TreeNode = {
    id: root.root.id,
    arabic: root.root.displayForm,
    transliteration: root.root.normalizedForm,
    meaning: root.root.meaning || 'N/A',
    children: [],
  }

  // Find all words directly derived from root (no derivedFromId)
  const primaryWords = words.filter(w => !w.derivedFromId)
  rootNode.children = primaryWords.map(w => buildSubtree(w.id))

  return rootNode
}

function toMermaid(node: TreeNode): string {
  console.log("tree node:", node)
  const lines = ['mindmap', `  root((${fmt(node)}))`]

  function walk(currentNode: TreeNode, indent = 4) {
    for (const child of currentNode.children) {
      lines.push(' '.repeat(indent) + `[${fmt(child)}]`)
      walk(child, indent + 2)
    }
  }

  walk(node)
  return lines.join('\n')
}

function fmt(node: TreeNode | { arabic: string; transliteration: string; meaning: string }): string {
  return `${node.arabic}<br>${node.transliteration}<br>${node.meaning}`
}

const mm = toMermaid(buildTree(currentRootWithWords.value!, currentRootWithWords.value!.words))

onMounted(async () => {
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({ startOnLoad: false })
  const { svg } = await mermaid.render('root', mm)
  if (container.value) container.value.innerHTML = svg
})
</script>

<style scoped>
svg {
  font-family: 'Noto Naskh Arabic', 'Arabic Typesetting', 'Times New Roman', serif;
}
</style>
