import React, {Component} from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom'


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event){
        console.log("login Form Submitted" + this.state.email + this.state.password)
        event.preventDefault()
    }

    render(){
        return(
            <React.Fragment>
                <h1 className="text-center display-1">Welcome to Texter</h1>
                <p className="lead text-center">A great place to share your thoughts</p>

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