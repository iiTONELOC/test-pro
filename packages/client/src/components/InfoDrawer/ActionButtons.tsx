import { JSX } from 'preact/jsx-runtime';

export function ActionButtons(): JSX.Element {
    return (
        <div>
            <button>Save</button>
            <button>Cancel</button>
        </div>
    );
}