# Vue 3 Best Practices

Collection of patterns and practices for Vue 3 development with Composition API.

## Composition API Patterns

### Use Composables for Reusable Logic
```typescript
// composables/useCounter.ts
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, increment, decrement }
}
```

### Prefer `<script setup>`
More concise, better TypeScript inference, and less boilerplate:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello')
</script>
```

## TypeScript Integration

### Type Your Props
```typescript
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
```

### Type Your Emits
```typescript
const emit = defineEmits<{
  update: [value: string]
  close: []
}>()
```

## Performance Tips

1. **Use `v-once` for static content**
2. **Lazy load components with `defineAsyncComponent`**
3. **Use `v-memo` for expensive lists**
4. **Keep computed properties pure**

## State Management

For simple apps, use:
- `provide/inject` for component trees
- Composables for shared state
- Pinia for complex state

Avoid Vuex in new projects.

## Component Design

### Single Responsibility
Each component should do one thing well.

### Props Down, Events Up
```vue
<!-- Parent -->
<ChildComponent
  :data="items"
  @update="handleUpdate"
/>
```

### Use Slots for Flexibility
```vue
<template>
  <div class="card">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>
```

## Common Pitfalls

- ❌ Mutating props directly
- ❌ Using `reactive()` for primitives (use `ref()`)
- ❌ Forgetting `.value` in script
- ❌ Overusing watchers (prefer computed)

## Resources
- [Vue 3 Docs](https://vuejs.org/)
- [VueUse](https://vueuse.org/) - composition utilities
- [Pinia](https://pinia.vuejs.org/) - state management

---
Tags: #vue #javascript #web-dev #best-practices
