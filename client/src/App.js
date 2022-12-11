import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";

import React, { useState, useEffect, useContext, } from 'react';
import { Container, Toast } from 'react-bootstrap/';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { DefaultLayout, LoginLayout, HikerLayout, RegisterLayout, FileUploadLayout, SearchLayout, PointsLayout } from './components/PageLayout';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Navigation } from './components/Navigation';
//import { LocalGuide_Home } from './components/localGuide_view';
import { LocalGuide_Home } from './components/localGuideHome';
import { Hiker_Home } from './components/hikerHome';

import MessageContext from './messageCtx';
import API from './API';
import Profile from "./components/profile";
import { EditHike } from './components/editHike';
import FileUploader from './components/UploadGpxForm';
import { GenericMap, HikePage } from './components/hikePage';
import { PointsContainer } from './components/pointsCards';


function App() {

  const [message, setMessage] = useState('');

  const handleErrors = (err) => {
    setMessage(err.error); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  //
  //DO NOT IMPLEMENTS ROUTE HERE
  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className="App">
          <Routes>
            <Route path="/*" element={<Main />/*<LocalGuide_Home/>*/} />
          </Routes>
          { }
          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  )
}

function Main() {
  /************AUTHENTICATION VARIABLES*****************/

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentHike, setCurrentHike] = useState([]);
  const [points, setPoints] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [profilePage, setProfilePage] = useState(false);
  //Remember to clear the current markers if the user leaves the page
  const [currentMarkers, setCurrentMarkers] = useState([]);

  const [hikes, setHikes] = useState([]);

  function handleError(err) {

    toast.error(
      err.error,
      { position: "top-center" },
      { toastId: 12 }
    );

  }

  const { handleErrors } = useContext(MessageContext);

  useEffect(() => {
    async function fetchInitialValues() {
      try {
        const fetchedPoints = await API.getPoints();
        setPoints(fetchedPoints);
      } catch (error) {
        handleErrors(error);
      }
    };
    async function fetchHikes() {
      try {
        const fetchedHikes = await API.getHikes();
        setHikes(fetchedHikes);
      } catch (error) {
        handleErrors(error);
      }
    };
    fetchInitialValues();
    fetchHikes();
  }, []);

  //*******CHECK_AUTH*******//
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user_curr = await API.getUserInfo(); // we have the user info here
        user_curr.name === 'Guest' ? setLoggedIn(false) : setLoggedIn(true);
        setCurrentUser(user_curr);
      } catch (err) {
        handleError(err); // mostly unauthenticated user, thus set not logged in
        setCurrentUser({});
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, [loggedIn]); // eslint-disable-line
  //***********************//

  //********HANDLE_LOGIN*******//
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setCurrentUser(user);
      //setUserFilter(false);
    } catch (err) {
      handleError(err);
    }
  };
  //*****************************//

  //********HANDLE_LOGOUT*******//
  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);

      //BEST PRACTISE after Logout-->Clean up everything!
      setCurrentUser({});
      //setUserFilter(false);
      //setMessage('');
    } catch (err) {
      handleError(err);
    }
  };
  /*****************************************************/

  //********HANDLE_REGISTER*******//
  const CreateNewAccount = async (user) => {
    //console.log(user);

    await API.addUser(user);

  };

  const checkUser = async (email) => {
    const u = await API.checkUser(email);
    // console.log(u);
    if (u.error) return true;
    else return false;
  };
  /*****************************************************/

  //********HANDLE_ADD_POINT*******//
  const CreateNewPoint = async (point) => {
    try {
      await API.addPoint(point)
    } catch (err) {
      handleError(err);
    }
  };

 //********HANDLE_ADD_HUT*******//
 const CreateNewHut = async (hut) => {
  try {
    await API.addHut(hut)
  } catch (err) {
    handleError(err);
  }
};

  //********HANDLE_NEW_HIKE*******//
  const CreateNewHike = async (hike) => {
    try {
      await API.addNewHike(hike)
    } catch (err) {
      handleError(err);
    }
  };

  const updateHike = async (hike) => {
    try {
      await API.updateHike(hike)
    } catch (err) {
      handleError(err);
    }
  };

  //********HANDLE_VERIFICATION_CODE*******//
  const sendEmail = async (email) => {

    await API.sendEmail(email);
  }

  const checkCode = async (email) => {

    const c = await API.checkCode(email);
    return c.code;

  }

  function profilePageSwitch(){
    if(profilePage)
      navigate('/');
    else
      navigate('/profile');
  } 

  function returnToHome(){
    navigate('/');
  } 


  /*****************************************************/

  return (
    <>
      <Navigation logout={handleLogout} user={currentUser} loggedIn={loggedIn} setCurrentMarkers={setCurrentMarkers} profilePage={profilePageSwitch} />
      <Routes>
        <Route path="/" element={
          loggedIn && currentUser.role == 'LocalGuide' ? <LocalGuide_Home CreateNewPoint={CreateNewPoint} CreateNewHut={CreateNewHut} CreateNewHike={CreateNewHike} currentMarkers={currentMarkers} setCurrentMarkers={setCurrentMarkers} hikes={hikes} currentUser={currentUser} /> :
            <DefaultLayout role={loggedIn ? currentUser.role : ''} isLoading={isLoading} setLoading={setLoading} setCurrentHike={setCurrentHike} hikes={hikes}/>  /*<FileUploadLayout></FileUploadLayout>*/
        } >
        </Route>
        {/* <Route path="/NewHike" element={<HikeForm/>} /> THIS WAS A TRY TO DO THE .GPX FILE UPLOAD.*/}
        <Route path="/map" element={loggedIn && currentUser.role == 'Hiker' && currentHike.length != 0 ? <HikerLayout currentHike={currentHike} currentMarkers={currentMarkers} setCurrentMarkers={setCurrentMarkers} /> : <Navigate replace to='/' />} />
        <Route path="/points" element={<PointsContainer points={points}></PointsContainer>} />
        <Route path="/register" element={!loggedIn ? <RegisterLayout CreateNewAccount={CreateNewAccount} checkUser={checkUser} checkCode={checkCode} sendEmail={sendEmail} /> : <Navigate replace to='/' />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
        <Route path="/searchHut" element={loggedIn && currentUser.role == 'Hiker' ? <SearchLayout /> : <Navigate replace to='/' />} />
        <Route path="/profile" element={loggedIn && currentUser.role == 'Hiker' ? <Hiker_Home currentUser={currentUser} /> : <Navigate replace to='/' />} />
        <Route path="/editHike" element={loggedIn && currentUser.role == 'LocalGuide' ? <EditHike updateHike={updateHike} returnToHome={returnToHome} currentHike={currentHike} /> : <Navigate replace to='/' />} />
      </Routes>
    </>
  );
}

export default App;
