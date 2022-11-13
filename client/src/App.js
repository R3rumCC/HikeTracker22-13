import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";

import React, { useState, useEffect, useContext, } from 'react';
import { Container, Toast } from 'react-bootstrap/';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DefaultLayout, LoginLayout, HikerLayout, AdminLayout, OfficerLayout } from './components/PageLayout';
import { Navigation } from './components/Navigation';
import { LocalGuide_Home } from './components/localGuide_view';

import MessageContext from './messageCtx';
import API from './API';

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
            <Route path="/*" element={<Main />/*<LocalGuide_Home/> */}/>
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
  const [currentHike, setCurrentHike] = useState([])


  const { handleErrors } = useContext(MessageContext);

  //*******CHECK_AUTH*******//
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user_curr = await API.getUserInfo(); // we have the user info here
        user_curr.name === 'Guest' ? setLoggedIn(false) : setLoggedIn(true);
        setCurrentUser(user_curr);
      } catch (err) {
        handleErrors(err); // mostly unauthenticated user, thus set not logged in
        setCurrentUser({});
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, [loggedIn]);
  //***********************//

  //********HANDLE_LOGIN*******//
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setCurrentUser(user);
      //setUserFilter(false);
      //handleMessages({ msg: `Welcome ${user.name}`, type: 'success' });
    } catch (err) {
      throw err
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
      throw err
    }
  };
  /*****************************************************/

  return (
    <>
      <Navigation logout={handleLogout} user={currentUser} loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={
          //DO NOT IMPLEMENTS ROUTES HERE, IN PageLayout.js THERE IS A LAYOUT PER EACH USER, 
          //USE THAT ONE TO IMPLEMENT FUNCTIONS
          //JUST PASS THE PROPS IF NEEDED HERE.
          loggedIn && currentUser.role == 'Hiker' ? <HikerLayout userName={currentUser.name} currentHike={currentHike} /> :
            loggedIn && currentUser.role == 'LocalGuide' ? <LocalGuide_Home /> :
              <DefaultLayout setCurrentHike={setCurrentHike} />
        } >
        </Route>
        <Route path="/Map" element={<HikerLayout currentHike={currentHike} />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
      </Routes>
    </>
  );
}

export default App;
