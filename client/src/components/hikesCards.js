import { Card, Button, Row, ListGroup, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; 
import {React, useRef, useMemo, useEffect, useState} from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import dayjs from 'dayjs';
import { Filter } from "react-bootstrap-icons";

function HikeCard(props) {

  function startHike() {
    let start_time = dayjs();
    props.startHike(props.currentUser.username, props.hike.title, start_time.format('YYYY/MM/DD HH:mm:ss'));
    props.setCurrentHike([props.hike]);
  }

  function endHike() {
    let end_time = dayjs();
    props.endHike(props.currentUser.username, props.hike.title, props.hike.start_time, end_time.format('YYYY/MM/DD HH:mm:ss'));
  }

  console.log(props.flagOnGoingHike)

  return (
    <Card className="text-center me-2 my-1" border="primary" style={{ width: '18rem' }}>
      <Card.Header as="h5"><strong>{props.hike.title}</strong></Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Card.Text><strong>Length:<br></br> {props.hike.length} km</strong></Card.Text>
          </Col>
          <Col>
            <Card.Text><strong>Expected Time:<br></br> {props.hike.expected_time} h</strong></Card.Text>
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col>
            <Card.Text><strong>Ascent:<br></br> {props.hike.ascent} m</strong></Card.Text>
          </Col>
          <Col>
            <Card.Text><strong>Difficulty:</strong><br></br><em>{props.hike.difficulty}</em></Card.Text>
          </Col>
        </Row>
        <br></br>
        <Card.Text><strong>Start Point:</strong>{props.hike.start_point_nameLocation ? <><br></br><em>{props.hike.start_point_nameLocation}</em></> : null}<br></br>{props.hike.start_point_address}</Card.Text>
        <Card.Text><strong>End Point:</strong>{props.hike.end_point_nameLocation ? <><br></br><em>{props.hike.end_point_nameLocation}</em></> : null}<br></br>{props.hike.end_point_address}</Card.Text>
        {props.hike.reference_points.length > 0 ? <ListGroup><strong>Reference Points:</strong><br></br>  {props.hike.reference_points.map((point) => { return (<ListGroup.Item key={point.idPoint}>{point.nameLocation}</ListGroup.Item>) })}</ListGroup> : null}
        <Card.Text><strong>Description:</strong><br></br> {props.hike.description}</Card.Text>
        {props.role == 'Hiker' ? <Link to='/Map'><Button style={{ margin: 5 }} onClick={() => { props.setCurrentHike([props.hike]) }}>See on map</Button></Link> : null}
        {props.role == 'LocalGuide' ? <Link to='/editHike'><Button onClick={() => { props.setCurrentHike(props.hike) }}>Edit hike</Button></Link> : null}
        {props.role == 'Hiker' && !props.flagOnGoingHike ? <Link to='/profile'><Button className="btn btn-success" style={{ margin: 5 }} onClick={() => { startHike() }}>Start hike</Button></Link> : null}
        {/*flag is a costant for choose to see or not the Start Button in the hikeCard. If it is true -> we are in onGoingHike page -> no show Start button but show eventually the End button*/}
        {/*flagOnGoingHike is a costant for choose to see or not the Start Button in the hikeCard. If it is true -> there is an hike in progress for the currentUser -> no show Start button*/}
        {props.role == 'Hiker' && props.flag ? <Link to='/'><Button className="btn btn-danger" style={{ margin: 5 }} onClick={() => { endHike() }}>End hike</Button></Link> : null}
      </Card.Body>
    </Card>
  );
}

function HikesContainer(props) {
  /*const [hikes, setHikes] = useState([]);
  const [displayedHikes, setDisplayedHikes] = useState([]);
  const [groupNum, setGroupNum] = useState(0);

  useEffect(() => {
    setHikes(props.hikes)
  }, [])

  useEffect(() => {
    setGroupNum(hikes.length/6);
    if(hikes.length % 6 !=0)
      setGroupNum(groupNum + 1);
    changeDsiplayedHikes(1)
  }, [hikes]);

  function changeDsiplayedHikes(group){
    if(group < groupNum){
      let sliceStart = (group-1)*6;
      let sliceEnd = hikes.length > sliceStart+6 ? sliceStart+6 : hikes.length;
      setDisplayedHikes(hikes.slice(sliceStart, sliceEnd));
    }
  }  

  return(
    <>
      <Row>
        {displayedHikes.length != 0 ? displayedHikes.map((hike) => { return (<HikeCard role={props.role} key={hike.title} hike={hike} setCurrentHike={props.setCurrentHike} startHike={props.startHike} endHike={props.endHike} currentUser={props.currentUser} flag={props.flag} flagOnGoingHike={props.flagOnGoingHike} />) }) : <h3>No result found</h3>}
      </Row> 
      <Row>
        Buttons go here
      </Row>
    </> 
  );*/

  //const hikes = props.hikes;

  const actualIdx = useRef(0)
  const PAGE_SIZE = 8;
  const [hikes,setHikes] = useState([]);
  const index = useRef(PAGE_SIZE)
  const isLoading = useRef(true)
  useEffect(()=>{
    setHikes(props.hikes.length !=0 ? props.hikes.slice(0, PAGE_SIZE > props.hikes.length ? props.hikes.length : PAGE_SIZE) : [])
    isLoading.current = false
  },[props.hikes])
  const nextPage = () =>{
 
    actualIdx.current = index.current == props.hikes.length ? actualIdx.current : index.current
    index.current = index.current + PAGE_SIZE > props.hikes.length ? props.hikes.length : index.current + PAGE_SIZE
    setHikes(props.hikes.slice(actualIdx.current,index.current))

  }
  const prevPage = () =>{
    index.current = actualIdx.current == 0 ? index.current : actualIdx.current
    actualIdx.current = actualIdx.current - PAGE_SIZE > 0 ? actualIdx.current - PAGE_SIZE : 0
    setHikes(props.hikes.slice(actualIdx.current,index.current))
  }
  //To solve the issue of showing too many hikes at once the followwing approach is to be taken:
  //Divide the hikes in groups of fixed size (6?)
  //Create N divs and show them using a useState akin to the profiles page system
  //Create buttons to navigate between them
  return (
    <>
      { hikes.length == 0 && !props.filter ? <ClipLoader color={'#fff'} size={150} /> : 
      <> 
        <div className="d-flex justify-content-start flex-wrap">
          {hikes.length != 0 ? hikes.map((hike) => { return (<HikeCard role={props.role} key={hike.title} hike={hike} setCurrentHike={props.setCurrentHike} startHike={props.startHike} endHike={props.endHike} currentUser={props.currentUser} flag={props.flag} flagOnGoingHike={props.flagOnGoingHike} />) }) : <h3>No result found</h3>}
        </div>
        <Container className="d-flex justify-content-center mt-2">
          <Row>
            <Col>
              {actualIdx.current !=0 && hikes.length !=0? <Button className="me-2" onClick={() =>prevPage()}>Previous Page</Button> : null}
              {index.current != props.hikes.length && hikes.length !=0 ? <Button onClick={() =>nextPage()}>Next Page</Button>: null}
            </Col>
          </Row>
        </Container>
      </>}
    </>

  );
}

export { HikesContainer };