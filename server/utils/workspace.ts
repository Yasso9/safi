import { constants } from 'node:fs'
import { access, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import type { FileMetadata, FolderMetadata } from '~~/shared/types/api'

export function getWorkspacePath(): string {
    const { workspacePath } = useRuntimeConfig()
    if (!workspacePath) {
        throw createError({
            statusCode: 500,
            statusMessage:
                'WORKSPACE_PATH environment variable is not set. Please configure it to point to your markdown files directory.',
        })
    }
    return path.resolve(workspacePath)
}

export function isWithinWorkspace(absolutePath: string): boolean {
    const workspacePath = getWorkspacePath()
    const relativePath = path.relative(workspacePath, absolutePath)

    return (
        !relativePath.startsWith('..')
        && !relativePath.startsWith('/')
        && relativePath !== ''
    )
}

export function isMarkdownFile(filePath: string): boolean {
    return path.extname(filePath).toLowerCase() === '.md'
}

export async function ensureDirectoryExists(filePath: string): Promise<void> {
    const dir = filePath.slice(0, Math.max(0, filePath.lastIndexOf('/')))
    try {
        await access(dir, constants.W_OK)
    } catch {
        await mkdir(dir, { recursive: true })
    }
}

export function resolvePath(relativePath: string): string {
    const workspacePath = getWorkspacePath()
    const normalizedPath = relativePath.replace(/^\/+/u, '')
    return path.resolve(path.join(workspacePath, normalizedPath))
}

export function resolveFilePath(relativePath: string): string {
    const absolutePath = resolvePath(relativePath)

    if (!isMarkdownFile(absolutePath)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Only .md files are allowed',
        })
    }

    return absolutePath
}

export function isHiddenFile(filename: string): boolean {
    return filename.startsWith('.')
}

export async function getFileMetadata(
    absolutePath: string,
    relativePath: string,
): Promise<FileMetadata> {
    const stats = await stat(absolutePath)
    const filename = path.basename(absolutePath)

    return {
        name: filename,
        path: relativePath,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
    }
}

export async function listDirectory(
    relativePath: string,
): Promise<{ files: FileMetadata[]; directories: FolderMetadata[] }> {
    const absolutePath = resolvePath(relativePath)
    const workspacePath = getWorkspacePath()

    try {
        await access(absolutePath, constants.R_OK)
    } catch {
        await mkdir(absolutePath, { recursive: true })
    }

    const entries = await readdir(absolutePath, { withFileTypes: true })

    const directories: FolderMetadata[] = []
    const filePromises: Promise<FileMetadata>[] = []

    for (const entry of entries) {
        if (isHiddenFile(entry.name)) {
            continue
        }

        const entryAbsolutePath = path.join(absolutePath, entry.name)
        const entryRelativePath = path.relative(
            workspacePath,
            entryAbsolutePath,
        )

        if (entry.isDirectory()) {
            directories.push({
                name: entry.name,
                path: entryRelativePath,
            })
        } else if (entry.isFile() && isMarkdownFile(entry.name)) {
            filePromises.push(
                getFileMetadata(entryAbsolutePath, entryRelativePath),
            )
        }
    }

    const files = await Promise.all(filePromises)

    return { files, directories }
}
