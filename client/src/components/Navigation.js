import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';
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
        <i className="bi bi-signpost-2-fill icon-size m-2"/> Office Queue Managment
        </Navbar.Brand>
      </Link>
      <Nav>
        <Navbar.Text className="mx-3">
          {props.user && props.user.name && `Welcome, ${props.user.role ? props.user.role : ''} ${props.user.name}!`}
        </Navbar.Text>
        <Form className="mx-3">
          {props.loggedIn ? <LogoutButton logout={props.logout} /> :  <LoginButton />}
        </Form>
      </Nav>
    </Navbar>
  );
}

export { Navigation }; 