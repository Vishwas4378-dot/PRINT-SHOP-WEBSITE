import React, { useEffect, useState } from 'react'
import axios from '../axios.js';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css'
import { Container, Row, Col, Badge, ButtonGroup, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';
import "./ProductPage.css";
import { LinkContainer } from 'react-router-bootstrap';
import { useAddToCartMutation } from '../services/appApi.js';
import ToastMessage from '../components/ToastMessage.js';

function ProductPage() {
    const { id } = useParams();
    const user = useSelector(state => state.user);
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [addToCart, { isSuccess }] = useAddToCartMutation();

    const handleDragStart = (e) => e.preventDefault();

    useEffect(() => {
        axios.get(`/products/${id}`).then(({ data }) => {
            setProduct(data.product);
            setSimilar(data.similar);
        }).catch(error => {
            console.log(error)
        })
    }, [id]);



    if (!product) {
        return <Loading />
    }

    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3 },
    }

    const images = product.pictures.map((picture) => <img className="product__carousel--image" src={picture.url} onDragStart={handleDragStart} />);

    let similarProducts = [];
    if (similar) {
        similarProducts = similar.map((product, idx) => (
            <div className='item' data-value={idx}>
                <SimilarProduct {...product} />
            </div>
        ))
    }

    return (
        <Container className='pt-4' style={{ position: 'relative' }}>
            <Row>
                <Col lg={6}>
                    <AliceCarousel mouseTracking items={images} controlsStrategy="alternate" />
                </Col>
                <Col lg={6} className="pt-4">
                    <h1>{product.name}</h1>
                    <p>
                        <Badge bg='primary'>{product.category}</Badge>
                    </p>
                    <p className='product__price'>
                        ₹{product.price}
                    </p>
                    <p style={{ textAlign: 'center' }} className="py-3">
                        <strong>Description:</strong> {product.description}
                    </p>

                    {user && !user.isAdmin && (
                        <ButtonGroup style={{ width: "90%" }} className="align-items-center">
                            <Form.Select size='lg' style={{ width: "40%", borderRadius: "0" }} >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Select>
                            <Button size="lg" onClick={() => addToCart({ userId: user._id, productId: id, price: product.price, image: product.pictures[0].url })}>
                                Add to cart
                            </Button>
                        </ButtonGroup>
                    )}
                    {user && user.isAdmin && (
                        <LinkContainer to={`/product/${product._id}/edit`}>
                            <Button size='lg'>
                                Edit Product
                            </Button>
                        </LinkContainer>
                    )}
                    {isSuccess && <ToastMessage bg="info" title="Added to card " body={`${product.name} is in the cart`} />}
                </Col>
            </Row>
            <div className='my-4'>
                <h2>Similar products</h2>
                <div className='d-flex justify-content-center align-items-center flex-wrap'>
                    <AliceCarousel mouseTracking items={similarProducts} responsive={responsive} controlsStrategy="alternate" />
                </div>
            </div>
        </Container>
    )
}

export default ProductPage;