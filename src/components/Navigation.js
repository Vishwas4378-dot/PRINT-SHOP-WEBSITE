import { current } from '@reduxjs/toolkit';
import React, { useRef } from 'react'
import { Navbar, Button, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout, resetNotifications } from '../features/userSlice';
import CartPage from '../pages/CartPage';
import "G:/print-shop/src/components/Navigation.css"
import { useState } from 'react';
import axios from 'G:/print-shop/src/axios.js'

function Navigation() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const bellRef = useRef(null);
    const notificationRef = useRef(null);
    const [bellPos, setBellPos] = useState({});

    function handleLogout() {
        dispatch(logout());
    }
    const unreadNotifications = user?.notifications?.reduce((acc, current) => {
        if (current.status == "unread") return acc + 1;
        return acc;
    }, 0);

    function handleToggleNotifications() {
        const position = bellRef.current.getBoundingClientRect();
        setBellPos(position);
        notificationRef.current.style.display = notificationRef.current.style.display === "block" ? "none" : "block";
        dispatch(resetNotifications());
        if (unreadNotifications > 0) axios.post(`/users/${user._id}/updateNotifications`);
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand><img src={require('G:/print-shop/src/components/Logo.jpg')} style={{width:"180px"}}/></Navbar.Brand>
                </LinkContainer>
                <LinkContainer to="/">
                    <Navbar.Brand>PRINT SHOP (VISHWAS R)</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* if no user */}
                        {!user && (
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        {user && !user.isAdmin && (
                            <>
                                <LinkContainer to="/" style={{ marginRight: "10px" }}>
                                    <Nav.Link id='home'>Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/about" style={{marginRight:"5px"}}>
                                    <Nav.Link id='about_link'>About</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/category/all" style={{ marginRight: "10px" }}>
                                    <Nav.Link id='products'>Products</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/cart" style={{ marginRight: "10px" }} >
                                    <Nav.Link>
                                        <i className="fas fa-shopping-cart"></i>
                                        {user?.cart.count > 0 && (
                                            <span className="badge badge-warning" id="cartcount">
                                                {user.cart.count}
                                            </span>
                                        )}
                                    </Nav.Link>
                                </LinkContainer>
                            </>
                        )}

                        {/* if user */}
                        {user && (
                            <>
                                <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
                                    <i className="fas fa-bell" ref={bellRef} data-count={unreadNotifications || null}></i>
                                </Nav.Link>
                                <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
                                    {user.isAdmin && (
                                        <>
                                            <LinkContainer to="/admin">
                                                <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/new-product">
                                                <NavDropdown.Item>Create Product</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}
                                    {!user.isAdmin && (
                                        <>

                                            <LinkContainer to="/cart">
                                                <NavDropdown.Item>Cart</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/orders">
                                                <NavDropdown.Item>My orders</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}

                                    <NavDropdown.Divider />
                                    <Button variant="danger" onClick={handleLogout} className="logout-btn">
                                        Logout
                                    </Button>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {/* notifications */}
            <div className="notifications-container" ref={notificationRef} style={{ position: "absolute", top: bellPos.top + 30, left: bellPos.left, display: "none" }}>
                {user?.notifications.length > 0 ? (
                    user?.notifications.map((notification) => (
                        <p className={`notification-${notification.status}`}>
                            {notification.message}
                            <br />
                            <span>{notification.time.split("T")[0] + " " + notification.time.split("T")[1]}</span>
                        </p>
                    ))
                ) : (
                    <p>No notifcations yet</p>
                )}
            </div>
        </Navbar>
    );
}

export default Navigation;