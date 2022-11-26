import { Col, Row } from 'react-bootstrap';
import { HikesContainer } from './hikesCards';
import { MapContainer, Polyline, TileLayer, Map, Marker, Popup, useMapEvents, GeoJSON, useMap } from 'react-leaflet'
import React, { Component, useState, useEffect }  from 'react';
import axiosInstance from "../utils/axios"
import API from '../API';

// THE GPX FILE MUST BE PASSED AS AN STRING. HERE I LEAVE AN EXAMPLE:
// THIS PARTICULAR GPX HAS A SINGLE TRACK AND TWO SEGMENTS. THESE 
// SEGMENTS ARE THE ANGLES THAT ARE BINDED BY LINES TO FORM THE PATH.

let mockGpx = `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
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

const $ = require( "jquery" );


function HikePage(props) {
    
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
                    <GenericMap currentHike={props.currentHike} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></GenericMap>
                </Col>
            </Row>
        </Col>
    )
    
};

function GenericMap(props){ //Map to be inserted anywhere. 
    /*
    REQUIRES THE FOLLOWING PROPS:
        -'currentMarkers':An array of the markers to draw on the map (Can be empty)
        -'setCurrentMarkers': State setter of currentMarkers
    OPTIONAL:
        -'currentHike': A hike to be ploted. Can be skiped. Must be a GeoJSON to be plotted.
    */

    const [map,setMap] = useState('')
    const [startPoint, setStartPoint]= useState('')
    const [endPoint, setEndPoint]= useState('')

    function MyComponent({gpxPos}) {
        const map = useMap()

        map.flyTo(gpxPos[Math.round(gpxPos.length/2)],gpxPos.length/100 > 1 ? 13 : 15)

        return null
      }


    async function gpxmap(name) {
        try {
            const map = await API.getMap(name);
            setMap(map);
            } catch (error) {
            throw error
            }
    }
    useEffect(() =>{
        if(props.currentHike.length > 0){
            gpxmap(props.currentHike[0].gpx_track.replace(/\s/g, ''))
            }
        else{
            setMap(props.gpxFile)
        }
      }, [props.gpxFile]);

        if(map != ''){
        // The commented stuff is only required if we are not passing a GeoJSON
        let gpxParser = require('gpxparser');
        var gpx = new gpxParser()
        gpx.parse(map)
        let geoJSON = gpx.toGeoJSON()
        //let geoJSON = JSON.parse(props.currentHike[0].gpx_track) //Get the object from a string
        // console.log(JSON.stringify(geoJSON))
        //var positions = gpx.tracks[0].points.map(p => [p.lat, p.lon,p.ele]).filter((p)=> p[2]!=null)
        var positions = geoJSON.features[0].geometry.coordinates.map(p => [p[1], p[0],p[2]]).filter((p)=> p[2]!=null)
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+positions[0][0]+'&lon='+positions[0][1]+'&format=json&limit=1&q=', function(data) {
            setStartPoint(data.display_name);    
            })
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+positions[positions.length-1][0]+'&lon='+positions[positions.length-1][1]+'&format=json&limit=1&q=', function(data) {
            setEndPoint(data.display_name);           
            })
        return(
            <>{ map != '' ? 
                <MapContainer
                    center={positions[Math.round(positions.length/2)]}
                    zoom={positions.length/100 > 1 ? 13 : 15}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {/* This object below is needed if we are passing the path line as a parsed XML, not as a GeoJSON */}
                     <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                        positions={positions}
                    /> 
                    <Marker position={positions[0]}> 
                        <Popup>
                            {startPoint}
                        </Popup>
                    </Marker>
                    <Marker position={positions[positions.length -1]}> 
                        <Popup>
                            {endPoint}
                        </Popup>
                    </Marker>
                    {/*<MapHandler currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></MapHandler>*/}
                    {/*<SelectedMarkers currentMarkers={props.currentMarkers}></SelectedMarkers>*/}
                    <MyComponent gpxPos = {positions}></MyComponent>
                    {<GeoJSON data={geoJSON}></GeoJSON>}
                </MapContainer>
                : null}
                
            </>
        )    
        }else if (props.currentHike<=0) {
            return(
                <>
                    <MapContainer
                        className="leaflet-container"
                        center={[42.715, 12.437]} //Center somewhere random as default
                        zoom={9}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapHandler></MapHandler> 
                        <SelectedMarkers currentMarkers={props.currentMarkers}></SelectedMarkers>
                    </MapContainer>
                </>
            )
        }

}

function MapHandler(props) { //Handles just the clicks on the map
    const map = useMapEvents({
        click: (e) => {
            console.log(e.latlng)
            $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+e.latlng.lat+'&lon='+e.latlng.lng+'&format=json&limit=1', function(data) {
                var newSelectedMarker = {latlng: e.latlng , address: data.display_name}
                var newSelectedMarkers = [...props.currentMarkers,newSelectedMarker]
                props.setCurrentMarkers(newSelectedMarkers)    
            })
            // console.log(props.currentMarkers)
        },
    })
    return null
}
function  SelectedMarkers(props){
    return(
        <>
            {/* {console.log(props.currentMarkers)} */}
            {props.currentMarkers.length>0 ? props.currentMarkers.map( p => {

                return(
                    
                    <Marker key={Math.random()} position={p.latlng}>
                        {  
                            <Popup>
                                {p.address}
                            </Popup>
                        }
                    </Marker>
                    
                   )
            })
            : ''}
        </>
    );

}


export { HikePage, GenericMap };
