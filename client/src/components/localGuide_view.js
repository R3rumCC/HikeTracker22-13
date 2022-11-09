import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Container, Form, FormGroup, FormLabel, ButtonGroup , Alert, InputGroup} from 'react-bootstrap';
import API from '../API';

//Function for calling the addNewHike API
const addHike= (newHike)=>{
    //setHikes((oldHikes)=>[...oldHikes, newHike]); --> not necessary(?)
    API.addNewHike(newHike)//.then(()=>{setDirty(true)});
}

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
        <text>HELLO LOCAL GUIDE</text>
        <InsertionOptions setHikeForm={selectHike} setParkingForm={selectParking} setHutForm={selectHut}></InsertionOptions>
        <Form>
            <div>{hikeForm ? <HikeForm/> : <></>}</div>
            <div>{parkingLotForm ? <ParkingLotForm/> : <></>}</div>
            <div>{hutForm ? <HutForm/> : <></>}</div>
        </Form>

    </Container>
    )
}

//Button group which allows the Local Guide to select the correct form for the new point of interest he wants to insert
function InsertionOptions(props){
    
    return(<>
        <FormGroup id='insertion_options' >
            <FormLabel>Do you want to insert something new?</FormLabel>
            <Row>
                <ButtonGroup > 
                    <Button  style={{background: 'green', size: 'md'}} value='hike' onClick={()=>props.setHikeForm()}>
                         New Hike Description
                    </Button>
                    <Button  style={{background: 'red', size: 'md'}} value= 'hut'  onClick={()=>props.setHutForm()}>
                        New Hut Description
                    </Button>
                    <Button  style={{background: 'blue', size: 'md'}} value='parking_lot'  onClick={()=>props.setParkingForm()}>
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
    const [startPoint, setStartPoint]= useState()
    const [endPoint, setEndPoint]= useState()
    //const [refPoints, setRefPoints]= useState([])
    const [description, setDescription]= useState('')
    //const [map, setMap]= useState()

    const [errorMsg, setErrorMsg] = useState("");

    const changeTitle= (val)=>{setTitle(val); console.log(title)}
    const changeLength= (val)=>{setLength(val)}
    const changeExpTime= (val)=>{setExpTime(val)}
    const changeAscent= (val)=>{setAscent(val)}
    const changeDifficulty= (val)=>{setDifficulty(val)}
    const changeStartP= (val) =>{setStartPoint(val)}
    const changeEndP= (val) =>{setEndPoint(val)}
    const changeDescription= (val)=>{setDescription(val)}

    //handler for form submission
    const submitHikeForm= (event)=>{
        let newHike;
        if(title=== ''){ setErrorMsg("Enter a title before submit."); } 
        if(length=== null){setErrorMsg("A length for the Hike is required.") }
        if(difficulty=== ''){ setErrorMsg("A difficulty level is required."); }
        //start/end point needed
        if(description=== ''){ setErrorMsg("Enter a description before submit."); } 
           
        //here do the check on user's role and then add the new Hike
        newHike={title: title, length: length, expected_time: expTime, ascent: ascent, difficulty: difficulty, startPoint:startPoint,
                endPoint: endPoint, description: description //start/end + ref points + map
                }
        console.log(newHike);
        //NEXT STEPS: 
        //1) props.addHike (just addHike if defined in this file)
        //2) reset all state values and/or redirect + success message
        //2
        setTitle('')
        setLength('')
        setExpTime('')
        setAscent('')
        setStartPoint('')
        setEndPoint('')
        setDifficulty('')
        setDescription('')
        event.preventDefault();
    }
    


    return(<>
    {errorMsg ? <Alert variant="danger" message={errorMsg} onClose={()=>{setErrorMsg('')}} delay={4000} autohide/> : '' //to be solved
    }

    <Form id='hikeForm' style={{fontSize:15, fontWeight:'bold'}} onSubmit={submitHikeForm}>
        <Form.Group>
			<Form.Label>Title</Form.Label>
			<Form.Control value={title} onChange={(ev) => changeTitle(ev.target.value)}/>
		</Form.Group>
        <Form.Group>
            <Row>
                <Col>
			        <Form.Label>Lenght</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control value={length} onChange={(ev) => changeLength(ev.target.value)} placeholder="3.0"/>
                        <InputGroup.Text id="basic-addon2">Km</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col>
                    <Form.Label>Expected Time</Form.Label>
                    <InputGroup className="mb-3">
			            <Form.Control value={expTime} onChange={(ev) => changeExpTime(ev.target.value)} placeholder="4.30"/>
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
                    <Form.Select>
                        <option label=''></option>
                        <option value='easy'  label="Easy" onChange={(ev) => changeDifficulty(ev.target.value)}/>
                        <option value='medium' label="Medium" onChange={(ev) => changeDifficulty(ev.target.value)}/>
                        <option value='hard' label="Hard" onChange={(ev) => changeDifficulty(ev.target.value)}/>
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
        <Form.Group>
			<Form.Label>Description</Form.Label>
			<Form.Control value={description} onChange={(ev) => changeDescription(ev.target.value)}/>
		</Form.Group>
        <Form.Group>
            <Form.Label>//TODO   Reference Points</Form.Label>
        </Form.Group>
        <Button type='submit' style={{background:'green'}}>SUBMIT</Button>
    </Form>
    </>)
}



/**PARKING FORM */

function ParkingLotForm(props){
    return(<>
        <text>parking lot form</text>
  </>)
}

/**HUT FORM */

function HutForm(props){
    return(<>
        <text>Hut form</text>
  </>)
}

export {LocalGuide_Home}