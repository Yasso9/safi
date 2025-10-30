<script setup lang="ts">
import ManagedExplorer from '~/components/managed-explorer.vue'
import ShortcutsDialog from '~/components/shortcuts-dialog.vue'
import { useLastEditedFile } from '~/composables/use-last-edited-file'
import { useKeyboardShortcut } from '~/composables/use-keyboard-shortcut'
import type { FileResponse } from '~~/shared/types/api'

const currentFolderPath = ref('')

const { data: workspace } = await useFetch('/api/workspace')
const workspacePath = computed(() => workspace.value?.path ?? '')

const isShortcutsOpen = ref(false)

useKeyboardShortcut(
    {
        key: 'F1',
    },
    () => {
        isShortcutsOpen.value = !isShortcutsOpen.value
    },
)

const { lastEditedFilePath } = useLastEditedFile()
const { data: lastEditedFile } = await useFetch<FileResponse>(
    '/api/files/last-edited',
    {
        // immediate: true,
        query: {
            path: lastEditedFilePath.value,
        },
        // watch: false,
    },
)

const PREVIEW_LINE_COUNT = 4

const previewLines = computed(() => {
    if (!lastEditedFile.value?.content) return []
    return lastEditedFile.value.content.split('\n').slice(0, PREVIEW_LINE_COUNT)
})

const fileName = computed(() => {
    if (!lastEditedFilePath.value) return ''
    return lastEditedFilePath.value.split('/').findLast(Boolean) || ''
})

function navigateToFile() {
    if (lastEditedFilePath.value !== undefined) {
        navigateTo(`/edit/${lastEditedFilePath.value}`)
    }
}
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center justify-start px-4 py-12"
    >
        <div class="w-full max-w-2xl">
            <div class="relative mb-12 text-center">
                <button
                    type="button"
                    class="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
                    aria-label="Show keyboard shortcuts"
                    @click="isShortcutsOpen = true"
                >
                    ?
                </button>
                <h1
                    class="mb-3 font-mono text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100"
                >
                    Pure Editor
                </h1>
                <p
                    class="font-mono text-sm text-zinc-600 sm:text-base dark:text-zinc-400"
                >
                    <span class="text-zinc-500 dark:text-zinc-500">
                        Workspace:
                    </span>
                    <span class="ml-1">{{ workspacePath }}</span>
                </p>
            </div>

            <div
                class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <ManagedExplorer v-model:folder-path="currentFolderPath" />
            </div>

            <button
                v-if="lastEditedFile"
                type="button"
                class="group relative mt-6 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                @click="navigateToFile"
            >
                <div class="transition-all duration-200 group-hover:blur-sm">
                    <div
                        class="mb-3 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                        {{ fileName }}
                    </div>
                    <div
                        class="space-y-1 font-mono text-xs text-zinc-500 dark:text-zinc-500"
                    >
                        <div
                            v-for="(line, index) in previewLines"
                            :key="index"
                            class="truncate"
                        >
                            {{ line || '\u00A0' }}
                        </div>
                    </div>
                </div>
                <div
                    class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                    <span
                        class="font-mono text-2xl font-medium text-zinc-900 dark:text-zinc-100"
                    >
                        Open
                    </span>
                </div>
            </button>
        </div>
    </div>

    <ShortcutsDialog v-model:open="isShortcutsOpen" />
</template>
