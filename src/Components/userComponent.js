import React, {Component} from 'react'
import Room from './roomComponent'
import { Navbar, NavbarBrand, NavbarText, Button } from 'reactstrap'
import { signout } from '../Firebase/auth'
import { auth, db } from '../Firebase/config'
import placehold from './assets/placeholder_profile_photo.png'
import { Link } from 'react-router-dom'
import logo from './assets/LogoMakr_6RmCyx.png'


class User extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: auth().currentUser,
            photo: null,
            displayName: ''
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

    async componentDidMount(){
        await db.collection("Users").doc(`${this.state.user.uid}`).get()
            .then(doc => {
                this.setState({
                    photo: doc.data().photoURL,
                    displayName: doc.data().displayName
                })
            })
            .catch(err => console.log(err))

    }

    render(){
        return(
            <React.Fragment>
                <div>
                    <Navbar light expand="md" className="fixed-top" style={{backgroundColor: "#33ccff"}}>
                        <NavbarBrand><img src={logo} alt="logo" width="96px" height="48px" className="logo" ></img></NavbarBrand>
                        <NavbarText className="ml-auto"><Link to="/profile"><img src={this.state.photo === '' || this.state.photo === null ? placehold : this.state.photo} height="50px" width="50px" style={{borderRadius: "50%"}} alt="profilepic"/></Link>  {this.state.displayName}</NavbarText>
                        <Button color="danger" className="ml-auto" onClick={this.signOut}>Sign Out</Button>
                    </Navbar>
                </div>
                <Room />
            </React.Fragment>
        )
    }
}

export default User