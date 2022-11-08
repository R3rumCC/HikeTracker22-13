import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Container, Form, FormGroup, FormLabel, ButtonGroup } from 'react-bootstrap';


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
    const selectHut= ()=>{if (selectHut) {
                            setHutForm(false)
                        } else{
                            setHutForm(true); setHikeForm(false); setParkingLotForm(false);
                        }};
    
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
                    <Button value='hike' onClick={()=>props.setHikeForm()}>
                         New Hike Description
                    </Button>
                    <Button value='parking_lot'  onClick={()=>props.setParkingForm()}>
                        New Parking Lot
                    </Button>
                    <Button value= 'hut'  onClick={()=>props.setHutForm()}>
                        New Hut Description
                    </Button>
                </ButtonGroup>
            </Row>
        </FormGroup>
    </>)
}
/**Qui nei bottoni aggiungere anche il cambio di visibility del form*/

function HikeForm(props){
    return(<>
          <text>HikeForm</text>
    </>)
}

function ParkingLotForm(props){
    return(<>
        <text>parking lot form</text>
  </>)
}


//HutForm visibility to be fixed
function HutForm(props){
    return(<>
        <text>Hut form</text>
  </>)
}

export {LocalGuide_Home}