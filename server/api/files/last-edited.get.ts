import type { FileResponse } from '~~/shared/types/api'
import { readFile } from 'node:fs/promises'
import { listDirectory, resolveFilePath } from '~~/server/utils/workspace'

export default defineEventHandler(
    async (event): Promise<FileResponse | undefined> => {
        const query = getQuery(event)
        const pathParam = query.path as string | undefined

        if (pathParam) {
            const absolutePath = resolveFilePath(pathParam)
            const content = await readFile(absolutePath, 'utf8')
            return {
                type: 'file',
                content,
                path: pathParam,
            }
        }

        const { files } = await listDirectory('')

        if (files.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'No markdown files found in workspace',
            })
        }

        const [firstFile] = files
        if (firstFile === undefined) {
            return
        }

        const absolutePath = resolveFilePath(firstFile.path)
        const content = await readFile(absolutePath, 'utf8')

        return {
            type: 'file',
            content,
            path: firstFile.path,
        }
    },
)
