import { useState, useEffect } from 'preact/hooks';

export function useMountedState(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted;
}
