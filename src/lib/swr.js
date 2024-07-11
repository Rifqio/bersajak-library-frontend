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

export const usePost = (url, body, config = {}) => {
    const postData = async () => {
      const response = await fetch(`http://localhost:3000/api/${url}`, {
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