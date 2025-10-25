import { baseExtensions } from './base-extensions'
import { headingOutdentExtension } from './heading-outdent'
import { keymapsExtension } from './keymap'
import { liveMarkers } from './live-markers'
import { markdownExtension } from './markdown'
import { createPlaceholder } from './placeholder'
import { focusModeExtension } from './focus-mode'
import { noSpell } from './spellcheck'
import { usePreferredDark } from '@vueuse/core'
import { darkTheme, lightTheme } from '~/lib/editor/theme/theme-extension'

export interface UseExtensionsOptions {
    /** @default undefined */
    placeholder?: string
    /** @default false */
    enableLiveMarkers?: boolean
    /** @default true */
    enableFocusMode?: boolean
}

export function useExtensions(options: UseExtensionsOptions = {}) {
    const {
        placeholder,
        enableLiveMarkers = false,
        enableFocusMode = true,
    } = options

    const extensions = [
        baseExtensions,
        keymapsExtension,
        markdownExtension,

        // Extra
        noSpell,
        headingOutdentExtension,
    ]

    if (enableLiveMarkers) {
        extensions.push(...liveMarkers)
    }

    if (enableFocusMode) {
        extensions.push(...focusModeExtension)
    }

    if (placeholder) {
        extensions.push(createPlaceholder(placeholder))
    }

    const isDark = usePreferredDark()

    return computed(() => [
        ...extensions,
        ...(isDark.value ? darkTheme : lightTheme),
    ])
}
