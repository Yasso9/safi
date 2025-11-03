<script setup lang="ts">
import ShortcutsDialog from '~/components/shortcuts-dialog.vue'
import { useShortcut } from '~/composables/use-shortcuts'

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - Safi` : 'Safi'
    },
    htmlAttrs: {
        lang: 'en',
    },
    link: [
        {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/favicon.svg',
        },
    ],
})

const isShortcutsOpen = useState('isShortcutsOpen', () => false)

useShortcut('show-shortcuts', () => {
    isShortcutsOpen.value = !isShortcutsOpen.value
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>

    <ShortcutsDialog v-model:open="isShortcutsOpen" />
</template>
