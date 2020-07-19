import React, {Component} from 'react'
import Room from './roomComponent'
import { Navbar, NavbarBrand, NavbarText, Button } from 'reactstrap'
import { signout } from '../Firebase/auth'
import { auth } from '../Firebase/config'


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
                    <Navbar color="warning" light expand="md" className="fixed-top">
                        <NavbarBrand>Texter</NavbarBrand>
                        <NavbarText className="ml-auto">{this.state.user.displayName}</NavbarText>
                        <Button color="danger" className="ml-auto" onClick={this.signOut}>Sign Out</Button>
                    </Navbar>
                </div>
                <Room />
            </React.Fragment>
        )
    }
}

export default User