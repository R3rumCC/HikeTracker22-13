import { Card, Button, Container, Row, ListGroup, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { Component }  from 'react';

function HikeCard(props) {
    return(
        <Card className ="text-center me-2 my-1  " border="primary" style={{ width: '18rem' }}>
            <Card.Header as="h5">{props.hike.title}</Card.Header>
            <Card.Body>
                <Card.Text>Length: {props.hike.length}</Card.Text>
                <Card.Text>Expected Time: {props.hike.expected_time}</Card.Text>
                <Card.Text>Ascent: {props.hike.ascent}</Card.Text>
                <Card.Text>Difficulty: {props.hike.difficulty}</Card.Text>
                <Card.Text>Start Point: {props.hike.start_point_nameLocation}</Card.Text>
                <Card.Text>End Point: {props.hike.end_point_nameLocation}</Card.Text>
                <ListGroup>Reference Points: {props.hike.reference_points.map((point)=>{return(<ListGroup.Item key={point.idPoint}>{point.nameLocation}</ListGroup.Item>)})}</ListGroup>
                <Card.Text>Description: {props.hike.description}</Card.Text>
                {props.role=='Hiker' ? <Link to='/Map'><Button onClick={()=>{props.setCurrentHike([props.hike])}}>See on map</Button></Link>: null}
            </Card.Body>
        </Card>
    );
}

function HikesContainer(props){
    const hikes = props.hikes;
    return(
        <div className="d-flex justify-content-start flex-wrap">
            {hikes.length != 0 ? hikes.map((hike) => {return(<HikeCard role={props.role} key={hike.title} hike={hike} setCurrentHike={props.setCurrentHike}/>)}) : <h3>No result found</h3>}
        </div>
    );
}

export {HikesContainer};