import type { ShortcutOptions } from '~/composables/use-shortcuts'

export function getKeyDisplay(shortcut: ShortcutOptions): string[] {
    const keys: string[] = []
    const isMac = navigator.userAgent.toLowerCase().includes('mac')

    if (shortcut.ctrl) {
        keys.push(isMac ? '⌘' : 'Ctrl')
    }
    if (shortcut.alt) {
        keys.push('Alt')
    }
    if (shortcut.shift) {
        keys.push('Shift')
    }
    keys.push(shortcut.key.toUpperCase())

    return keys
}
