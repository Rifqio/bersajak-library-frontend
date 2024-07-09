import axios from "./axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const fetcherWithRange = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Range: 'bytes=0-'
            },
            responseType: 'blob'
        });

        if (response.status === 206) {
            return response.data;
        } else {
            throw new Error('Failed to fetch audio');
        }
    } catch (error) {
        console.error('Error fetching audio:', error);
        throw error;
    }
};

export { fetcher, fetcherWithRange };