import { Button, Form, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut(){
    return(
      <Col className="vh-100 justify-content-md-center">
        <Row>
          <h1>Search Hut</h1>
        </Row>
        <Row>
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Example: john.doe@polito.it"
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter the password."
                required={true} //minLength={6}
              />
            </Form.Group>
            <Button className="mt-3 me-3" type="submit">Login</Button>
            <Button className="mt-3" >Cancel</Button>
          </Form>
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