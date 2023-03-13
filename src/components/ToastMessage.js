import React, { useState } from 'react'
import { Toast,ToastContainer } from 'react-bootstrap';
import "G:/print-shop/src/pages/ToastMessage.css"

function ToastMessage({bg ,title, body}) {
  const [show, setShow] = useState(true);
  return (
    <ToastContainer position='bottom-right' className='toast-container'>
        <Toast bg={bg} onClose={() => setShow(false)} show={show} delay={2000} autohide>
            <Toast.Header>
                <strong className='me-auto'>{title}</strong>
                <small> now</small>
            </Toast.Header>
            <Toast.Body>
                {body}
            </Toast.Body>
        </Toast>
    </ToastContainer>

  )
}

export default ToastMessage