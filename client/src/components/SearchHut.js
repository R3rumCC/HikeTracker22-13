import { Button, Form, Col, Row } from 'react-bootstrap';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import MessageContext from '../messageCtx';

//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut(){

  const { handleErrors } = useContext(MessageContext);
  const [huts, setHuts] = useState([]);

  async function getHuts(){
    try{
      const list = await API.getHuts();
      setHuts(list);
    } catch(e){
      handleErrors(e);
    }
  }

  useEffect(() =>{
    getHuts();
    console.log(huts);
  }, []);

    return(
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
                placeholder="Enter the geographival area of the hut"
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
        <Row>
          Huts will appear here
        </Row>
      </Col>
    )
}

function SearchHutButton(props) {
    const navigate = useNavigate();
    if(props.searchPage){
      return (
        <Button variant="outline-light" floating='right' onClick={() =>{props.setSearchPage(false); navigate('/')}}>Home</Button>
      )
    }else{
      return (
        <Button variant="outline-light" floating='right' onClick={() =>{props.setSearchPage(true); navigate('/searchHut')}}>Search Hut</Button>
      )
    }
}

export{SearchHut, SearchHutButton};