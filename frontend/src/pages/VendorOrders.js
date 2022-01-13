import React, { useState, useEffect } from 'react';
import OrderList from '../components/OrderList.js';
import Header from '../components/Header.js';
import {useHistory} from 'react-router-dom';
import axios from '../commons/axios';
import { message} from 'antd';
/**
 * This function makes vendors supervise all the orders
 */
export default function VendorOrders(props) {
    // Set up basic information
    let history = useHistory();
    const [user, setUser] = useState('');
    const [status, setStatus] = useState('');
    // Get target information when render this page
    useEffect(() => { if (window.location.pathname === '/orders') { setUser('vendor') } }, [])
    // Let vendor off duty
    const closeVendor = () => {
        axios.post('/vendor/' + props.location.state.vendor.id + '/update', {status: "closed"}).then(response =>{
            if (response.data.success){
                message.success("vendor closed!")
                history.push('/', {})
          } else {
              message.error(response.data.error)
          }
        })
    }
        
    return (
        <div>
            <Header vendor={props.location.state.vendor} />
           
            <p className="middle">
                    <button className = 'third_button' onClick={() => history.goBack()} >Update Location</button>
                    <button className = 'third_button' onClick={() => closeVendor()} > Quit </button>
            </p>
            <p className="middle">
                    <button className = 'second_button' onClick={() => setStatus('&status=outstanding')} >Outstanding</button>
                    <button className = 'second_button' onClick={() => setStatus('&status=fulfilled')} >Fulfilled</button>
                    <button className = 'second_button' onClick={() => setStatus('&status=completed')} >Completed</button>           
            </p>
            <OrderList id={props.location.state.vendor.id} target={user} status={status}/>
        </div>
    )
}
