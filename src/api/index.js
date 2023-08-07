import axios from 'axios';
export const imgsPerFetch = 10;
export const fetchUrl = 'https://picsum.photos/v2/list';

export default async function getImages (page = 3) {
    try {
        const response = await axios.get(`${fetchUrl}?page=${page}&limit=${imgsPerFetch}`);
        if (response.status !== 200 || !Array.isArray(response.data)) {
            throw new Error('Can not fetch images');
        }
        await sleep(2000);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

function sleep (delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
