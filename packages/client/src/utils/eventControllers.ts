export type ClickHandlerProps = {
    event: MouseEvent;
    callback?: Function | null;
    stopPropagation?: boolean;
}

export const clickHandler = ({ event, callback = null, stopPropagation = false }: ClickHandlerProps): void => {
    try {
        event?.preventDefault();
        stopPropagation && event?.stopPropagation();
        callback?.();

    } catch (error) {
        console.error('There was an error handling the click event: ', error);
    }
}


export type KeyHandlerProps = {
    event: KeyboardEvent;
    keyToWatch: string;
    callback?: Function | null;
    stopPropagation?: boolean;
    direction?: 'up' | 'down';
}

export const keyHandler = ({ event, keyToWatch, callback = null, stopPropagation = false, direction = 'down' }: KeyHandlerProps): void => {
    try {
        if (event?.key === keyToWatch && event?.type === `key${direction}`) {
            event?.preventDefault();
            stopPropagation && event?.stopPropagation?.();
            callback?.();
        }

    } catch (error) {
        console.error('There was an error handling the key event: ', error);
    }
}
