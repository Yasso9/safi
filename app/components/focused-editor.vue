<template>
  <div class="relative w-full">
    <div
      ref="editorRef"
      contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      class="relative z-10 w-full min-h-[70vh] p-8 font-mono text-lg leading-relaxed bg-transparent border-0 outline-none focus:outline-none text-[#0a0a0a] dark:text-[#fafafa]"
      spellcheck="false"
    ></div>
    <div
      v-if="isEmpty"
      class="pointer-events-none absolute left-8 top-8 z-20 font-mono text-lg text-[#a3a3a3] dark:text-[#525252]"
    >
      {{ placeholder }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    placeholder: 'Start typing...',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLElement>()
const focusedParagraphIndex = ref(0)

const isEmpty = computed(() => !props.modelValue)

let isInternalUpdate = false

const updateFocusedParagraph = () => {
  if (!editorRef.value) return

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  let node = range.startContainer

  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode as Node
  }

  const paragraphs = editorRef.value.querySelectorAll('[data-paragraph-index]')
  let newIndex = 0

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    if (paragraph && paragraph.contains(node)) {
      newIndex = i
      break
    }
  }

  if (focusedParagraphIndex.value !== newIndex) {
    focusedParagraphIndex.value = newIndex
  }

  paragraphs.forEach((p, i) => {
    if (p instanceof HTMLElement) {
      p.style.opacity = i === focusedParagraphIndex.value ? '1' : '0.3'
    }
  })
}

const reindexParagraphs = () => {
  if (!editorRef.value) return

  const paragraphs = editorRef.value.querySelectorAll('[data-paragraph-index]')
  paragraphs.forEach((p, index) => {
    p.setAttribute('data-paragraph-index', String(index))
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
   

    const selection = window.getSelection()
    if (!selection || !editorRef.value) return

    const range = selection.getRangeAt(0)
    const newDiv = document.createElement('div')
    newDiv.setAttribute('data-paragraph-index', '0')
    newDiv.className = 'transition-opacity duration-200 min-h-[1.75rem]'
    newDiv.textContent = '\u200B'

    range.deleteContents()
    range.insertNode(newDiv)

    const newRange = document.createRange()
    newRange.setStart(newDiv, 0)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    reindexParagraphs()
    updateFocusedParagraph()

    const text = extractText()
    isInternalUpdate = true
    emit('update:modelValue', text)
    isInternalUpdate = false
  }
}

const extractText = (): string => {
  if (!editorRef.value) return ''

  const paragraphs = editorRef.value.querySelectorAll('[data-paragraph-index]')
  return Array.from(paragraphs)
    .map((p) => p.textContent?.replace(/\u200B/g, '') || '')
    .join('\n')
}

const handleInput = () => {
  if (!editorRef.value) return

  const text = extractText()

  isInternalUpdate = true
  emit('update:modelValue', text)
  isInternalUpdate = false
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (isInternalUpdate || !editorRef.value) return

    const currentText = extractText()
    if (currentText !== newValue) {
      const lines = newValue.split('\n')
      if (lines.length === 0) lines.push('')

      editorRef.value.innerHTML = ''
      lines.forEach((line, index) => {
        const div = document.createElement('div')
        div.setAttribute('data-paragraph-index', String(index))
        div.className = 'transition-opacity duration-200 min-h-[1.75rem]'
        div.textContent = line || '\u200B'
        editorRef.value?.appendChild(div)
      })

      updateFocusedParagraph()
    }
  },
)

onMounted(() => {
  if (editorRef.value) {
    const lines = props.modelValue.split('\n')
    if (lines.length === 0) lines.push('')

    lines.forEach((line, index) => {
      const div = document.createElement('div')
      div.setAttribute('data-paragraph-index', String(index))
      div.className = 'transition-opacity duration-200 min-h-[1.75rem]'
      div.textContent = line || '\u200B'
      editorRef.value?.appendChild(div)
    })

    updateFocusedParagraph()
  }

  document.addEventListener('selectionchange', updateFocusedParagraph)
})

onUnmounted(() => {
  document.removeEventListener('selectionchange', updateFocusedParagraph)
})
</script>
