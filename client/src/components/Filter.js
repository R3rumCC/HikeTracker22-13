import { end } from "@popperjs/core";
import { useState, React } from "react";
import { Form, Button, Row, Col, Container} from "react-bootstrap";
import MultiRangeSlider, {ChangeResult} from "multi-range-slider-react";
import '../App.css';
const FilterForm = (props) => {

    const [minLength, setminLength] = useState(0)
    const [maxLength, setmaxLength] = useState(20)
    const [etMin, setETmin] = useState(0)
    const [etMax, setETmax] = useState(5)
    const [ascentMin, setAscentMin] = useState(0)
    const [ascentMax, setAscentMax] = useState(1000)
    const [difficulty, setDifficulty] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [region, setRegion] = useState('')
    const [filterLength,setFilterLength] = useState(false)
    const [filterET,setFilterET] = useState(false)
    const [filterAscent,setFilterAscent] = useState(false)

    function reset(){
        setminLength(0); setmaxLength(20);
        setETmin(0); setETmax(5); 
        setAscentMin(0); setAscentMax(1000); 
        setDifficulty(''); setCity('');
        setProvince(''); setRegion('');
        
    }

    function handleSubmit(event) {

        event.preventDefault();

        const $ = require( "jquery" );
        let filteredHikes = ''
        const filter = {city: city, region: region, province:province, length: {min : minLength, max: maxLength}, expected_time: {min: etMin, max: etMax}, ascent: {min : ascentMin, max: ascentMax},
        difficulty: difficulty}
        props.setLoading(true)
        if(filter.city || filter.region || filter.province){
            let str = "https://nominatim.openstreetmap.org/search?format=json&limit=1&city="+filter.city +"&county="+filter.province+"&state="+filter.region
            $.getJSON(str
            , function(data) {
                if(data.length!= 0){
                    $.each(data, function(key, val) {
                        filteredHikes = props.hikes.filter( (hike) =>{
                            let bool = true
                            if( filter.length && filterLength){
                                let key = 'length'
                                console.log(hike[key])
                                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                                    bool = false;
                            }
                            if(filter.expected_time && filterET){
                                let key = 'expected_time'
                                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                                    bool = false;
                            }
                            if(filter.ascent && filterAscent){
                                let key = 'ascent'
                                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                                    bool = false;
                            }
                            if(filter.difficulty)
                                if(hike['difficulty']!=filter['difficulty'])
                                    bool = false;
                            
                            if(bool){
                                if(filter.city||filter.province||filter.region){

                                    let values = val.display_name.split(',')
                                    console.log(values)
                                    if(filter.city)
                                        bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(values[0].trim())
                                    console.log(bool)
                                    if(filter.province && bool){
                                        bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[1].trim() : values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[1].trim() : values[0].trim())
                                    }
        
                                    if(filter.region && bool)
                                        bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[2].trim() : filter.province ? values[1].trim() : values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[2].trim() : filter.province ? values[1].trim() : values[0].trim())   
                                }
                            }
    
                            return bool
                            
                        }
                        )
                        props.setFilteredHikes(filteredHikes)
                        props.setLoading(false)

                    })
                }else{
                    props.setFilteredHikes(filteredHikes)
                    props.setLoading(false)
                }            
            })

        }
        else{
            filteredHikes = props.hikes.filter( (hike) =>{
                
            let bool = true
            if( filter.length && filterLength){
                let key = 'length'
                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                    bool = false;
            }
            if(filter.expected_time && filterET){
                let key = 'expected_time'
                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                    bool = false;
            }
            if(filter.ascent && filterAscent){
                let key = 'ascent'
                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                    bool = false;
            }
            if(filter.difficulty)
                if(hike['difficulty']!=filter['difficulty'])
                    bool = false;

            return bool
                
            }
            )
            props.setFilteredHikes(filteredHikes)
            props.setLoading(false)  

        }
        props.setFiltered(true)  
        props.setHidden(true)

        reset()
    }
      return (
        <Form  className="border border-primary rounded d-flex justify-content-center flex-wrap" onSubmit={handleSubmit}>


            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>City</Form.Label>
                <Form.Control type="text" required={false} value={city} placeholder = {'Turin'} onChange={event => setCity(event.target.value)}/>
            </Form.Group>


            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>Province</Form.Label>
                <Form.Control type="text" required={false} value={province} placeholder = {'Turin'} onChange={event => setProvince(event.target.value)}/>
            </Form.Group>


            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>Region</Form.Label>
                <Form.Control type="text" required={false} value={region} placeholder = {'Piedmont'} onChange={event => setRegion(event.target.value)}/>
            </Form.Group>   

            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>Difficulty</Form.Label>
                    <Form.Select onChange={(e) => setDifficulty(e.target.value)}>
                        <option label=''></option>
                        <option value='Tourist'  label="Tourist"/>
                        <option value='Hiker' label="Hiker"/>
                        <option value='Professional hiker' label="Professional Hiker"/>
                    </Form.Select>
            </Form.Group>
            <Col className="px-3">
                <Row>
                    <Form.Group className="my-2">
                        <Form.Check type="checkbox" label="Filter by Lenght" onChange={()=>setFilterLength(!filterLength)}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="my-2">
                        <Form.Check type="checkbox" label="Filter by Expected Time" onChange={()=>setFilterET(!filterET)}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="my-2 ">
                        <Form.Check type="checkbox" label="Filter by Ascent" onChange={()=>setFilterAscent(!filterAscent)}/>
                    </Form.Group>
                </Row>
            </Col>
            <Row className="px-3">
            {filterLength ? 
                <Form.Group className="my-2" >
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
                            minValue={0}
                            maxValue={20}
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
            :null}
            {filterET ?
                <Form.Group className="my-2" >
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
            : null}
            {filterAscent ?
                <Form.Group className="my-2">
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
            : null}
            </Row>     
            <Button className="align-self-end mb-2 ms-4" variant="primary" type="submit">Search</Button>

    </Form>

        
      );
  }
  export default FilterForm;