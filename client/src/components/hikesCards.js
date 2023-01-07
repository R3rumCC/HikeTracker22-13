import { Card, Button, Row, ListGroup, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { React, useRef, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Badge from 'react-bootstrap/Badge';
import dayjs from 'dayjs';

const default_image = 'https://www.travelmanagers.com.au/wp-content/uploads/2012/08/AdobeStock_254529936_Railroad-to-Denali-National-Park-Alaska_750x500.jpg'
const URL = 'http://localhost:3001/api/Pictures';

function HikeCard2(props) {

  const [colorDiff, setColorDiff] = useState('success');
  const [nameStart, setNameStart] = useState('');
  const [nameEnd, setNameEnd] = useState('');
  const [picName, setPicName]= useState('');
  const [showDetails, setShowDetails]= useState(false);

  function startHike() {
    let start_time = dayjs();
    props.startHike(props.currentUser.username, props.hike.title, start_time.format('YYYY/MM/DD HH:mm:ss'));
    props.setCurrentHike([props.hike]);
  }

  function endHike() {
    let end_time = dayjs();
    props.endHike(props.currentUser.username, props.hike.title, props.hike.start_time, end_time.format('YYYY/MM/DD HH:mm:ss'));
  }

  useEffect(() => {
    setColorDifficulty(props.hike.difficulty)
    console.log(colorDiff)
  }, [props.hike.difficulty])


  useEffect(() => {

    if (props.hike.start_point_nameLocation !== null) {
      setNameStart(props.hike.start_point_nameLocation)
    } else {
      let split_start = props.hike.start_point_address.split(",");
      setNameStart(split_start[0] + " , " + split_start[1])
    }

    if (props.hike.end_point_nameLocation !== null) {
      setNameEnd(props.hike.end_point_nameLocation)
    } else {
      let split_end = props.hike.end_point_address.split(",");
      setNameEnd((split_end[0] + " , " + split_end[1]));
    }

    let name= URL + "/" + props.hike.picture
    setPicName(name)

  }, [props.hike])

  const setColorDifficulty = (difficulty) => {
    if (difficulty === 'Tourist') {
      setColorDiff('success')
    } else if (difficulty === 'Hiker') {
      setColorDiff('warning')
    } else if (difficulty === 'Professional hiker') {
      setColorDiff('danger')
    }
  }

  return (
    <Card className="mx-1 my-1" border='success' style={{ width: '18rem' }}>
      <Card.Img variant="top" src={picName} />
      <Card.Body>

        <Card.Title style={{ fontWeight: 'bold', color: 'green' }}> {props.hike.title}</Card.Title>
        <ListGroup className="list-group-flush" style={{ fontWeight: 'bold', fontSize: 13 }}>
          <ListGroup.Item>
            <Row style={{fontSize: 16}}>
              <Col><Badge bg={colorDiff}> <i className="bi bi-graph-up-arrow"></i> {props.hike.difficulty}</Badge></Col>
              <Col><Badge bg='info'>{props.hike.hike_condition}</Badge></Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row >
              <Col><i className="bi bi-map"></i> {props.hike.length} km</Col>
              <Col><i className="bi bi-stopwatch"></i> {props.hike.expected_time} h</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <i className="bi bi-compass"></i> Start Point :
            { !showDetails ? <div style={{ fontWeight: 'normal' }}> {nameStart} </div> : <div style={{ fontWeight: 'normal' }}> {props.hike.start_point_address} </div>}
          </ListGroup.Item>
          <ListGroup.Item>
            <i className="bi bi-compass"></i> End Point :
            { !showDetails ? <div style={{ fontWeight: 'normal' }}>{nameEnd}</div> : <div style={{ fontWeight: 'normal' }}> {props.hike.end_point_address} </div>}
          </ListGroup.Item>
          {showDetails ? 
            <>
              <ListGroup.Item>
                <div><i class="bi bi-geo-fill"></i> {props.hike.ascent} m</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div> Description : </div>
                <div style={{ fontWeight: 'normal' }}>{props.hike.description}</div>
              </ListGroup.Item> 
            </>
            
          : null}
          <ListGroup.Item>
            {props.role == 'Hiker' ? <Card.Link><Link to='/Map' style={{ fontWeight: 'normal', fontSize: 16 }} onClick={() => { props.setCurrentHike([props.hike]) }}>See on map</Link></Card.Link> : null}
          </ListGroup.Item>
            {props.role == 'Hiker' && props.flagCompleted ?
              <ListGroup.Item>
                <Row>
                  <Col>Times completed: </Col>
                  <Col style={{ fontWeight: 'normal' }}> {props.hike.times_completed} </Col>
                </Row>
              </ListGroup.Item>
              : null
            }
            {props.role == 'Hiker' && props.flagCompleted ?
              <ListGroup.Item>
                <Row>
                  <Col>Best time: </Col>
                  <Col style={{ fontWeight: 'normal' }}> {props.hike.best_time} min</Col>
                </Row>
              </ListGroup.Item>
              : null
            }
        </ListGroup>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col><Button variant='outline-success' onClick={() => {setShowDetails(!showDetails)}}>Details</Button></Col>
          <Col>
            {props.role == 'LocalGuide' ? <Link to='/editHike'><Button variant='outline-success' onClick={() => { props.setCurrentHike(props.hike) }}>Edit hike</Button></Link> : null}
            {props.role == 'Hiker' && !props.flagOnGoingHike ? <Link to='/profile'><Button variant='outline-success' onClick={() => { startHike() }}>Start hike</Button></Link> : null}
            {/*flag is a costant for choose to see or not the Start Button in the hikeCard. If it is true -> we are in onGoingHike page -> no show Start button but show eventually the End button*/}
            {/*flagOnGoingHike is a costant for choose to see or not the Start Button in the hikeCard. If it is true -> there is an hike in progress for the currentUser -> no show Start button*/}
            {props.role == 'Hiker' && props.flag ? <Link to='/'><Button className="btn btn-danger" onClick={() => { endHike() }}>End hike</Button></Link> : null}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );

}


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
  const [hikes, setHikes] = useState([]);
  const index = useRef(PAGE_SIZE)
  const isLoading = useRef(true)
  useEffect(() => {
    setHikes(props.hikes.length != 0 ? props.hikes.slice(0, PAGE_SIZE > props.hikes.length ? props.hikes.length : PAGE_SIZE) : [])
    isLoading.current = false
  }, [props.hikes])
  const nextPage = () => {

    actualIdx.current = index.current == props.hikes.length ? actualIdx.current : index.current
    index.current = index.current + PAGE_SIZE > props.hikes.length ? props.hikes.length : index.current + PAGE_SIZE
    setHikes(props.hikes.slice(actualIdx.current, index.current))

  }
  const prevPage = () => {
    index.current = actualIdx.current == 0 ? index.current : actualIdx.current
    actualIdx.current = actualIdx.current - PAGE_SIZE > 0 ? actualIdx.current - PAGE_SIZE : 0
    setHikes(props.hikes.slice(actualIdx.current, index.current))
  }
  //To solve the issue of showing too many hikes at once the followwing approach is to be taken:
  //Divide the hikes in groups of fixed size (6?)
  //Create N divs and show them using a useState akin to the profiles page system
  //Create buttons to navigate between them
  return (
    <>
      {hikes.length == 0 && !props.filter ? <>{!props.flagOnGoingHike ? <h1>There aren't on going hikes.</h1> : <ClipLoader color={'#fff'} size={150} />}</> :
        <>
          {/**From grid example, to better separate cards:     <Row xs={1} md={2} className="g-4"> */}
          <div className="d-flex justify-content-start flex-wrap">
            {hikes.length != 0 ? hikes.map((hike) => { return (<HikeCard2 role={props.role} key={hike.title} hike={hike} setCurrentHike={props.setCurrentHike} startHike={props.startHike} endHike={props.endHike} currentUser={props.currentUser} flag={props.flag} flagOnGoingHike={props.flagOnGoingHike} flagCompleted={props.flagCompleted} />) }) : <h3>No result found</h3>}
          </div>
          {<Container className="d-flex justify-content-center mt-2">
            <Row >
              <Col>
                {actualIdx.current != 0 && hikes.length != 0 ? <Button className="me-2" onClick={() => prevPage()}>Previous Page</Button> : null}
                {index.current < props.hikes.length && hikes.length != 0 ? <Button onClick={() => nextPage()}>Next Page</Button> : null}
              </Col>
            </Row>
          </Container>
          }
        </>}
    </>

  );
}

export { HikesContainer };