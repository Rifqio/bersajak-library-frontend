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

export const usePost = (url, body, config = {}) => {
    const postData = async () => {
      const response = await fetch(`https://api.bersajak.com/api/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        ...config,
      });
      return response.json();
    };
  
    return useSwr(url, postData, config);
  };