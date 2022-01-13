import React, { useState } from 'react'; 
import { InputNumber, Card, message, Divider } from 'antd';
import { useHistory } from 'react-router-dom';
import image from "../icons/coffee-shop.jpg";
import { Modal } from 'react-bootstrap'; 
import axios from '../commons/axios.js';
import { Marker } from 'react-leaflet';
import {Icon} from "leaflet";
const { Meta } = Card;
/**
 * This function shows the meun page
 */
export default function Menu(props) {
    // Set up basic information
    const vendorIcon = new Icon({ iconUrl: image, iconSize: [40, 40], });
    const [modalVisible, setModalVisible] = useState(props.modalVisible);
    const [confirm, setconfirm] = useState(props.confirm);
    const handleModalClose = () => setModalVisible(false);
    const handleModalShow = () => setModalVisible(true);
    const handleConfirmClose = () => setconfirm(false);
    const handleConfirmShow = () => setconfirm(true);
    const [order, setOrder] = useState([]);
    let history = useHistory();
    // Create new list collecting orders with proper indexing
    const onChange = (index, event) => {
        let newArray = [...order];
        newArray[index] = event;
        setOrder(newArray);
    }
    // Submit the details to our database and check if there is an empty order
    const onSubmit = () => {
        if(!props.customer) {
            message.error("You must login to place orders!")
            history.goBack()
        } else {
            // Record orders
            var submitOrder = []
            var sum = order.reduce((x, y) => x + y, 0);
            if (order.length !== 0 && sum !== 0){
                for (var i = 0; i < order.length; i++) {
                    if (Number.isFinite(order[i])) {
                        submitOrder.push({
                            "Name": props.snacks[i].snackName,
                            "Price": props.snacks[i].price,
                            "Quantity" : order[i]
                        })
                    }
                }
                // Calculate the total price 
                var total = 0
                for (var j = 0; j < submitOrder.length; j++) {
                    let update = total + submitOrder[j].Price * submitOrder[j].Quantity
                    total = update
                }
                axios.post('/customer/addOrder', {
                    customer: props.customer.id,
                    vendor: props.vendor.id,
                    snacks: submitOrder,
                    total: total
                }).then(response => {
                    if (response.data.success) {
                        message.success("Order has been placed!")
                        setModalVisible(false) 
                    } else {
                        message.error("Order placing errored!")
                    }
                })
            } else { message.error("You didn't make an order yet!!") }
        }
    }
    
    // Return modal which allows the customer to order and confirm
    return(
        <>
            <Marker key = {props.id} position={props.position} icon={vendorIcon} eventHandlers={{ click: handleModalShow }}> </Marker>
            
            <Modal show={modalVisible} onHide={handleModalClose}>
                <Modal.Header className="popup" closeButton> <Modal.Title>Menu</Modal.Title> </Modal.Header>
                
                <Modal.Body>
                    <p>Vendor Name: {props.vendor.vendorName}</p>
                    <p/>
                    <p>Status: {props.vendor.status}</p>                 
                    <p/>
                    <p>Distance to you: {props.vendor.distance} m</p>
                    <Divider/>
                    {props.snacks && props.snacks.map((snack, index)=>(
                        <Card cover={<img alt="example" src={snack.image} />} style={{ marginbottom: "2vh" }} size={'small'} key={snack._id}>
                            <Meta title={snack.snackName + "   $" + snack.price}/>
                            <InputNumber key={snack._id} min={0} defaultValue={0} style={{marginLeft: "80%" }} onChange={e => onChange(index, e)} />
                        </Card>
                    ))}
                </Modal.Body>
                
                <Modal.Footer>
                    <button className = 'second_button' onClick={() => { handleConfirmShow(); handleModalClose()}}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={confirm} onHide={handleConfirmClose}>
                <Modal.Header className = 'popup' closeButton> <Modal.Title>Are you sure?</Modal.Title> </Modal.Header> 

                <Modal.Footer>
                    <button className = 'second_button' onClick={() => {onSubmit(); handleConfirmClose(); handleModalClose()}}>
                        Confirm
                    </button>
                    <button className = 'first_button' onClick={handleConfirmClose}>
                        Not yet
                    </button>
                </Modal.Footer>
                
            </Modal>
        </>
    )
}