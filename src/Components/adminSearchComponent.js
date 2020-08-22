import React, {Component} from 'react'
import { db, auth } from '../Firebase/config'
import { Form, Modal, ModalBody, ModalHeader, Input, FormGroup, Label, ListGroup, ListGroupItem, Button, Spinner } from 'reactstrap'
import firebase from 'firebase'
import placehold from './assets/placeholder_profile_photo.png'

class Admin extends Component{
    constructor(props){
        super(props)
        this.state ={
            userSearch: '',
            users: [],
            user: auth().currentUser,
            selectedUser: '',
            selectedRoom: {},
            name: '',
            loading: true,
            admns: [],
            ads: [],
            indicator: false,
            deletedUser: '',
            deletedName: ''
        }
        this.getUsers = this.getUsers.bind(this)
        this.handleUserSearch = this.handleUserSearch.bind(this)
        //this.getAdmins = this.getAdmins.bind(this)
        this.removeAsAdmin = this.removeAsAdmin.bind(this)
        //this.finally = this.finally.bind(this)
        this.sendAddNoti = this.sendAddNoti.bind(this)
        this.sendRemNoti = this.sendRemNoti.bind(this)
    }

    handleUserSearch(event){
        this.setState({userSearch: event.target.value})
    }

    getUsers(){
        this.unsubsrcibeUsers = db.collection("Users")
        .onSnapshot((querySnapshot) => {
            let user = []
            querySnapshot.forEach((doc) => {
                user.push(doc.data())
            })
            this.setState({
                users: user,
                loading: false
            })
        })
    }

    setAsAdmin(){
        db.collection("Rooms").doc(`${this.props.edibleRoom}`)
            .update({
                admin: firebase.firestore.FieldValue.arrayUnion(`${this.state.selectedUser}`)
            })
            //.then(() => this.sendAddNoti())
            .then(() => alert(`${this.state.name} is successfully added as an admin`))
    }

    removeAsAdmin(){
        db.collection("Rooms").doc(`${this.props.edibleRoom}`)
            .update({
                admin: firebase.firestore.FieldValue.arrayRemove(`${this.state.deletedUser}`)
            })
            //.then(() => this.sendRemNoti())
            .then(() => alert(`${this.state.deletedName} is successfully removed as an admin`))
    }

    sendAddNoti(){
        db.collection("Notifications").doc(`${this.state.selectedUser}`).collection("News")
            .add({
                news: `${this.state.user.displayName} has added you as an admin of ${this.state.selectedRoom.roomName}`,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date())
            })
            .then(() => console.log("news send"))
            .catch(err => console.log(err))
    }

    sendRemNoti(){
        db.collection("Notifications").doc(`${this.state.deletedUser}`).collection("News")
            .add({
                news: `${this.state.user.displayName} has removed you as an admin of ${this.state.selectedRoom.roomName}`,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date())
            })
            .then(() => console.log("news send"))
            .catch(err => console.log(err))
    }

    getRms(){
        this.unsubscribeRooms = db.collection("Rooms").doc(`${this.props.edibleRoom}`)
            .onSnapshot((doc) => {
                this.setState({
                    selectedRoom: doc.data(),
                    ads: doc.data().admin,
                    indicator: true
                })
            })
            
    }

    /*getAdmins(){
        let adms = []
        this.state.ads.forEach(i => {
            db.collection("Users").doc(`${i}`).get()
                .then(doc => {
                    adms.push(doc.data())

                    this.setState({
                        admns: adms
                    }) 
                }) 
            })
            
        }*/

    async componentDidMount(){
        //this.getAdmins()

        this.getRms()

        this.getUsers()
    }

    
      
    /*finally(){
        console.log(this.state.admns)
        this.state.admns.map(i => {
            return(
                <ListGroupItem>
                    <img src={i.photoURL} alt={i.displayName} width="25px" height="25px" style={{borderRadius: "50%"}} /> {i.displayName}
                </ListGroupItem>  
            )
        })
    }*/
  
    componentWillUnmount(){
        this.unsubscribeRooms()
        this.unsubsrcibeUsers()
    }

    render(){
        console.log("ads array " + this.state.ads)
        console.log("admns array " + this.state.admns)
        
        let search = this.state.userSearch
        
        let init = this.state.users.map(i => {
            return i
        })

        let fltrd = init.filter(el => el.displayName.toLowerCase().indexOf(search.toLowerCase()) !== -1)

        let slctAdmin = fltrd.map(i => {
            let btn
            let ticked
            let dp

            if(this.state.indicator){
                if(this.state.selectedRoom.admin.includes(i.uid)){
                    ticked = <i className="fa fa-check" aria-hidden="true" style={{color: "#00ff00"}}></i>
                }
                else{
                    ticked=<div></div>
                }

                /*if(this.state.setted && this.state.selectedUser === i.uid){
                    ticked = <i className="fa fa-check" aria-hidden="true" style={{color: "#00ff00"}}></i>
                }
                if(this.state.deleted && this.state.deletedUser === i.uid){
                    ticked = <div></div>
                }*/
                
                if(this.state.selectedRoom.admin.includes(i.uid)){
                    btn = <Button size="sm" onClick={() => {this.setState({deletedUser: i.uid, deletedName: i.displayName}, () => {this.removeAsAdmin(); this.sendRemNoti()})}}><i className="fa fa-times" aria-hidden="true" style={{color: "#ff6666"}}></i></Button>
                }
                else{
                    btn = <Button size="sm" onClick={() => {this.setState({selectedUser: i.uid, name: i.displayName}, () => {this.setAsAdmin(); this.sendAddNoti()})}}><i className="fa fa-plus" aria-hidden="true" style={{color: "#00e600"}}></i></Button>
                }

                /*if(this.state.setted && this.state.selectedUser === i.uid){
                    btn = <Button size="sm" onClick={() => {this.setState({deletedUser: i.uid, deletedName: i.displayName}, () => this.removeAsAdmin())}}><i className="fa fa-times" aria-hidden="true"></i></Button>
                }
                if(this.state.deleted && this.state.deletedUser === i.uid){
                    btn = <Button size="sm" onClick={() => {this.setState({selectedUser: i.uid, name: i.displayName}, () => this.setAsAdmin())}}><i className="fa fa-plus" aria-hidden="true"></i></Button>
                }*/
            }

            if(i.photoURL === null || i.photoURL === ''){
                dp = <img src={placehold} alt={i.displayName} width="25px" height="25px" style={{borderRadius: "50%"}} />
            }
            else{
                dp = <img src={i.photoURL} alt={i.displayName} width="25px" height="25px" style={{borderRadius: "50%"}} />
            }
            return(
                <ListGroupItem key={i.uid}>
                    <div className="row">
                        <div className="col-10">
                           {dp} {i.displayName} {ticked}
                        </div>
                        <div className="col-2">
                            {btn}
                        </div>
                    </div>   
                </ListGroupItem>
            )
        })

        return(
            <React.Fragment>
                <Modal isOpen={this.props.isSettingsOpen} toggle={this.props.toggleSettingsModal}>
                    <ModalHeader toggle={this.props.toggleSettingsModal}>
                        {this.props.edibleRoomName} Settings
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label>Click on a Texter user to select as an admin:</Label>
                                <Input type="text" name="userSearch" 
                                    id="userSearch" placeholder="Search users by typing"
                                    onChange={this.handleUserSearch} value={this.state.userSearch}
                                />
                            </FormGroup>
                        </Form>
                        {this.state.loading && <div className="text-center"><Spinner type="grow" color="info" /></div> }
                        <ListGroup>
                            {slctAdmin}
                        </ListGroup>
                    </ModalBody>
                </Modal> 
            </React.Fragment>
        )
    }
}

export default Admin