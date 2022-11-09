import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import { LoginForm } from './Auth';
import { HikesContainer } from './hikesCards';
import  FilterForm from './Filter';
import MessageContext from '../messageCtx';
import API from '../API';

/**
 * Except when we are waiting for the data from the server, this layout is always rendered.
 * <Outlet /> component is replaced according to which route is matching the URL.
 */


//SERVICE CARD LAYOUT FOR NO LOGGED USERS
function DefaultLayout(props) {

  const { handleErrors } = useContext(MessageContext);
  const [hikes, setHikes] = useState([]);
  const [currentHike, setCurrentHike] = useState({})
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function fetchHikes() {
      try {
        const fetchedHikes = await API.getHikes();
        setHikes(fetchedHikes);
      } catch (error) {
        handleErrors(error);
      }
    }
    fetchHikes();
  }, []);

  return (
    <Container className='my-5'>
      <Row bg='white'>
        <Row >
          <Col>
            { <Button className='mt-5 mb-3'  onClick={()=>setHidden( s =>!s)}>Filter</Button> }
          </Col>

        </Row>
        <Row>
          {!hidden ? <FilterForm display='none' ></FilterForm> : null}
        </Row>

      </Row>
      <Row>
        <HikesContainer hikes={hikes} setCurrentHike={setCurrentHike}/>
      </Row>
    </Container>


  )
}

/*
function MainLayout(props) {

  const [films, setFilms] = useState([]);
  const [dirty, setDirty] = useState(true);

  const location = useLocation();

  const {handleErrors} = useContext(MessageContext);


  const { filterLabel } = useParams();
  const filterName = props.filters[filterLabel] ? props.filters[filterLabel].label : 'All';
  const filterId = filterLabel || (location.pathname === "/" && 'filter-all');

  // Without this we do not pass the if(dirty) test in the [filterId, dirty] useEffect
  useEffect(() => {
    setDirty(true);
  }, [filterId])


  useEffect(() => {
    if (dirty) {
      API.getFilms(filterId)
        .then(films => {
          setFilms(films);
          setDirty(false);
        })
        .catch(e => { handleErrors(e);  } ); 
    }
  }, [filterId, dirty]);

  const deleteFilm = (film) => {
    API.deleteFilm(film)
      .then(() => { setDirty(true);})
      .catch(e => handleErrors(e)); 
  }

  // update a film into the list
  const updateFilm = (film) => {
    API.updateFilm(film)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  // When an unpredicted filter is written, all the films are displayed.
  const filteredFilms = films; 


  return (
    <>
      <h1 className="pb-3">Filter: <span className="notbold">{filterName}</span></h1>
      <FilmTable films={filteredFilms}
        deleteFilm={deleteFilm} updateFilm={updateFilm} />
      <Link to="/add" state={{ nextpage: location.pathname }}>
        <Button variant="primary" size="lg" className="fixed-right-bottom" > &#43; </Button>
      </Link>
    </>
  )
}

function AddLayout(props) {

  const {handleErrors} = useContext(MessageContext);

  // add a film into the list
  const addFilm = (film) => {
    API.addFilm(film)
      .catch(e => handleErrors(e)); 
  }
  return (
    <FilmForm addFilm={addFilm} />
  );
}

function EditLayout(props) {

  const {handleErrors} = useContext(MessageContext);

  const { filmId } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    API.getFilm(filmId)
      .then(film => {
        setFilm(film);
      })
      .catch(e => {
        handleErrors(e); 
      }); 
  }, [filmId]);

  // update a film into the list
  const editFilm = (film) => {
    API.updateFilm(film)
      .catch(e => handleErrors(e)); 
  }


  return (
    film ? <FilmForm film={film} editFilm={editFilm} /> : <></>
  );
}

function NotFoundLayout() {
  return (
    <>
      <h2>This is not the route you are looking for!</h2>
      <Link to="/">
        <Button variant="primary">Go Home!</Button>
      </Link>
    </>
  );
}
*/

//LOGIN LAYOUT
function LoginLayout(props) {
  return (
    <Row className="vh-200">
      <Col md={12} className="below-nav">
        <LoginForm login={props.login} />
      </Col>
    </Row>
  );
}

//MAP LAYOUT
function HikerLayout(props) {
  return (
    <Row>
      Hiker layout
    </Row>
  );
}

/**
 * This layout shuld be rendered while we are waiting a response from the server.
 */
/*function LoadingLayout(props) {
  
  return (
    <Row className="vh-100">
      <Col md={4} bg="light" className="below-nav" id="left-sidebar">
      </Col>
      <Col md={8} className="below-nav">
        <h1>Office Queue Managment ...</h1>
      </Col>
    </Row>
  )
}
*/
//export { DefaultLayout, AddLayout, EditLayout, NotFoundLayout, LoginLayout, MainLayout, LoadingLayout };
export { LoginLayout, DefaultLayout, HikerLayout };