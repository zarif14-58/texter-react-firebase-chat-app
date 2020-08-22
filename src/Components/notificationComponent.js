import React, {Component} from 'react'
import { Modal, ModalHeader, ModalBody, ListGroupItem, ListGroup} from 'reactstrap'
import { db, auth } from '../Firebase/config'

class Notifi extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: auth().currentUser,
            news: []
        }
    }

    getNews(){
        this.unsubscribe = db.collection("Notifications").doc(`${this.state.user.uid}`).collection("News").orderBy("createdAt", "desc").limit(6)
                                .onSnapshot(querySnapshot => {
                                    let docs = []
                                    querySnapshot.forEach(doc => {
                                        docs.push(doc.data())
                                    })
                                    this.setState({
                                        news: docs
                                    })
                                })
                            }

    async componentDidMount(){
        this.getNews()
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    render(){
        let news
        if(this.state.news.length === 0){
            news = <h6 color="#a6a6a6"><em>You don't have any texterication yet.</em></h6>
        }
        else{
            news = this.state.news.map(i => {
                        return(
                            <ListGroupItem key={i.createdAt}>
                                <h5>{i.news}</h5>
                                <p>{i.createdAt.toDate().toDateString()} at {i.createdAt.toDate().toLocaleTimeString()}</p>
                            </ListGroupItem>
                        )
                    })
        }
        
        return(
            <React.Fragment>
                <Modal isOpen={this.props.isNotiOpen} toggle={this.props.toggleNotiModal}>
                    <ModalHeader toggle={this.props.toggleNotiModal}>
                        Texterication
                    </ModalHeader>
                    <ModalBody>
                        <ListGroup>
                            {news}
                        </ListGroup>
                    </ModalBody>
                </Modal> 
            </React.Fragment>
        )
    }
}

export default Notifi