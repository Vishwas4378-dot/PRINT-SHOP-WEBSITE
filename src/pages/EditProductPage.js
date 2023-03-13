import React, { useEffect, useState } from 'react'
import { Container, Form, Row, Alert, Col, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateProductMutation } from '../services/appApi';
import "G:/print-shop/src/pages/NewProduct.css"
import axios from 'G:/print-shop/src/axios.js';

function EditProductPage() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [imgToRemove, setImgToRemove] = useState(null);
    const navigate = useNavigate();
    const [updateProduct, { isError, error, isLoading, isSuccess }] = useUpdateProductMutation();


    useEffect(()=>{
        axios.get('/products/'+id)
        .then(({data})=>{
            const product = data.product;
            setName(product.name)
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setImages(product.pictures);
        })
        .catch((e) => console.log(e))
    },[id]);

    function handleRemoveImg(imgObj) {
        setImgToRemove(imgObj.public_id);
        axios.delete(`/images/${imgObj.public_id}/`)
            .then((res) => {
                setImgToRemove(null);
                setImages(prev => prev.filter((img) => img.public_id !== imgObj.public_id))
            }).catch((e) => console.log(e));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!name || !description || !price || !category || !images.length) {
            return alert("Please fill out all the fields");
        }
        updateProduct({ id, name, description, price, category, images }).then(({ data }) => {
            if (data.length > 0) {
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        });
    }


    function showWidget() {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'dqi3q0up9',
                uploadPreset: "lafkqy8w",
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    setImages((prev) => [...prev, { url: result.info.url, public_id: result.info.public_id }])
                }
            }
        );
        widget.open();
    }

    return (
        <Container>
            <Row>
                <Col md={6} className="new-product__form--container">
                    <Form style={{ width: "100%" }} onSubmit={handleSubmit} >
                        <h1 className='mt-4'>Edit print shop product</h1>
                        {isSuccess && <Alert variant="success">Print shop product updated</Alert>}
                        {isError && <Alert variant="danger">{error.data}</Alert>}
                        <Form.Group className='mb-3'>
                            <Form.Label>Product name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name" value={name} required onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Product description</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter product description" style={{ height: "100px" }} value={description} required onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Product price(₹)</Form.Label>
                            <Form.Control type="number" placeholder="Enter price" value={price} required onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>

                        <Form.Group className='mb-3' onChange={(e) => setCategory(e.target.value)} >
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={category}>
                                <option disabled selected> -- Select one --</option>
                                <option value="visiting-cards"> Visiting cards </option>
                                <option value="cards"> Cards </option>
                                <option value="posters"> Posters </option>
                                <option value="business_cards"> Business Cards </option>
                                <option value="ID Card"> ID Card </option>
                                <option value="flyers"> Flyers </option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Button type='button' onClick={showWidget}>Upload Images</Button>
                            <div className='images-preview-container'>
                                {images.map((image) => (
                                    <div className='image-preview'>
                                        <img src={image.url} />
                                        {/* add icon for removing */}
                                        {imgToRemove !== image.public_id && <i className='fa fa-times-circle' onClick={() => handleRemoveImg(image)}></i>}
                                    </div>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Button type="submit" disabled={isLoading || isSuccess}>Update product</Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={6} className="new-product__image--container"></Col>
            </Row>
        </Container>
    )
}

export default EditProductPage;