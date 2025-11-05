const TOUCH_THRESHOLD = 500

export function useContextMenu<T, K extends string = string>() {
    const isOpen = ref(false)
    const x = ref(0)
    const y = ref(0)
    const selectedItem = ref<T | undefined>(undefined)
    const selectedItemType = ref<K | undefined>(undefined)

    let touchTimer: NodeJS.Timeout | undefined
    let touchStartX = 0
    let touchStartY = 0

    function handleContextMenu(event: MouseEvent, item: T, type: K) {
        event.preventDefault()
        selectedItem.value = item
        selectedItemType.value = type
        x.value = event.clientX
        y.value = event.clientY
        isOpen.value = true
    }

    function handleTouchStart(event: TouchEvent, item: T, type: K) {
        const [touch] = event.touches
        if (!touch) return

        touchStartX = touch.clientX
        touchStartY = touch.clientY

        touchTimer = setTimeout(() => {
            selectedItem.value = item
            selectedItemType.value = type
            x.value = touch.clientX
            y.value = touch.clientY
            isOpen.value = true
            touchTimer = undefined
        }, TOUCH_THRESHOLD)
    }

    function handleTouchMove(event: TouchEvent) {
        if (!touchTimer) return

        const [touch] = event.touches
        if (!touch) return

        const deltaX = Math.abs(touch.clientX - touchStartX)
        const deltaY = Math.abs(touch.clientY - touchStartY)

        if (deltaX > 10 || deltaY > 10) {
            clearTimeout(touchTimer)
            touchTimer = undefined
        }
    }

    function handleTouchEnd() {
        if (touchTimer) {
            clearTimeout(touchTimer)
            touchTimer = undefined
        }
    }

    function close() {
        isOpen.value = false
    }

    return {
        isOpen,
        x,
        y,
        selectedItem,
        selectedItemType,
        handleContextMenu,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        close,
    }
}
