import React, {Component} from 'react'
import { db, auth } from '../Firebase/config'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Card, CardTitle, CardText, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import Admin from './adminSearchComponent'
import Notifi from './notificationComponent'


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
            againFav: [],
            isEditModal: false,
            edibleRoom: '',
            edibleRoomName: '',
            edibleRoomAbout: '',
            editRoom: '',
            editAbout: '',
            editNameErr: null,
            editAboutErr: null,
            isSettingsOpen: false
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
        this.toggleEditModal = this.toggleEditModal.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleEditAbout = this.handleEditAbout.bind(this)
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this)        
        this.toggleSettingsModal = this.toggleSettingsModal.bind(this)
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    toggleEditModal(){
        this.setState({
            isEditModal: !this.state.isEditModal
        })
    }

    toggleSettingsModal(){
        this.setState({
            isSettingsOpen: !this.state.isSettingsOpen
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

    handleEdit(event){
        //this.setState({[event.target.name]: event.target.value})
        this.setState({editRoom: event.target.value})

        /*switch (event.target.name) {
            case 'editRoom':
                event.target.value.length < 5 ? this.setState({nameError: 'Room Name Must Be At Least 5 Characters Long'})
                    : this.setState({nameError: ''})
                ||
                event.target.value.length > 21 ? this.setState({nameError: 'Room Name Must Be Less Than 21 Characters'})
                    : this.setState({nameError: ''})

                break;

            case 'editAbout':
                event.target.value.length > 150 ? this.setState({aboutError: 'Room Description Must Be Less Than 150 Characters'})
                    : this.setState({aboutError: ''})
                ||
                event.target.value.length < 10 ? this.setState({aboutError: 'Room Description Must Be Greater Than 10 Characters Long'})
                    : this.setState({aboutError: ''})

                break;
        
            default:
                break;
        }*/

        event.target.value.length < 5 ? this.setState({editNameErr: 'Room Name Must Be At Least 5 Characters Long'})
            : this.setState({editNameErr: ''})
        ||
        event.target.value.length > 21 ? this.setState({editNameErr: 'Room Name Must Be Less Than 21 Characters'})
            : this.setState({editNameErr: ''})
    }

    handleEditAbout(event){
        this.setState({editAbout: event.target.value})

        event.target.value.length > 150 ? this.setState({editAboutErr: 'Room Description Must Be Less Than 150 Characters'})
            : this.setState({editAboutErr: ''})
        ||
        event.target.value.length < 10 ? this.setState({editAboutErr: 'Room Description Must Be Greater Than 10 Characters Long'})
            : this.setState({editAboutErr: ''})
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
            poppers: [],
            admin: [`${this.state.user.uid}`]
        })

        this.setState({room: '', about: ''})
    }

    async handleSubmitEdit(event){
        event.preventDefault()

        let editRef = db.collection("Rooms").doc(`${this.state.edibleRoom}`)

        return editRef.update({
            roomName: `${this.state.editRoom}`,
            about: `${this.state.editAbout}`
        })
        .then(() => console.log("Room Successfully updated"))
        .catch((err) => console.error("Error updating document: ", err))
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
            //console.log(this.state.user.uid)
            let color
            let fav
            let isAdmin
            let settings
            if(i.admin.includes(this.state.user.uid)){
                isAdmin = <i className="fa fa-pencil-square" aria-hidden="true" style={{fontSize: "20px", cursor: "pointer", color: "#4da6ff"}} onClick={() => {this.setState({edibleRoom: i.roomId, edibleRoomName: i.roomName, edibleRoomAbout: i.about, editRoom: i.roomName, editAbout: i.about}, () => this.toggleEditModal())}}></i>
                settings = <i className="fa fa-cog" aria-hidden="true" style={{fontSize: "20px", cursor: "pointer", color: "#33cc00"}} onClick={() => {this.setState({edibleRoom: i.roomId, edibleRoomName: i.roomName, edibleRoomAbout: i.about}, () => this.toggleSettingsModal())}}></i>
            }
            else{
                isAdmin = <div></div>
                settings = <div></div>
            }

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
                        <div className="row">
                            <div className="col-9">
                               <Link to={{pathname: "/chat", state:{room: i.roomId, name: i.roomName}}}><Button color="primary">Enter</Button></Link> 
                            </div>
                            <div className="col-1">
                                {isAdmin}
                            </div>
                            <div className="col-1">
                                {settings}
                            </div>
                        </div>
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
                
                <Modal isOpen={this.state.isEditModal} toggle={this.toggleEditModal}>
                    <ModalHeader toggle={this.toggleEditModal}>
                        Edit {this.state.edibleRoomName}
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmitEdit}>
                            <FormGroup>
                                <Label>Room Name:</Label>
                                <Input type="text" name="editRoom" 
                                    id="editRoom" placeholder={this.state.edibleRoomName}
                                    onChange={this.handleEdit} value={this.state.editRoom}
                                />
                                {this.state.editNameErr !== null && <h6 className="text-danger">{this.state.editNameErr}</h6>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Room About:</Label>
                                <Input type="text" name="editAbout" 
                                    id="editAbout" placeholder={this.state.edibleRoomAbout}
                                    onChange={this.handleEditAbout} value={this.state.editAbout}
                                />
                                {this.state.editAboutErr !== null && <h6 className="text-danger">{this.state.editAboutErr}</h6>}
                            </FormGroup>
                            {(this.state.editNameErr === '' || this.state.editAboutErr === '') && <Button outline color="success">Save Edit</Button>}
                        </Form>
                    </ModalBody>
                </Modal>

                {this.state.edibleRoom !== '' && <Admin edibleRoom={this.state.edibleRoom} edibleRoomName={this.state.edibleRoomName} toggleSettingsModal={this.toggleSettingsModal} isSettingsOpen={this.state.isSettingsOpen} />}

                <Notifi toggleNotiModal={this.props.toggleNotiModal} isNotiOpen={this.props.isNotiOpen} />

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