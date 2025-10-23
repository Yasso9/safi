import { syntaxHighlighting } from '@codemirror/language'
import { clouds } from 'thememirror'

import { markdownStyles } from './bold-headings'

export const themeExtension = [clouds, syntaxHighlighting(markdownStyles)]

// Previous custom theming (commented out for future reference):
// import { syntaxHighlighting } from '@codemirror/language'
// import { baseViewTheme } from './base-view-theme'
// import { markdownHighlightStyle } from './markdown-highlight-style'
// import { highlightStyle, viewTheme } from './theme'
//
// export const themeExtension = [
//     baseViewTheme,
//     viewTheme,
//     syntaxHighlighting(highlightStyle),
//     syntaxHighlighting(markdownHighlightStyle),
// ]
