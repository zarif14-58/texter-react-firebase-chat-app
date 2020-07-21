import React, {Component} from 'react'
import { db } from '../Firebase/config'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Card, CardTitle, CardText } from 'reactstrap'
import { Link } from 'react-router-dom'


class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: [],
            isModalOpen: false,
            room: '',
            about: '',
            selectedOption: "public",
            privateId : false,
            privId: ''
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleChange(event) {    
        this.setState({[event.target.name]: event.target.value});  
    }

    handleOptionChange(event){
        this.setState({selectedOption: event.target.value})
    }

    async handleSubmit(event) {
        event.preventDefault();

        let docRef = db.collection("Rooms").doc()

        let type
        if(this.state.selectedOption === "public"){
            type = true
        }
        else{
            type = false

            this.setState({
                privateId: true,
                privId: docRef.id
            })
        }

        await docRef.set({
            roomName: this.state.room,
            about: this.state.about,
            public: type,
            roomId: docRef.id
        })

        this.setState({room: '', about: ''})
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
                <div className="col-12 col-sm-4 roomCards" key={i.roomId}>
                    <Card body>
                        <CardTitle>{i.roomName}</CardTitle>
                        <CardText>{i.about}</CardText>
                        <Link to={{pathname: "/chat", state:{room: i.roomId}}}><Button color="primary">Enter {i.roomName} Room</Button></Link>
                    </Card>
                </div>
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
                            <FormGroup>
                                <Label>About:</Label>
                                <Input type="text" name="about" 
                                    id="about" placeholder="Give a short description about the room"
                                    onChange={this.handleChange} value={this.state.value}
                                />
                            </FormGroup>
                            <FormGroup tag="fielset">
                                <legend>Please Select Your Room Type:</legend>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="room-type"
                                            value="public" checked={this.state.selectedOption === "public"}
                                            onChange={this.handleOptionChange}
                                        />
                                        Public
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="room-type"
                                            value="private" checked={this.state.selectedOption === "private"}
                                            onChange={this.handleOptionChange}
                                        />
                                        Private
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                            <Button outline color="success">Create Room</Button>
                            {this.state.privateId && <h5>Here's your private room's ID: <em>{this.state.privId}</em>. Store it somewhere safe. You can join the private room by entering this ID.</h5>}
                        </Form>
                    </ModalBody>
                </Modal>
                <div className="container">
                    <h1 className="text-center">Rooms</h1>
                    <div className="row justify-content-center"> 
                        {nms}
                    </div>
                </div>
                <div className="text-center">
                    <Button><i className="fa fa-plus-circle" aria-hidden="true" onClick={this.toggleModal}></i></Button>
                    <Button to="/private">Join Private Room</Button>
                </div>
            </React.Fragment>
        )
    }
}

export default Room