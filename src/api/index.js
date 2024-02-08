import axios from 'axios';
export const imgsPerFetch = 10;
export const fetchUrl = 'https://picsum.photos/v2/list';

export default async function getImages (page = 3) {
    try {
        const response = await axios.get(`${fetchUrl}?page=${page}&limit=${imgsPerFetch}`);
        if (response.status !== 200 || !Array.isArray(response.data)) {
            throw new Error('Can not fetch images');
        }
        return response.data.map((image) => {
            return {
                ...image,
                isLoading: true,
                cardtype: Math.random() < 0.5 ? 'item' : 'pure'
            };
        });
    } catch (error) {
        console.error(error);
    }
}

export function sleep (delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export function debounce (fn, delay) {
    console.log('debounce');
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

export function throttle (fn, delay) {
    console.log('throttle');
    let shouldWait = false;
    let waitingArgs;

    const timeoutFn = () => {
        if (waitingArgs === null) {
            shouldWait = false;
        } else {
            fn(...waitingArgs);
            waitingArgs = null;
            setTimeout(timeoutFn, delay);
        }
    };

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args;
            return;
        }

        fn(...args);
        shouldWait = true;
        setTimeout(timeoutFn, delay);
    };
}
