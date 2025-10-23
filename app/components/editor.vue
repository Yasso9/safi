<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = withDefaults(
    defineProps<{
        placeholder?: string
    }>(),
    {
        placeholder: 'Start typing...',
    },
)

const editorRef = useTemplateRef('editorRef')

const isEmpty = computed(() => !model.value)

function handleInput() {
    if (!editorRef.value) return
    model.value = editorRef.value.textContent
}

function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') || ''

    const selection = globalThis.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    range.deleteContents()

    const textNode = document.createTextNode(text)
    range.insertNode(textNode)

    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)

    handleInput()
}

watch(model, (newValue) => {
    if (!editorRef.value) return
    if (editorRef.value.textContent !== newValue) {
        editorRef.value.textContent = newValue
    }
})

onMounted(() => {
    if (editorRef.value) {
        editorRef.value.textContent = model.value
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
            {{ props.placeholder }}
        </div>
    </div>
</template>
