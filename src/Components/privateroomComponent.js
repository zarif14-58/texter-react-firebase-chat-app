import React, {Component} from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom' 

class Private extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({
            value: event.target.value
        })
    }


    render(){
        return(
            <div className="container private">
                <div className="row justify-content-center">
                    <div className="col-10 col-sm-8">
                        <Form>
                            <FormGroup>
                                <Label for="private">Enter Your Private Room's ID</Label>
                                <Input type="text" name="private" id="private" onChange={this.handleChange} value={this.state.value} />
                            </FormGroup>
                        </Form>
                        <Link to={{pathname: "/chat", state:{room: this.state.value}}}><Button outline color="success">Join</Button></Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Private