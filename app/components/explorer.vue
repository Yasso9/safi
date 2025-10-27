<script setup lang="ts">
import type { FolderResponse } from '~~/shared/types/api'

interface FileExplorerProps {
    folder: FolderResponse
}

const props = defineProps<FileExplorerProps>()
const emit = defineEmits<{
    folderClick: [path: string]
    fileClick: [path: string]
}>()

const sortedDirectories = computed(() =>
    props.folder.directories.toSorted((a, b) => a.name.localeCompare(b.name)),
)

const sortedFiles = computed(() =>
    props.folder.files.toSorted((a, b) => a.name.localeCompare(b.name)),
)

const parentPath = computed(() => {
    const segments = props.folder.currentPath.split('/').filter(Boolean)
    if (segments.length === 0) return
    segments.pop()
    return segments.length === 0 ? '' : `/${segments.join('/')}`
})

const hasParent = computed(() => parentPath.value !== undefined)
</script>

<template>
    <div class="flex min-h-screen flex-col font-mono">
        <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <button
                v-if="hasParent"
                type="button"
                class="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-900 dark:active:bg-zinc-800"
                @click="
                    parentPath !== undefined && emit('folderClick', parentPath)
                "
            >
                <span class="flex-1 text-zinc-900 dark:text-zinc-100">
                    go back
                </span>
            </button>

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
