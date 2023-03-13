import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import categories from '../categoriesFile'
import { Row, Col } from 'react-bootstrap'
import "G:/print-shop/src/pages/Home.css"
import axios from "G:/print-shop/src/axios.js"
import { useDispatch, useSelector } from 'react-redux'
import { updateProducts } from '../features/productSlice'
import ProductPreview from '../components/ProductPreview'

function Home() {

    const dispatch = useDispatch();
    const products = useSelector(state => state.products);
    const lastProducts = products.slice(0, 8);
    useEffect(() => {
        axios.get('/products').then(({ data }) => dispatch(updateProducts(data)));
    }, []);

    return (
        <div>
            <img src={require('G:/print-shop/src/components/HOMEMAIN2.jpg')} style={{ width: "75%" ,height:'60vh', marginTop:"30px" }} className='home-banner' alt="" />
            <div className="featured-products-container container mt-4">
                <h2>Recently added products</h2>
                {/* last products */}
                <div className="d-flex justify-content-center flex-wrap">
                    {lastProducts.map((product) => (
                        <ProductPreview {...product} />
                    ))}
                </div>
            </div>
            <div>
                <Link to="/category/all" style={{ textAlign: "right", display: "block", textdecoration: "none" }}>See more {'>>'}</Link>
            </div>
            {/* Sale-banner */}
            <div className='sale-banner--container mt-4'>
                <img src={require('G:/print-shop/src/components/saleBanner.jpg')} style={{ width: "80%", height: "60vh" }} className='home-banner' alt="" />
            </div>
            <div className='recent-products-container container mt-4'>
                <h2>Categories</h2>
                <Row>
                    {categories.map((category) => (
                        <LinkContainer to={`/category/${category.name.toLocaleLowerCase()}`}>
                            <Col md={4}>
                                <div style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)) ,url(${category.img})`, backgroundSize: "180px", gap: "10px" }} className="category-tile">{category.name}</div>
                            </Col>
                        </LinkContainer>
                    ))}
                </Row>
            </div>
            <div className='sale-banner--container mt-4'>
                <img src={require('G:/print-shop/src/components/HOME3.jpg')} style={{ width: "100%", height: "40vh" }} className='home-banner' alt="" />
            </div>
        </div>
    )
}

export default Home