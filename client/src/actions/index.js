import axios from 'axios';

export function getBooks(
    // default action if none specified 
    limit = 10,
    start = 0,
    order = 'asc'
){
    //AXIOS Promise based HTTP client for the browser //${order} - url parameters 
    const request = axios.get(`/api/books?limit=${limit}&skip=${start}&order=${order}`)
    // THEN - from promise library 
                    .then(response => response.data)

    return {
        type:'GET_BOOKS',
        payload:request
    }
}
