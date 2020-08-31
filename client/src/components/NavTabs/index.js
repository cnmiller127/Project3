import React, {useState} from "react";
import {Link} from "react-router-dom";
import { useStoreContext } from "../../utils/GlobalStore"
import API from "../../utils/API";
import { AUTH_SET_LOGGED_OUT } from "../../utils/actions";
import {
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    NavbarText
  } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";

function NavTab () {
    // const [isOpen, setIsOpen] = useState(false);
  
    // const toggle = () => setIsOpen(!isOpen);
    const [state, dispatch] = useStoreContext();
    const { username } = state;

    const logout = () => {
      API.logout().then(() => {
          dispatch({
              type: AUTH_SET_LOGGED_OUT
          })
      })
  }

  const [isOpen, setIsOpen] = useState(false);      
  const toggle = () => setIsOpen(!isOpen);

  //Use tag and to to avoid render issue in navbar
    return (
        <div>
        <Navbar color="dark" dark expand="lg" fixex="top">
                  <NavbarBrand tag = {Link} to="/">Movie Librarian</NavbarBrand>
                  <NavbarText className = "d-lg-none ml-auto pr-3"> Hi, {username}</NavbarText>
                  <NavbarToggler onClick={toggle} />
                  <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                      <NavItem>
                        <NavLink  tag = {Link} to="/">Home</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink  tag = {Link} to="/library">Library</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag = {Link} to="/wishlist">Wishlist</NavLink>
                      </NavItem>
                      <NavItem className = "d-inline d-lg-none">
                      <NavLink className="float-right text-primary" onClick={() => logout() } tag = {Link} to="/login">Log out</NavLink>
                      </NavItem>
                    </Nav>
                    <NavbarText className = "d-none d-lg-inline"> Hi, {username}</NavbarText> 
                    <NavLink className="float-right d-none d-lg-inline text-primary" onClick={() => logout() } tag = {Link} to="/login">Log out</NavLink>
                  </Collapse>
                </Navbar>


        </div>
      );


}
export default NavTab;