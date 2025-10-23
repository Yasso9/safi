import { placeholder } from '@codemirror/view'

export function createPlaceholder(
    text = 'Start typing your note here...',
) {
    return placeholder(text)
}
