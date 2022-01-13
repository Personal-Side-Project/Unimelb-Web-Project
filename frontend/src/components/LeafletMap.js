import React, {useState, useMemo} from 'react';
import { MapContainer as Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Form, Modal } from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import axios from '../commons/axios.js'
import {message} from 'antd';
import Menu from './Menu.js'
/**
 * This function mainly sets up the map for searching purpose
 */
export default function LeafletMap(props) {
    // Set up basic information
    const [position, setPosition] = useState(props.center)
    const [address, setAddress] = useState('');
    const [show, setShow]  = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let history = useHistory();
    // syschronise posisions
    const syschroniser = useMemo(
        (e) => ({
            dragend(e) {
                setPosition(e.target.getLatLng())
            }, click() { handleShow() }
        }), [],
    )
    // Set up vendors location
    const parking = () => {
        axios.post('/vendor/park/' + props.vendor.id, {
            location: [position.lat, position.lng],
            textAddress: address
        }).then(response => {
            message.success('vendor successfully parked!')
            history.push({ pathname: '/orders', state: { vendor: props.vendor } })
        })
    }
    // Show up nearest five opening vendors
    const showFiveVendors = props.vendors.map((vendor) => {
        return (
            <Menu key={vendor.id} position={vendor.location} snacks={props.snacks} vendor={vendor} customer={props.customer}/> 
        )
    })
    // Make both customers and vendor visible 
    const createCustomerMarker = ( < Marker position={props.center} iconUrl={"url"} > <Popup> Your location</Popup> </Marker>)
    const createVendorMarker = ( <Marker draggable={true} eventHandlers={syschroniser} position={position}></Marker> )
    return (
        <>
            <Modal show={show} onHide={handleClose} style={{marginTop: '2vh' }} >

                <Modal.Header className="popup" closeButton> <Modal.Title>Vendor Park</Modal.Title> </Modal.Header>

                <Modal.Body className="second_body">
                    <Form >
                        <Form.Group controlId='formBasicEmail'>
                            <Form.Label>Detailed Text Address</Form.Label>
                            <Form.Text className="text-muted"> Enter detailed address so customers can spot your location. </Form.Text>
                            <Form.Control type='text' onChange={e => setAddress(e.target.value)} />                           
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer> <button className = 'second_button' onClick={parking}> Submit </button> </Modal.Footer>
            </Modal>

            <Map center={props.center} zoom={18} scrollWheelZoom={false} style={{ height: "100vh" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
                />            
                {(history.location.pathname === "/vendor") ? createVendorMarker : <></>}
                {(history.location.pathname === "/customer") ? createCustomerMarker : <></>}
                {(history.location.pathname === "/customer") ? showFiveVendors : <></>} 
            </Map>
        </>
    )
}




