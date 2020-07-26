import React, {Component} from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import {signin} from '../Firebase/auth'


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            error: null
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async handleSubmit(event){
        console.log("login Form Submitted" + this.state.email + this.state.password)
        event.preventDefault()
        this.setState({ error: '' })
        try {
            await signin(this.state.email, this.state.password)
        } catch(error){
            this.setState({ error: error.message })
        }
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8">
                            <h1 className="text-center display-3">Welcome to Texter</h1>
                        </div>
                    </div>
                    <p className="lead text-center">Instantly Connect With Others</p>
                </div>
                <div className="container" id="loginForm">
                    
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8">
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input type="email" name="email" 
                                            id="loginemail" placeholder="Enter your email" 
                                            value={this.state.email} onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="loginPassword">Password</Label>
                                        <Input type="password" name="password" 
                                            id="loginPassword" placeholder="Enter your password"
                                            value={this.state.password} onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
                                    <Button outline color="primary">Login</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="container text-center" id="quesOne">
                        <div className="row">
                            <div className="col-12 col-sm-12">
                                <h4>Don't have an account? Then <Link to="/signup"><Button outline color="info">Sign Up</Button></Link></h4>
                            </div>
                        </div>
                    </div>
            </React.Fragment>
        )
    }
}

export default Home