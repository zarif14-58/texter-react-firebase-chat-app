import React, {Component} from 'react'
import { auth, db } from '../Firebase/config'
import { Button, Form, FormGroup, Label, Input, Card, CardTitle, CardText } from 'reactstrap'
import firebase from 'firebase'
import FileUploader from "react-firebase-file-uploader"
import placehold from './assets/placeholder_profile_photo.png'
import { Link } from 'react-router-dom'


class Profile extends Component {

    constructor(props){
        super(props)
        this.state = {
            user: auth().currentUser,
            edit: false,
            isUploading: false,
            progress: 0,
            imageUrl: null,
            value: auth().currentUser.displayName,
            favs: [],
            favRooms: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleProgress = this.handleProgress.bind(this)
        this.handleUploadError = this.handleUploadError.bind(this)
        this.handleUploadStart = this.handleUploadStart.bind(this)
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this)
    }

    handleEdit(){
        this.setState({
            edit: !this.state.edit
        })
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
        .ref("profileImages")
        .child(filename)
        .getDownloadURL()
        .then(url => this.setState({ imageUrl: url }))

    }

    handleChange(event){
        this.setState({
            value: event.target.value
        })
    }

    async handleSubmit(event){
        event.preventDefault()

        let finalUpload

        if(this.state.imageUrl === null){
            finalUpload = this.state.user.photoURL
        }
        else{
            finalUpload = this.state.imageUrl
        }

        await this.state.user.updateProfile({
            displayName: this.state.value,
            photoURL: finalUpload
        }).then(() => console.log("Updated Successfully"))
        .catch(err => console.error("Function denied with error: ", err))

        await db.collection("Users").doc(`${this.state.user.uid}`).update({
            displayName: this.state.value,
            photoURL: finalUpload
        }).then(() => console.log("Doc Updated Successfully"))
        .catch(err => console.error("Error: ", err))

        this.setState({
            value: '',
            imageUrl: null,
            isUploading: false,
            progress: 0,
            edit: false
        })

    }

    async componentDidMount(){

        db.collection("Users").doc(`${this.state.user.uid}`)
            .onSnapshot(doc => {
                this.setState({
                    favs: doc.data().favs
                })
            })

            this.state.favs.forEach(i => {
                let rooms = []
                db.collection("Rooms").doc(`${i}`)
                    .onSnapshot(doc => {
                        rooms.push(doc.data())
                    })
                    this.setState({
                        favRooms: rooms
                    })
                })
            }

    render(){
        console.log(this.state.favs)
        let favRooms = this.state.favRooms.map(i => {
            return(
                <div className="col-12 col-sm-12 roomCards" key={i.roomId}>
                    <Card body>
                        <div className="row">
                            <div className="col-12">
                                <CardTitle>{i.roomName}</CardTitle>
                            </div>
                        </div>
                        <CardText>{i.about}</CardText>
                        <Link to={{pathname: "/chat", state:{room: i.roomId, name: i.roomName}}}><Button color="primary">Enter {i.roomName} Room</Button></Link>
                    </Card>
                </div>
            )
        })
        return(
            <div className="container" style={{paddingTop: "50px"}}>
                {!this.state.edit && <div className="row justify-content-center">
                    <div className="col-10 col-sm-6 text-center">
                        <img src={this.state.user.photoURL === null ? placehold : this.state.user.photoURL} alt="profile pic" height="200px" width="200px" style={{borderRadius: "50%"}} />
                    </div>
                </div>}
                {this.state.edit && <div className="row justify-content-center">
                    <div className="col-10 col-sm-6 text-center">
                        <img src={this.state.imageUrl === null ? placehold : this.state.imageUrl} alt="profile pic" height="200px" width="200px" style={{borderRadius: "50%"}} />
                    </div>
                </div>}
                {this.state.edit && <div className="row justify-content-center">
                    <div className="col-10 col-sm-8">
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <div className="text-center">
                                    <label style={{backgroundColor: '#ff66ff', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer', marginRight: "5px"}}>
                                        Change Avatar {this.state.isUploading && this.state.progress}
                                            <FileUploader
                                                hidden
                                                randomizeFilename
                                                accept="image/*"
                                                storageRef={firebase.storage().ref('profileImages')}
                                                onUploadStart={this.handleUploadStart}
                                                onUploadError={this.handleUploadError}
                                                onUploadSuccess={this.handleUploadSuccess}
                                                onProgress={this.handleProgress}
                                            />
                                    </label>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="editname">Edit Your Display Name</Label>
                                    <Input type="text" name="editname"
                                        value={this.state.value} onChange={this.handleChange}
                                        placeholder={this.state.user.displayName} id="editname"
                                    />
                            </FormGroup>
                            <Button color="success">Save Edits</Button>
                        </Form>
                    </div>
                </div>}
                {!this.state.edit && <div className="row justify-content-center username">
                    <div className="col-7 col-sm-7 text-center">
                        <h3>{this.state.user.displayName}</h3>
                    </div>
                </div>}
                <div className="text-center escape">
                    {!this.state.edit && <Button color="success" onClick={this.handleEdit}>Edit</Button>}
                    {this.state.edit && <Button color="warning" onClick={this.handleEdit}>Cancel Editing</Button>}
                </div>

                {!this.state.edit && <hr />}

                {!this.state.edit && 
                <div className="row justify-content-center">
                    {favRooms}
                </div>}
            </div>
        )
    }
}

export default Profile