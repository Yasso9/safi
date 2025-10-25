import type { FolderResponse } from '~~/shared/types/api'

export default defineEventHandler(async (): Promise<FolderResponse> => {
    return await $fetch(`/api/folders/`)
})
