import React from 'react'
import Header from '../components/Header.js';
import LeafletMap from '../components/LeafletMap.js'
/**
 * This function rendor map for vendors to park and update in database
 */
export default function VendorPark(props) {
    return (
        <div>
            <Header id={props.location.state.vendor.id} vendor={props.location.state.vendor}/>
            <p className="body"> Drag to your location and click to confirm:</p>
            <LeafletMap
                center={props.location.state.position}
                vendor={props.location.state.vendor}
                vendors={[]} />
        </div>
    )
}
