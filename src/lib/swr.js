import useSWR from "swr";

const defaultConfig = {
    shouldRetryOnError: false,
    revalidateOnFocus: false
}

export const useSwr = (url, fetcher, config = '') => {
    return useSWR(url, fetcher, {
        ...defaultConfig,
        config,
    });
}