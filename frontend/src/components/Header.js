import React, { useState, useEffect } from 'react';
import OrderList from './OrderList.js';
import { useHistory } from 'react-router';
import { Divider, Drawer } from 'antd';
import "antd/dist/antd.css";
import '../pages/App.css';
/**
 * Set up customer page extension functions
 */
export default function Header(props) {
    // Set up basic information
    const [drawerVisible, setDrawerVisible] = useState(false);
    const handleDrawerClose = () => setDrawerVisible(false);
    const handleDrawerShow = () => setDrawerVisible(true);
    const [customerID, setCustomerID] = useState('');
    const [buttons, setButtons] = useState([]);
    const [target, setTarget] = useState('');
    const [title, setTitle] = useState('');
    let history = useHistory();
    // Let buttons can be triggered to correct route
    useEffect(() => {
        if (history.location.pathname === "/customer" && props.customer) {
            setTitle("Welcome " + props.customer.givenName + ", choose a van!")
            setTarget('customer');
            setCustomerID(props.customer.id);
            setButtons([
                <img src="https://i.imgur.com/l1s69fW.png" className="resize" onClick={() => history.goBack()}></img>,
                <button className="second_button" key="0" onClick={() => {
                    history.push('/profile', {
                        customer: props.customer
                    });
                }}>Profile</button>,
                <button className="second_button" onClick={handleDrawerShow}>Orders</button>]
            )
        } else if (history.location.pathname === "/profile") {
            setTitle('Profile Settings')
            setButtons([<img src="https://i.imgur.com/l1s69fW.png" className="resize" onClick={() => history.goBack()}></img>])
        } else if (history.location.pathname === "/orders") {
            setTitle("Welcome " + props.vendor.vendorName + " !")
        } else {
            setTitle("Welcome!")
        }
    }, [history, props]);

    return (
        <div>
            <h1 className='second_header'> {title} </h1>
            <p> {buttons} </p>
            <Drawer className='popup' visible={drawerVisible} closable={true} onClose={handleDrawerClose} width={"60vw"}>
                All Orders
                <Divider />
                <OrderList id={customerID} target={target} />
            </Drawer>
        </div>
    )
}
