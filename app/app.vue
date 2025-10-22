<template>
    <div :class="isDark ? 'dark' : ''">
        <div
            class="min-h-screen bg-[#fafafa] transition-colors duration-200 dark:bg-[#0a0a0a]"
        >
            <!-- Editor Container -->
            <div
                class="flex min-h-screen items-center justify-center px-6 py-12"
            >
                <div class="w-full max-w-[70ch]">
                    <PlainEditor
                        v-model="text"
                        @update:model-value="handleInput"
                        placeholder="Start typing..."
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'pure-editor:text'
const DEBOUNCE_MS = 300

const text = ref('')
const isDark = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Load saved text from localStorage
onMounted(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved !== null) {
            text.value = saved
        }

        // Initialize theme based on OS preference
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches
        isDark.value = prefersDark

        // Listen for OS theme changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                isDark.value = e.matches
            })
    }
})

// Debounced autosave to localStorage
const handleInput = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, text.value)
        }
    }, DEBOUNCE_MS)
}
</script>
