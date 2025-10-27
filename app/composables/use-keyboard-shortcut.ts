export interface KeyboardShortcutOptions {
    key: string
    ctrl?: boolean
    alt?: boolean
    shift?: boolean
    meta?: boolean
}

export function useKeyboardShortcut(
    options: KeyboardShortcutOptions,
    callback: () => void,
) {
    const handler = (event: KeyboardEvent) => {
        const matchesKey = event.key.toLowerCase() === options.key.toLowerCase()
        const matchesCtrl = options.ctrl ? event.ctrlKey : !event.ctrlKey
        const matchesAlt = options.alt ? event.altKey : !event.altKey
        const matchesShift = options.shift ? event.shiftKey : !event.shiftKey
        const matchesMeta = options.meta ? event.metaKey : !event.metaKey

        if (
            matchesKey
            && matchesCtrl
            && matchesAlt
            && matchesShift
            && matchesMeta
        ) {
            event.preventDefault()
            callback()
        }
    }

    onMounted(() => {
        globalThis.addEventListener('keydown', handler)
    })

    onUnmounted(() => {
        globalThis.removeEventListener('keydown', handler)
    })
}
