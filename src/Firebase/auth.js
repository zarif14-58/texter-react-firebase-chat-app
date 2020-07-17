import { auth } from './config'

export function signup(email, password) {
    return auth().createUserWithEmailAndPassword(email, password)
}

export function signin(email, password) {
    return auth().signInWithEmailAndPassword(email, password)
}

export function signout(){
    return auth().signOut()
}