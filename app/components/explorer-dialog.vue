<script setup lang="ts">
import Explorer from '~/components/explorer.vue'
import type { FolderResponse } from '~~/shared/types/api'

const isOpen = defineModel<boolean>('open', { default: false })
const dialogEl = useTemplateRef('dialogEl')

const currentPath = ref('')
const { data: folder, refresh } = await useFetch<FolderResponse>(
    () => `/api/folders/${currentPath.value}`,
    {
        immediate: false,
    },
)

watch(isOpen, async (open) => {
    if (open) {
        await refresh()
        dialogEl.value?.showModal()
    } else {
        dialogEl.value?.close()
    }
})

function handleFolderClick(path: string) {
    currentPath.value = path
    refresh()
}

function handleFileClick(path: string) {
    isOpen.value = false
    navigateTo(`/edit/${path}`)
}

function handleClose() {
    isOpen.value = false
}
</script>

<template>
    <dialog
        ref="dialogEl"
        class="fixed inset-0 m-auto h-fit max-h-[80vh] w-full max-w-2xl rounded-lg border-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm dark:bg-zinc-900"
        closedby="any"
        @close="handleClose"
    >
        <Explorer
            v-if="folder"
            :folder="folder"
            @folder-click="handleFolderClick"
            @file-click="handleFileClick"
        />
    </dialog>
</template>
