import type { FileMetadata } from '~~/shared/types/api'

export default defineEventHandler(async (): Promise<FileMetadata[]> => {
    return await listAllFilesRecursive()
})
