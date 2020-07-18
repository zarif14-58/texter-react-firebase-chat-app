import React, {Component} from 'react'
import { db } from '../Firebase/config'
import { Form, FormGroup, Input, Button, Navbar, NavbarBrand, NavbarText } from 'reactstrap'
import { auth } from '../Firebase/config'
import firebase from 'firebase';
import { signout } from '../Firebase/auth'

class Chat extends Component {
    constructor(props){
        super(props)
        this.state = {
            chats: [],
            rooms: this.props.location.state.room,
            value: '',
            user: auth().currentUser,
            color: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this) 
    }

    async signOut(){
        try{
            await signout()
        } catch(error){
            console.log(error.message)
        }
    }

    handleChange(event){
        this.setState({
            value: event.target.value
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
                    text: true
                })
                .then((docRef) => console.log("Document written with ID: ", docRef.id))
                .catch((error) => console.log(error))

                this.setState({value: ''})
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
        let text = this.state.chats.map(i => {
            return(
                <div className="row justify-content-center chats" key={i.createdAt}>
                    <div className={"col-8 col-sm-3 " + (this.state.user.displayName === i.from ? "active" : "notActive")}>
                        <h4>{i.content}</h4>
                        <p>--{i.from}</p>
                    </div>
                </div>
            )
        })
        return(
            <React.Fragment>
                <div>
                    <Navbar color="warning" light expand="md">
                        <NavbarBrand>Texter</NavbarBrand>
                        <NavbarText className="ml-auto">{this.state.user.displayName}</NavbarText>
                        <Button color="danger" className="ml-auto" onClick={this.signOut}>Sign Out</Button>
                    </Navbar>
                </div>
                <div className="container">
                    {text}
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-6">
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Input type="text" name="content" 
                                        id="content" placeholder="Type your thought"
                                        value={this.state.value} onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <Button color="primary">Send</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default Chat