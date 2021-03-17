import React from "react";
import {Link} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import styled from "styled-components";

const Styles = styled.div`
  .navbar{
    background-color: #FFCC00;
    display: flex;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .navbar-brand, .navbar-nav{
    color: black;

    &:hover{
      color: white;
    }
  }

  .nav{
    min-height: 10vh;
  }

  .styledLink{
    color: black;
    font-size: 20px;
    margin-left: 20px;
    &:hover{
      color: white;
    }
  }
`;

function NavigationBar() {
  return (
    <Styles>
      <Navbar expand="lg">
        <Navbar.Brand href="/"><h1>Finning</h1></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item><Link to="/" className="styledLink">Orders</Link></Nav.Item>
            <Nav.Item><Link to="/Users" className="styledLink">Users</Link></Nav.Item>
            <Nav.Item><Link to="/Email" className="styledLink">Emails</Link></Nav.Item>
            <Nav.Item><Link to="/Export" className="styledLink">Export</Link></Nav.Item>
            <Nav.Item><Link to="/Upload" className="styledLink">Upload</Link></Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Styles>
  );
}

export default NavigationBar;
