import type { FileMetadata, FolderMetadata } from '~~/shared/types/api'

interface ClipboardState {
    item: FileMetadata | FolderMetadata
    itemType: 'document' | 'folder'
    operation: 'copy' | 'cut'
}

const clipboard = ref<ClipboardState | undefined>(undefined)

export function useClipboard() {
    function copyToClipboard(
        item: FileMetadata | FolderMetadata,
        itemType: 'document' | 'folder',
    ) {
        clipboard.value = { item, itemType, operation: 'copy' }
    }

    function cutToClipboard(
        item: FileMetadata | FolderMetadata,
        itemType: 'document' | 'folder',
    ) {
        clipboard.value = { item, itemType, operation: 'cut' }
    }

    function clearClipboard() {
        clipboard.value = undefined
    }

    function hasClipboard() {
        return clipboard.value !== undefined
    }

    return {
        clipboard: readonly(clipboard),
        copyToClipboard,
        cutToClipboard,
        clearClipboard,
        hasClipboard,
    }
}
