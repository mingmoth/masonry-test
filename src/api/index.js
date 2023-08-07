import axios from 'axios';
export const imgsPerFetch = 10;
export const fetchUrl = 'https://picsum.photos/v2/list';

export default async function getImages (page = 1) {
    const response = await axios.get(`${fetchUrl}?page=${page}&limit=${imgsPerFetch}`);
    console.log('repsonse', response);
}
