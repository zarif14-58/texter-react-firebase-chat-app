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
            displayName: '',
            isNotiOpen: false
        }
        this.signOut = this.signOut.bind(this)
        this.toggleNotiModal = this.toggleNotiModal.bind(this)
    }

    async signOut(){
        try{
            await signout()
        } catch(error){
            console.log(error.message)
        }
    }

    toggleNotiModal(){
        this.setState({
            isNotiOpen: !this.state.isNotiOpen
        })
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
                        <div className="ml-auto">
                            <i className="fa fa-bell" aria-hidden="true" style={{marginRight: "15px", fontSize: "20px", color: "#1a53ff", textShadow: "1px 1px 2px black", cursor: "pointer"}} onClick={this.toggleNotiModal}></i>
                            <Button color="danger" size="sm" onClick={this.signOut}>Sign Out</Button> 
                        </div>
                    </Navbar>
                </div>
                <Room toggleNotiModal={this.toggleNotiModal} isNotiOpen={this.state.isNotiOpen} />
            </React.Fragment>
        )
    }
}

export default User