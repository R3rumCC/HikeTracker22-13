import { end } from "@popperjs/core";
import { useState, React } from "react";
import { Form, Button, Row, Col} from "react-bootstrap";

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
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')

    function handleSubmit(event) {
        const $ = require( "jquery" );
        let filteredHikes = ''
        const filter = {city: city, country:country, province:province, title: title, length: length, expected_time: expected_time, ascent: ascent,
        difficulty: difficulty,start_point_nameLocation: start_point, end_point_nameLocation: end_point, reference_points: reference_points,
        description: description}


        if(filter.city || filter.country || filter.province){
            let str = "https://nominatim.openstreetmap.org/search?format=json&limit=1&city="+filter.city +"&county="+filter.province+"&country="+filter.country
            $.getJSON(str
            , function(data) {

                $.each(data, function(key, val) {
                    filteredHikes = props.hikes.filter( (hike) =>{
                        let bool = true
                        //console.log(hike)
                        for (const key in hike){
                            if(key == "reference_points" && filter[key]){
                                bool = false
                                for(const v in hike[key]){
                                    if(hike[key][v].nameLocation == filter[key])
                                        bool = true
                                }
                            }
                            else if(filter[key] ){
                                if (filter[key] != hike[key])
                                    bool = false     
                            }
                        }
                        if(bool){
                            if(filter.city||filter.province||filter.country){

                                let values = val.display_name.split(',')
                                if(filter.city)
                                    bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(values[0].trim())
                                console.log(bool)
                                if(filter.province && bool){
                                    bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[1].trim() : values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[1].trim() : values[0].trim())
                                    console.log(hike.start_point_address.split(',').map((v)=>v.trim()))
                                }
    
                                if(filter.country && bool)
                                    bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(values[values.length - 1].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(values[values.length-1].trim())   
                                //some((v)=>{/*console.log(v.trim()); console.log(hike.start_point_address.split(',').map((v)=>v.trim()));*/
                                //    return (hike.start_point_address.split(',').map((v)=>v.trim())[3].includes(v.trim())) || (hike.end_point_address.split(',').map((v)=>v.trim()).includes(v.trim()))})
                            }
                        }
 
                        return bool
                        
                    }
                    )
                    console.log(filteredHikes)
                    props.setFilteredHikes(filteredHikes)  
                })            
            });

        }
        else{
            filteredHikes = props.hikes.filter( (hike) =>{

                let bool = true
                console.log(hike)
                for (const key in hike){
                    if(key == "reference_points" && filter[key]){
                        bool = false
                        for(const v in hike[key]){
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
            console.log(filteredHikes)
            props.setFilteredHikes(filteredHikes)  

        }
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
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" required={false} value={city} placeholder = {'Turin'} onChange={event => setCity(event.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Province</Form.Label>
                        <Form.Control type="text" required={false} value={province} placeholder = {'Hike#1'} onChange={event => setProvince(event.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" required={false} value={country} placeholder = {123} onChange={event => setCountry(event.target.value)}/>
                    </Form.Group>   
                </Col>  

            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Hike Title</Form.Label>
                        <Form.Control type="text" required={false} value={title} placeholder = {'Hike#1'} onChange={event => setTitle(event.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Length meters</Form.Label>
                        <Form.Control type="number" required={false} value={length} placeholder = {123} onChange={event => setLength(event.target.value)}/>
                    </Form.Group>   
                </Col>  

            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Expected time minutes</Form.Label>
                        <Form.Control type="number" required={false} value={expected_time} placeholder = {112} onChange={event => setExpectedTime(event.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Ascent meters</Form.Label>
                        <Form.Control type="number" required={false} value={ascent} placeholder = {100} onChange={event => setAscent(event.target.value)}/>
                    </Form.Group>
                </Col>    
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Difficulty</Form.Label>
                        <Form.Control type="text" required={false} value={difficulty} placeholder = {'easy'} onChange={event => setDifficulty(event.target.value)}/>
                    </Form.Group>
                
                </Col>              

            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Point</Form.Label>
                        <Form.Control type="text" required={false} value={start_point} placeholder = {'Hut#1'} onChange={event => setStartPoint(event.target.value)}/>
                    </Form.Group>
                </Col>   
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>End Point</Form.Label>
                        <Form.Control type="text" required={false} value={end_point} placeholder = {'Hut#2'} onChange={event => setEndPoint(event.target.value)}/>
                    </Form.Group>
                
                </Col>   
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Refernce Points</Form.Label>
                        <Form.Control type="text" required={false} value={reference_points} placeholder = {'Hut#3'} onChange={event => setReferencePoints(event.target.value)}/>
                    </Form.Group>
                
                </Col>   
            </Row>
            <Row>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" required={false} value={description} placeholder = {'mountain'} onChange={event => setDescription(event.target.value)}/>
                </Form.Group>
            </Row>
            
        <Button className="mb-3" variant="primary" type="submit">Search</Button>
        </Form>
        
      );
  }
  export default FilterForm;