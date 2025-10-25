<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import Editor from '~/components/editor.vue'
import type { FileResponse } from '~~/shared/types/api'

const props = defineProps<{
    file: FileResponse
}>()

const content = ref('')

watchEffect(() => {
    content.value = props.file.content
})

const DEBOUNCE_DELAY = 150

watchDebounced(
    content,
    async (newContent) => {
        await $fetch(`/api/files/${props.file.path}`, {
            method: 'PUT',
            body: { content: newContent },
        })
    },
    { debounce: DEBOUNCE_DELAY },
)
</script>

<template>
    <div class="flex min-h-screen items-start justify-center">
        <div class="w-full max-w-[70ch]">
            <Editor
                v-model:content="content"
                placeholder="Start typing your markdown..."
            />
        </div>
    </div>
</template>
