import React, {Component} from 'react'
import { db } from '../Firebase/config'
import { Form, FormGroup, Input, Button, Navbar, NavbarText, Progress, Spinner } from 'reactstrap'
import { auth } from '../Firebase/config'
import firebase from 'firebase';
import { signout } from '../Firebase/auth'
import FileUploader from "react-firebase-file-uploader"
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart'
import placehold from './assets/placeholder_profile_photo.png'
import { Link } from 'react-router-dom'

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
            emojyOpen: false,
            users: [],
            metaData: null,
            loading: true,
            roomName: this.props.location.state.name
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this)
        this.handleProgress = this.handleProgress.bind(this)
        this.handleUploadError = this.handleUploadError.bind(this)
        this.handleUploadStart = this.handleUploadStart.bind(this)
        this.addEmoji = this.addEmoji.bind(this)
        this.handleEmojy = this.handleEmojy.bind(this)
        this.scrolltoBottom = this.scrolltoBottom.bind(this)
        this.getTexts = this.getTexts.bind(this)
        this.getTextsAgain = this.getTextsAgain.bind(this)
        //this.handleImgUpload = this.handleImgUpload.bind(this) 
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

        firebase
        .storage()
        .ref("images")
        .child(filename)
        .getMetadata()
        .then(metadata => {
            this.setState({
                metaData: metadata.contentType
            })
        })

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
                    dp: this.state.user.photoURL,
                    fileMetaData: this.state.metaData
                })
                .then((docRef) => console.log("Document is written"))
                .catch((error) => console.log(error))

                this.setState({value: ''})
                this.setState({imageUrl: ''})
                this.setState({isUploading: false})
                this.setState({progress: 0})
            }

        scrolltoBottom(){
            this.messagesEnd.scrollIntoView({behavior: "smooth"})
        }

        
        getTextsAgain(){
            this.unsubscribeText = db.collection("Rooms").doc(`${this.state.rooms}`).collection("Texts").orderBy("createdAt", "asc")
            .onSnapshot((querySnapshot) => {
                let chat = []
                querySnapshot.forEach((doc) => {
                    chat.push(doc.data())
                })
                this.setState({ chats: chat })
            })
        }
        
        getTexts(){
            this.unsubscribeUser = db.collection("Users")
            .onSnapshot((querySnapshot) => {
                let user = []
                querySnapshot.forEach((doc) => {
                    user.push(doc.data())
                })
                this.setState({users: user, loading: false})
            })

            /*this.unsubscribe = db.collection("Rooms").doc(`${this.state.rooms}`).collection("Texts").orderBy("createdAt", "asc")
            .onSnapshot((querySnapshot) => {
                let chat = []
                querySnapshot.forEach((doc) => {
                    chat.push(doc.data())
                })
                this.setState({ chats: chat })
            })*/
        }

        

    async componentDidMount(){
        
        /**/
        /*db.collection("Users")
            .onSnapshot((querySnapshot) => {
                let user = []
                querySnapshot.forEach((doc) => {
                    user.push(doc.data())
                })
                this.setState({users: user, loading: false})
            })

        db.collection("Rooms").doc(`${this.state.rooms}`).collection("Texts").orderBy("createdAt", "asc")
            .onSnapshot((querySnapshot) => {
                let chat = []
                querySnapshot.forEach((doc) => {
                    chat.push(doc.data())
                })
                this.setState({ chats: chat })
            })*/
            this.getTexts()
            this.getTextsAgain()
        }

        componentDidUpdate(){
            this.scrolltoBottom()
        }

        componentWillUnmount(){
            this.unsubscribeText()
            this.unsubscribeUser()
        }

    render(){
        
        let text = this.state.chats.map(i => {
            let rndr
            let dp

            let photoURL
            let username

            this.state.users.forEach(j => {

                if(j.uid === i.uid){
                    photoURL = j.photoURL
                    username = j.displayName
                }

            })
            
            if(i.imageUrl === ""){
                rndr = <div></div>
            }
            else{
                if(i.fileMetaData === "image/jpeg" || i.fileMetaData === "image/apng" || i.fileMetaData === "image/bmp" || i.fileMetaData === "image/gif" || i.fileMetaData === "image/x-icon" || i.fileMetaData === "image/png" || i.fileMetaData === "image/svg+xml" || i.fileMetaData === "image/tiff" || i.fileMetaData === "image/webp"){
                    rndr = <img src={i.imageUrl} alt="" className="img-fluid"/>
                }
                else if(i.fileMetaData === "video/x-flv" || i.fileMetaData === "video/mp4" || i.fileMetaData === "application/x-mpegURL" || i.fileMetaData === "video/MP2T" || i.fileMetaData === "video/3gpp" || i.fileMetaData === "video/quicktime" || i.fileMetaData === "video/x-msvideo" || i.fileMetaData === "video/x-ms-wmv"){
                    rndr = <video width="100%" controls><source src={i.imageUrl}></source></video>
                }
                else if(i.fileMetaData === "audio/basic" || i.fileMetaData === "audio/basic" || i.fileMetaData === "auido/L24" || i.fileMetaData === "audio/mid" || i.fileMetaData === "audio/mid" || i.fileMetaData === "audio/mpeg" || i.fileMetaData === "audio/mp4" || i.fileMetaData === "audio/x-aiff" ||  i.fileMetaData === "audio/x-mpegurl" || i.fileMetaData === "audio/vnd.rn-realaudio" || i.fileMetaData === "audio/vnd.rn-realaudio" || i.fileMetaData === "audio/ogg" || i.fileMetaData === "audio/vorbis" || i.fileMetaData === "audio/vnd.wav" || i.fileMetaData === "application/octet-stream"){
                    rndr = <audio style={{width: "100%"}} controls><source src={i.imageUrl}></source>Your Browser Does Not Support The Audio Format</audio>
                }
                else if(i.fileMetaData === "application/pdf"){
                    rndr = <a href={i.imageUrl}>Attached Link</a>
                }
                else{
                    rndr = <h6><em>Sorry! Attached File Type Is Not Supported</em></h6>
                }
                
            }

            if(photoURL === null || photoURL === ''){
                dp = <img src={placehold} alt="" height="25px" width="25px" style={{borderRadius: "50%"}} />
            }
            else{
                dp = <img src={photoURL} alt="" height="25px" width="25px" style={{borderRadius: "50%"}} />
            }
            return(
                <div className="row justify-content-center chats" key={i.createdAt}>
                    <div className={"col-8 col-sm-3 " + (this.state.user.uid === i.uid ? "active" : "notActive")}>
                        <h6>{i.content}</h6>
                        {rndr}
                        <p>--{dp} {username}</p>
                        <em>{i.createdAt.toDate().toDateString()} at {i.createdAt.toDate().toLocaleTimeString()}</em>
                    </div>
                </div>
            )
        })
        return(
            <React.Fragment>
                <div>
                    <Navbar light expand="md" className="fixed-top" style={{backgroundColor: "#33ccff"}}>
                        <NavbarText>@{this.state.roomName}</NavbarText>
                        <NavbarText className="ml-auto"><Link to="/profile"><img src={this.state.user.photoURL === null ? placehold : this.state.user.photoURL} height="50px" width="50px" style={{borderRadius: "50%"}} alt="profilepic"/></Link></NavbarText>
                        <Button color="danger" className="ml-auto" size="sm" onClick={this.signOut}>Sign Out</Button>
                    </Navbar>
                </div>
                {this.state.loading && <div className="text-center" style={{paddingTop: "90px"}}><Spinner type="grow" color="info" /></div>}
                <div className="container" style={{paddingTop: "110px", paddingBottom: "110px"}}>
                    {text}
                </div>
                <div className="container fixed-bottom" style={{backgroundColor: "#40E0D0"}}>
                    <div className="row justify-content-center" style={{marginTop: "10px" ,marginBottom: "15px"}}>
                        <div className="col-9 col-sm-4 offset-sm-2">
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Input type="text" name="content" 
                                        id="content" placeholder="Type your thought"
                                        value={this.state.value} onChange={this.handleChange}
                                    />
                                    {this.state.emojyOpen && <Picker onSelect={this.addEmoji} style={{width: "300px", height: "auto"}} />}
                                </FormGroup>
                                {this.state.isUploading && <div style={{marginBottom: "5px"}}>
                                    <Progress value={this.state.isUploading && this.state.progress} />
                                </div>}
                                <Button color="primary"><i className="fa fa-paper-plane" aria-hidden="true"></i></Button>
                            </Form>   
                        </div>
                        <div className="col-3 col-sm-3" style={{marginLeft: "-17px"}}>
                        
                            <label style={{backgroundColor: '#ff66ff', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer', marginRight: "5px"}}>
                            <i className="fa fa-file" aria-hidden="true"></i>
                                    <FileUploader
                                        hidden
                                        randomizeFilename
                                        accept="image/*, video/*, audio/*, application/pdf"
                                        storageRef={firebase.storage().ref('images')}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                        //onChange={(event) => this.handleImgUpload(event)}
                                    />
                            </label>

                            <i className="fa fa-smile-o" aria-hidden="true" style={{color: "blue", fontSize: "20px", verticalAlign: "sub", "cursor": "pointer"}} onClick={this.handleEmojy}></i>             
                        </div>
                    </div>
                </div>
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </React.Fragment>
        )
    }

}

export default Chat