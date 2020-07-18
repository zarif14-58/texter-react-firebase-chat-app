import React, {Component} from 'react'
import { db } from '../Firebase/config'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { Link } from 'react-router-dom'


class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: [],
            isModalOpen: false,
            value: ''
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleChange(event) {    
        this.setState({value: event.target.value});  
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        let docRef = db.collection("Rooms").doc()
        
        await docRef.set({
            roomName: this.state.value,
            public: true,
            roomId: docRef.id
        })

        this.setState({value: ''})
    }

    async componentDidMount(){
        db.collection("Rooms").where("public", "==", true)
            .onSnapshot((querySnapshot) => {
                let names = []
                querySnapshot.forEach((doc) => {
                    names.push(doc.data())
                })
                this.setState({
                    name: names
                })
            })   
        }

    render(){
        let nms = this.state.name.map(i => {
            return(
                <React.Fragment key={i.roomId}>
                    <h2>{i.roomName}</h2>
                    <Link to={{pathname: "/chat", state:{room: i.roomId}}}><Button color="primary">Enter {i.roomName} Room</Button></Link>
                </React.Fragment>
            )
        })
        return(
            <React.Fragment>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Create A Chat Room
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label>Room Name:</Label>
                                <Input type="text" name="room" 
                                    id="room" placeholder="Type your room name"
                                    onChange={this.handleChange} value={this.state.value}
                                />
                            </FormGroup>
                            <Button outline color="success">Create Room</Button>
                        </Form>
                    </ModalBody>
                </Modal>
                <div className="container text-center">
                    <h1>Rooms</h1>
                    {nms}
                </div>
                <div className="text-center">
                    <Button outline color="info" onClick={this.toggleModal}>Create Room</Button>
                </div>
            </React.Fragment>
        )
    }
}

export default Room