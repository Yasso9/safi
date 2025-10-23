import { HighlightStyle } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

export const markdownStyles = HighlightStyle.define([
    {
        tag: t.heading1,
        fontWeight: 'bold',
    },
    {
        tag: t.heading2,
        fontWeight: 'bold',
    },
    {
        tag: t.heading3,
        fontWeight: 'bold',
    },
    {
        tag: t.heading4,
        fontWeight: 'bold',
    },
    {
        tag: t.heading5,
        fontWeight: 'bold',
    },
    {
        tag: t.heading6,
        fontWeight: 'bold',
    },
    {
        tag: t.strong,
        fontWeight: 'bold',
    },
    {
        tag: t.emphasis,
        fontStyle: 'italic',
    },
    {
        tag: t.strikethrough,
        textDecoration: 'line-through',
    },
])
