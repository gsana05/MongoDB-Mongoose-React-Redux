// REDUCERS -  piece of data we want to save in our application 

export default function(state={},action){
    //switch statement - checks for conditions and acts accordingly // a better way to do if and else
    switch(action.type){
        case 'GET_BOOKS':
        //return previous state [...state] inside [list] where [action.payload] shows the books 
            return {...state, list: action.payload}
        default:
            return state;
    }
}