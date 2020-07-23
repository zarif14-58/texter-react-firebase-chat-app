import React, {Component} from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom' 
import { db } from '../Firebase/config'


class Private extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: '',
            error: null,
            roomId: []
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({
            value: event.target.value
        })
        
        this.state.roomId.forEach(i => {
            if(i === event.target.value){
                this.setState({error: false})
            }
            else{
                this.setState({error: true})
            }
        })
    }


    componentDidMount(){
        db.collection("Rooms").where("public", "==", false)
            .onSnapshot(querysnapshot => {
                let id = []
                querysnapshot.forEach(doc => {
                    id.push(doc.data().roomId)
                })
                this.setState({roomId: id})
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
                                {this.state.error && <h6 className="text-danger">No Room Found With This ID</h6>}
                            </FormGroup>
                        </Form>
                        {this.state.error !== null && !this.state.error && <Link to={{pathname: "/chat", state:{room: this.state.value}}}><Button outline color="success">Join</Button></Link>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Private