<script setup lang="ts">
import ManagedExplorer from '~/components/managed-explorer.vue'

const currentFolderPath = ref('')

const { data: workspace } = await useFetch('/api/workspace')
const workspacePath = computed(() => workspace.value?.path ?? '')
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center justify-start px-4 py-12"
    >
        <div class="w-full max-w-2xl">
            <div class="mb-12 text-center">
                <h1
                    class="mb-3 font-mono text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100"
                >
                    Pure Editor
                </h1>
                <p
                    class="font-mono text-sm text-zinc-600 sm:text-base dark:text-zinc-400"
                >
                    A minimalist markdown editor
                </p>
                <p
                    v-if="workspacePath"
                    class="mt-3 font-mono text-xs text-zinc-400 dark:text-zinc-600"
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
        </div>
    </div>
</template>
