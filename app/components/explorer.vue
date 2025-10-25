<script setup lang="ts">
import type { FolderResponse } from '~~/shared/types/api'

interface FileExplorerProps {
    path?: string
}

const props = withDefaults(defineProps<FileExplorerProps>(), {
    path: '',
})

const emit = defineEmits<{
    folderClick: [path: string]
    fileClick: [path: string]
}>()

const { data, error, status } = await useFetch<FolderResponse>(
    () => `/api/folders/${props.path}`,
    {
        key: `folders-${props.path}`,
        watch: [() => props.path],
    },
)

const sortedDirectories = computed(() =>
    (data.value?.directories ?? []).toSorted((a, b) =>
        a.name.localeCompare(b.name),
    ),
)

const sortedFiles = computed(() =>
    (data.value?.files ?? []).toSorted((a, b) => a.name.localeCompare(b.name)),
)

const isLoading = computed(() => status.value === 'pending')
</script>

<template>
    <div class="flex min-h-screen flex-col font-mono">
        <div
            v-if="isLoading"
            class="flex items-center justify-center py-12 text-zinc-400 dark:text-zinc-600"
        >
            Loading...
        </div>

        <div
            v-else-if="error"
            class="flex items-center justify-center py-12 text-red-500 dark:text-red-400"
        >
            Failed to load directory
        </div>

        <div
            v-else-if="
                sortedDirectories.length === 0 && sortedFiles.length === 0
            "
            class="flex items-center justify-center py-12 text-zinc-400 dark:text-zinc-600"
        >
            Empty directory
        </div>

        <div
            v-else
            class="divide-y divide-zinc-200 dark:divide-zinc-800"
        >
            <button
                v-for="directory in sortedDirectories"
                :key="directory.path"
                type="button"
                class="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-900 dark:active:bg-zinc-800"
                @click="emit('folderClick', directory.path)"
            >
                <span class="text-xl">📁</span>
                <span class="flex-1 text-zinc-900 dark:text-zinc-100">{{
                    directory.name
                }}</span>
            </button>

            <button
                v-for="file in sortedFiles"
                :key="file.path"
                type="button"
                class="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-900 dark:active:bg-zinc-800"
                @click="emit('fileClick', file.path)"
            >
                <span class="text-xl">📄</span>
                <span class="flex-1 text-zinc-900 dark:text-zinc-100">{{
                    file.name
                }}</span>
            </button>
        </div>
    </div>
</template>
