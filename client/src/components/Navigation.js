import { React, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';
import { PersonCircle } from "react-bootstrap-icons";


const Navigation = (props) => {

  const OPACITY_WHEN_MOUSE_INTERACT = 0.6;
  const NORMAL_OPACITY = 0.85;
  const [opacity, setOpacity] = useState(NORMAL_OPACITY);

  return (
    // 
    <Navbar bg="primary" expand="lg" variant="dark" className="justify-content-between">
      <Link to="/" onClick={() => { props.setCurrentMarkers([]) }}>
        <Navbar.Brand>
          <i className="bi bi-compass icon-size m-2" /> Hike Tracker
        </Navbar.Brand>
      </Link>
      <Nav>
        <Container fluid>
          <Row>
            {props.loggedIn ? <Col >
              <Navbar.Text >
                {`Welcome, ${props.user.role} ${props.user.name}!`}
              </Navbar.Text>
            </Col> : null}
            <Col >
              {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
            </Col>
            <Col>
              {props.loggedIn && props.user.role == "Hiker" ? <PersonCircle
                className="m-2"
                fill="white"
                fontSize={32}
                onClick={props.profilePage}
                opacity={opacity}
                onMouseOver={() => setOpacity(OPACITY_WHEN_MOUSE_INTERACT)}
                onMouseLeave={() => setOpacity(NORMAL_OPACITY)}
                onMouseDown={() => setOpacity(1)}
                onMouseUp={() => setOpacity(OPACITY_WHEN_MOUSE_INTERACT)}
              /> : <></>}
            </Col>
          </Row>
        </Container>
      </Nav>
    </Navbar>
  );
}


export { Navigation }; 