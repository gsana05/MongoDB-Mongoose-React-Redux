//CONTAINERS SUMMARY 
//gets data, gets component and connects them so you can display data on the UI

import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import { getBooks } from '../actions';

import BookItem from '../widgetsUI/book_item'; 

class HomeContainer extends Component {

    //componentWillMount - runs on both client and server side // fetches data // runs before rendering of app
    componentWillMount(){
        //getBooks(limit, start, order) from actions url parameters  
        //DISPATCH accepts an ACTION and dispatches the data to the store which gives it full access to the app 
        // which makes data available from getBooks function to use and display on the UI 
        this.props.dispatch(getBooks(1, 0, 'desc'))
    }
    
    //map/loops through the items and finds unique id (book) requested by user on the UI 
   renderItems = (books) => (
       books.list ?
         books.list.map(item => (
             <BookItem {...item} key={item._id}/> 
         ))
       : null
    )

    loadmore = () => {
        // adds 1 book more from the databse each time onClick 
        // counts how many books on the list
        let count = this.props.books.list.length;
        // this then passes the list as a argument to ACTION which is waiting for the list 
        this.props.dispatch(getBooks(1,count,'desc',this.props.books.list))
    }

    render(){
        //console.log(this.props)
        return (
            <div>
                {this.renderItems(this.props.books)} 
                <div className="loadmore"
                onClick={this.loadmore}
                >Load More </div> 
            </div>
        )
    }
}


//mapStateToProps - takes a piece of state specified in return and sends into component as props 
//  this allows access to books in the entire application 
// REDUCER 
function mapStateToProps(state){
    return {
        books:state.books
    }
}

//connects state/data to this file 
//mapStateToProps state (data from mongoDB) AND HomeContainer is the component
//connect lets them access eachother to display on UI 
export default connect(mapStateToProps)(HomeContainer)
