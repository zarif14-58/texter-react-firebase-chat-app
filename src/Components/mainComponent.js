import React, {Component} from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './homeComponent'
import Signup from './signupComponent'

class Main extends Component {

    render(){
        return(
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path="/signup" component={Signup} />
                </Switch>
            </Router>
        )
    }
}

export default Main