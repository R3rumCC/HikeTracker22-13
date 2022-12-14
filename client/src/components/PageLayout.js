import React, { useState, useContext } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { SearchHut } from './SearchHut';
import { HikePage } from './hikePage';
import { UserForm } from './newUserForm';
import { LoginForm } from './Auth';
import { HikesContainer } from './hikesCards';
import  FilterForm from './Filter';
import MessageContext from '../messageCtx';
import FileUploader from './UploadGpxForm';
import ClipLoader from 'react-spinners/ClipLoader';

/**
 * Except when we are waiting for the data from the server, this layout is always rendered.
 * <Outlet /> component is replaced according to which route is matching the URL.
 */


//SERVICE CARD LAYOUT FOR NO LOGGED USERS
function DefaultLayout(props) {

  
  const { handleErrors } = useContext(MessageContext);
  //const [hikes, setHikes] = useState([]);                 //move to App.js to use it also in localGuideHome
  const [hidden, setHidden] = useState(true);
  const [filteredHikes, setFilteredHikes] = useState([])
  const [filtered, setFiltered] = useState(false)


  

  /*useEffect(() => {
    async function fetchHikes() {
      try {
        const fetchedHikes = await API.getHikes();
        setHikes(fetchedHikes);
      } catch (error) {
        handleErrors(error);
      }
    }
    fetchHikes();
  }, []);*/
  
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
              {!hidden ? <FilterForm isLoading={props.isLoading} setLoading={props.setLoading} hikes={props.hikes} setFiltered = {setFiltered} setFilteredHikes={setFilteredHikes} setHidden={setHidden} ></FilterForm> : null}
            </Row>

          </Row>
          <Row>
            {hidden ? <HikesContainer role= {props.role} name ={props.name} hikes={!filtered ? props.hikes : filteredHikes} setCurrentHike={props.setCurrentHike}/> : null}
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
        <UserForm CreateNewAccount={props.CreateNewAccount} checkUser={props.checkUser} sendEmail={props.sendEmail} checkCode={props.checkCode}/>
      </Col>
    </Row>
  );
}

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
        <HikePage currentHike={props.currentHike} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></HikePage>
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