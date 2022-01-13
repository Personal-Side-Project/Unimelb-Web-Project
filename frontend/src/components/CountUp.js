import React, { Component } from 'react'
import { Typography, Divider } from 'antd';
const { Text } = Typography;
const GET_DISCOUNT_OVER_TIME_OVER = 0;
const GET_DISCOUNT_OVER_TIME = 15;
const UPDATE_TIME = 1000;
const SIXTY_SECOND = 59;
const TIME_UNIT = 60000;
/**
 * This class let orders update time on our page
 */
export default class CountUp extends Component {
    // Make constructor to store all the initial information
    constructor() { super(); this.state = { min: "", sec: "", remainMin: "", remainSec: "" } }

    // Record order time
    timer() {
        let current = new Date()
        let previous = Date.parse(this.props.updatedAt)
        this.setState({ min: parseInt((current - previous) / TIME_UNIT) })
        this.setState({ sec: parseInt(((current - previous) - this.state.min * TIME_UNIT) / UPDATE_TIME) })
        this.setState({ remainMin: parseInt((GET_DISCOUNT_OVER_TIME - (current - previous) / TIME_UNIT))})
        this.setState({ remainSec: parseInt(( SIXTY_SECOND - this.state.sec))})
    }

    componentDidMount() { this.timerID = setInterval( () => this.timer() , UPDATE_TIME); } // updates this DOM every second   
    componentWillUnmount() { clearInterval( this.timerID ); } // tear down timer so that interval starts over
    
    // Render timer details 
    render() {
        return (
            <>
                {this.state.remainMin >= GET_DISCOUNT_OVER_TIME_OVER ? 
                    <Text className="second_body" strong={true}>
                    <Divider> </Divider>
                    <Divider> Time left until a 20%off discount is released! </Divider>
                    <Divider> {this.state.remainMin + " mins " + this.state.remainSec + " secs "} </Divider>
                    </Text> : <Text className="second_body" strong={true}>
                    <Divider> </Divider>
                    <Divider> We apologize for your waiting!</Divider>
                    <Divider> {this.state.min + " mins " + this.state.sec + " secs "} </Divider>
                    </Text>
                }          
            </>
        )
    }
}