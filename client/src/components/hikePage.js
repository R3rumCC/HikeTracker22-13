import { Col, Row } from 'react-bootstrap';
import { HikesContainer } from './hikesCards';
import 'leaflet/dist/leaflet.css'

import { MapContainer, Polyline, TileLayer, Map, Marker, Popup } from 'npm i react-leaflet'


function HikePage(props) {
    return (
        <Col className="vh-100 justify-content-md-center">
            <Row fixed="top" className=''>
                <h1 className="pb-3">HIKER PAGE</h1>
            </Row>
            <Row className='mt-2'>
                <Col sm={4}>
                    {props.currentHike.length > 0 ? 
                        <HikesContainer hikes={props.currentHike}></HikesContainer> : 
                        <div>No map has been selected selected</div>
                    }
                </Col>
                <Col sm={8} className='map'>
                    {/* THIS MAP IS HARD CODED AND SHOULD BE CHANGED FOR THE .GPX FILE OF A HIKE */}
                    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[51.505, -0.09]}>
                            <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Col>
            </Row>
        </Col>
    )
};



export { HikePage };
