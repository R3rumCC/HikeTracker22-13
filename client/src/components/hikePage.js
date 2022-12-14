import { Col, Row, Button, ToggleButton, ButtonGroup, Alert } from 'react-bootstrap';
import { HikesContainer } from './hikesCards';
import { MapContainer, Polyline, TileLayer, Map, Marker, Popup, useMapEvents, GeoJSON, useMap, Circle, LayerGroup, } from 'react-leaflet'
import * as L from "leaflet";
import React, { Component, useState, useEffect, useContext, useRef } from 'react';
import axiosInstance from "../utils/axios"
import API from '../API';
import { UNSAFE_NavigationContext, useNavigate } from "react-router-dom";

// THE GPX FILE MUST BE PASSED AS AN STRING. HERE I LEAVE AN EXAMPLE:
// THIS PARTICULAR GPX HAS A SINGLE TRACK AND TWO SEGMENTS. THESE 
// SEGMENTS ARE THE ANGLES THAT ARE BINDED BY LINES TO FORM THE PATH.

// let mockGpx = `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
// <gpx creator="www.flyisfun.com" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
//   <trk>
//     <name>Track_n1</name>
//     <trkseg>
//       <trkpt lat="-48.843895" lon="10.9835696">
//         <ele>126.75549</ele>
//         <time>2016-04-16T11:05:00Z</time>
//       </trkpt>
//       <trkpt lat="-48.843254" lon="11.9823042">
//         <ele>126.90486</ele>
//         <time>2016-04-16T11:05:05Z</time>
//       </trkpt>
//     </trkseg>
//   </trk>
// </gpx>`;



const $ = require("jquery");

// I took it from here: https://stackoverflow.com/a/27943/12249045
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) { //Calc distance between two points
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}

function calcMinDistance(latlng, positions) { //Get the min distance to from a point to a set of points
    let distances = positions.map(p => {
        return getDistanceFromLatLonInKm(latlng.lat, latlng.lng, p[0], p[1])
    })
    return Math.min(...distances)
}
function refDistance(latlng, positions) { //Get the min distance to from a point to a set of points
    let min = 0.5
    let point = {}
    positions.forEach(p => {
        let x = getDistanceFromLatLonInKm(latlng.lat, latlng.lng, p[0], p[1])
        if (x <= min) {
            point = p;
            min = x
        }
    })
    return {lat: point[0], lng: point[1], alt: point[2]}
}

function distanceRespectHikes(latlng, list) {
    return [...list].map((x) => {
        return { hike: x.hike, minDist: getDistanceFromLatLonInKm(latlng.lat, latlng.lng, x.start.split(',')[0], x.start.split(',')[1]) }
    })

}

function HikePage(props) {

    const useBackListener = (callback) => { // Handler for the back button
        const navigator = useContext(UNSAFE_NavigationContext).navigator;
        useEffect(() => {
            const listener = ({ location, action }) => {
                // console.log("listener", { location, action });
                if (action === "POP") {
                    callback({ location, action });
                }
            };
            const unlisten = navigator.listen(listener);
            return unlisten;
        }, [callback, navigator]);
    };

    useBackListener(({ location }) => {
        // console.log("Navigated Back", { location });
        props.setCurrentMarkers([])
    });

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
const LeafIcon = L.Icon.extend({
    options: {}
});
const blueIcon = new LeafIcon({
    iconUrl:
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF"
}),
    greenIcon = new LeafIcon({
        iconUrl:
            "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF"
    });

function GenericMap(props) { //Map to be inserted anywhere. 
    /*
    REQUIRES THE FOLLOWING PROPS:
        -'currentMarkers':An array of the markers to draw on the map (Can be empty)
        -'setCurrentMarkers': State setter of currentMarkers
    OPTIONAL:
        -'currentHike': A hike to be ploted. Can be skiped. Must be a GeoJSON to be plotted.
    */

    const [map, setMap] = useState('')
    const mapList = useRef([])
    const [startPoint, setStartPoint] = useState('')
    const [endPoint, setEndPoint] = useState('')
    const [startCheck, setStartCheck] = useState('');
    const [endCheck, setEndCheck] = useState('');

    function MyComponent({ gpxPos }) {
        const map = useMap()

        map.flyTo(gpxPos[Math.round(gpxPos.length / 2)], gpxPos.length / 100 > 1 ? 13 : 15)

        return null
    }
    async function gpxmap(name, hike = null) {
        try {
            const map = await API.getMap(name);
            setMap(map);
        } catch (error) {
            throw error
        }
    }
    useEffect(() => {
        if (props.currentHike.length > 0) {
            gpxmap(props.currentHike[0].gpx_track.replace(/\s/g, ''))
        }
        else if (props.gpxFile) {
            setMap(props.gpxFile)
        } else if (props.hikes) {
            props.hikes.forEach((h) => {
                if (mapList.current.filter((x) => x.hike == h ? true : false).length == 0 || mapList.length == 0) {
                    mapList.current.push({ hike: h, start: h.start_point_coordinates })
                }
            })
        }
    }, [props.gpxFile, props.hikes]);
    useEffect(() => {
        if (props.currentMarkers.length != 0 && props.currentMarkers.some((x) => !x.distHikes)) {
            console.log(props.currentMarkers)
            let currentMarkersMod = [...props.currentMarkers].map((x) => {
                if (!x.distHikes) {
                    let dist = distanceRespectHikes(x.latlng, mapList.current)
                    console.log(dist)
                    return { latlng: x.latlng, address: x.address, distHikes: dist }
                }
                else
                    return { latlng: x.latlng, address: x.address, distHikes: x.distHikes }
            })
            console.log(currentMarkersMod)
            props.setCurrentMarkers(currentMarkersMod)
        }
    }, [props.currentMarkers, mapList.current])
    if (map != '') {
        // The commented stuff is only required if we are not passing a GeoJSON
        let gpxParser = require('gpxparser');
        let gpx = new gpxParser()
        gpx.parse(map)
        let geoJSON = gpx.toGeoJSON()
        //let geoJSON = JSON.parse(props.currentHike[0].gpx_track) //Get the object from a string
        // console.log(JSON.stringify(geoJSON))
        //var positions = gpx.tracks[0].points.map(p => [p.lat, p.lon,p.ele]).filter((p)=> p[2]!=null)
        let positions = geoJSON.features[0].geometry.coordinates.map(p => [p[1], p[0], p[2]]).filter((p) => p[2] != null)
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[0][0] + '&lon=' + positions[0][1] + '&format=json&limit=1&q=', function (data) {
            setStartPoint(data.display_name);
        })
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[positions.length - 1][0] + '&lon=' + positions[positions.length - 1][1] + '&format=json&limit=1&q=', function (data) {
            setEndPoint(data.display_name);
        })
        return (
            <>{map != '' ?
                <MapContainer
                    center={positions[Math.round(positions.length / 2)]}
                    zoom={positions.length / 100 > 1 ? 13 : 15}
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
                            <hr></hr>
                            {'Start Point'}
                            {props.points ?
                                <>
                                    <hr></hr>
                                    <ToggleButton
                                        className="mb-2"
                                        id="toggle-start"
                                        type="checkbox"
                                        variant="outline-success"
                                        checked={startPoint == startCheck}
                                        onChange={(e) => { setStartCheck(startPoint); props.setStartPoint(startPoint); props.setStartPointGps(positions[0].lat + ',' + positions[0].lng) }}
                                    >
                                        Start Point
                                    </ToggleButton>
                                </>
                                : null}
                        </Popup>
                    </Marker>
                    <Marker position={positions[positions.length - 1]}>
                        <Popup>
                            {endPoint}
                            <hr></hr>
                            {'End Point'}

                            {props.points ?
                                <>
                                    <hr></hr>
                                    <ToggleButton
                                        className="mb-2"
                                        id="toggle-end"
                                        type="checkbox"
                                        variant="outline-danger"
                                        checked={endPoint == endCheck}
                                        onChange={(e) => { setEndCheck(endPoint); props.setEndPoint(endPoint); props.setEndPointGps(positions[positions.length - 1].lat + ',' + positions[positions.length - 1].lng) }}
                                    >
                                        End Point
                                    </ToggleButton>
                                </>
                                : null}

                        </Popup>
                    </Marker>
                    {props.points ? [...props.points].filter((x) => { return getDistanceFromLatLonInKm(x.gps_coordinates.split(',')[0], x.gps_coordinates.split(',')[1], positions[0][0],positions[0][1]) <= 5 || getDistanceFromLatLonInKm(x.gps_coordinates.split(',')[0], x.gps_coordinates.split(',')[1], positions[positions.length -1][0],positions[positions.length -1][1]) <=5 }).map((p) => {
                        return (
                            <Marker icon={greenIcon} key={Math.random()} position={{ lat: p.gps_coordinates.split(',')[0], lng: p.gps_coordinates.split(',')[1] }}>

                                <Popup >
                                    {p.nameLocation}
                                    <hr></hr>
                                    {p.address}
                                    <hr></hr>
                                    {p.type}
                                    <hr></hr>

                                    <ButtonGroup>

                                        <ToggleButton
                                            className="mb-2"
                                            id="toggle-start"
                                            type="checkbox"
                                            variant="outline-success"
                                            checked={p.address == startCheck}
                                            onChange={(e) => { setStartCheck(p.address); props.setStartPoint(p.address); props.setStartPointGps(p.gps_coordinates) }}
                                        >
                                            Start Point
                                        </ToggleButton>
                                        <ToggleButton
                                            className="mb-2"
                                            id="toggle-end"
                                            type="checkbox"
                                            variant="outline-danger"
                                            checked={p.address == endCheck}
                                            onChange={(e) => { setEndCheck(p.address); props.setEndPoint(p.address); props.setEndPointGps(p.gps_coordinates) }}
                                        >
                                            End Point
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Popup>
                            </Marker>
                        )
                    }) : null}
                    {!props.points ?
                        <>
                            <MapHandler currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} positions={positions}></MapHandler>
                            <SelectedMarkers currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></SelectedMarkers>
                        </>
                        : null}
                    {props.gpxFile ? <MyComponent gpxPos={positions}></MyComponent> : null}
                    {<GeoJSON data={geoJSON}></GeoJSON>}
                </MapContainer>
                : null}

            </>
        )
    } else {

        return (
            <>
                <MapContainer
                    className="leaflet-container"
                    center={[42.715, 12.437]} //Center somewhere random as default
                    zoom={5}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {props.filter ? props.hikes.map(p => {

                        return (
                            <Marker icon={greenIcon} key={Math.random()} position={{ lat: p.start_point_coordinates.split(',')[0], lng: p.start_point_coordinates.split(',')[1] }}>
                                <Popup >
                                    {p.start_point_address}
                                </Popup>
                            </Marker>
                        )
                    })
                        : ''}
                    {!props.clicked ? <MapHandler currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} generic={props.generic}></MapHandler> : ''}
                    {props.filter ? <SelectedMarkers currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} radiusMin={props.radiusMin} radiusMax={props.radiusMax}></SelectedMarkers> :
                        <SelectedMarkers currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></SelectedMarkers>}
                </MapContainer>
            </>
        )
    }

}

function MapHandler(props) { //Handles just the clicks on the map
    const map = useMapEvents({
        click: (e) => {
            // console.log(e.latlng)
            $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng + '&format=json&limit=1', function (data) {
                let newSelectedMarker = {}
                if (!props.generic) {
                    let point = refDistance(e.latlng, props.positions)
                    if(point.lat && point.lng)
                        newSelectedMarker = { nameLocation:data.display_name.split(',')[0], latlng: {lat: point.lat, lng:point.lng}, altitude: point.alt, address: data.display_name }
                    else
                        alert('The point is too far from the track')
                }
                else {
                    newSelectedMarker = { latlng: e.latlng, address: data.display_name }
                }
                if ( newSelectedMarker.latlng==null ){
                    console.log("Invalid point")
                }
                else if (!props.currentMarkers.find(p => p.address == newSelectedMarker.address && p.latlng.lng == newSelectedMarker.latlng.lng && p.latlng.lat == newSelectedMarker.latlng.lat)) {
                    let newSelectedMarkers = [...props.currentMarkers, newSelectedMarker]
                    props.setCurrentMarkers(newSelectedMarkers)
                } else {
                    console.log("Location already selected")
                }
            })
        },
    })
    return null
}
function SelectedMarkers(props) {
    return (
        <>
            {/* {console.log(props.currentMarkers)} */}
            {props.currentMarkers.length > 0 ? props.currentMarkers.map(p => {

                return (
                    <LayerGroup>
                        <Marker key={Math.random()} position={p.latlng}
                            eventHandlers={{
                                click: (e) => {
                                    console.log("CLICKERD")
                                    let newSelectedMarkers = props.currentMarkers.filter(m => m.address != p.address || (m.latlng.lat != p.latlng.lat && m.latlng.lng != p.latlng.lng));
                                    props.setCurrentMarkers(newSelectedMarkers);
                                    console.log(props.currentMarkers)
                                }
                            }}
                        >
                            {
                                <Popup>
                                    {p.address}
                                </Popup>
                            }
                        </Marker>
                        {props.radiusMax || props.radiusMin ?
                            <>
                                <Circle key={'RadiusMax'} center={p.latlng} fillColor="green" radius={props.radiusMax * 1000} />
                                <Circle key={'RadiusMin'} center={p.latlng} fillColor="red" radius={props.radiusMin * 1000} />
                            </>
                            : null}

                    </LayerGroup>

                )
            })
                : ''}
        </>
    );

}


export { HikePage, GenericMap, calcMinDistance };
