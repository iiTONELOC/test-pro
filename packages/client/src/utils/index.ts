export function trimClasses(text: string) {
    if (!text) return ''

    return text.replace(/\s+/g, ' ').trim()
}

export const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
