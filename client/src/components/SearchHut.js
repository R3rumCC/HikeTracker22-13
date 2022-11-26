import { Button, Form, Col, Row, Card } from 'react-bootstrap';
import { useEffect, useState, useContext, React } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import MessageContext from '../messageCtx';

function HutContainer(props) {
  const huts = props.huts;
  return (
    <div className="d-flex justify-content-start flex-wrap">
      {huts.length != 0 ? huts.map((hut) => { return (<HutCard nameLocation={hut.nameLocation} address={hut.address} gps_coordinates={hut.gps_coordinates} />) }) : <h3>No result found</h3>}
    </div>
  );
}

function Coordinates(props) {
  const coordinates = props.coordinates.split(',');
  return (
    <Row>
      <Col>
        <Card.Text>Latitude: {coordinates[0]}</Card.Text>
      </Col>
      <Col>
        <Card.Text>Longitude: {coordinates[1]}</Card.Text>
      </Col>
    </Row>
  );
}

function HutCard(props) {
  return (
    <Card>
      <Card.Header>{props.nameLocation}</Card.Header>
      <Card.Body>
        <Card.Text>Address: {props.address}</Card.Text>
        <Coordinates coordinates={props.gps_coordinates}/>
      </Card.Body>
    </Card>
  )
}

//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut() {

  const { handleErrors } = useContext(MessageContext);
  const [huts, setHuts] = useState([]);

  async function getHuts() {
    try {
      const list = await API.getHuts();
      console.log("Post API");
      console.log(list);
      setHuts(list);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    getHuts();
    console.log(huts);
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
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the name of the hut"
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
                />
              </Form.Group>
            </Col>
          </Row>
          <Button className="mt-3 me-3">Search</Button>
          <Button className="mt-3" type='reset'>Cancel</Button>
        </Form>
      </Row>
      <br/>
      <Row>
        <HutContainer huts={huts} />
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