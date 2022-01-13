import React, { Component } from 'react'; 
import { Badge, InputNumber, Card, notification, message, Rate, Divider } from 'antd';
import { EyeOutlined, EditOutlined, CheckOutlined, DeleteOutlined} from '@ant-design/icons';
import CountUp from '../components/CountUp.js';
import TextArea from 'antd/lib/input/TextArea';
import { Modal } from 'react-bootstrap'; 
import axios from '../commons/axios';
const ORDER_CHANGEABLE_PERIOD = 10;
const GET_DISCOUNT_OVER_TIME = 15;
const UPDATE_TIME = 1000;
const { Meta } = Card;
/**
 * This class show up order details
 */
export default class OrderBrief extends Component{
    // Set up constructor
    constructor(props) {
        super();
        this.state = {
            menu: [],
            order: [],
            modalVisible: false,
            editModalVisible: false,
            modalBody: <></>,
            diff: "",
            ratings:0,
            comment:""
        }
    }
    // Set up basic information
    handleEditClose = () => this.setState({ editModalVisible: false });
    handleEditShow = () => this.setState({ editModalVisible: true })
    handleClose = () => this.setState({ modalVisible: false }); 
    handleShow = () => this.setState({ modalVisible: true });
    
    // Record time
    timer() {
        let current = new Date().getTime()
        let previous = Date.parse(this.props.order.updatedAt)
        this.setState({ diff: ((current - previous) / 60000) })
    }

    // Customer services: place orders, cancle orders and comment the order after completed
    onChange = (index, event) => {
        let newArray = [...this.state.order]; 
        newArray[index] = event; 
        this.setState({ order: newArray })
    }
    handleShowOrderDetail = () => { console.log(this.props.order) }
    handleEditOrder = () => {
        if (this.props.order.status === "outstanding" && this.state.diff <= ORDER_CHANGEABLE_PERIOD){
            this.setState({ editModalVisible: true});
        }
        if (this.props.order.status === "fulfilled"){
            notification.open({
                message: "Ready to be collected!",
                description: "You cannot make any chages to a fulfilled order. You can rate your experience after picking up the snacks",
                duration: 3
            });   
        } else if (this.props.order.status === "outstanding" && this.state.diff > ORDER_CHANGEABLE_PERIOD){
            notification.open({
                message: "Order in processing!",
                description: "You can only update within 10 minutes after placing an order",
                duration: 3
            });   
        } else {
            this.setState({ editModalVisible: true});
        }
    }
    handleCancleShow = () => {     
        if (this.props.order.status === "outstanding" && this.state.diff <= ORDER_CHANGEABLE_PERIOD) {
            // change order status to "canceled"
            axios.post('/order/' + this.props.order._id + '/update', {
                status: "canceled"
            }).then(response => {
                if (response.data.success) {
                    message.success("Order has been canceled.")
                } else {
                    message.error("order cancel errored!")
                }
            })
        } else {
            message.error(" Sorry, this can not be canceled anymore, order is on its way! ")
        }
    }

    // Submit order and comments
    submitOrder = () => {
        // Get the orders
        var submitOrder = []
        for (var i = 0; i < this.state.order.length; i++) {
            if (Number.isFinite(this.state.order[i])) {
                submitOrder.push({
                    "Name": this.state.menu[i].snackName,    
                    "Price": this.state.menu[i].price,
                    "Quantity" : this.state.order[i]
                })
            }
        }
        // Calculate the total price
        var total = 0
        for (var j = 0; j < submitOrder.length; j++) {
            let update = total + submitOrder[j].Price * submitOrder[j].Quantity
            total = update
        }
        if(submitOrder.length === 0) {
            this.setState({ editModalVisible: false });
            message.error("You haven't make an order yet!!")
        } else {
            axios.post('/order/' + this.props.order._id + '/update', {
                status: "outstanding",
                snacks: submitOrder,
                total: total
            }).then(response => {
                if (response.data.success) {
                    message.success("Order has been placed!")
                    this.setState({ editModalVisible: false });
                } else {
                    message.error("Order placing errored!")
                }
            })
        }
    }
    submitComment = () => {
        axios.post('/order/' + this.props.order._id + '/update', {
            comment: this.state.comment,
            ratings: this.state.ratings
        }).then(response => {
            if (response.data.success) {
                message.success("Order has been commented!")
                this.setState({ editModalVisible: false });
            } else {
                message.error("Order commenting errored!")
            }
        })
    }
    
    // Vendor services: mark the status of an order
    markingOrder = () => {
        var statusToBeUpdated, discount
        var total = this.props.order.total
        if (this.props.order.status === "outstanding") {
            statusToBeUpdated = "fulfilled"
            if (this.state.diff > GET_DISCOUNT_OVER_TIME) {
                discount = true
                total = total * 0.8
            } else {
                discount = false
            }
            axios.post('/order/' + this.props.order._id + '/update', {
                total: total,
                discount: discount,
                status: statusToBeUpdated
            }).then(response => {
                if (response.data.success) {
                    message.success("Status has been updated!")
                    this.setState({ editModalVisible: false });
                } else {
                    message.error("status updating errored!")
                }
            })
        } else if (this.props.order.status === "fulfilled") {
            statusToBeUpdated = "completed"
            axios.post('/order/' + this.props.order._id + '/update', {
                status: statusToBeUpdated
            }).then(response => {
                if (response.data.success) {
                    message.success("Status has been updated!")
                    this.setState({ editModalVisible: false });
                } else {
                    message.error("status updating errored!")
                }
            })
        } else {
            notification.open({
                message: 'Order is completed!',
                description: 'Congratulation! You have completed this order!',
                duration: 3
            });
        }
    }
    
    componentWillUnmount() { clearInterval(this.timerID); } //tear down timer so that interval starts over 
    componentDidMount() {
        axios.get('/customer/menu').then(response=> {
            this.setState({ menu: response.data.snacks })
        })
        this.timerID = setInterval(() => this.timer(), UPDATE_TIME); // Update every second (DOM)
    }
    
    // Making rates and comments
    ratingsChange = (value) => { this.setState({ ratings: value }); };
    commentChange = (value) => { this.setState({ comment: value }) }

    // Actions that allowed on the order card
    renderActions = () => {
        if(window.location.pathname === '/customer') {
            return (               
                [
                    <EyeOutlined onClick={() => this.handleShow()} />,
                    <EditOutlined onClick={() => this.handleEditShow()} />,
                    <DeleteOutlined onClick={() => this.handleCancleShow()}/>
                ]
            )
        } else if (window.location.pathname === '/orders') {
            return (
                [
                    <EyeOutlined onClick={() => this.handleShow()} />,
                    <CheckOutlined onClick={() => this.markingOrder()} />
                ]
            )
        }
    }

    renderEditModalContent = () => {
        if (this.props.order.status === "outstanding"){
            return(
                <>
                    <Modal.Header closeButton> <Modal.Title>Menu</Modal.Title> </Modal.Header>

                    <Modal.Body>
                        {this.state.menu.map((snack, index)=>(
                            <Card cover={<img alt="example" src={snack.image} />} style={{ marginbottom: "2vh" }} size={'small'} key={snack._id}>
                                <Meta
                                    title={snack.snackName + "   $" + snack.price}
                                />
                                <InputNumber key={snack._id} min={0} defaultValue={0} style={{marginLeft: "80%" }} onChange={e => this.onChange(index, e)} />
                            </Card>
                        ))}
                    </Modal.Body>

                    <Modal.Footer>
                        <button className = 'second_button' onClick={() => { this.submitOrder() }}>
                            Submit
                        </button>
                    </Modal.Footer>
                </>
            )
        } else {
            return(
                <>
                    <Modal.Header closeButton> <Modal.Title className="popup"> {"OrderId: " + this.props.order._id}</Modal.Title> </Modal.Header>

                    <Modal.Body>
                        <p>Vendor: {this.props.order.vendor.vendorName}</p>
                        <Divider>Your Order</Divider>
                        <p>Snacks: {this.props.order.snacks.map((snack) => <li key={snack.name}> {snack.Name} * {snack.Quantity}</li>)}</p>
                        <Divider>Total Cost</Divider>
                        {(this.props.order.discount) ? <p>{this.props.order.total * 1.25} * 0.8 = ${Math.round(this.props.order.total * 100) / 100} </p> : <p>Total Cost: ${this.props.order.total} </p>}  
                        <Divider>Rate Your Experience</Divider>
                        <p>Ratings:</p>
                        <Rate onChange={(e) => this.ratingsChange(e)}/>
                        <Divider>Give Us Some Feedback</Divider>
                        <p>Comment</p><TextArea rows={4} onChange={(e) => this.commentChange(e.target.value)} />
                    </Modal.Body>

                    <Modal.Footer>
                        <button className = 'second_button' onClick={() => { this.submitComment() }}>
                            Submit
                        </button>
                    </Modal.Footer>
                </>
            )
        }
    }

    render() {
        return (
            <>
                <Modal show={this.state.modalVisible} onHide={() => this.handleClose()}>
                    <Modal.Header closeButton> <Modal.Title className="popup"> {"OrderId: " + this.props.order._id}</Modal.Title> </Modal.Header>

                    <Modal.Body>
                        <p>Vendor Name: {this.props.order.vendor.vendorName}</p>
                        <p>Customer Name: {this.props.order.customer.givenName}</p>
                        <Divider>Your Order: </Divider>
                        <p>{this.props.order.snacks.map((snack) => <li key={snack.name}> {snack.Name} * {snack.Quantity}</li>)}</p>
                        <Divider>Total Cost: </Divider>
                        {(this.props.order.discount) ? <p>{this.props.order.total * 1.25} * 0.8 = ${Math.round(this.props.order.total * 100) / 100} </p> : <p>Total Cost: ${this.props.order.total} </p>}             
                        {(this.props.order.ratings) ? <><p><Divider>Rate Us: </Divider></p> <Rate disabled value={this.props.order.ratings} /></> : <> </>}
                        {(this.props.order.comment) ? <><p><Divider>Say Something to Us: </Divider></p> <>{this.props.order.comment}</></>: <> </>}
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.editModalVisible} onHide={() => this.handleEditClose()}>{this.renderEditModalContent()} </Modal>
                {
                (this.props.order.discount) ? 
                    <Badge.Ribbon className="label" text="order has been discounted">
                        <Card style={{ margin: "10px" }} actions={this.renderActions()}>
                        <Meta title={this.props.order.vendor.vendorName + "  -  " + this.props.order.status} />
                        {(this.props.order.status === "fulfilled") ? "order is fulfilled"
                            : (this.props.order.status === "completed") ? "order is completed"                    
                                : <CountUp updatedAt={this.props.order.updatedAt} />}
                        </Card>
                    </Badge.Ribbon>
                    : <Card style={{ margin: "10px"}} actions={this.renderActions()}>
                        <Meta title={this.props.order.vendor.vendorName + "  -  " + this.props.order.status} />
                        {(this.props.order.status === "fulfilled") ? "order is fulfilled"
                            : (this.props.order.status === "completed") ? "order is completed"                    
                                : <CountUp updatedAt={this.props.order.updatedAt} />}
                    </Card>
                }
            </>
        )
    }
}
