import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home/home'; 
import BookView from './components/Books';
import Layout from './hoc/layout';
import Login from './containers/Admin/login'; 

//switch - acts accordingly to which ever route is requested 
const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
                <Route path="/books/:id" exact component={BookView} />
            </Switch>
        </Layout>
    );
};

export default Routes;