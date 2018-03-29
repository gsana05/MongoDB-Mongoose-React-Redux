// REDUCERS -  piece of data we want to save in our application 

export default function(state={},action){
    //switch statement - checks for conditions and acts accordingly // a better way to do if and else
    switch(action.type){
        case 'GET_BOOKS':
        //return previous state [...state] inside [list] where [action.payload] shows the books 
            return {...state, list: action.payload}
        case 'GET_BOOK':
            return {...state, book:action.payload}
        case 'GET_BOOK_W_REVIEWER':
            return {
                ...state,
                book:action.payload.book,
                reviewer:action.payload.reviewer
            }
        case 'CLEAR_BOOK_W_REVIEWER':
            return {
                    ...state, 
                    book: action.payload.book,
                    reviewer: action.payload.reviewer
                }
        case 'ADD_BOOK':
            return {...state,newbook: action.payload}
        case 'CLEAR_NEWBOOK':
            return {...state,newbook:action.payload}
        case 'UPDATE_BOOK':
            return {...state,
                 updateBook: action.payload.success,
                 book: action.payload.doc
                }
        case 'DELETE_BOOK':
            return {
                ...state,
                postDeleted: action.payload
            }
        case 'CLEAR_BOOK':
            return {
                ...state,
                updateBook:action.payload.updateBook,
                book:action.payload.book,
                postDeleted:action.payload.postDeleted
            }
        default:
            return state;
    }
}

