import { React, useState } from 'react';
import { Row, Col, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GenericMap } from './hikePage';

function EditHike(props) {

  return (
    <>
      <Row>
        <EditHikeForm updateHike={props.updateHike} oldHike={props.currentHike} setCurrentMarkers={props.setCurrentMarkers} currentMarkers={props.currentMarkers} returnToHome={props.returnToHome} ></EditHikeForm>
      </Row>
      <div className="d-flex flex-row">

      </div>
    </>
  )
}

function EditHikeForm(props) {

  const navigate = useNavigate();

  const [title, setTitle] = useState(props.oldHike.title)
  const [length, setLength] = useState(props.oldHike.length)
  const [expTime, setExpTime] = useState(props.oldHike.expected_time)
  const [ascent, setAscent] = useState(props.oldHike.ascent)
  const [difficulty, setDifficulty] = useState(props.oldHike.difficulty)
  const [description, setDescription] = useState(props.oldHike.description)
  const [condition, setCondition] = useState(props.oldHike.hike_condition ? props.oldHike.hike_condition : '')
  const [conditionDescription, setConditionDescription] = useState(props.oldHike.hike_condition_description ? props.oldHike.hike_condition_description : '')
  const [reference_points, setReferencePoints] = useState(props.oldHike.reference_points);
  const [errorMsg, setErrorMsg] = useState("");
  const changeTitle = (val) => { setTitle(val) }
  const changeLength = (val) => { setLength(val) }
  const changeExpTime = (val) => { setExpTime(val) }
  const changeAscent = (val) => { setAscent(val) }
  const changeDifficulty = (val) => { setDifficulty(val); }
  const changeDescription = (val) => { setDescription(val) }
  const changeCondition = (val) => { setCondition(val) }
  const changeConditionDescription = (val) => { setConditionDescription(val) }
  const changeReferencePoints = (val) => { setReferencePoints(val) }

  const submitHikeForm = (event) => {
    event.preventDefault();
    let updateHike;
    //Checks on needed fields
    if (title !== "") {
      if (length !== "" && difficulty !== "") {
        if (description !== "") {
          /*let temp = [...reference_points].map((x) => {
            console.log(x.latlng.lat, x.latlng.lng)
            return { address: x.address, nameLocation: x.nameLocation, gps_coordinates: x.latlng.lat + ',' + x.latlng.lng, type: null, capacity: null, altitude: x.altitude }
          })
          setReferencePoints(temp)*/

          //After mapping the data we need on a vector we have to add each point in the db and check if it already exists
          //While adding the point we store in a string the ids of the points added
          //After adding every point in the db we can update the hike with all the info we edited and the string of ref points
          //We cannot add reference points as objects in the hikes table, other than being wrong it can cause errors

          updateHike = {
            title: title, length: length, expected_time: expTime, ascent: ascent,
            difficulty: difficulty, reference_points: reference_points,
            description: description, hike_condition: condition,
            hike_condition_description: conditionDescription
          }

          props.updateHike(props.oldHike.title, updateHike);
          alert('Hike correctly updated!')
          reset();
          navigate('/');
        } else {
          setErrorMsg("Enter a description before submit.");
        }
      } else {
        setErrorMsg("A length and a difficulty are required.")
      }
    } else {
      setErrorMsg("Enter a title before submit.");
    }
  }

  const reset = () => {
    setTitle(props.oldHike.title);
    setLength(props.oldHike.length);
    setExpTime(props.oldHike.expected_time);
    setAscent(props.oldHike.ascent);
    setDifficulty(props.oldHike.difficulty);
    setDescription(props.oldHike.description);
    setCondition(props.oldHike.hike_condition);
    setConditionDescription(props.oldHike.hike_condition_description);
    setReferencePoints(props.oldHike.reference_points);
    setErrorMsg('');
  }

  return (<>
    {errorMsg ? (<Alert variant="danger" onClose={() => { setErrorMsg(""); }} dismissible> {errorMsg}</Alert>) : (false)}

    <Form id='editHikeForm' onSubmit={submitHikeForm} style={{ fontSize: 15, fontWeight: 'bold' }}>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Title</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i class="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control value={title} required={true} onChange={(ev) => changeTitle(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Description</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i class="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control as="textarea" required={true} rows={3} value={description} onChange={(ev) => changeDescription(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label style={{ fontSize: 25 }}>Hike's Details</Form.Label>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Length</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-map"></i></InputGroup.Text>
            <Form.Control value={length} required={true} onChange={(ev) => changeLength(ev.target.value)} placeholder="3.2" />
            <InputGroup.Text>Km</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Expected Time</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-stopwatch"></i></InputGroup.Text>
            <Form.Control value={expTime} required={true} onChange={(ev) => changeExpTime(ev.target.value)} placeholder="4" />
            <InputGroup.Text>hours</InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Ascent</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-geo-fill"></i></InputGroup.Text>
            <Form.Control value={ascent} required={true} onChange={(ev) => changeAscent(ev.target.value)} placeholder="670" />
            <InputGroup.Text>m</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Difficulty</Form.Label>
          <InputGroup>
            <InputGroup.Text><i class="bi bi-graph-up-arrow"></i></InputGroup.Text>
            <Form.Select required={true} value={difficulty} onChange={(ev) => changeDifficulty(ev.target.value)}>
              <option label=''></option>
              <option value='Tourist' label="Tourist" />
              <option value='Hiker' label="Hiker" />
              <option value='Professional hiker' label="Professional Hiker" />
            </Form.Select>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Condition</Form.Label>
          <InputGroup>
            <InputGroup.Text><i class="bi bi-graph-up-arrow"></i></InputGroup.Text>
            <Form.Select value={condition} onChange={(ev) => changeCondition(ev.target.value)}>
              <option label=''></option>
              <option value='Open' label="Open" />
              <option value='Closed' label="Closed" />
              <option value='Party Blocked' label="Party Blocked" />
              <option value='Requires Special Gear' label="Requires Special Gear" />
            </Form.Select>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Condition Description</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control as="textarea" value={conditionDescription} onChange={(ev) => changeConditionDescription(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>
      <Form.Label style={{ fontSize: 25 }}> Click on the map to add Reference Points </Form.Label>
      <Row>
        { 
          reference_points ? [...reference_points].map( (x, index) =>{
          return (
                <>
                <div className='col-md-4 col-sm-6'>
                  <Form.Label style={{ fontSize: 25 }}> Reference Point #{index+1}</Form.Label>
                  <Form.Group as={Col}>
                    <Form.Label>Title</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control value={reference_points[index].nameLocation} onChange={(ev) => { let temp = [...reference_points]; temp[index].nameLocation = ev.target.value; console.log(temp); changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label>Address</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control disabled value={reference_points[index].address} onChange={(ev) => { let temp = [...reference_points]; temp[index].address = ev.target.value; console.log(temp); changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Coordinates</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control disabled value={reference_points[index].latlng.lat+','+reference_points[index].latlng.lng} onChange={(ev) => { let temp = [...reference_points]; temp[index].latlng = {lat: ev.target.value.split(',')[0], lng:ev.target.value.split(',')[1]}; console.log(temp); changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Altitude</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control disabled value={reference_points[index].altitude} onChange={(ev) => { let temp = [...reference_points]; temp[index].altitude = ev.target.value; console.log(temp); changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                </div>
              </>)
          }
          )
            : null}
            </Row>
      {console.log(reference_points)}
      <Form.Group as={Col}>
        <GenericMap currentHike={[props.oldHike]} setCurrentMarkers={setReferencePoints} currentMarkers={reference_points}></GenericMap>
      </Form.Group>
      <Button className='mt-y' type='submit' style={{ background: 'green' }}>Save</Button>
      <Button style={{ background: 'green' }} onClick={reset} className='ms-2 my-2'>Cancel</Button>
      <Button className='ms-2 my-2' onClick={props.returnToHome}>Home</Button>
    </Form>

  </>)
}

export { EditHike }