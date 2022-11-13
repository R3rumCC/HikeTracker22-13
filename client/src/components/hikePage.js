import { Col, Row } from 'react-bootstrap';
import { HikesContainer } from './hikesCards';
import { Icon } from 'leaflet'
import { MapContainer, Polyline, TileLayer, Map, Marker, Popup } from 'react-leaflet'
import { AiFillEnvironment } from "react-icons/ai";
import { start } from '@popperjs/core';


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
<<<<<<< HEAD
    
=======

    let gpxParser = require('gpxparser');
    var gpx = new gpxParser()
    gpx.parse(props.currentHike[0].gpx_track) // This attribute is the .gpx file that defines the hike. 
	const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
    console.log(positions[0]," ",positions[positions.length-1])

>>>>>>> 9754d06bd57ac6c7f68bc67288c3992b51eaca09
    return (
        <Col className="vh-100 justify-content-md-center">
            <Row className='my-3'>
                <Col sm={4}>
                    {/* THIS ROW CONTAINS A SELECTED CARD. */}
                    {props.currentHike.length > 0 ? 
                        <HikesContainer hikes={props.currentHike}></HikesContainer> : 
                        <div>No map has been selected selected</div>
                    }
                </Col>
                <Col sm={8} className='map'>
                    <MapContainer
                        // for simplicty set center to first gpx point
                        center={positions[positions.length/2]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {/* Polyline is the hike's path extracted from the .gpx
                            as an array of tuples [lat,lon] passed on the
                            'positions argument. Not much more is 
                            required for the path-drawing. I think...
                        */}
                        <Polyline
                            pathOptions={{ fillColor: 'red', color: 'blue' }}
                            positions={positions}
                        />
                        {/* Marker can be used to set a pointer on each of the 
                            corresponding reference points. Just use a .map() and
                            change the following 'position' attribute.
                        */}
                        <Marker position={positions[0]}> 
                            <Popup>
                                {props.currentHike[0].start_point_address}
                            </Popup>
                        </Marker>
                        <Marker position={positions[positions.length -1]}> 
                            <Popup>
                                {props.currentHike[0].end_point_address}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Col>
            </Row>
        </Col>
    )
    
};



export { HikePage };
