import React, {Component} from 'react'
import { db } from '../Firebase/config'
import { Form, FormGroup, Input, Button, Navbar, NavbarBrand, NavbarText } from 'reactstrap'
import { auth } from '../Firebase/config'
import firebase from 'firebase';
import { signout } from '../Firebase/auth'
import FileUploader from "react-firebase-file-uploader"
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart'
import placehold from './assets/placeholder_profile_photo.png'


class Chat extends Component {
    constructor(props){
        super(props)
        this.state = {
            chats: [],
            rooms: this.props.location.state.room,
            value: '',
            user: auth().currentUser,
            color: '',
            imageUrl: '',
            isUploading: false,
            progress: 0,
            emojyOpen: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this)
        this.handleProgress = this.handleProgress.bind(this)
        this.handleUploadError = this.handleUploadError.bind(this)
        this.handleUploadStart = this.handleUploadStart.bind(this)
        this.addEmoji = this.addEmoji.bind(this)
        this.handleEmojy = this.handleEmojy.bind(this) 
    }

    async signOut(){
        try{
            await signout()
        } catch(error){
            console.log(error.message)
        }
    }

    handleUploadStart(){
        this.setState({
            isUploading: true,
            progress: 0
        })
    }

    handleProgress(progress){
        this.setState({
            progress
        })
    }

    handleUploadError(error){
        this.setState({ isUploading: false })
        alert(error)
    }

    handleUploadSuccess(filename){
        firebase
        .storage()
        .ref("images")
        .child(filename)
        .getDownloadURL()
        .then(url => this.setState({ imageUrl: url }))

    }

    handleChange(event){
        this.setState({
            value: event.target.value
        })
    }

    handleEmojy(){
        this.setState({emojyOpen: !this.state.emojyOpen})
    }

    addEmoji(e){
        let emoji = e.native
        this.setState({
            value: this.state.value + emoji
        })
    }

    async handleSubmit(event){
        event.preventDefault()
        await db.collection("Rooms").doc(`${this.state.rooms}`).collection("Texts")
                .add({
                    content: this.state.value,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                    uid: this.state.user.uid,
                    from: this.state.user.displayName,
                    text: true,
                    imageUrl: this.state.imageUrl,
                    dp: this.state.user.photoURL
                })
                .then((docRef) => console.log("Document written with ID: ", docRef.id))
                .catch((error) => console.log(error))

                this.setState({value: ''})
                this.setState({imageUrl: ''})
                this.setState({isUploading: false})
                this.setState({progress: 0})
            }

    async componentDidMount(){
        db.collection("Rooms").doc(`${this.state.rooms}`).collection("Texts").orderBy("createdAt", "asc")
            .onSnapshot((querySnapshot) => {
                let chat = []
                querySnapshot.forEach((doc) => {
                    chat.push(doc.data())
                })
                this.setState({ chats: chat })
            })
        }

    render(){
        console.log(this.state.rooms)
        console.log("Image URL" + this.state.imageUrl)
        let text = this.state.chats.map(i => {
            let rndr
            let dp
            if(i.imageUrl === ""){
                rndr = <div></div>
            }
            else{
                rndr = <img src={i.imageUrl} alt="" className="img-fluid"/>
            }

            if(i.dp === ""){
                dp = <img src={placehold} alt="" height="25px" width="25px" style={{borderRadius: "50%"}} />
            }
            else{
                dp = <img src={i.dp} alt="" height="25px" width="25px" style={{borderRadius: "50%"}} />
            }
            return(
                <div className="row justify-content-center chats" key={i.createdAt}>
                    <div className={"col-8 col-sm-3 " + (this.state.user.uid === i.uid ? "active" : "notActive")}>
                        <h6>{i.content}</h6>
                        {rndr}
                        <p>--{dp} {i.from}</p>
                    </div>
                </div>
            )
        })
        return(
            <React.Fragment>
                <div>
                    <Navbar color="warning" light expand="md" className="fixed-top">
                        <NavbarBrand>Texter</NavbarBrand>
                        <NavbarText className="ml-auto">{this.state.user.displayName}</NavbarText>
                        <Button color="danger" className="ml-auto" onClick={this.signOut}>Sign Out</Button>
                    </Navbar>
                </div>
                <div className="container">
                    {text}
                </div>
                <div className="container" style={{marginBottom: "20px"}}>
                    <div className="row justify-content-center">
                        <div className="col-9 col-sm-4 offset-sm-2">
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Input type="text" name="content" 
                                        id="content" placeholder="Type your thought"
                                        value={this.state.value} onChange={this.handleChange}
                                    />
                                    {this.state.emojyOpen && <Picker onSelect={this.addEmoji} style={{width: "300px", height: "auto"}} />}
                                </FormGroup>
                                <Button color="primary"><i className="fa fa-paper-plane" aria-hidden="true"></i></Button>
                            </Form>   
                        </div>
                        <div className="col-3 col-sm-3" style={{marginLeft: "-17px"}}>
                        
                            <label style={{backgroundColor: '#ff66ff', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer', marginRight: "5px"}}>
                                <i className="fa fa-file-image-o" aria-hidden="true"></i>{this.state.isUploading && this.state.progress}
                                    <FileUploader
                                        hidden
                                        randomizeFilename
                                        accept="image/*"
                                        storageRef={firebase.storage().ref('images')}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                    />
                            </label>
                            <i className="fa fa-smile-o" aria-hidden="true" style={{color: "blue", fontSize: "20px", verticalAlign: "sub", "cursor": "pointer"}} onClick={this.handleEmojy}></i>             
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default Chat