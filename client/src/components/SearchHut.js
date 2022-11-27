import { Button, Form, Col, Row, Card } from 'react-bootstrap';
import { useEffect, useState, useContext, React } from 'react';
import { UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import API from '../API';
import MessageContext from '../messageCtx';

function hutMapping(dbHuts) {
  let newHuts = [];
  newHuts = dbHuts.map((h) => {
    return {name: h.nameLocation, address: h.address, latitude: h.gps_coordinates.split(',')[0], longitude: h.gps_coordinates.split(',')[1]}
  });
  console.log(newHuts);
  return newHuts;
}

function HutContainer(props) {
  const huts = props.huts;
  return (
    <div className="d-flex justify-content-start flex-wrap">
      {huts.length != 0 ? huts.map((hut) => { return (<HutCard key={hut.address} name={hut.name} address={hut.address} latitude={hut.latitude} longitude={hut.longitude} />) }) : <h4>No result found</h4>}
    </div>
  );
}

function filterCheck(arg, filter) {
  if (arg === null) {
    return true;
  }
  else if(filter == ''){
    return true;
  }
  else if (arg.includes(filter)) {
    return true;
  }
  else return false;
}

function filterLatLng(arg, filter){
  console.log(Math.floor(arg),Math.floor(filter))
  if (arg === null) {
    return true;
  }
  else if(filter == ''){
    return true;
  }
  else if( Math.floor(arg) == Math.floor(filter) ){
    return true
  }
  else return false;
}

function HutCard(props) {
  return (
    <Card style={{width: '20rem'}}>
      <Card.Header>{props.name}</Card.Header>
      <Card.Body>
        <Card.Text>Address: {props.address}</Card.Text>
        <Row>
          <Col>
            <Card.Text>Latitude: {props.latitude}</Card.Text>
          </Col>
          <Col>
            <Card.Text>Longitude: {props.longitude}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut() {

  const { handleErrors } = useContext(MessageContext);
  const [huts, setHuts] = useState([]);
  const [filteredHuts, setFilteredHuts] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [latFilter, setLatFilter] = useState("");
  const [longFilter, setLongFilter] = useState("");
  const [geoFilter, setGeoFilter] = useState("");
  const [filters, setFilters] = useState(false);

  async function getHuts() {
    try {
      const list = await API.getHuts();
      const newList = hutMapping(list);
      setHuts(newList);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    setFilteredHuts(huts.filter((h) => {
      return filterCheck(h.name, nameFilter) && filterCheck(h.address, geoFilter) && filterLatLng(h.latitude, latFilter) && filterLatLng(h.longitude, longFilter)
    }))
  }, [filters]);

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
              value={geoFilter} onChange={(e) => { setGeoFilter(e.target.value) }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the name of the hut"
              value={nameFilter} onChange={(e) => { setNameFilter(e.target.value) }}
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
                  value={latFilter} onChange={(e) => { setLatFilter(e.target.value) }}
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
                  value={longFilter} onChange={(e) => { setLongFilter(e.target.value) }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button className="mt-3 me-3" onClick={() => { setFilters(true) }}>Search</Button>
          <Button className="mt-3" type='reset' onClick={() => { setFilters(false) }}>Reset Filters</Button>
        </Form>
      </Row>
      <br />
      <Row>
        {filters ? <HutContainer huts={filteredHuts} /> : <HutContainer huts={huts} />}
      </Row>
    </Col>
  )
}

function SearchHutButton(props) {

  const useBackListener = (callback) => { // Handler for the back button
    const navigator = useContext(UNSAFE_NavigationContext).navigator;
    useEffect(() => {
        const listener = ({ location, action }) => {
            console.log("listener", { location, action });
            if (action === "POP") {
                callback({ location, action });
            }
        };
        const unlisten = navigator.listen(listener);
        return unlisten;
    }, [callback, navigator]);
};

useBackListener(({ location }) =>{
    console.log("Navigated Back", { location });
    if(props.searchPage){ props.setSearchPage(false); }
});

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