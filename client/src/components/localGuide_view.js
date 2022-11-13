import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Container, Form, FormGroup, FormLabel, ButtonGroup , InputGroup, Alert} from 'react-bootstrap';
import API from '../API';


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
            <div>{hikeForm ? <HikeForm CreateNewHike={props.CreateNewHike}/> : <></>}</div>
            <div>{parkingLotForm ? <ParkingLotForm CreateNewPoint={props.CreateNewPoint} /> : <></>}</div>
            <div>{hutForm ? <HutForm CreateNewPoint={props.CreateNewPoint}/> : <></>}</div>
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
    //start and end point must be choosen from the list of points
    const [startPoint, setStartPoint]= useState(0)
    const [endPoint, setEndPoint]= useState(0)
    const [refPoints, setRefPoints]= useState([])
    const [description, setDescription]= useState('')


    const [map, setMap]= useState('') //USED TO SAVE MAP STRING
    //const[points, setPoints]= useState([]);
    //const Points

    const [errorMsg, setErrorMsg] = useState(""); //to be fixed

    const changeTitle= (val)=>{setTitle(val)}
    const changeLength= (val)=>{setLength(val)}
    const changeExpTime= (val)=>{setExpTime(val)}
    const changeAscent= (val)=>{setAscent(val)}
    const changeDifficulty= (val)=>{setDifficulty(val);}
    const changeStartP= (val) =>{setStartPoint(val)}
    const changeEndP= (val) =>{setEndPoint(val)}
    const changeDescription= (val)=>{setDescription(val)}


    //handler for form submission
    const submitHikeForm= (event)=>{
        event.preventDefault();
        let newHike;
        //Checks on needed fields
        if(title!== ""){ 
            if(length!== "" && difficulty!== ""){
                 if(startPoint!==0 && endPoint!==0){
                    if(description!== ""){

                        const sql = 'INSERT INTO HIKES (title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description) VALUES(?,?,?,?,?,?,?,?,?)';

                        //here do the check on user's role (?) and then add the new Hike
                        newHike={title: title, length: length, expected_time: expTime, ascent: ascent, difficulty: difficulty, 
                                startPoint:startPoint, endPoint: endPoint, reference_points: refPoints,description: description //map
                                }
                        console.log(newHike);
                        props.CreateNewHike(newHike)
                        alert('New Hike correctly added!')

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
        setStartPoint(0); setEndPoint(0)
        //setRefPoints() --> vector
        setDifficulty(''); setDescription('')
    }
    
    //Import gpx file and read, gpx parse it is used to retreive the start point and the end point (format latitude,longitude)
    //after have red the file it changes automatically the start point and the end point 
    const importGpx = (selectedFile) => {
        const $ = require( "jquery" );
        let gpxParser = require('gpxparser');
        var gpx = new gpxParser()

        let reader = new FileReader();
      
        reader.readAsText(selectedFile);
      
        reader.onload = function() {
            setMap(reader.result)  
            gpx.parse(reader.result)
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
            console.log(positions[0]);
            console.log(positions[positions.length-1]);
            $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+positions[0][0]+'&lon='+positions[0][1]+'&format=json&limit=1&q=', function(data) {

            $.each(data, function(key, val) {
                changeStartP(data.display_name);
            })      
            }); 
            $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+positions[positions.length-1][0]+'&lon='+positions[positions.length-1][1]+'&format=json&limit=1&q=', function(data) {

                $.each(data, function(key, val) {
                    changeEndP(data.display_name);
                })        
            });
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
                        <option value='easy'  label="Easy"/>
                        <option value='medium' label="Medium"/>
                        <option value='hard' label="Hard"/>
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
            <Form.Label>//TODO Map</Form.Label>
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
        <Form.Group>
            <Form.Label>//TODO   Reference Points</Form.Label>
        </Form.Group>
        <Button type='submit' style={{background:'green'}}>SAVE</Button>
        <Button style={{background:'green'}} onClick={reset}>Cancel</Button>
    </Form>
    </>)
}


/**HUT FORM */

function HutForm(props){

    const [title, setTitle]= useState('')
    const [position,setPosition]= useState('')
    const [address, setAddress]= useState('')
    //const [refPoints, setRefPoints]= useState([])
    //const [map, setMap]= useState()

    const [errorMsg, setErrorMsg] = useState("");

    const changeTitle= (val)=>{setTitle(val);}
    const changePosition= (val)=>{setPosition(val)}
    const changeAddress= (val)=>{setAddress(val)}

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
                <Form.Control value={position} onChange={(ev) => changePosition(ev.target.value)}/>
            </Row>
            <Form.Label>//TODO Map</Form.Label>
            <Row>
			    <Form.Label>Address</Form.Label>
			    <Form.Control value={address} onChange={(ev) => changeAddress(ev.target.value)}/>
            </Row>
		</Form.Group>
        <Form.Group>
            <Form.Label>//TODO Add Reference Points</Form.Label>
        </Form.Group>
        <Button type='submit' style={{background:'red'}}>SAVE</Button>
        <Button style={{background:'red'}} onClick={reset}>Cancel</Button>
    </Form>
    </>)
}


/**PARKING FORM */

function ParkingLotForm(props){
   
    const [title, setTitle]= useState('')
    const [position,setPosition]= useState('')
    const [address, setAddress]= useState('')
    const [type, setType]= useState('Parking Lot')
    //const [map, setMap]= useState()

    const [errorMsg, setErrorMsg] = useState("");


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
                    onChange={(ev) => setPosition(ev.target.value)} 
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    value={address}
                    onChange={(ev) => setAddress(ev.target.value)}
                ></Form.Control>
            </Form.Group>
            <Button type='submit'>Save</Button>
            {/* <Button onClick={props.test}>test</Button> */}
            <Button onClick={props.cancel}>Cancel</Button>
        </Form>
        
   </>     )
}

export {LocalGuide_Home}