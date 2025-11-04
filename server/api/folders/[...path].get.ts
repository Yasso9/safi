import { decodeRouterParam, listDirectory } from '~~/server/utils/workspace'
import type { FolderResponse } from '~~/shared/types/api'

export default defineEventHandler(async (event): Promise<FolderResponse> => {
    const path = decodeRouterParam(event, 'path')

    const { files, directories } = await listDirectory(path)

    return {
        type: 'folder',
        files,
        directories,
        currentPath: path,
    }
})
