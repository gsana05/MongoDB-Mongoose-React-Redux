import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home/home'; 
import BookView from './components/Books';
import Layout from './hoc/layout';
import Login from './containers/Admin/login'; 
import User from './components/Admin';

import Auth from './hoc/auth';

//switch - acts accordingly to which ever route is requested 
const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Auth (Home, null)} />
                <Route path="/login" exact component={Auth (Login, false)} />
                <Route path="/user" exact component={Auth(User,true)}/>
                <Route path="/books/:id" exact component={Auth (BookView)} />
            </Switch>
        </Layout>
    );
};

export default Routes;