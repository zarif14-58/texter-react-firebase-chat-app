import React, {Component} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Home from './homeComponent'
import Signup from './signupComponent'
import { auth } from '../Firebase/config'
import User from './userComponent'
import { Spinner } from 'reactstrap'
import Chat from './chatComponent'
import Private from './privateroomComponent'
import Profile from './profileComponent'

function PrivateRoute({component: Component, authenticated, ...rest}){
    return(
        <Route {...rest} render={(props) => authenticated === true ? <Component {...props} /> : <Redirect to={{pathname: '/', state: {from: props.location}}} />} />
    )
}

function PublicRoute({component: Component, authenticated, ...rest}){
    return(
        <Route {...rest} render={(props) => authenticated === false ? <Component {...props} /> : <Redirect to="/user" />} />
    )
}

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            authenticated: false
        }
    }
    
    componentDidMount(){
        auth().onAuthStateChanged((user) => {
            if(user){
                this.setState({
                    loading: false,
                    authenticated: true
                })
            }
            else{
                this.setState({
                    loading: false,
                    authenticated: false
                })
            }
        })
    }

    render(){
        return this.state.loading === true ? <div className="text-center" id="spinner"><Spinner type="grow" color="primary"></Spinner></div> : (
            <Router>
                <Switch>
                    <PrivateRoute path='/user' authenticated={this.state.authenticated} component={User} />
                    <PrivateRoute path='/private' authenticated={this.state.authenticated} component={Private} />
                    <PrivateRoute path='/chat' authenticated={this.state.authenticated} component={Chat} />
                    <PrivateRoute path='/profile' authenticated={this.state.authenticated} component={Profile} />
                    <PublicRoute path="/signup" authenticated={this.state.authenticated} component={Signup} />
                    <PublicRoute path='/' authenticated={this.state.authenticated} component={Home} />
                </Switch>
            </Router>
        )
    }
}

export default Main