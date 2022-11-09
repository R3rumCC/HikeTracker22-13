import { end } from "@popperjs/core";
import { useState } from "react";
import { Form, Button} from "react-bootstrap";

const FilterForm = (props) => {
    
    const [title, setTitle] = useState('Hike #1')
    const [length, setLength] = useState('Hike #1')
    const [expected_time, setExpectedTime] = useState('Hike #1')
    const [ascent, setAscent] = useState('Hike #1')
    const [difficulty, setDifficulty] = useState('Hike #1')
    const [start_point, setStartPoint] = useState('Hike #1')
    const [end_point, setEndPoint] = useState('Hike #1')
    const [reference_points, setReferencePoints] = useState('Hike #1')
    const [description, setDescription] = useState('Hike #1')

    function handleSubmit(event) {
      event.preventDefault();
    }
      return (
        <Form className="block-example border border-primary rounded mb-0 form-padding mt-2 mb-2" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" required={false} value={title} onChange={event => setTitle(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Length</Form.Label>
                <Form.Control type="text" required={false} value={length} onChange={event => setLength(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Expected time</Form.Label>
                <Form.Control type="text" required={false} value={expected_time} onChange={event => setExpectedTime(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ascent</Form.Label>
                <Form.Control type="text" required={false} value={ascent} onChange={event => setAscent(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Control type="text" required={false} value={difficulty} onChange={event => setDifficulty(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Start Point</Form.Label>
                <Form.Control type="text" required={false} value={start_point} onChange={event => setStartPoint(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>End Point</Form.Label>
                <Form.Control type="text" required={false} value={end_point} onChange={event => setEndPoint(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Refernce Points</Form.Label>
                <Form.Control type="text" required={false} value={reference_points} onChange={event => setReferencePoints(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" required={false} value={description} onChange={event => setDescription(event.target.value)}/>
            </Form.Group>
            
        <Button className="mb-3" variant="primary" type="submit">Search</Button>
        </Form>
        
      );
  }
  export default FilterForm;