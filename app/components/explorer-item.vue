<script setup lang="ts">
import { Icon } from '#components'

interface ExplorerItemProps {
    icon?: string
}

defineProps<ExplorerItemProps>()
defineSlots<{
    default: []
}>()
</script>

<template>
    <li
        role="button"
        tabindex="0"
        class="flex w-full items-center gap-3 px-5 py-3 text-left text-zinc-900 transition-colors select-none hover:bg-zinc-50 focus:bg-zinc-100 focus:inset-ring-2 focus:outline-none active:bg-zinc-100 dark:text-zinc-100 dark:inset-ring-zinc-200 dark:hover:bg-zinc-900 dark:focus:bg-zinc-800 dark:active:bg-zinc-800"
    >
        <Icon
            v-if="icon"
            :name="icon"
            class="text-xl"
        />
        <span class="flex-1">
            <slot />
        </span>
    </li>
</template>
