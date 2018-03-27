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
                            // DATA - represents data from MONGOOSE/MONGODB
                            return[...list,...response.data]
                        } else {
                            // returns nothing other than the books already loaded, as there are no more to load 
                            // if on the books are already on UI 
                            // DATA - represents data from MONGOOSE/MONGODB
                            return response.data
                        }
                    }
                )

    return {
        type:'GET_BOOKS',
        payload:request
    }
}

export function getBookWithReviewer(id) {
    const request = axios.get(`/api/getBook?id=${id}`)

//using redux-thunk
    return (dispatch) => {
        request.then(({data}) => {
            let book = data;
            //console.log(book)

            axios.get(`/api/getReviewer?id=${book.ownerId}`)
            .then(({data}) => {
                let response = {
                    book,
                    reviewer: data
                }
                //console.log(response)
                dispatch({
                    type: 'GET_BOOK_W_REVIEWER',
                    payload: response
                })
            })
        })
    }
}

export function clearBookWithReviewer(){
    return {
        type:'CLEAR_BOOK_W_REVIEWER',
        payload:{
            book:{},
            reviewer:{}
        }
    }
}

export function addBook(book){
    const request = axios.post('/api/book',book)
        .then(response => response.data);

    return {
        type:'ADD_BOOK',
        payload:request
    }
}

export function clearNewBook() {
    return {
        type:'CLEAR_NEWBOOK',
        payload:{}
    }
}

/*==================== USER ======================*/

export function loginUser({email, password}) {

    //links up server.backend with front end 
    const request = axios.post('/api/login', {email, password})
        .then(response => response.data)

    return {
        type: 'USER_LOGIN',
        payload: request
    }
}

export function auth(){
    const request = axios.get('/api/auth')
                .then(response => response.data);

    return {
        type:'USER_AUTH',
        payload:request
    }

}