import { Col, Row } from 'react-bootstrap';
import { HikesContainer } from './hikesCards';
import { Icon } from 'leaflet'
import { MapContainer, Polyline, TileLayer, Map, Marker, Popup, useMapEvents } from 'react-leaflet'
import { AiFillEnvironment } from "react-icons/ai";
import { start } from '@popperjs/core';
import React, { Component }  from 'react';



// THE GPX FILE MUST BE PASSED AS AN STRING. HERE I LEAVE AN EXAMPLE:
// THIS PARTICULAR GPX HAS A SINGLE TRACK AND TWO SEGMENTS. THESE 
// SEGMENTS ARE THE ANGLES THAT ARE BINDED BY LINES TO FORM THE PATH.

/*let mockGpx = `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
<gpx creator="www.flyisfun.com" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <trk>
    <name>Track_n1</name>
    <trkseg>
      <trkpt lat="-48.843895" lon="10.9835696">
        <ele>126.75549</ele>
        <time>2016-04-16T11:05:00Z</time>
      </trkpt>
      <trkpt lat="-48.843254" lon="11.9823042">
        <ele>126.90486</ele>
        <time>2016-04-16T11:05:05Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`
*/
function HikePage(props) {

    let gpxParser = require('gpxparser');
    var gpx = new gpxParser()
    gpx.parse(props.currentHike[0].gpx_track)
    var positions//No track positions as default
    try { // Set positions if there is a  gpx map selected
        positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
    } catch (error) {
        positions = [] 
    }
    
    // console.log(positions[0]," ",positions[positions.length-1])
 return (
        <Col className="vh-100 justify-content-md-center">
            <Row className='my-3'>
                <Col sm={4}>
                    {props.currentHike.length > 0 ? 
                        <HikesContainer hikes={props.currentHike}></HikesContainer> : 
                        <div>No map has been selected selected</div>
                    }
                </Col>
                <Col sm={8} className='map'>
                    <GenericMap positions={positions} currentHike={props.currentHike} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></GenericMap>
                </Col>
            </Row>
        </Col>
    )
    
};

function GenericMap(props){ //Map to be inserted anywhere. 

    return(
        <>
            {props.positions.length<=0 ? // If the track is empty, show an empty map
                <MapContainer
                    className="leaflet-container"
                    center={[33.8735578, 35.86379]} //Center somewhere random as default
                    zoom={9}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapHandler></MapHandler> 
                    <SelectedMarkers currentMarkers={props.currentMarkers}></SelectedMarkers>
                </MapContainer> :
                // If there is a map to plot:
                <MapContainer
                    center={props.positions[props.positions.length/2]}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                        positions={props.positions}
                    />
                    <Marker position={props.positions[0]}> 
                        <Popup>
                            {props.currentHike[0].start_point_address}
                        </Popup>
                    </Marker>
                    <Marker position={props.positions[props.positions.length -1]}> 
                        <Popup>
                            {props.currentHike[0].end_point_address}
                        </Popup>
                    </Marker>
                    <MapHandler currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></MapHandler>
                    <SelectedMarkers currentMarkers={props.currentMarkers}></SelectedMarkers>
                </MapContainer>
            }
        </>

    );

}

function MapHandler(props) { //Handles just the clicks on the map
    const map = useMapEvents({
        click: (e) => {
            var newSelectedMarkers = props.currentMarkers.concat(e.latlng)
            props.setCurrentMarkers(newSelectedMarkers)
            // console.log(props.currentMarkers)
        },
    })
    return null
}

function  SelectedMarkers(props){
    return(
        <>
            {/* {console.log(props.currentMarkers)} */}
            {props.currentMarkers.length>=0 ? props.currentMarkers.map( p => {
                return(
                    <Marker key={Math.random()} position={p}>
                        <Popup>
                            New Marker
                        </Popup>
                    </Marker>)})
            : ''}
        </>
    );

}


export { HikePage, GenericMap };
