import React, {Component} from 'react'
import { Form, FormGroup, Label, Row, Col, Input, Button, Progress } from 'reactstrap'
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
            progress: 0,
            isDisabbled: true,
            lastNameErr: null,
            emailErr: null,
            passwordErr: null
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleProgress = this.handleProgress.bind(this)
        this.handleUploadError = this.handleUploadError.bind(this)
        this.handleUploadStart = this.handleUploadStart.bind(this)
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this)
        this.handleDisable = this.handleDisable.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })

        const regex = RegExp(/.+@.+\..+/)

        switch(event.target.name){
            case 'lastname':
                event.target.value.length < 5 ? this.setState({lastNameErr: "Last Name Should Be At Least 5 Characters Long"})
                    : this.setState({lastNameErr: ''})
                break

            case 'signupemail':
                regex.test(event.target.value) ? this.setState({emailErr: ''}) : this.setState({emailErr: "Email Is Not Valid"})
                break 

            case 'signuppass':
                event.target.value.length < 8 ? this.setState({passwordErr: "Password Should Be Atleast 8 Characters Long"})
                    : this.setState({passwordErr: ''})
                break

            default:
                break
        }

    }

    handleDisable(){
        return this.state.lastNameErr === '' && this.state.emailErr === '' && this.state.passwordErr === ''
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
                            uid: result.user.uid,
                            favs: []
                        }).then(() => {
                            console.log("Profile written successful")
                        })
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
        const disable = this.handleDisable()
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
                                        {this.state.lastNameErr !== null && <p className="text-danger">{this.state.lastNameErr}</p>}   
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="signupemail">Email</Label>
                                <Input type="email" name="signupemail" 
                                    id="signupemail" placeholder="Email" 
                                    value={this.state.signupemail} onChange={this.handleChange}
                                />
                                {this.state.emailErr !== null && <p className="text-danger">{this.state.emailErr}</p>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="signuppass">Password</Label>
                                <Input type="password" name="signuppass" 
                                    id="signuppass" placeholder="Password"
                                    value={this.state.signuppass} onChange={this.handleChange}
                                />
                                {this.state.passwordErr !== null && <p className="text-danger">{this.state.passwordErr}</p>}
                            </FormGroup>
                            <FormGroup>
                            <img src={this.state.dp === '' ? placehold : this.state.dp} alt="profile pic" height="100px" width="100px" style={{borderRadius: "50%"}} />
                            <label style={{backgroundColor: '#ff66ff', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer', marginRight: "5px"}}>
                                Upload Profile Picture
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
                            {this.state.isUploading && <div style={{marginTop: "5px"}}>
                                <Progress value={this.state.isUploading && this.state.progress} />
                            </div>}
                            </FormGroup>
                            {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
                            <Button color="info" disabled={!disable}>Sign Up</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup