import React, {Component} from 'react'
import Room from './roomComponent'
import { Navbar, NavbarBrand, NavbarText, Button } from 'reactstrap'
import { signout } from '../Firebase/auth'
import { auth } from '../Firebase/config'
import placehold from './assets/placeholder_profile_photo.png'
import { Link } from 'react-router-dom'


class User extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: auth().currentUser
        }
        this.signOut = this.signOut.bind(this)
    }

    async signOut(){
        try{
            await signout()
        } catch(error){
            console.log(error.message)
        }
    }

    render(){
        return(
            <React.Fragment>
                <div>
                    <Navbar light expand="md" className="fixed-top" style={{backgroundColor: "#33ccff"}}>
                        <NavbarBrand>Texter</NavbarBrand>
                        <NavbarText className="ml-auto"><Link to="/profile"><img src={this.state.user.photoURL === null ? placehold : this.state.user.photoURL} height="50px" width="50px" style={{borderRadius: "50%"}} alt="profilepic"/></Link>  {this.state.user.displayName}</NavbarText>
                        <Button color="danger" className="ml-auto" onClick={this.signOut}>Sign Out</Button>
                    </Navbar>
                </div>
                <Room />
            </React.Fragment>
        )
    }
}

export default User