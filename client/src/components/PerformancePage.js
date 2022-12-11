import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';


function PerformancePage(props){
    return(
        <Form>
            <Form.Group>
                <Form.Label>Prova</Form.Label>
                <Form.Control 
                    placeholder='Test Input'
                />
            </Form.Group>
        </Form>
    )
}

export { PerformancePage };