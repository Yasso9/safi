<script setup lang="ts">
import ShortcutsDialog from '~/components/shortcuts-dialog.vue'
import { useShortcut } from '~/composables/use-shortcuts'

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
