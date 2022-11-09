import { end } from "@popperjs/core";
import { useState } from "react";
import { Form, Button} from "react-bootstrap";

const FilterForm = (props) => {
    
    const [title, setTitle] = useState('')
    const [length, setLength] = useState('')
    const [expected_time, setExpectedTime] = useState('')
    const [ascent, setAscent] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [start_point, setStartPoint] = useState('')
    const [end_point, setEndPoint] = useState('')
    const [reference_points, setReferencePoints] = useState('')
    const [description, setDescription] = useState('')

    function handleSubmit(event) {
        const filter = {title: title, length: length, expected_time: expected_time, ascent: ascent,
        difficulty: difficulty,start_point_nameLocation: start_point, end_point_nameLocation: end_point, reference_points: reference_points,
        description: description}

        const filtereHikes = props.hikes.filter( (hike) =>{
            let bool = true
            console.log(hike)
            for (const key in hike){
                console.log(`${key} : ${hike[key]}  `);
                console.log(filter[key])
                if(key == "reference_points" && filter[key]){
                    bool = false
                    for(const v in hike[key]){
                        console.log(hike[key][v].nameLocation)
                        if(hike[key][v].nameLocation == filter[key])
                            bool = true
                    }
                }
               else if(filter[key] ){
                    if (filter[key] != hike[key])
                        bool = false     
                } 
                
            }
            return bool
            
        }
        )
        console.log(filtereHikes)
        props.setFilteredHikes(filtereHikes)  
        props.setFiltered(true)  
        props.setHidden(true)

        setTitle('')
        setLength('')
        setExpectedTime('')
        setDifficulty('')
        setStartPoint('')
        setEndPoint('')
        setReferencePoints('')
        setDescription('');
        event.preventDefault();
    }
      return (
        <Form className="block-example border border-primary rounded mb-0 form-padding my-2 mx-2" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" required={false} value={title} placeholder = {'Hike#1'} onChange={event => setTitle(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Length meters</Form.Label>
                <Form.Control type="number" required={false} value={length} placeholder = {123} onChange={event => setLength(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Expected time minutes</Form.Label>
                <Form.Control type="number" required={false} value={expected_time} placeholder = {112} onChange={event => setExpectedTime(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ascent meters</Form.Label>
                <Form.Control type="number" required={false} value={ascent} placeholder = {100} onChange={event => setAscent(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Control type="text" required={false} value={difficulty} placeholder = {'easy'} onChange={event => setDifficulty(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Start Point</Form.Label>
                <Form.Control type="text" required={false} value={start_point} placeholder = {'Hut#1'} onChange={event => setStartPoint(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>End Point</Form.Label>
                <Form.Control type="text" required={false} value={end_point} placeholder = {'Hut#2'} onChange={event => setEndPoint(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Refernce Points</Form.Label>
                <Form.Control type="text" required={false} value={reference_points} placeholder = {'Hut#3'} onChange={event => setReferencePoints(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" required={false} value={description} placeholder = {'mountain'} onChange={event => setDescription(event.target.value)}/>
            </Form.Group>
            
        <Button className="mb-3" variant="primary" type="submit">Search</Button>
        </Form>
        
      );
  }
  export default FilterForm;