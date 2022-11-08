import { Card, Button, Container, Row, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function calcWait(tr, nr, ki, sir){

    //Missing implementation of the calculation

    return tr
}



function HikeCard(props) {
    return(
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.hike.title}</Card.Title>
                <Card.Text>Length: {props.hike.length}</Card.Text>
                <Card.Text>Expected Time: {props.hike.expected_time}</Card.Text>
                <Card.Text>Ascent: {props.hike.ascent}</Card.Text>
                <Card.Text>Difficulty: {props.hike.difficulty}</Card.Text>
                <Card.Text>Start Point: {props.hike.start_point_nameLocation}</Card.Text>
                <Card.Text>End Point: {props.hike.end_point_nameLocation}</Card.Text>
                <ListGroup>Reference Points: {props.hike.reference_points.map((point)=>{return(<ListGroup.Item key={point.idPoint}>{point.nameLocation}</ListGroup.Item>)})}</ListGroup>
                <Card.Text>Description: {props.hike.description}</Card.Text>
                <Link to='/Map'><Button onClick={()=>{props.setCurrentHike(props.hike)}}>See on map</Button></Link>
            </Card.Body>
        </Card>
    );
}

function HikesContainer(props){
    const hikes = props.hikes;
    return(
        <Container>
            {hikes.map((hike) => {return(<HikeCard key={hike.title} hike={hike} setCurrentHike={props.setCurrentHike}/>)})}
        </Container>
    );
}

export {HikesContainer};