import React, {useRef} from 'react'
import {Form, Container, Row, Button} from 'react-bootstrap'

const FileUploader = () => {

    const handleSubmit = (event) => {

        console.log(event.target.value)
        event.preventDefault();
    }


    return (
        
        <Container className="mt-5">
            <Row className="mt-5">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mt-5">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" />
                    </Form.Group>
                <Button className ="mt-3 ms-1" type='submit'>Import</Button>
                </Form>
            </Row>

        </Container>
    )

}
export default FileUploader;