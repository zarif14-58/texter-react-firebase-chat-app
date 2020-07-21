import React, {Component} from 'react'
import { Form, FormGroup, Label, Row, Col, Input, Button } from 'reactstrap'
import { signup } from '../Firebase/auth'
import FileUploader from "react-firebase-file-uploader"
import firebase from 'firebase';
import placehold from './assets/placeholder_profile_photo.png'
import { db } from '../Firebase/config';

class Signup extends Component {
    constructor(props){
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            signupemail: '',
            signuppass: '',
            error: null,
            dp: '',
            isUploading: false,
            progress: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleProgress = this.handleProgress.bind(this)
        this.handleUploadError = this.handleUploadError.bind(this)
        this.handleUploadStart = this.handleUploadStart.bind(this)
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
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
        console.log(error)
    }

    handleUploadSuccess(filename){
        firebase
        .storage()
        .ref("profileImages")
        .child(filename)
        .getDownloadURL()
        .then(url => this.setState({ dp: url }))

    }

    async handleSubmit(event){
        console.log("Form submitted" + this.state.firstname + this.state.lastname + this.state.signupemail)
        event.preventDefault()
        this.setState({ error: '' })
        try{
            await signup(this.state.signupemail, this.state.signuppass)
                    .then(result => {

                        result.user.updateProfile({
                            displayName: this.state.lastname,
                            photoURL: this.state.dp
                        })

                        db.collection("Users").doc(`${result.user.uid}`).set({
                            displayName: this.state.lastname,
                            photoURL: this.state.dp,
                            uid: result.user.uid
                        }).then(() => console.log("Profile written successful"))
                            .catch(err => console.error("Error writing doc", err))
                    })
                    .catch(err => console.log(err))
        } catch(error){
            this.setState({ error: error.message })
        }

        

        this.setState({
            isUploading: false,
            progress: 0
        })
    }

    render(){
        return(
            <div className="container" id="signupForm">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8">
                    <h2>Sign Up</h2>

                        <Form onSubmit={this.handleSubmit}>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="firstname">First Name</Label>
                                        <Input type="text" name="firstname" 
                                            id="firstname" placeholder="First Name"
                                            value={this.state.firstname} onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="lastname">Last Name</Label>
                                        <Input type="text" name="lastname" 
                                            id="lastname" placeholder="Last Name" 
                                            value={this.state.lastname} onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="signupemail">Email</Label>
                                <Input type="email" name="signupemail" 
                                    id="signupemail" placeholder="Email" 
                                    value={this.state.signupemail} onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="signuppass">Password</Label>
                                <Input type="password" name="signuppass" 
                                    id="signuppass" placeholder="Password"
                                    value={this.state.signuppass} onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                            <img src={this.state.dp === '' ? placehold : this.state.dp} alt="profile pic" height="100px" width="100px" style={{borderRadius: "50%"}} />
                            <label style={{backgroundColor: '#ff66ff', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer', marginRight: "5px"}}>
                                Upload Profile Picture {this.state.isUploading && this.state.progress}
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
                            </FormGroup>
                            {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
                            <Button outline color="info">Sign Up</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup