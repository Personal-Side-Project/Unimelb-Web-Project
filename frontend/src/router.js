import React from 'react'; 
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CustomerProfile from './pages/CustomerProfile.js';
import VendorOrders from './pages/VendorOrders.js';
import Registering from './pages/Registering.js';
import VendorPark from './pages/VendorPark.js';
import Customer from './pages/Customer.js';
import App from './pages/App.js';
/** 
 * This Class is to use path connect to different pages
*/
class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component ={App}></Route>
                    <Route path="/vendor" exact component ={VendorPark}></Route>
                    <Route path="/customer" exact component ={Customer}></Route>
                    <Route path="/orders" exact component ={VendorOrders}></Route>
                    <Route path="/register" exact component ={Registering}></Route>                   
                    <Route path="/profile" exact component ={CustomerProfile}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}
export default Router;