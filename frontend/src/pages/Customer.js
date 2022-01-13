import { useState, useEffect } from 'react'; 
import LeafletMap from '../components/LeafletMap.js';
import Header from '../components/Header.js';
import axios from '../commons/axios';
import "antd/dist/antd.css"; 
import './App.css';
/**
 * This function allows customers to order and view vendors on the map
 */
export default function Customer(props) {
    // Set up basic information
    const [customerID, setCustomerID] = useState('');
    const [snacks, setSnacks] = useState([]);

    // Get basic information when render this page
    useEffect(() => {
        if(props.location.state.customer) {
            setCustomerID(props.location.state.customer.id)
        } 
        axios.get('/customer/menu').then(response => {
            setSnacks(response.data.snacks)   
        })

    }, [props.location.state.customer, 
        props.location.state.position, 
        props.location.state.vendors] );
    
    // Show the map and let customers know where they are
    return (
        <div align="center">
            <Header id={customerID} customer={props.location.state.customer}/>
            <LeafletMap className = 'map'
                customer={props.location.state.customer}
                vendors={props.location.state.vendors}
                center={props.location.state.position}
                snacks={snacks}  
            />
        </div>
    )
}

