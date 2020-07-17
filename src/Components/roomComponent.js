import React, {Component} from 'react'
import { db } from '../Firebase/config'


class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: []
        }
    }

    async componentDidMount(){
        db.collection("Rooms").where("public", "==", true)
            .onSnapshot((querySnapshot) => {
                let names = []
                querySnapshot.forEach((doc) => {
                    names.push(doc.data().roomName)
                })
                this.setState({
                    name: names
                })
            })   
        }

    render(){
        let nms = this.state.name.map(i => {
            return(
                <h2>{i}</h2>
            )
        })
        return(
            <div>
                <h1>Rooms</h1>
                {nms}
            </div>
        )
    }
}

export default Room