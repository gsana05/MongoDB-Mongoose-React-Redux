import axios from 'axios';

export function getBooks(
    // default action if none specified 
    limit = 10,
    start = 0,
    order = 'asc',
    list = ''
){
    //AXIOS Promise based HTTP client for the browser //${order} - url parameters 
    const request = axios.get(`/api/books?limit=${limit}&skip=${start}&order=${order}`)
    // THEN - from promise library 
    // waiting for book list from home_container
                    .then(response => {
                        if(list){
                            // returns the previous loaded book list (list) plus one new book to the list (response.data)
                            return[...list,...response.data]
                        } else {
                            // returns nothing other than the books already loaded, as there are no more to load 
                            // if on the books are already on UI 
                            return response.data 
                        }
                    }
                )

    return {
        type:'GET_BOOKS',
        payload:request
    }
}
