import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SearchHut(){
    return(
      <Form>
        <Form.Group>
          <Form.Label>Hut Address</Form.Label>
          <Form.Control
            type="text" placeholder="Via Salcazzi"
          />
        </Form.Group>
      </Form>
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