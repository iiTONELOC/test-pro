export function trimClasses(text: string) {
    if (!text) return ''

    return text.replace(/\s+/g, ' ').trim()
}
