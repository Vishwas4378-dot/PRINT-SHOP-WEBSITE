import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [paying, setPaying] = useState(false);

    const handlePayClick = async() =>{
        try{
            const order = await createOrder({
                userId: user._id, cart: user.cart, address, country 
            }).unwrap();
            console.log('Order created:',order);
            setAlertMessage('Payment success');
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        }
        catch(error){
            console.error("error creating order: ",error);
        }
    }

    // New function to handle file selection and saving
    const handleFileSave = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/pdf";
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                // Use FileReader API to read the file as a data URL
                const reader = new FileReader();
                reader.onload = () => {
                    // Use the File API to save the data URL as a file
                    const blob = new Blob([reader.result], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
                reader.readAsDataURL(file);
            }
        });
        fileInput.click();
    };

    async function handlePay(e) {
        e.preventDefault();
        if (!stripe || !elements || user.cart.count <= 0) return;
        setPaying(true);
        const { client_secret } = await fetch("http://localhost:8080/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: user.cart.total }),
        }).then((res) => res.json());
        const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });
        setPaying(false);

        if (paymentIntent) {
            createOrder({ userId: user._id, cart: user.cart, address, country }).then(
                (res) => {
                    if (!isLoading && isError) {
                    }
                }
            );
            setAlertMessage(`Payment ${paymentIntent.status}`);
            setTimeout(() => {
                navigate("/orders");
            }, 2000);
        }
    }

    return (
        <Col className="cart-payment-container">
            <Form onSubmit={handlePay}>
                <Row>
                    {alertMessage && <Alert>{alertMessage}</Alert>}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First Name" value={user.name} disabled />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Email" value={user.email} disabled />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={7}>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </Form.Group>
                    </Col>
                </Row>
                <label htmlFor="card-element">Card</label>
                <CardElement id="card-element" />
                <Button className="mt-3 me-3" onClick={handleFileSave}>
                    Upload PDF for the designs to be printed on the product
                </Button>
                <Button className="mt-3" type="submit" disabled={user.cart.count <= 0 || paying || isSuccess} onClick={handlePayClick}>
                    {paying ? "Processing..." : "Pay"}
                </Button>
            </Form>
        </Col>
    );
}

export default CheckoutForm;