import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, Button, Container, Form, FormGroup, FormLabel, ButtonGroup , InputGroup, Alert} from 'react-bootstrap';
import { MapContainer, Polyline, TileLayer, Map, Marker, Popup, useMapEvents, GeoJSON, useMap } from 'react-leaflet'
import { GenericMap } from './hikePage';
import API from '../API';
import axiosInstance from "../utils/axios"

function LocalGuide_Home(props){
    //states to select the form from buttons
    const [hikeForm, setHikeForm]= useState(false);
    const [parkingLotForm, setParkingLotForm]= useState(false)
    const [hutForm, setHutForm]= useState(false)
    //handlers for the onClick events on buttons
    const selectHike= ()=>{ if (hikeForm) { 
                                setHikeForm(false); 
                            } else{ 
                                setHikeForm(true); setParkingLotForm(false); setHutForm(false);
                            }};
    const selectParking= ()=>{if (parkingLotForm) { 
                                setParkingLotForm(false)
                            } else {
                                setParkingLotForm(true); setHikeForm(false); setHutForm(false);
                            }};
    const selectHut= ()=>{if (hutForm) {
                            setHutForm(false)
                        } else{
                            setHutForm(true); setHikeForm(false); setParkingLotForm(false);
                        }};
    
    //The container                    
    return(<Container>
        <div style={{color: 'green', fontSize:30, fontWeight:'bold', textAlign:'center'}}>
            HELLO LOCAL GUIDE
        </div>
        <InsertionOptions setHikeForm={selectHike} setParkingForm={selectParking} setHutForm={selectHut}></InsertionOptions>
        <Row>
            <div>{hikeForm ? <HikeForm CreateNewPoint={props.CreateNewPoint} CreateNewHike={props.CreateNewHike}/> : <></>}</div>
            <div>{parkingLotForm ? <ParkingLotForm CreateNewPoint={props.CreateNewPoint} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} /> : <></>}</div>
            <div>{hutForm ? <HutForm CreateNewPoint={props.CreateNewPoint} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}/> : <></>}</div>
        </Row>
    </Container>
    )
}

//Button group which allows the Local Guide to select the correct form for the new point of interest he wants to insert
function InsertionOptions(props){
    
    return(<>
        <FormGroup id='insertion_options' style={{paddingTop: 15}}>
            <FormLabel>Do you want to insert something new?</FormLabel>
            <Row>
                <ButtonGroup > 
                    <Button  style={{background: 'green', size: 'md'}} value='hike' onClick={()=>props.setHikeForm()}>
                         New Hike Description
                    </Button>
                    <Button  style={{background: 'red', size: 'md'}} value= 'hut' onClick={()=>props.setHutForm()}>
                        New Hut Description
                    </Button>
                    <Button  style={{background: 'blue', size: 'md'}} value='parking_lot' onClick={()=>props.setParkingForm()}>
                        New Parking Lot
                    </Button>
                </ButtonGroup>
            </Row>
        </FormGroup>
    </>)
}

/**HIKE FORM */

function HikeForm(props){

    const [title, setTitle]= useState('')
    const [length, setLength] = useState('')
    const [expTime, setExpTime] = useState('')
    const [ascent, setAscent]= useState('')
    const [difficulty, setDifficulty]= useState('')
    const [description, setDescription]= useState('')

    const [startPoint, setStartPoint]= useState('')
    const [startPointGps, setStartPointGps]= useState('')
    const [endPoint, setEndPoint]= useState('')
    const [endPointGps, setEndPointGps]= useState('')
    let reference_points= []
    const [map, setMap]= useState('') //USED TO SAVE MAP STRING
    const [gpxPos, setGpxPos] = useState(null)
    const [errorMsg, setErrorMsg] = useState("");

    const changeTitle= (val)=>{setTitle(val)}
    const changeLength= (val)=>{setLength(val)}
    const changeExpTime= (val)=>{setExpTime(val)}
    const changeAscent= (val)=>{setAscent(val)}
    const changeDifficulty= (val)=>{setDifficulty(val);}
    const changeDescription= (val)=>{setDescription(val)}
    const changeStartP= (val) =>{setStartPoint(val)}
    const changeStartPGps= (val) =>{setStartPointGps(val)}
    const changeEndP= (val) =>{setEndPoint(val)}
    const changeEndPGps= (val) =>{setEndPointGps(val)}

  
    const submitFile = () => {
        var myBlob = new Blob(
            [map],
            {type: "text/plain"}
        )
        let formData = new FormData()
  
        formData.append("file", myBlob, title)

        axiosInstance.post("/upload_file", formData, {
            headers: {
            "Content-Type": "text/plain",
            },
        })
    }
    const submitHikeForm= (event)=>{
        event.preventDefault();
        let newHike;
        //Checks on needed fields
        if(title!== ""){ 
            if(length!== "" && difficulty!== ""){
                 if(startPoint!==0 && endPoint!==0){
                    if(description!== ""){
                        if(map !== ''){
                        let start= {address: startPoint, gps_coordinates: startPointGps}
                        let startId= props.CreateNewPoint(start) //try to use startId and endId instead of performing again the search
                        let end= {address: endPoint, gps_coordinates: endPointGps}
                        let endId= props.CreateNewPoint(end);

                        //check on user's role (?)
                        newHike={title: title, length: length, expected_time: expTime, ascent: ascent, difficulty: difficulty, 
                                start_point: startPoint, end_point: endPoint, reference_points: reference_points,
                                description: description, gpx_track: title
                                //gpx_track: map --> request entity too large
                                }
                        props.CreateNewHike(newHike)
                        submitFile()
                        console.log('after CreateNewHike');
                        alert('New Hike correctly added!')
                        document.getElementById('hikeForm').hidden = true;
                        setTitle(''); 
                        setLength(''); setExpTime(''); setAscent('')
                        setDifficulty(''); setDescription('')
                        setStartPoint(''); setStartPointGps('');
                        setEndPoint(''); setEndPointGps('');
                        setErrorMsg(''); setMap(''); setGpxPos(null);
                            }
                            else{
                                setErrorMsg("Enter a valid gpx file.");
                            }
                    }else{
                        setErrorMsg("Enter a description before submit.");
                    }
                 }else{
                    setErrorMsg("A Start and End Point are required.")
                 }
            }else{
                setErrorMsg("A length and a difficulty are required.")
            }
        } else{
            setErrorMsg("Enter a title before submit."); 
        }
    }

    const reset= ()=>{
        setTitle(''); 
        setLength(''); setExpTime(''); setAscent('')
        setDifficulty(''); setDescription('')
        setStartPoint(''); setStartPointGps('');
        setEndPoint(''); setEndPointGps('');
        setErrorMsg(''); setMap(''); setGpxPos(null);
    }
    
    //Import gpx file and read, gpx parse it is used to retreive the start point and the end point (format latitude,longitude)
    //after have red the file it changes automatically the start point and the end point 
    const importGpx = (selectedFile) => {
        const $ = require( "jquery" );
        let gpxParser = require('gpxparser');
        var gpx = new gpxParser()
        setTitle(''); 
        setLength(''); setExpTime(''); setAscent('')
        setDifficulty(''); setDescription('')
        setStartPoint(''); setStartPointGps('');
        setEndPoint(''); setEndPointGps('');
        setErrorMsg('');
        let reader = new FileReader();
      
        reader.readAsText(selectedFile);
      
        reader.onload = function() { 
            gpx.parse(reader.result)

            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon, p.ele]).filter((x) => x[2]!= null)
            if(positions.length == 0){
                setErrorMsg("No Elevation available")
                setGpxPos(null)
                setMap('')
            }
            else{

                //storing lat and lon inside the status of start/end point
                let gps_start= `${positions[0][0]}, ${positions[0][1]}`
                changeStartPGps(gps_start);
                let gps_end= `${positions[positions.length-1][0]}, ${positions[positions.length-1][1]}`
                changeEndPGps(gps_end);
                console.log('gps_start=' + gps_start + ', STATE startP= ' + startPointGps)
                console.log('gps_end= ' + gps_end + ', STATE endP= ' + endPointGps)

                let trackPoints = gpx.tracks[0].points.map((o)=>o.ele).filter((x)=>x!=null)
                console.log(trackPoints)
                if(trackPoints.length != 0){
                    let maxPoint = Math.max(...trackPoints)
                    let minPoint = Math.min(...trackPoints)
                    console.log(maxPoint)
                    console.log(minPoint)
                    var totalElevation = (Number(maxPoint - minPoint).toFixed(2));
                    changeAscent(totalElevation);
                    
                }

                var totalDistance = (Number(gpx.tracks[0].distance.total/1000).toFixed(2));
                changeLength(totalDistance);
                console.log(positions[0]);
                console.log(positions[positions.length-1]);
                $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+positions[0][0]+'&lon='+positions[0][1]+'&format=json&limit=1&q=', function(data) {

                    changeStartP(data.display_name);    
                }); 
                $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+positions[positions.length-1][0]+'&lon='+positions[positions.length-1][1]+'&format=json&limit=1&q=', function(data) {

                    changeEndP(data.display_name);      
                });
                
                setMap(reader.result) 
                setGpxPos(positions)
            }
        };
      
        reader.onerror = function() {
            console.log(reader.error);
        };

    }

    return(<>
        {errorMsg ? (<Alert variant="danger" onClose={()=>{setErrorMsg("");}} dismissible> {errorMsg}</Alert>) : (false)}
        
    <Form id='hikeForm' onSubmit={submitHikeForm} style={{fontSize:15, fontWeight:'bold'}}>
        <Form.Group>
			<Form.Label>Title</Form.Label>
			<Form.Control value={title} onChange={(ev) => changeTitle(ev.target.value)}/>
		</Form.Group>
        <Form.Group>
            <Row>
                <Col>
			        <Form.Label>Length</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control value={length} onChange={(ev) => changeLength(ev.target.value)} placeholder="3.2"/>
                        <InputGroup.Text id="basic-addon2">Km</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col>
                    <Form.Label>Expected Time</Form.Label>
                    <InputGroup className="mb-3">
			            <Form.Control value={expTime} onChange={(ev) => changeExpTime(ev.target.value)} placeholder="4"/>
                        <InputGroup.Text id="basic-addon2">hours</InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label>Ascent</Form.Label>
                    <InputGroup className="mb-3">
			            <Form.Control value={ascent} onChange={(ev) => changeAscent(ev.target.value)} placeholder="670"/>
                        <InputGroup.Text id="basic-addon2">m</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col>
                    <Form.Label>Difficulty</Form.Label>
                    <Form.Select onChange={(ev) => changeDifficulty(ev.target.value)}>
                        <option label=''></option>
                        <option value='Tourist'  label="Tourist"/>
                        <option value='Hiker' label="Hiker"/>
                        <option value='Professional hiker' label="Professional Hiker"/>
                    </Form.Select>
                </Col>
            </Row>
		</Form.Group>
        <Form.Group>
            <Row>
                <Col>
                    <Form.Label>Start Point</Form.Label>
                    <Form.Control value={startPoint} onChange={(ev) => changeStartP(ev.target.value)}/>
                </Col>
                <Col>
                    <Form.Label>End Point</Form.Label>
                    <Form.Control value={endPoint} onChange={(ev) => changeEndP(ev.target.value)}/>
                </Col>
            </Row>
        </Form.Group>

        {/* This is the form used to import the gpx, on upload of the file it call the importGpx function passing the file object */}
        <Form.Group controlId="formFile" className="mt-5">
            <Form.Label>Upload the GPX track</Form.Label>
            <Form.Control type="file" onChange={(e) => importGpx(e.target.files[0])} />
        </Form.Group>
    
        <Form.Group>
			<Form.Label>Description</Form.Label>
			<Form.Control value={description} onChange={(ev) => changeDescription(ev.target.value)}/>
		</Form.Group>
        <Button className= 'mt-y' type='submit' style={{background:'green'}}>SAVE</Button>
        <Button style={{background:'green'}} onClick={reset} className = 'ms-2 my-2'>Cancel</Button>
    </Form>
    {gpxPos != null ?
        <>
        <GenericMap gpxFile = {map} currentHike ={[]} currentMarkers = {[]} setCurrentMarkers ={''}/>
        </>
    : null}
    </>)
}


/**HUT FORM */

function HutForm(props){

    const [title, setTitle]= useState('')
    const [position,setPosition]= useState('')
    const [address, setAddress]= useState('')
    const [clicked,setClicked] = useState(false)
    //const [refPoints, setRefPoints]= useState([])
    //const [map, setMap]= useState()

    const [errorMsg, setErrorMsg] = useState("");

    const changeTitle= (val)=>{setTitle(val);}
    const changePosition= (val)=>{setPosition(val)}
    const changeAddress= (val)=>{setAddress(val)}

    useEffect(()=>{
        props.setCurrentMarkers([]);
    },[])
    useEffect(() => {
        if(props.currentMarkers.length != 0){
            setPosition(props.currentMarkers[0].latlng.lat+ ","+ props.currentMarkers[0].latlng.lng)
            setAddress(props.currentMarkers[0].address)
            setTitle(props.currentMarkers[0].address.split(',')[0])
            setClicked(true)
        }
        else{
            setPosition('')
            setAddress('')
            setClicked(false)
        }
      }, [props.currentMarkers]);

    const submitHutForm= (event)=>{
        event.preventDefault();
        let newHut;
        if(title!==""){
            if(position!==''){
                if(address!==""){

                    newHut= {address: address, nameLocation: title, gps_coordinates: position , type: 'Hut'}
                    console.log('Before form submission newHut=')
                    console.log(newHut)
                    //call to the API
                    props.CreateNewPoint(newHut)
			        alert('New Hut correctly added!')
                    
                    console.log(newHut)

                }else{
                    setErrorMsg("An address for the hut is required."); 
                }
            }else{
                setErrorMsg("A position for the hut is required."); 
            }
        }else{
            setErrorMsg("Enter a title before submit."); 
        }
    }

    const reset= ()=>{
        setTitle(''); setPosition(''); setAddress('')
    }

    return(<>
        {errorMsg ? (<Alert variant="danger" onClose={()=>{setErrorMsg("");}} dismissible> {errorMsg}</Alert>) : (false)}

    <Form id='hutForm' onSubmit={submitHutForm} style={{fontSize:15, fontWeight:'bold'}}>
        <Form.Group>
			<Form.Label>Title</Form.Label>
			<Form.Control value={title} onChange={(ev) => changeTitle(ev.target.value)}/>
		</Form.Group>
        <Form.Group>
            <Row>
                <Form.Label>Position</Form.Label>
                <Form.Control disabled={clicked} value={position} onChange={(ev) => changePosition(ev.target.value)}/>
            </Row>
            <Form.Label>//TODO Map</Form.Label>
            <Row>
			    <Form.Label>Address</Form.Label>
			    <Form.Control value={address} disabled={clicked} onChange={(ev) => changeAddress(ev.target.value)}/>
            </Row>
		</Form.Group>
        <Form.Group>
            <Form.Label>//TODO Add Reference Points</Form.Label>
        </Form.Group>
        <Button type='submit' style={{background:'red'}}>SAVE</Button>
        <Button style={{background:'red'}} onClick={reset}>Cancel</Button>
    </Form>
    <GenericMap gpxFile = {''} currentHike ={[]} currentMarkers = {props.currentMarkers} setCurrentMarkers ={props.setCurrentMarkers} clicked ={clicked} />
    </>)
}


/**PARKING FORM */

function ParkingLotForm(props){
   
    const [title, setTitle]= useState('')
    const [position,setPosition]= useState('')
    const [address, setAddress]= useState('')
    const [clicked,setClicked] = useState(false)
    const [type, setType]= useState('Parking Lot')
    //const [map, setMap]= useState()

    const [errorMsg, setErrorMsg] = useState("");

    useEffect(()=>{
        props.setCurrentMarkers([]);
    },[])

    useEffect(() => {
        if(props.currentMarkers.length != 0){
            setPosition(props.currentMarkers[0].latlng.lat+ ","+ props.currentMarkers[0].latlng.lng)
            setAddress(props.currentMarkers[0].address)
            setTitle(props.currentMarkers[0].address.split(',')[0])
            setClicked(true)
        }
        else{
            setPosition('')
            setAddress('')
            setClicked(false)
        }
      }, [props.currentMarkers]);
    const handleSubmit = (event) => {
        console.log(props.test);
		event.preventDefault();
		// validation
		if (title.trim().length !== 0) {
			let newPoint;
				if (address.trim().length !== 0) {
						newPoint = {nameLocation: title, address: address,gps_coordinates:position, type: type };				
				} else {
					setErrorMsg("Error: Enter a valid address.");
					return;
				}
			props.CreateNewPoint(newPoint);
			alert('New parking lot added.');
            console.log(newPoint);
        }
		else {
			setErrorMsg("Error: Enter a valid title.");
		}
	};

    return(


<>
        {errorMsg ? (
            <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>
                {errorMsg}
            </Alert>
        ) : (
            false
        )}
        <Form onSubmit={handleSubmit} style={{fontSize:15, fontWeight:'bold'}} >
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>position</Form.Label>
                <Form.Label>//TODO Map</Form.Label>
                <Form.Control
                    value={position}
                    disabled={clicked}
                    onChange={(ev) => setPosition(ev.target.value)} 
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    value={address}
                    disabled={clicked}
                    onChange={(ev) => setAddress(ev.target.value)}
                ></Form.Control>
            </Form.Group>
            <Button type='submit'>Save</Button>
            {/* <Button onClick={props.test}>test</Button> */}
            <Button onClick={props.cancel}>Cancel</Button>
        </Form>
        <GenericMap gpxFile = {''} currentHike ={[]} currentMarkers = {props.currentMarkers} setCurrentMarkers ={props.setCurrentMarkers} clicked ={clicked}/>


        
   </>     )
}

export {LocalGuide_Home}