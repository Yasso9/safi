import { listDirectory } from '~~/server/utils/workspace'
import type { FolderResponse } from '~~/shared/types/api'

export default defineEventHandler(async (): Promise<FolderResponse> => {
    const path = ''

    const { files, directories } = await listDirectory(path)

    return {
        type: 'folder',
        files,
        directories,
        currentPath: path,
    }
})
