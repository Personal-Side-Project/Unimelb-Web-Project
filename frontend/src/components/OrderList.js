import React, { Component, useEffect, useState } from 'react'
import OrderBrief from './OrderBrief.js';
import axios from '../commons/axios.js';
import io from "socket.io-client";
import { Empty } from 'antd';
import URLs from "../url";
/**
 * This function list all orders
 */
function Orders(props) {
    const [orders, setOrders] = useState([])
    const id = props.id
    useEffect(() => {
        async function fetchData() {
            if(props.target === "customer") {
                // Get all orders for customer
                axios.get("/order?" + props.target + "=" + id).then(response => {
                    if (response.data.success) {
                        // Get all orders that are not canceled
                        var validOrders = []
                        var index = 0
                        for(var i = 0; i< response.data.allOrders.length; i++) {
                            if(response.data.allOrders[i].status !== "canceled") {
                                validOrders[index] = response.data.allOrders[i]
                                index++
                            }
                        }
                        setOrders(validOrders)
                    } else {
                        setOrders([])
                    }
                }).catch( error => { setOrders([]); })
            } else {
                // Get all orders for vendor
                axios.get("/order?" + props.target + "=" + id + props.status).then(response => {
                    if (response.data.success) {
                        // Get all orders that are not canceled
                        var validOrders = []
                        var index = 0
                        for(var i = 0; i< response.data.allOrders.length; i++) {
                            if(response.data.allOrders[i].status !== "canceled") {
                                validOrders[index] = response.data.allOrders[i]
                                index++
                            }
                        }
                        setOrders(validOrders)
                    } else {
                        setOrders([])
                    }
                }).catch(error => {
                    setOrders([]);
                })
            }
        }
        fetchData()
    }, [id, orders, props.target, props.status])

    // Render orders that are not canceled
    const renderOrders = orders.map((order) => {
        return (
            <OrderBrief key={order._id} order={order} />
        )
    });

    return (
        <>
            {(orders.length > 0) ? renderOrders : <Empty image="https://i.imgur.com/rPggCa8.png" description={<span className="third_body">Currently No Orders</span>} />}
        </>  
    )
}
/**
 * This class make order list 
 */
export default class OrderList extends Component {
    // Make constructor
    constructor(props) { super(); this.state = { orders: [], } }

    componentDidMount() {
        const socket = io(`${URLs.socketURL}/socket`, { transports: ['websocket']});
        
        socket.on("newOrder", (order) => {
            console.log("insertion detected at frontend");
            this.setState({ orders: [...this.state.orders, order] });
        });

        socket.on("updateOrder", (id) => {
            console.log("update detected at frontend");
            console.log(id)
        })

        socket.on("deleteOrder", (id) => {
            console.log("deletion detected at frontend");
            const updateOrders = this.state.orders.filter((order) => {
                return order._id !== id;
            });
            this.setState({ orders: updateOrders });
        });
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100%', margin: "auto", "marginTop": "5%" }}>
                <Orders id={this.props.id} orders={this.state.orders} target={this.props.target} status={this.props.status} />
            </div>
        )
    }
}