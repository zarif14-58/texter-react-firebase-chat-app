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
            roomId: [],
            roomName: '',
            privID: ''
        }
        this.handleChange = this.handleChange.bind(this)
        
    }

    handleChange(event){
        this.setState({
            value: event.target.value
        })

        this.state.roomId.forEach(i => {
            if(i.roomId.includes(event.target.value)){
                this.setState({error: false}) 
                this.setState({roomName: i.roomName})
                this.setState({privID: i.roomId})
            }
            else{
                this.setState({error: true})
            }
        })
        
    }


    async componentDidMount(){
        this.unsubscribe = db.collection("Rooms").where("public", "==", false)
            .onSnapshot(querysnapshot => {
                let id = []
                querysnapshot.forEach(doc => {
                    id.push(doc.data())
                })
                this.setState({roomId: id})
            })
        
    }

    componentWillUnmount(){
        this.unsubscribe()
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
                                {this.state.privID !== this.state.value && <h6 className="text-danger">No Private Room Found With This ID</h6>}
                            </FormGroup>
                        </Form>
                        {this.state.roomName !== '' && <Link to={{pathname: "/chat", state:{room: this.state.value, name: this.state.roomName}}}><Button outline color="success">Join</Button></Link>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Private