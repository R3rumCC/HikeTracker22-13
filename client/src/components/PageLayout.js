import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';
import { SearchHut } from './SearchHut';
import { HikePage } from './hikePage';
import { UserForm } from './newUserForm';
import { LoginForm } from './Auth';
import { HikesContainer } from './hikesCards';
import  FilterForm from './Filter';
import MessageContext from '../messageCtx';
import API from '../API';
import FileUploader from './UploadGpxForm';
import ClipLoader from 'react-spinners/ClipLoader';

/**
 * Except when we are waiting for the data from the server, this layout is always rendered.
 * <Outlet /> component is replaced according to which route is matching the URL.
 */


//SERVICE CARD LAYOUT FOR NO LOGGED USERS
function DefaultLayout(props) {

  
  const { handleErrors } = useContext(MessageContext);
  const [hikes, setHikes] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [filteredHikes, setFilteredHikes] = useState([])
  const [filtered, setFiltered] = useState(false)

  

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

  <>
    { props.isLoading ? 
        (<ClipLoader color={'#fff'} size={150} />) : (
        <Container >
          <Row>
            <h1>Welcome, this is the Available Hikes List!</h1>
          </Row>
          <Row bg='white'>
            <Row >
              <Col>
                { <Button className='mt-5 mb-3'  onClick={()=>setHidden( s =>!s)}>Filter</Button> }
                {filtered ? <Button className='mt-5 mb-3 ms-3'  onClick={()=>{setFiltered(false); setFilteredHikes([])}}>Clear</Button> : null }
              </Col>

            </Row>
            <Row>
              {!hidden ? <FilterForm isLoading={props.isLoading} setLoading={props.setLoading} hikes={hikes} setFiltered = {setFiltered} setFilteredHikes={setFilteredHikes} setHidden={setHidden} ></FilterForm> : null}
            </Row>

          </Row>
          <Row>
            {hidden ? <HikesContainer role= {props.role} name ={props.name} hikes={!filtered ? hikes : filteredHikes} setCurrentHike={props.setCurrentHike}/> : null}
          </Row>
        </Container>
        )
    }
    </>
  )
}
function FileUploadLayout(){

  return(
    <Container className='my-5'>
      <FileUploader></FileUploader>
    </Container>

  )
}

function RegisterLayout(props) {
  return (
    <Row className="vh-200">
      <Col md={12} className="below-nav">
        <UserForm CreateNewAccount={props.CreateNewAccount} />
      </Col>
    </Row>
  );
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
    <Row className="vh-200">
        <HikePage currentHike={props.currentHike}></HikePage>
    </Row>
  );  
}

//SEARCH LAYOUT
function SearchLayout(){
  return (  
    <Row className="vh-200">
        <Col md={12} className="below-nav">
          <SearchHut />
        </Col>
    </Row>
  )
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
export { LoginLayout, DefaultLayout, HikerLayout, FileUploadLayout,RegisterLayout, SearchLayout };