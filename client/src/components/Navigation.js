import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';

const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Navbar bg="primary" expand="lg" variant="dark" fixed="top" className="justify-content-between">
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