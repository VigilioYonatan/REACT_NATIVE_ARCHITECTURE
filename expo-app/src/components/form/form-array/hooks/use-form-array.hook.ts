import { useSignal } from "@preact/signals-react";

export function useFormArray(props: any) {
    return {
        savedSearches: useSignal<any[]>([]),
        showSuggestions: useSignal(false),
        handleSelectSuggestion: (item: any) => {},
        handleRemoveItem: (id: any) => {},
        err: {} as { message?: string, [key: string]: any },
        isFocused: useSignal(false),
        data: [],
        valueFormated: []
    };
}
