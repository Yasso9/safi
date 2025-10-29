export default defineEventHandler(() => {
    const workspacePath = getWorkspacePath()

    return {
        path: workspacePath,
    }
})
