import { themeExtension } from '~/lib/editor/theme/theme-extension'
import { baseExtensions } from './base-extensions'
import { keymapsExtension } from './keymap'
import { liveMarkers } from './live-markers'
import { markdownExtension } from './markdown'
import { createPlaceholder } from './placeholder'
import { noSpell } from './spellcheck'

export function useExtensions(placeholder?: string) {
    const extensions = [
        baseExtensions,
        keymapsExtension,
        markdownExtension,
        themeExtension,

        // Extra
        noSpell,
        liveMarkers,
    ]

    // Add placeholder if provided
    if (placeholder) {
        extensions.push(createPlaceholder(placeholder))
    }

    return extensions
}
