export async function useEntry(path: ComputedRef<string>) {
    const { data } = await useFetch(() => `/api/entry/${path.value}`)

    const entry = computed(() => data.value)

    return {
        entry,
    }
}
