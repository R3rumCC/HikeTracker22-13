import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Container, Form, FormGroup, FormLabel, ButtonGroup, InputGroup, Alert, Nav } from 'react-bootstrap';
import { GenericMap } from './hikePage';
import { HikesContainer } from './hikesCards';
import Profile from './profile';
import axiosInstance from "../utils/axios"
import "./sidebar.css";

function EditHike(props) {

  return (
    <>
      <Row>
        <EditHikeForm></EditHikeForm>
      </Row>
      <div className="d-flex flex-row">
        <Button style={{ marginRight: 5, width: "8%" }} onClick={props.returnToHome}>Home</Button>
      </div>
    </>
  )
}

function EditHikeForm(props) {

  const [title, setTitle] = useState('')
  const [length, setLength] = useState('')
  const [expTime, setExpTime] = useState('')
  const [ascent, setAscent] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [description, setDescription] = useState('')
  const [condition, setCondition] = useState('')
  const [conditionDescription, setConditionDescription] = useState('')

  const [startPoint, setStartPoint] = useState('')
  const [startPointGps, setStartPointGps] = useState('')
  const [endPoint, setEndPoint] = useState('')
  const [endPointGps, setEndPointGps] = useState('')
  let reference_points = []
  const [map, setMap] = useState('') //USED TO SAVE MAP STRING
  const [gpxPos, setGpxPos] = useState(null)
  const [errorMsg, setErrorMsg] = useState("");

  const changeTitle = (val) => { setTitle(val) }
  const changeLength = (val) => { setLength(val) }
  const changeExpTime = (val) => { setExpTime(val) }
  const changeAscent = (val) => { setAscent(val) }
  const changeDifficulty = (val) => { setDifficulty(val); }
  const changeDescription = (val) => { setDescription(val) }
  const changeCondition = (val) => { setCondition(val) }
  const changeConditionDescription = (val) => { setConditionDescription(val) }
  const changeStartP = (val) => { setStartPoint(val) }
  const changeStartPGps = (val) => { setStartPointGps(val) }
  const changeEndP = (val) => { setEndPoint(val) }
  const changeEndPGps = (val) => { setEndPointGps(val) }


  const submitFile = () => {
    var myBlob = new Blob(
      [map],
      { type: "text/plain" }
    )
    let formData = new FormData()

    formData.append("file", myBlob, title)

    axiosInstance.post("/upload_file", formData, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
  const submitHikeForm = (event) => {
    event.preventDefault();
    let newHike;
    //Checks on needed fields
    if (title !== "") {
      if (length !== "" && difficulty !== "") {
        if (startPoint !== '' && endPoint !== '') {
          if (description !== "") {
            if (map !== '') {
              let start = { address: startPoint, gps_coordinates: startPointGps }
              let startId = props.CreateNewPoint(start) //try to use startId and endId instead of performing again the search
              let end = { address: endPoint, gps_coordinates: endPointGps }
              let endId = props.CreateNewPoint(end);

              //check on user's role (?)
              newHike = {
                title: title, length: length, expected_time: expTime, ascent: ascent, difficulty: difficulty,
                start_point: startPoint, end_point: endPoint, reference_points: reference_points,
                description: description, gpx_track: title, hike_condition: condition,
                hike_condition_description: conditionDescription, local_guide: props.currentUser.username
                //gpx_track: map --> request entity too large
              }
              props.CreateNewHike(newHike)
              console.log('newHike=' + newHike)
              submitFile()
              console.log('after CreateNewHike');
              alert('New Hike correctly added!')
              document.getElementById('hikeForm').hidden = true;
              reset()
            }
            else {
              setErrorMsg("Enter a valid gpx file.");
            }
          } else {
            setErrorMsg("Enter a description before submit.");
          }
        } else {
          setErrorMsg("A Start and End Point are required.")
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
    setStartPoint(''); setStartPointGps('');
    setEndPoint(''); setEndPointGps('');
    setErrorMsg(''); setMap(''); setGpxPos(null);
  }

  //Import gpx file and read, gpx parse it is used to retreive the start point and the end point (format latitude,longitude)
  //after have red the file it changes automatically the start point and the end point 
  const importGpx = (selectedFile) => {
    const $ = require("jquery");
    let gpxParser = require('gpxparser');
    var gpx = new gpxParser()
    setTitle('');
    setLength(''); setExpTime(''); setAscent('')
    setDifficulty(''); setDescription('');
    setCondition(''); setConditionDescription('');
    setStartPoint(''); setStartPointGps('');
    setEndPoint(''); setEndPointGps('');
    setErrorMsg('');
    let reader = new FileReader();

    reader.readAsText(selectedFile);

    reader.onload = function () {
      gpx.parse(reader.result)

      const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon, p.ele]).filter((x) => x[2] != null)
      if (positions.length == 0) {
        setErrorMsg("No Elevation available")
        setGpxPos(null)
        setMap('')
      }
      else {

        //storing lat and lon inside the status of start/end point
        let gps_start = `${positions[0][0]}, ${positions[0][1]}`
        setStartPointGps(gps_start);
        let gps_end = `${positions[positions.length - 1][0]}, ${positions[positions.length - 1][1]}`
        setEndPointGps(gps_end);
        console.log('gps_start=' + gps_start + ', STATE startP= ' + startPointGps)
        console.log('gps_end= ' + gps_end + ', STATE endP= ' + endPointGps)

        let trackPoints = gpx.tracks[0].points.map((o) => o.ele).filter((x) => x != null)
        console.log(trackPoints)
        if (trackPoints.length != 0) {
          let maxPoint = Math.max(...trackPoints)
          let minPoint = Math.min(...trackPoints)
          console.log(maxPoint)
          console.log(minPoint)
          var totalElevation = (Number(maxPoint - minPoint).toFixed(2));
          changeAscent(totalElevation);

        }

        var totalDistance = (Number(gpx.tracks[0].distance.total / 1000).toFixed(2));
        changeLength(totalDistance);
        console.log(positions[0]);
        console.log(positions[positions.length - 1]);
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[0][0] + '&lon=' + positions[0][1] + '&format=json&limit=1&q=', function (data) {

          changeStartP(data.display_name);
        });
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[positions.length - 1][0] + '&lon=' + positions[positions.length - 1][1] + '&format=json&limit=1&q=', function (data) {

          changeEndP(data.display_name);
        });

        setMap(reader.result)
        setGpxPos(positions)
      }
    };

    reader.onerror = function () {
      console.log(reader.error);
    };

  }

  return (<>
    {errorMsg ? (<Alert variant="danger" onClose={() => { setErrorMsg(""); }} dismissible> {errorMsg}</Alert>) : (false)}

    <Form id='hikeForm' onSubmit={submitHikeForm} style={{ fontSize: 15, fontWeight: 'bold' }}>

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
          <Form.Label>Start Point</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
            <Form.Control value={startPoint} required={true} onChange={(ev) => changeStartP(ev.target.value)} />
            <InputGroup.Text>m</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>End Point</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
            <Form.Control value={endPoint} required={true} onChange={(ev) => changeEndP(ev.target.value)} />
            <InputGroup.Text>m</InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Row>

      <Form.Group className='mt-3'>
        {gpxPos != null ?
          <>
            <GenericMap gpxFile={map} currentHike={[]} currentMarkers={[]} setCurrentMarkers={''} />
          </>
          : null}
      </Form.Group>

      {/* This is the form used to import the gpx, on upload of the file it call the importGpx function passing the file object */}
      <Form.Group controlId="formFile" className="mt-3">
        <Form.Label style={{ fontSize: 25 }}>Upload the GPX track</Form.Label>
        <Form.Control type="file" required={true} onChange={(e) => importGpx(e.target.files[0])} />
      </Form.Group>

      <Button className='mt-y' type='submit' style={{ background: 'green' }}>Save</Button>
      <Button style={{ background: 'green' }} onClick={reset} className='ms-2 my-2'>Cancel</Button>

    </Form>

  </>)
}

export { EditHike }