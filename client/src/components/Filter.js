import { end } from "@popperjs/core";
import { useState, React } from "react";
import { Form, Button, Row, Col, Container} from "react-bootstrap";
import MultiRangeSlider, {ChangeResult} from "multi-range-slider-react";
import '../App.css';
const FilterForm = (props) => {

    const [title, setTitle] = useState('')
    const [length, setLength] = useState('')
    const [minLength, setminLength] = useState(0)
    const [maxLength, setmaxLength] = useState(20)
    const [etMin, setETmin] = useState(0)
    const [etMax, setETmax] = useState(5)
    const [ascentMin, setAscentMin] = useState(0)
    const [ascentMax, setAscentMax] = useState(1000)
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

        props.setLoading(true)
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
                    props.setLoading(false)  
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
            props.setLoading(false)  

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
        <Form  className="border border-primary rounded d-flex justify-content-space-center flex-wrap" onSubmit={handleSubmit}>

            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>City</Form.Label>
                <Form.Control type="text" required={false} value={city} placeholder = {'Turin'} onChange={event => setCity(event.target.value)}/>
            </Form.Group>


            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Province</Form.Label>
                <Form.Control type="text" required={false} value={province} placeholder = {'Turin'} onChange={event => setProvince(event.target.value)}/>
            </Form.Group>


            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" required={false} value={country} placeholder = {'Italy'} onChange={event => setCountry(event.target.value)}/>
            </Form.Group>   



            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Hike Title</Form.Label>
                <Form.Control type="text" required={false} value={title} placeholder = {'Hike#1'} onChange={event => setTitle(event.target.value)}/>
            </Form.Group>

            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Difficulty</Form.Label>
                    <Form.Select onChange={(e) => setDifficulty(e.target.value)}>
                        <option label=''></option>
                        <option value='Tourist'  label="Tourist"/>
                        <option value='Hiker' label="Hiker"/>
                        <option value='Professional hiker' label="Professional Hiker"/>
                    </Form.Select>
            </Form.Group>
            
            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Length</Form.Label>
                <Row className="mx-2">
                    <MultiRangeSlider
                        min={0}
                        max={100}
                        step={1}
                        ruler ={false}
                        label = {true}
                        barInnerColor ={'#0091ea'}
                        style = {{border: 'none', boxShadow: 'none'}}
                        minValue={minLength}
                        maxValue={maxLength}
                        minCaption = {minLength}
                        maxCaption = {maxLength}
                        onInput={(e) => {
                            setminLength(e.minValue);
                            setmaxLength(e.maxValue);
                        }}
                    />
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="number" required={false} value={minLength} placeholder = {minLength} onChange={event => setminLength(event.target.value)}/>
                        </Form.Group>  
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>to</Form.Label>
                            <Form.Control type="number" required={false} value={maxLength} placeholder = {maxLength} onChange={event => setmaxLength(event.target.value)}/>
                        </Form.Group>  
                    </Col>
                </Row>
            </Form.Group>   

            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Expected time hours</Form.Label>
                <Row className="mx-2">
                    <MultiRangeSlider
                        min={0}
                        max={24}
                        step={1}
                        ruler ={false}
                        label = {true}
                        barInnerColor ={'#0091ea'}
                        style = {{border: 'none', boxShadow: 'none'}}
                        minValue={etMin}
                        maxValue={etMax}
                        minCaption = {etMin}
                        maxCaption = {etMax}
                        onInput={(e) => {
                            setETmin(e.minValue)
                            setETmax(e.maxValue)
                        }}
                    />
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="number" required={false} value={etMin} placeholder = {etMin} onChange={event => setETmin(event.target.value)}/>
                        </Form.Group>  
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>to</Form.Label>
                            <Form.Control type="number" required={false} value={etMax} placeholder = {etMax} onChange={event => setETmax(event.target.value)}/>
                        </Form.Group>  
                    </Col>
                </Row>
            </Form.Group>   

            <Form.Group className="my-2 mx-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Ascent</Form.Label>
                <Row className="mx-2">
                    <MultiRangeSlider
                        min={0}
                        max={2000}
                        step={10}
                        ruler ={false}
                        label = {true}
                        barInnerColor ={'#0091ea'}
                        style = {{border: 'none', boxShadow: 'none'}}
                        minValue={ascentMin}
                        maxValue={ascentMax}
                        minCaption = {ascentMin}
                        maxCaption = {ascentMax}
                        onInput={(e) => {
                            setAscentMin(e.minValue)
                            setAscentMax(e.maxValue)
                        }}
                    />
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="number" required={false} value={ascentMin} placeholder = {ascentMin} onChange={event => setAscentMin(event.target.value)}/>
                        </Form.Group>  
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>to</Form.Label>
                            <Form.Control type="number" required={false} value={ascentMax} placeholder = {ascentMax} onChange={event => setAscentMax(event.target.value)}/>
                        </Form.Group>  
                    </Col>
                </Row>
            </Form.Group>     
            <Row>
            <Form.Group className="" style={{ width: 'maxWidth' }}>
                <Form.Label>Start Point</Form.Label>
                <Form.Control type="text" required={false} value={start_point} placeholder = {'Hut#1'} onChange={event => setStartPoint(event.target.value)}/>
            </Form.Group>

            <Form.Group className="" style={{ width: 'maxWidth' }}>
                <Form.Label>End Point</Form.Label>
                <Form.Control type="text" required={false} value={end_point} placeholder = {'Hut#2'} onChange={event => setEndPoint(event.target.value)}/>
            </Form.Group>
        

            <Form.Group className="" style={{ width: 'maxWidth' }}>
                <Form.Label>Refernce Points</Form.Label>
                <Form.Control type="text" required={false} value={reference_points} placeholder = {'Hut#3'} onChange={event => setReferencePoints(event.target.value)}/>
            </Form.Group>
        

            <Form.Group className="mb-2 me-2" style={{ width: 'maxWidth' }}>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" required={false} value={description} placeholder = {'mountain'} onChange={event => setDescription(event.target.value)}/>
            </Form.Group>
            </Row>
            <Button className="align-self-end mb-2 ms-2" variant="primary" type="submit">Search</Button>

    </Form>

        
      );
  }
  export default FilterForm;