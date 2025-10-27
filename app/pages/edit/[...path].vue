<script setup lang="ts">
import Explorer from '~/components/explorer.vue'
import FileEditor from '~/components/file-editor.vue'

const route = useRoute()
const filePath = computed(() => {
    const pathParam = route.params.path
    const path = Array.isArray(pathParam) ? pathParam.join('/') : pathParam
    return path ?? ''
})

const { data: entry } = await useFetch(() => `/api/entry/${filePath.value}`)

function handleFolderClick(path: string) {
    navigateTo(`/edit/${path}`)
}
function handleFileClick(path: string) {
    navigateTo(`/edit/${path}`)
}
</script>

<template>
    <Explorer
        v-if="entry?.type === 'folder'"
        :folder="entry"
        @folder-click="handleFolderClick"
        @file-click="handleFileClick"
    />
    <FileEditor
        v-else-if="entry?.type === 'file'"
        :file="entry"
    />
</template>
