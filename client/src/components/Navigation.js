import { React, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SearchHutButton } from './SearchHut';
import { LogoutButton, LoginButton } from './Auth';



const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }  

  //State that identifies whether the user is on the search page or not
  //Used to render the text in the button differently
  const [searchPage, setSearchPage] = useState(false);

  return (
    <Navbar bg="primary" expand="lg" variant="dark" className="justify-content-between">
      <Link to="/">
        <Navbar.Brand>
        <i className="bi bi-compass icon-size m-2"/> Hike Tracker
        </Navbar.Brand>
      </Link>
      <Nav>
        <Container fluid>
          <Row>
            <Col>
              <Navbar.Text >
                {props.user && props.user.name && `Welcome, ${props.user.role ? props.user.role : ''} ${props.user.name}!`}
              </Navbar.Text>
            </Col>
            <Col>
              <Form>
                  {props.loggedIn && props.user.role == "Hiker" ? <SearchHutButton searchPage={searchPage} setSearchPage={setSearchPage} /> : <></>}
              </Form>
            </Col>
            <Col xs={6}>
              <Form className="me-5" >
                  {props.loggedIn ? <LogoutButton logout={props.logout} /> :  <LoginButton />}
              </Form>
            </Col>
          </Row>
        </Container>
      </Nav>
    </Navbar>
  );
}

export { Navigation }; 