import React, { useState } from 'react';
import { Row, Col, Button, Form, FormGroup, FormLabel, ButtonGroup, InputGroup, Alert } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { GenericMap } from './hikePage';
import axiosInstance from "../utils/axios"

function EditHike(props) {

  return (
    <>
      <Row>
        <EditHikeForm updateHike={props.updateHike} oldHikeTitle={props.currentHike.title}></EditHikeForm>
      </Row>
      <div className="d-flex flex-row">
        <Button style={{ marginRight: 5, width: "8%" }} onClick={props.returnToHome}>Home</Button>
      </div>
    </>
  )
}

function EditHikeForm(props) {

  const navigate = useNavigate(); 

  const [title, setTitle] = useState('')
  const [length, setLength] = useState('')
  const [expTime, setExpTime] = useState('')
  const [ascent, setAscent] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [description, setDescription] = useState('')
  const [condition, setCondition] = useState('')
  const [conditionDescription, setConditionDescription] = useState('')
  const [reference_points, setReferencePoints] = useState([]);
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

          updateHike = {
            title: title, length: length, expected_time: expTime, ascent: ascent,
            difficulty: difficulty, reference_points: reference_points,
            description: description, hike_condition: condition,
            hike_condition_description: conditionDescription
          }

          props.updateHike(props.oldHikeTitle, updateHike);
          alert('Hike correctly update!')
          //document.getElementById('EditHikeForm').hidden = true;
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
    setTitle('');
    setLength(''); setExpTime(''); setAscent('')
    setDifficulty(''); setDescription('');
    setCondition(''); setConditionDescription('');
    changeReferencePoints([]); setErrorMsg('');
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
            <Form.Select required={true} onChange={(ev) => changeDifficulty(ev.target.value)}>
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
            <Form.Select required={true} onChange={(ev) => changeCondition(ev.target.value)}>
              <option label=''></option>
              <option value='Open' label="Open" />
              <option value='Closed' label="Closed" />
              <option value='Party Blocked' label="Party Blocked" />
              <option value='Requires Special Gear' label="PRequires Special Gear" />
            </Form.Select>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Condition Description</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i class="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control as="textarea" value={conditionDescription} onChange={(ev) => changeConditionDescription(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Reference Points</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
            <Form.Control value={reference_points} required={true} onChange={(ev) => changeReferencePoints(ev.target.value)} />
            <InputGroup.Text>m</InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Row>

      <Button className='mt-y' type='submit' style={{ background: 'green' }}>Save</Button>
      <Button style={{ background: 'green' }} onClick={reset} className='ms-2 my-2'>Cancel</Button>

    </Form>

  </>)
}

export { EditHike }