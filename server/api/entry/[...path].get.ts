import type { FileResponse, FolderResponse } from '~~/shared/types/api'
import { readFile, stat } from 'node:fs/promises'
import { resolvePath } from '~~/server/utils/workspace'

export default defineEventHandler(
    async (event): Promise<FileResponse | FolderResponse> => {
        const relativePath = getRouterParam(event, 'path') ?? ''
        const absolutePath = resolvePath(relativePath)
        const stats = await stat(absolutePath)

        if (stats.isDirectory()) {
            return await $fetch(`/api/folders/${relativePath}`)
        }

        if (stats.isFile()) {
            const content = await readFile(absolutePath, 'utf8')
            return {
                type: 'file',
                content,
                path: relativePath,
            }
        }

        throw createError({
            statusCode: 400,
            message: 'Path is neither a file nor a directory',
        })
    },
)
