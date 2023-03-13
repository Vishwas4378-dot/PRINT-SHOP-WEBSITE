import React from 'react'
import { Col, Container, Row, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import "G:/print-shop/src/pages/Signup.css"
import { useSignupMutation } from '../services/appApi';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signup,{error, isLoading, isError}] = useSignupMutation();

    function handleSignup(e){
        e.preventDefault();
        signup({name,email,password});
    }

  return (
      <Container>
          <Row>
              <Col md={6} className="signup__form--container">
                  <Form style={{ width: "100%" }} onSubmit={handleSignup}>
                      <h1>Create an account</h1>
                      {isError && <Alert variant='danger'>{error.data}</Alert>}
                      <Form.Group className='mb-3'>
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" placeholder="Enter your name" value={name} required onChange={(e) => setName(e.target.value)} />
                      </Form.Group>
                      <Form.Group className='mb-3'>
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control type="email" placeholder="Enter your email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                      </Form.Group>
                      <Form.Group className='mb-3'>
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" placeholder="Enter password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                      </Form.Group>
                      <Form.Group className='mb-3'>
                          <Button type="submit" disabled={isLoading}>Create account</Button>
                      </Form.Group>
                      <p>Dont have an account? <Link to="/login">Login</Link>{" "}</p>
                  </Form>
              </Col>
              <Col md={6} className="signup__image--container"></Col>
          </Row>
      </Container>
  )
}

export default Signup