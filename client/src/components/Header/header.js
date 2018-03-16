import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import Nav from './Sidenav/sidenav';

class Header extends Component {

    state = {
        //tells sidenav to be hidden // defualt state 
        showNav:false
    }
    
    // toggles state of sidenav = show and hide 
    onHideNav = () => {
        this.setState({showNav:false})
    }


    render() {
        return (
            <header>
                <div className="open_nav">
                    <FontAwesome name="bars"
                        onClick={()=> this.setState({showNav:true})}
                        style={{
                            color:'#ffffff',
                            padding:'10px',
                            cursor:'pointer'
                        }}
                    />
                </div>
                <Nav
                    showNav={this.state.showNav}
                    onHideNav={()=>this.onHideNav()}
                />

                <Link to="/" className="logo">
                        The Book Shelf
                </Link>
       
            </header>
        );
    }
}

export default Header;