import { Button, Form, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut(){
    return(
      <Col className="vh-100 justify-content-md-center">

      Aaaaa
      
      </Col>
    )
}

function SearchHutButton(props) {
    const navigate = useNavigate();
    if(props.searchPage){
      return (
        <Button variant="outline-light" floating='right' onClick={() =>{props.setSearchPage(false); navigate('/')}}>Home</Button>
      )
    }else{
      return (
        <Button variant="outline-light" floating='right' onClick={() =>{props.setSearchPage(true); navigate('/searchHut')}}>Search Hut</Button>
      )
    }
}

export{SearchHut, SearchHutButton};