import {
    access,
    copyFile,
    mkdir,
    readdir,
    readFile,
    writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { isHiddenFile, isMarkdownFile } from './workspace'

export async function generateUniqueName(
    dirPath: string,
    baseName: string,
): Promise<string> {
    const ext = path.extname(baseName)
    const nameWithoutExt = baseName.slice(
        0,
        Math.max(0, baseName.lastIndexOf(ext)),
    )

    let counter = 1
    let uniqueName = baseName

    while (true) {
        try {
            await access(path.join(dirPath, uniqueName))
            uniqueName = `${nameWithoutExt} (${counter})${ext}`
            counter++
        } catch {
            return uniqueName
        }
    }
}

export async function copyFileWithContent(
    sourcePath: string,
    destPath: string,
): Promise<void> {
    const content = await readFile(sourcePath, 'utf8')
    await writeFile(destPath, content, 'utf8')
}

export async function copyFolderRecursive(
    sourcePath: string,
    destPath: string,
): Promise<void> {
    await mkdir(destPath, { recursive: true })

    const entries = await readdir(sourcePath, { withFileTypes: true })

    for (const entry of entries) {
        if (isHiddenFile(entry.name)) {
            continue
        }

        const sourceEntryPath = path.join(sourcePath, entry.name)
        const destEntryPath = path.join(destPath, entry.name)

        if (entry.isDirectory()) {
            await copyFolderRecursive(sourceEntryPath, destEntryPath)
        } else if (entry.isFile() && isMarkdownFile(entry.name)) {
            await copyFile(sourceEntryPath, destEntryPath)
        }
    }
}
