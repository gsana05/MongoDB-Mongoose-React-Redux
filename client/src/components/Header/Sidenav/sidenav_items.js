import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
//import { connect } from 'react-redux';

const SidenavItems = ({user}) => {

    const items = [
        {
            type:'navItem', //type - is the class of the element
            icon:'home', //react-fontawesome 
            text:'Home', // what text the nav displays 
            link:'/', // the link url 
            restricted:false //allows or refuses access to the url depending on user 
        },
        {
            type:'navItem',
            icon:'file-text-o',
            text:'My Profile',
            link:'/user',
            restricted:true
        },
        {
            type:'navItem',
            icon:'file-text-o',
            text:'Add Admins',
            link:'/user/register',
            restricted:true
        },
        {
            type:'navItem',
            icon:'file-text-o',
            text:'Login',
            link:'/login',
            restricted:false,
            exclude:true
        },
        {
            type:'navItem',
            icon:'file-text-o',
            text:'My reviews',
            link:'/user/user-reviews',
            restricted:true
        },
        {
            type:'navItem',
            icon:'file-text-o',
            text:'Add reviews',
            link:'/user/add',
            restricted:true
        },
        {
            type:'navItem',
            icon:'file-text-o',
            text:'Logout',
            link:'/user/logout',
            restricted:true
        }
    ]

    // RENDERS THE UNIQUE URL 
    //key - renders the item with that unique key - otherwise it renders the whole page 
    // i - represents the unique iteration number 
    const element = (item,i) => (
        <div key={i} className={item.type}>
            <Link to={item.link}>
                <FontAwesome name={item.icon}/>
                {item.text}
            </Link>
        </div>
    )

    //loops through the items by using the method MAP
    const showItems = () => (
            items.map((item,i)=>{
                return element(item,i)
                   
                })
            )

    return (
        <div>
            {showItems()}
        </div>
    );
};


export default SidenavItems;