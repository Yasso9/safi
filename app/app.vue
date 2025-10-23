<script setup lang="ts">
import PlainEditor from '~/components/plain-editor.vue'

const STORAGE_KEY = 'pure-editor:text'
const DEBOUNCE_MS = 300

const text = ref('')
const isDark = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
    if (globalThis.window !== undefined) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved !== null) {
            text.value = saved
        }

        // Initialize theme based on OS preference
        const prefersDark = globalThis.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches
        isDark.value = prefersDark

        // Listen for OS theme changes
        globalThis
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                isDark.value = e.matches
            })
    }
})

// Debounced autosave to localStorage
function handleInput() {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
        if (globalThis.window !== undefined) {
            localStorage.setItem(STORAGE_KEY, text.value)
        }
    }, DEBOUNCE_MS)
}
</script>

<template>
    <div :class="isDark ? 'dark' : ''">
        <div
            class="min-h-screen bg-[#fafafa] transition-colors duration-200 dark:bg-[#0a0a0a]"
        >
            <div
                class="flex min-h-screen items-center justify-center px-6 py-12"
            >
                <div class="w-full max-w-[70ch]">
                    <PlainEditor
                        v-model="text"
                        placeholder="Start typing..."
                        @update:model-value="handleInput"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
