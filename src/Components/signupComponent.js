import React, {Component} from 'react'
import { Form, FormGroup, Label, Row, Col, Input, Button } from 'reactstrap'
import { signup } from '../Firebase/auth'

class Signup extends Component {
    constructor(props){
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            signupemail: '',
            signuppass: '',
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
        console.log("Form submitted" + this.state.firstname + this.state.lastname + this.state.signupemail)
        event.preventDefault()
        this.setState({ error: '' })
        try{
            await signup(this.state.signupemail, this.state.signuppass)
                    .then(result => {
                        result.user.updateProfile({
                            displayName: this.state.lastname
                        })
                    })
                    .catch(err => console.log(err))
        } catch(error){
            this.setState({ error: error.message })
        }
    }

    render(){
        return(
            <div className="container" id="signupForm">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8">
                    <h2>Sign Up</h2>

                        <Form onSubmit={this.handleSubmit}>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="firstname">First Name</Label>
                                        <Input type="text" name="firstname" 
                                            id="firstname" placeholder="First Name"
                                            value={this.state.firstname} onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="lastname">Last Name</Label>
                                        <Input type="text" name="lastname" 
                                            id="lastname" placeholder="Last Name" 
                                            value={this.state.lastname} onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="signupemail">Email</Label>
                                <Input type="email" name="signupemail" 
                                    id="signupemail" placeholder="Email" 
                                    value={this.state.signupemail} onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="signuppass">Password</Label>
                                <Input type="password" name="signuppass" 
                                    id="signuppass" placeholder="Password"
                                    value={this.state.signuppass} onChange={this.handleChange}
                                />
                            </FormGroup>
                            {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
                            <Button outline color="info">Sign Up</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup