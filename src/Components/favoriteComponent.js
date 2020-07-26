import React, {Component} from 'react'
import { Card, CardTitle, CardText, Button, Spinner } from 'reactstrap'
import { auth, db } from '../Firebase/config'
import { Link } from 'react-router-dom'

class Favorite extends Component {

    constructor(props){
        super(props)
        this.state = {
            favs: [],
            favRooms: [],
            user: auth().currentUser,
            loading: true
        }
        this.handleFavs = this.handleFavs.bind(this)
        this.getFavs = this.getFavs.bind(this)
    }

    getFavs(){
        db.collection("Users").doc(`${this.state.user.uid}`)
        .get().then(doc => {
            this.setState({
                favs: doc.data().favs
            }, () => this.handleFavs())
        })
        
    }

    async componentDidMount(){

        /*db.collection("Users").doc(`${this.state.user.uid}`)
            .onSnapshot(doc => {
                this.setState({
                    favs: doc.data().favs
                }, () => this.handleFavs())
            })*/
            
            this.getFavs()

        }

    handleFavs(){
        let favs = []
        this.state.favs.forEach(i => {
                db.collection("Rooms").doc(`${i}`)
                    .get().then(doc => {
                        favs.push(doc.data())
                        this.setState({
                        favRooms: favs,
                        loading: false
                    })
                })   
            })
        
    }
    
    /*componentWillUnmount(){
        this.unsubscribe()
    }*/

    render(){
        let favRooms = this.state.favRooms.map(i => {
            return(
                <div className="col-12 col-sm-12 roomCards" key={i.roomId}>
                    <Card body outline color="danger">
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
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-6">
                        <div className="row justify-content-center">
                            <h5>Favorite Rooms</h5>
                            
                            {favRooms}
                        </div>
                    </div>
                </div>
                
                <div className="text-center">
                    {this.state.loading && <Spinner type="grow" color="info" />}
                </div> 
            </React.Fragment>
        )
    }
}

export default Favorite