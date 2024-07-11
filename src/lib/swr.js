import { useModalErrorStore } from "@/zustand";
import useSWR from "swr";

const defaultConfig = {
    shouldRetryOnError: false,
    revalidateOnFocus: false
}

export const useSwr = (url, fetcher, config = '') => {
    const { onOpen } = useModalErrorStore();
    return useSWR(url, fetcher, {
        ...defaultConfig,
        config,
        onError: (error) => {
            console.error('Error fetching data:', error);
            onOpen('Internal Server Error', error);
        },
    });
}