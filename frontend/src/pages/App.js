import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; import './App.css';
import { Modal, Form} from 'react-bootstrap';
import { message, Typography } from 'antd';
import axios from '../commons/axios.js'; 
const { Link } = Typography; // Make links
/**
 * The frontend app function that runs main page handling login and register needs
 */
export default function App(props) {  
    // Set up pop up window based on target
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const handleShow = (e) => {
        if(e.target.outerText === "Customer") {
            setModal('customer')
        } else {
            setModal('vendor')
        }
        setShow(true);
    };

    // Set up all required information
    const [password, setPassword] = useState('');
    const [vendors, setVendors] = useState([]); 
    const [modal, setModal] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    
    // Set up Vendors and Get Location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLng(position.coords.longitude)   
            setLat(position.coords.latitude)       
        });
        axios.get('/vendor?lat=' + lat + '&lng=' + lng).then(response => {
            setVendors(response.data.vendors)
        })   
    }, [lat, lng])

    // Login and go to customer page 
    const loginCustomer = () => {
        axios.post('/customer/login', { email: email, password: password }).then(response =>{
            if (response.data.success) {
                props.history.push('/customer', {
                    customer: response.data.customer,
                    vendors: vendors,
                    position: [lat, lng]
                });
            } else {
                message.error(response.data.error)
            }
        }).catch(error => {
            setShow(false)
            message.error("Wrong account!")

        })
    }
    
    // Login and go to vendor page 
    const loginVendor = () => {
        axios.post('/vendor/login', { vendorName: name, password: password }).then(response =>{
            if (response.data.success) {
                message.success('Logged in successfully!')
                props.history.push('/vendor', {
                    vendor: response.data.vendor,
                    position: [lat, lng],
                    vendors: []
                });
            } else {
                message.error(response.data.error)
            }
          }).catch(error => {
              setShow(false)
              console.log(error)
              message.error("Wrong account!")
        })
    }
    
    // Ignore login to customer page for browsing menu
    const skipping = () => { props.history.push('/customer', { position: [lat, lng], vendors: vendors }); }

    // Register pages
    const registerCustomer = () => { props.history.push('/register', { target: "customer", }); }
    const registerVendor = () => { props.history.push('/register', { target: "vendor", }); }

    // Modals for cuatomer and vendor logining and registering
    const customerModal = (
        <>
            <Modal.Header className="popup" closeButton> <Modal.Title> Customer Login </Modal.Title> </Modal.Header>

            <Modal.Body className="second_body">
                <Form >
                    <Form.Group controlId='formBasicEmail'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Text> Your email is under high security protection </Form.Text>
                        <Form.Control type='email' onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Text> Enter your password </Form.Text>
                        <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                </Form>
                <Link onClick={skipping}> Skip To See Menu </Link>
            </Modal.Body>

            <Modal.Footer>
                <button className = 'second_button' onClick={loginCustomer}> Login </button>
                <button className = 'first_button' onClick={registerCustomer}> Register </button>
            </Modal.Footer>
        </>
    )
    const vendorModal = (
        <>
            <Modal.Header className="popup" closeButton> <Modal.Title> Vendor Login </Modal.Title> </Modal.Header>

            <Modal.Body className="second_body">
                <Form >
                    <Form.Group controlId='formBasicEmail'>
                        <Form.Label>Name</Form.Label>
                        <Form.Text> Enter your vendor name </Form.Text>
                        <Form.Control type='email' onChange={e => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Text> Enter your password </Form.Text>
                        <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                  </Form>
            </Modal.Body>

            <Modal.Footer>
                <button className = 'second_button' onClick={loginVendor}> Login </button>
                <button className = 'first_button' onClick={registerVendor}> Register </button>
            </Modal.Footer>
        </>
    )

    return (
        <div className="center" >
            <Modal show={show} onHide={handleClose}> {(modal === "customer") ? customerModal : vendorModal} </Modal>
            <h1 className = 'header'> Welcome to Snacks In A Van</h1>
            <p className = 'body'> Snacks In A Van runs a fleet of food trucks that work as popup cafes in Melbourne, Australia. </p> 
            <p className = 'body'> Are you a:</p>
            <p>
                <button className = 'second_button' onClick={handleShow}>Customer</button>
                <button className = 'second_button' onClick={handleShow}>Vendor</button>
            </p>
        </div>
  )
}