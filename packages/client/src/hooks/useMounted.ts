import { useState, useEffect } from 'preact/hooks';

export function useMountedState() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted;
}
