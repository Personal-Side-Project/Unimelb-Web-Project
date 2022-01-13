import React, { useState, useEffect } from 'react'
import Header from '../components/Header.js';
import {useHistory} from 'react-router-dom';
import { Form, Input, message } from 'antd';
import axios from '../commons/axios';
/**
 * This function is for registering purpose
 */
export default function Registering(props) {
    // Set up basic setting
    const passwordCheck = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})"); // Check if password is valid
    const [checkPassword, setCheckPassword] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [form] = Form.useForm();
    let history = useHistory();
    // Customer and vendor information
    const [familyName, setFamilyName] = useState('');
    const [givenName, setGivenName] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState(''); 
    
    // Get the target information when render this page
    useEffect(() => { setUser(props.location.state.target) }, [props.location.state.target])

    // Submit customer register post
    const submitCustomer = () => {
        const newCustomer = {
            "givenName": givenName, "familyName": familyName, "email": email, "password": password,
        }
        if(givenName === '' || familyName === ''){
            message.error("Name can not be empty!")
        } else if (checkPassword === password && passwordCheck.test(password)) {
            axios.post("/customer/register", newCustomer).then(response =>{
                if (response.data){
                    message.success("Your account is ready! Login now to make an order!")
                    props.history.push('/', { });
                } else {
                    message.error("Register failed :(")
                }
            })
        } else { message.error("Check your information again, or make sure the confirm password is identical") }  
    }
    // Submit vendor register post
    const submitVendor = () => {
        const newVendor = {
            "vendorName": name, "password": password
        }
        axios.post("/vendor/register", newVendor).then(response =>{
            if (response.data){
                message.success("Your vendor account is ready now! Login to start your business at any time!")
                props.history.push('/', { });
            } else {
                message.error(response.data.error)
            }
        })
    }
    // Create forms to fill personal or vendor information
    const customerForm = (
        <>
            <Header/>
            <div className="body" style={{ width: "40%", margin: "auto"}}>
                <Form  form={form} layout="vertical">
                    <Form.Item label="Given Name">
                        <Input placeholder="given name" onChange={e => setGivenName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Family Name">
                        <Input placeholder="family name" onChange={e => setFamilyName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input placeholder="email" onChange={e => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input placeholder="Password" onChange={e => setPassword(e.target.value)}></Input>
                    </Form.Item>
                    <Form.Item label="Confirm Password">
                        <Input placeholder="Confirm Password" onChange={e => setCheckPassword(e.target.value)} />
                    </Form.Item>
                </Form>                     
            </div>

            <div className="align_center">
                <button className="third_button" onClick={() => history.goBack()}> 
                    Back To Main Page 
                </button>
                <button className="second_button" onClick={submitCustomer}> Confirm Registion </button>
            </div>
        </>
    )
    const vendorForm = (
        <>
            <Header/>
            <div style={{ width: "40%", margin: "auto"}}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Vendor Name">
                        <Input placeholder="name" onChange={e => setName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="OTS">
                        <Input placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    </Form.Item>
                </Form>    
            </div>

            <div className="align_center">
                <button className="third_button" onClick={() => history.goBack()}> 
                    Back To Main Page 
                </button>
                <button className="second_button" onClick={submitVendor}> Confirm Registion </button>
            </div>
        </>
    )

    return ( 
    <>
        {(user === "customer") ? customerForm : vendorForm} 
    </> 
    )
}