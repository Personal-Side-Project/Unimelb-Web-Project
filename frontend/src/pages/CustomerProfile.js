import React, { useState } from 'react'
import { Modal, Form } from 'react-bootstrap';
import Header from '../components/Header.js';
import axios from '../commons/axios';
import { message } from 'antd';
/**
 * This function allows customers to update personal information
 */
export default function CustomerProfile(props) {

    // Handle modal visibility
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        if (e.target.outerText === "Change Name") {
            setModal('name')
        } else {
            setModal('password')
        }
        setShow(true);
    };

    // Set up updated personal information   
    const passwordCheck = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})"); // Check if password is valid 
    const [checkPassword, setCheckPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [givenName, setGivenName] = useState('');

    // Submit name and password update
    const submitName = () => {
        if (givenName !== '' && familyName !== '') {
            axios.post('/customer/' + props.location.state.customer.id + '/nameUpdate', { "givenName": givenName, "familyName": familyName }).then(response => {
                if (response.data.success) {
                    message.success("customer detail updated success")
                } else {
                    message.error(response.data.error)
                }
            })
        } else { message.error("Name can not be enpty!") }
    }
    const submitPassword = () => {
        // Check if first password input is identical to the second input, and the validity of the new password
        if (newPassword === checkPassword && passwordCheck.test(newPassword)) {
            axios.post('/customer/' + props.location.state.customer.id + '/passwordUpdate', { "password": newPassword }).then(response => {
                if (response.data.success) {
                    message.success("customer detail updated success")
                } else {
                    message.error(response.data.error)
                }
            })
        } else { message.error("Password is not identical or not valid! ") }
    }

    // Models for change name and password
    const changeName = (
        <>
            <Modal.Header className="popup" closeButton><Modal.Title>Change Name</Modal.Title></Modal.Header>

            <Modal.Body className="second_body">
                <Form>
                    <Form.Group controlId="formPlaintext">
                        <Form.Label>New Given Name</Form.Label>
                        <Form.Control type="text" placeholder="Given Name" onChange={e => setGivenName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formPlaintext">
                        <Form.Label>New Family Name</Form.Label>
                        <Form.Control type="text" placeholder="Family Name" onChange={e => setFamilyName(e.target.value)} />
                    </Form.Group>
                </Form>

                <button className='second_button' onClick={() => { submitName(); handleClose() }}> Confirm </button>
            </Modal.Body>
        </>
    )
    const changePassword = (
        <>
            <Modal.Header className="popup" closeButton><Modal.Title>Change Password</Modal.Title></Modal.Header>

            <Modal.Body className="second_body">
                <Form>
                    <Form.Group controlId='formBasicEmail'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type='text' placeholder='new password' onChange={e => setNewPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId='formBasicPassword'>
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" placeholder="new password" onChange={e => setCheckPassword(e.target.value)} />
                    </Form.Group>
                </Form>

                <button className='second_button' onClick={() => { submitPassword(); handleClose() }}> Confirm </button>
            </Modal.Body>
        </>
    )

    return (
        <>
            <Header />
            <div className="center">
                <p className='third_body'> Given Name </p>
                <p className='body'> {props.location.state.customer.givenName}  </p>
                <p className='third_body'> Family Name </p>
                <p className='body'> {props.location.state.customer.familyName} </p>
                <p className='third_body'> Your Email </p>
                <p className='body'> {props.location.state.customer.email} </p>
                <p className="center">
                    <button className='second_button' onClick={handleShow}>Change Name</button>
                    <button className='second_button' onClick={handleShow}>Change Password</button>
                </p>
                <Modal show={show} onHide={handleClose}> {(modal === "name") ? changeName : changePassword} </Modal>
            </div>
        </>
    )
}
