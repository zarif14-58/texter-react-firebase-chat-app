import React, {Component} from 'react'
import { db, auth } from '../Firebase/config'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Card, CardTitle, CardText, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import firebase from 'firebase'


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
            privId: '',
            search: '',
            loading: true,
            nameError: null,
            aboutError: null,
            poppedRoom: null,
            user: auth().currentUser,
            popper: [],
            favedRoom: null,
            fav: [],
            againFav: []
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.handleFav = this.handleFav.bind(this)
        this.getRooms = this.getRooms.bind(this)
        this.getUser = this.getUser.bind(this)
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleChange(event) {    
        this.setState({[event.target.name]: event.target.value});  

        switch (event.target.name) {
            case 'room':
                event.target.value.length < 5 ? this.setState({nameError: 'Room Name Must Be At Least 5 Characters Long'})
                    : this.setState({nameError: ''})
                ||
                event.target.value.length > 21 ? this.setState({nameError: 'Room Name Must Be Less Than 21 Characters'})
                    : this.setState({nameError: ''})

                break;

            case 'about':
                event.target.value.length > 150 ? this.setState({aboutError: 'Room Description Must Be Less Than 150 Characters'})
                    : this.setState({aboutError: ''})
                ||
                event.target.value.length < 10 ? this.setState({aboutError: 'Room Description Must Be Greater Than 10 Characters Long'})
                    : this.setState({aboutError: ''})

                break;
        
            default:
                break;
        }
    }

    handleOptionChange(event){
        this.setState({selectedOption: event.target.value})
    }

    handleSearch(event){
        this.setState({search: event.target.value})
    }

    async handlePop(){
        
        let ref = db.collection("Rooms").doc(`${this.state.poppedRoom}`)
        await ref.get().then((doc) => this.setState({popper: doc.data().poppers})).catch(err => console.log(err))

        if(this.state.popper.includes(this.state.user.uid)){
            db.collection("Rooms").doc(`${this.state.poppedRoom}`).update({
                poppers: firebase.firestore.FieldValue.arrayRemove(`${this.state.user.uid}`)
            })

            const decrement = firebase.firestore.FieldValue.increment(-1)

            ref.update({ pop: decrement })
        }
        else{
            db.collection("Rooms").doc(`${this.state.poppedRoom}`).update({
                poppers: firebase.firestore.FieldValue.arrayUnion(`${this.state.user.uid}`)
            })

            const increment = firebase.firestore.FieldValue.increment(1)

            ref.update({ pop: increment })
        }
    }
      
    async handleFav(){
        let ref = db.collection("Users").doc(`${this.state.user.uid}`)
        await ref.get().then((doc) => this.setState({fav: doc.data().favs}))

        if(this.state.fav.includes(this.state.favedRoom)){
            ref.update({
                favs: firebase.firestore.FieldValue.arrayRemove(`${this.state.favedRoom}`)
            })
        }
        else{
            ref.update({
                favs: firebase.firestore.FieldValue.arrayUnion(`${this.state.favedRoom}`)
            })
        }
        
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
            roomId: docRef.id,
            pop: 0,
            poppers: []
        })

        this.setState({room: '', about: ''})
    }

    getRooms(){
        this.unsubsrcibeRoom = db.collection("Rooms").where("public", "==", true).orderBy("pop", "desc")
        .onSnapshot((querySnapshot) => {
            let names = []
            querySnapshot.forEach((doc) => {
                names.push(doc.data())
            })
            this.setState({
                name: names,
                loading: false
            })
        })

        /*db.collection("Users").doc(`${this.state.user.uid}`)
        .onSnapshot((doc) => {
            this.setState({
                againFav: doc.data().favs
            })
        })*/
    }

    getUser(){
        this.unsubsrcibeUser = db.collection("Users").doc(`${this.state.user.uid}`)
        .onSnapshot((doc) => {
            this.setState({
                againFav: doc.data().favs
            })
        })
    }

    async componentDidMount(){

        /*db.collection("Rooms").where("public", "==", true).orderBy("pop", "desc")
            .onSnapshot((querySnapshot) => {
                let names = []
                querySnapshot.forEach((doc) => {
                    names.push(doc.data())
                })
                this.setState({
                    name: names,
                    loading: false
                })
            })

        db.collection("Users").doc(`${this.state.user.uid}`)
            .onSnapshot((doc) => {
                this.setState({
                    againFav: doc.data().favs
                })
            })*/ 

            this.getUser()
            this.getRooms()
        }

        componentWillUnmount(){
            this.unsubsrcibeRoom()
            this.unsubsrcibeUser()
        }

    render(){

        let search = this.state.search
        
        let init = this.state.name.map(i => {
            return i
        })

        let fltrd = init.filter(el => el.roomName.toLowerCase().indexOf(search.toLowerCase()) !== -1)

        let nms = fltrd.map(i => {
            let color
            let fav
            if(i.poppers.includes(this.state.user.uid)){
                color = "#ff3399"
            }
            else{
                color = "#66ff99"
            }

            if(this.state.againFav.includes(i.roomId)){
                fav = "#ff3333"
            }
            else{
                fav = "#ccccff"
            }
            return(
                <div className="col-12 col-sm-4 roomCards" key={i.roomId}>
                    <Card body outline color="warning">
                        <div className="row">
                            <div className="col-5">
                                <CardTitle>{i.roomName}</CardTitle>
                            </div>
                            <div className="col-3">
                                <i className="fa fa-star" aria-hidden="true" style={{fontSize: "17px", cursor: "pointer", color: `${fav}`}} onClick={() => {this.setState({favedRoom: i.roomId}, () => this.handleFav())}}></i>
                            </div>
                            <div className="col-4">
                                <i className="fa fa-fire" aria-hidden="true" style={{fontSize: "20px", cursor: "pointer", color: `${color}`}} onClick={() => {this.setState({poppedRoom: i.roomId}, () => this.handlePop())}}></i>
                                {i.pop} POPs
                            </div>
                        </div>
                        <CardText>{i.about}</CardText>
                        <Link to={{pathname: "/chat", state:{room: i.roomId, name: i.roomName}}}><Button color="primary">Enter {i.roomName} Room</Button></Link>
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
                                {this.state.nameError !== null && <h6 className="text-danger">{this.state.nameError}</h6>}
                            </FormGroup>
                            <FormGroup>
                                <Label>About:</Label>
                                <Input type="text" name="about" 
                                    id="about" placeholder="Give a short description about the room"
                                    onChange={this.handleChange} value={this.state.value}
                                />
                                {this.state.aboutError !== null && <h6 className="text-danger">{this.state.aboutError}</h6>}
                            </FormGroup>
                            <FormGroup tag="fieldset">
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
                            {this.state.nameError !== null && this.state.aboutError !== null && this.state.nameError === '' && this.state.aboutError === '' && <Button outline color="success">Create Room</Button>}
                            {this.state.privateId && <h5>Here's your private room's ID: <em>{this.state.privId}</em>. Store it somewhere safe. You can join the private room by entering this ID.</h5>}
                        </Form>
                    </ModalBody>
                </Modal>
                <div className="container" style={{paddingTop: "100px"}}>
                    
                    <div className="row justify-content-center">
                        <div className="col-10 col-sm-6">
                            <Form>
                                <FormGroup>
                                    <Input type="text" name="search"
                                        id="search" value={this.state.search}
                                        onChange={this.handleSearch} placeholder="Search Public Rooms By Typing"
                                    />
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                    <h6 className="text-center">Or,</h6>
                    
                    <div className="text-center" style={{marginBottom: "10px"}}>
                        <Link to="/private"><Button color="info">Join A Private Room</Button></Link>
                    </div>

                    <hr />
                    {this.state.loading && <div className="text-center"><Spinner type="grow" color="info" /></div>}
                    <div className="row justify-content-center"> 
                        {nms}
                    </div>
                </div>
                
                <i className="fa fa-plus-circle" aria-hidden="true" onClick={this.toggleModal} id="circle"></i>
            </React.Fragment>
        )
    }
}

export default Room