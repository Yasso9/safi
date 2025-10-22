<template>
    <div class="relative w-full">
        <div
            ref="editorRef"
            contenteditable="plaintext-only"
            @input="handleInput"
            @paste="handlePaste"
            class="min-h-[70vh] w-full border-0 bg-transparent p-8 font-mono text-lg leading-relaxed text-[#0a0a0a] outline-none focus:outline-none dark:text-[#fafafa]"
            spellcheck="false"
        ></div>
        <div
            v-if="isEmpty"
            class="pointer-events-none absolute top-8 left-8 font-mono text-lg text-[#a3a3a3] dark:text-[#525252]"
        >
            {{ placeholder }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

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

const isEmpty = computed(() => !props.modelValue)

const handleInput = () => {
    if (!editorRef.value) return
    emit('update:modelValue', editorRef.value.textContent || '')
}

const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') || ''
    document.execCommand('insertText', false, text)
}

watch(
    () => props.modelValue,
    (newValue) => {
        if (!editorRef.value) return
        if (editorRef.value.textContent !== newValue) {
            editorRef.value.textContent = newValue
        }
    },
)

onMounted(() => {
    if (editorRef.value) {
        editorRef.value.textContent = props.modelValue
    }
})
</script>
