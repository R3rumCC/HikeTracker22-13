import { Button, Form, Col, Row, Card } from 'react-bootstrap';
import { useEffect, useState, useContext, React } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import MessageContext from '../messageCtx';

function HutContainer(props) {
  const huts = props.huts;
  return (
    <div className="d-flex justify-content-start flex-wrap">
      {huts.length != 0 ? huts.map((hut) => { return (<HutCard nameLocation={hut.nameLocation} address={hut.address} gps_coordinates={hut.gps_coordinates} geoFilter={props.geoFilter} nameFilter={props.nameFilter} latFilter={props.latFilter} longFilter={props.longFilter}/>) }) : <h4>No result found</h4>}
    </div>
  );
}

function Coordinates(props) {  
  return (
    <Row>
      <Col>
        <Card.Text>Latitude: {props.coordinates[0]}</Card.Text>
      </Col>
      <Col>
        <Card.Text>Longitude: {props.coordinates[1]}</Card.Text>
      </Col>
    </Row>
  );
}

function filterCheck(arg, filter){
  if(arg.indexOf(filter) > -1){
    return true;
  }
  else return false;
}

function HutCard(props) {
  const coordinates = props.gps_coordinates.split(',');
  if(filterCheck(props.nameLocation, props.nameFilter) && filterCheck(props.address, props.geoFilter) && filterCheck(props.latitude, props.latFilter) && filterCheck(props.longitude, props.longFilter)){
    return (
      <Card>
        <Card.Header>{props.nameLocation}</Card.Header>
        <Card.Body>
          <Card.Text>Address: {props.address}</Card.Text>
          <Coordinates coordinates={coordinates}/>
        </Card.Body>
      </Card>
    );
  }    
}


//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut() {

  const { handleErrors } = useContext(MessageContext);
  const [huts, setHuts] = useState([]);
  const [hutName, setHutName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [geoArea, setGeoArea] = useState("");

  async function getHuts() {
    try {
      const list = await API.getHuts();
      console.log(list);
      setHuts(list);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    getHuts();
  }, []);

  return (
    <Col className="vh-100 justify-content-md-center">
      <Row>
        <h1>Search Hut</h1>
      </Row>
      <Row>
        <Form>
          <Form.Group className="mb-3" controlId="geo">
            <Form.Label>Geographical Area</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the geographical area of the hut"
              value={geoArea} onChange={(e) => {setGeoArea(e.target.value)}}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the name of the hut"
              value={hutName} onChange={(e) => {setHutName(e.target.value)}}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number" step="0.0000001"
                  min="-90.0000000" max="90.0000000"
                  placeholder='Enter the latitude'
                  value={latitude} onChange={(e) => {setLatitude(e.target.value.toString())}}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number" step="0.0000001"
                  min="-180.0000000" max="180.0000000"
                  placeholder='Enter the longitude'
                  value={longitude} onChange={(e) => {setLongitude(e.target.value.toString())}}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button className="mt-3 me-3">Search</Button>
          <Button className="mt-3" type='reset'>Reset Filters</Button>
        </Form>
      </Row>
      <br/>
      <Row>
        <HutContainer huts={huts} geoFilter={geoArea} nameFilter={hutName} latFilter={latitude} longFilter={longitude}/>
      </Row>
    </Col>
  )
}

function SearchHutButton(props) {
  const navigate = useNavigate();
  if (props.searchPage) {
    return (
      <Button variant="outline-light" floating='right' onClick={() => { props.setSearchPage(false); navigate('/') }}>Home</Button>
    )
  } else {
    return (
      <Button variant="outline-light" floating='right' onClick={() => { props.setSearchPage(true); navigate('/searchHut') }}>Search Hut</Button>
    )
  }
}

export { SearchHut, SearchHutButton };