async function createFile(path: string, content = '') {
    await $fetch(`/api/files/${path as ':path'}`, {
        method: 'POST',
        body: { content },
    })
}

async function createFolder(path: string) {
    await $fetch(`/api/folders/${path as '**:path'}`, {
        method: 'POST',
    })
}

async function renameFile(path: string, newName: string) {
    await $fetch(`/api/files/${path as ':path'}`, {
        method: 'PATCH',
        body: { newName },
    })
}

async function renameFolder(path: string, newName: string) {
    await $fetch(`/api/folders/${path as '**:path'}`, {
        method: 'PATCH',
        body: { newName },
    })
}

async function deleteFile(path: string) {
    await $fetch(`/api/files/${path as ':path'}`, {
        method: 'DELETE',
    })
}

async function deleteFolder(path: string) {
    await $fetch(`/api/folders/${path as '**:path'}`, {
        method: 'DELETE',
    })
}

export function useFileSystemCrud() {
    return {
        createFile,
        createFolder,
        renameFile,
        renameFolder,
        deleteFile,
        deleteFolder,
    }
}
