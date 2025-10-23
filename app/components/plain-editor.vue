<script setup lang="ts">
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

const editorRef = useTemplateRef('editorRef')

const isEmpty = computed(() => !props.modelValue)

function handleInput() {
    if (!editorRef.value) return
    emit('update:modelValue', editorRef.value.textContent || '')
}

function handlePaste(e: ClipboardEvent) {
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

<template>
    <div class="relative w-full">
        <div
            ref="editorRef"
            contenteditable="plaintext-only"
            class="min-h-[70vh] w-full border-0 bg-transparent p-8 font-mono text-lg leading-relaxed text-[#0a0a0a] outline-none focus:outline-none dark:text-[#fafafa]"
            spellcheck="false"
            @input="handleInput"
            @paste="handlePaste"
        ></div>
        <div
            v-if="isEmpty"
            class="pointer-events-none absolute top-8 left-8 font-mono text-lg text-[#a3a3a3] dark:text-[#525252]"
        >
            {{ placeholder }}
        </div>
    </div>
</template>
