import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";

import React, { useState, useEffect, useContext, } from 'react';
import { Container, Toast } from 'react-bootstrap/';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DefaultLayout, LoginLayout, HikerLayout,RegisterLayout, FileUploadLayout, SearchLayout } from './components/PageLayout';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Navigation } from './components/Navigation';
import { LocalGuide_Home } from './components/localGuide_view';

import MessageContext from './messageCtx';
import API from './API';
import { HikeForm } from './components/newHikeForm';
import FileUploader from './components/UploadGpxForm';
import { HikePage } from './components/hikePage';


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
<<<<<<< HEAD
            <Route path="/*" element={<Main />/*<LocalGuide_Home/> */}/>
=======
            <Route path="/*" element={<Main />/*<LocalGuide_Home/>*/} />
>>>>>>> 9754d06bd57ac6c7f68bc67288c3992b51eaca09
          </Routes>
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

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentHike, setCurrentHike] = useState([]);

  function handleError(err) {
    toast.error(
      err.error,
      { position: "top-center" },
      { toastId: 12 }
    );
  }

  //const { handleErrors } = useContext(MessageContext);

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
  /*****************************************************/

  //********HANDLE_ADD_POINT*******//
  const CreateNewPoint = async (point) => {
    console.log(point);
   
    await API.addPoint(point)
    
  };

  // const test = async()=>{
  //   console.log("this is text")
  // }
  /*****************************************************/

  return (
    <>
      <Navigation logout={handleLogout} user={currentUser} loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={
            loggedIn && currentUser.role == 'LocalGuide' ? <LocalGuide_Home CreateNewPoint={CreateNewPoint}/> :
             <DefaultLayout role = {loggedIn ? currentUser.role : ''} setCurrentHike={setCurrentHike} />  /*<FileUploadLayout></FileUploadLayout>*/
        } >
        </Route>
        {/* <Route path="/NewHike" element={<HikeForm/>} /> THIS WAS A TRY TO DO THE .GPX FILE UPLOAD.*/}
        <Route path="/map" element={loggedIn && currentUser.role == 'Hiker' && currentHike.length != 0 ? <HikerLayout currentHike={currentHike}/> : <Navigate replace to='/' />} />
        <Route path="/register" element={!loggedIn ? <RegisterLayout CreateNewAccount={CreateNewAccount} /> : <Navigate replace to='/' />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
        <Route path="/searchHut" element={loggedIn && currentUser.role == 'Hiker' ? <SearchLayout/> : <Navigate replace to='/' />} />
      </Routes>
    </>
  );
}

export default App;
