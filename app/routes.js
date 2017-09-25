/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './containers/layout/Layout';
import Home from './containers/Home';
import TemplateManagement from './Containers/templates/TemplateManagement';
import NotFound from './components/NotFound';
import Login from './containers/Login';
import MaintenanceMode from './containers/maintenance/MaintenanceModePageMessage';
import NoTenants from './containers/NoTenants';
import ErrorPage from './Containers/ErrorPage';

import {setValue,clearContext} from './actions/context';
import Auth from './utils/auth';
import Consts from './utils/consts';

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        var managerData = store.getState().manager;
        if (!Auth.isLoggedIn()) {
            console.log('User is not logged in, navigating to Login screen');
            replace('login');
        }

        if (managerData.maintenance === Consts.MAINTENANCE_ACTIVATED) {
            console.log('Manager is on maintenance mode, navigating to maintenance page');
            replace('maintenance');
        }

        callback();
    };

    let isInMaintenanceMode = (nextState, replace, callback)=>{
        var managerData = store.getState().manager;

        // This is only relevant if the user is logged in
        if (!Auth.isLoggedIn()) {
            console.log('User is not logged in, navigating to Login screen');
            replace('login');
        }

        // Only stay here if we are in maintenance mode
        if (managerData.maintenance !== Consts.MAINTENANCE_ACTIVATED) {
            console.log('Manager is NOT on maintenance mode, navigating to main page');
            replace('/');
        }

        callback();
    };

    let hasAdminRole = (nextState, replace, callback)=>{
        var managerData = store.getState().manager;

        // This is only relevant if the user is logged in
        if (!Auth.isLoggedIn()) {
            console.log('User is not logged in, navigating to Login screen');
            replace('login');
        }

        // Only stay here if we have admin role
        if (managerData.auth.role !== Consts.ROLE_ADMIN) {
            console.log('Manager has NOT an admin role, navigating to main page');
            replace('/');
        }

        callback();
    };

    let redirectToPortal = () => {
        window.location = store.getState().config.app.saml.portalUrl;
    };

    let redirectToSSO = () => {
        window.location = store.getState().config.app.saml.ssoUrl;
    };

    return (
        <Route path='/'>
            {store.getState().config.app.saml.enabled
                ?
                [
                    <Route key='loginRoute' path='login' onEnter={redirectToSSO}/>,
                    <Route key='logoutRoute' path='logout' onEnter={redirectToPortal}/>
                ]
                :
                [
                    <Route key='loginRoute' path='login' component={Login}/>,
                    <Redirect key='logoutRoute' from='logout' to='login'/>
                ]
            }
            <Route path='noTenants' component={NoTenants}/>
            <Route path='maintenance' component={MaintenanceMode} onEnter={isInMaintenanceMode}/>
            <Route component={Layout} onEnter={isLoggedIn}>
                <Route path='page/(:pageId)' component={Home}/>
                <Route path='page/(:pageId)/(:pageName)' component={Home}/>
                <Route path='template_management' component={TemplateManagement} onEnter={hasAdminRole}/>
                <Route path='404' component={NotFound}/>
                <Route path='error' component={ErrorPage}/>
                <IndexRoute component={Home}/>
                <Redirect from="*" to='404'/>
            </Route>
        </Route>
    );


};
