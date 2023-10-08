import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument,} from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';

import {
  getFirestore,
  collection,
  getDocs
} from 'firebase/firestore';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any

  db = getFirestore()
  adminsCollection = collection(this.db, 'admins')

  constructor(
    public firestore: AngularFirestore,
    public fireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
  ) {
    this.fireAuth.authState.subscribe((user) => {
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      }else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
    // && user.emailVerified !== false ? true : false
  }

  async signIn(email: string, password: string): Promise<any> {
    try {
      const result = await this.fireAuth.signInWithEmailAndPassword(email, password);
      await this.setUserData(result.user);
      this.router.navigate(['/account', this.userData.uid]);
    } catch (error) {
      window.alert(error.message);
      return error;
    }
  }

  async signUp(name: string, email: string, password: string): Promise<any> {
    try{
      const result = await this.fireAuth.createUserWithEmailAndPassword(email, password)
      await this.setUserData(result.user);
      this.setDisplayName(name)
      this.router.navigate(['/account', this.userData.uid])
    } catch(error){
      window.alert(error.message)
      return error
    }
  }

  googleAuth(){
    return this.loginWith(new auth.GoogleAuthProvider())
  }

  logOut(){
    this.fireAuth.signOut()
    .then(() => {
      localStorage.removeItem('user')
      this.router.navigate(['/landing-page'])
    })
    .catch((error) => {console.log("[!] Something went wrong: ", error.message)});
  }

  async loginWith(provider: any): Promise<any> {
    try{
      const result = await this.fireAuth.signInWithPopup(provider)
      await this.setUserData(result.user)
      this.router.navigate(['/account', this.userData.uid]);
    } catch(error){ window.alert(error.message) }
  }

  setUserData(user: any){
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {merge: true});
  }

  async setDisplayName(name: string): Promise<void> {
    try{
      const user = await this.fireAuth.currentUser
      if(user){
        user.updateProfile({
          displayName: name,
        })
        .then(() => {
          this.setUserData(user);
        })
      }
    } catch(error){ window.alert(error.message) }
  }

  async isAdmin(): Promise<boolean> {
    if(!this.isLoggedIn) return false
    return new Promise<boolean>((resolve, reject) => {
      getDocs(this.adminsCollection)
        .then((snapshot) => {
          const admins = snapshot.docs.map((doc) => ({ ...doc.data() }))
          admins.forEach(admin => {
            if(admin['uid'] == this.userData.uid) resolve(true)
          })
          resolve(false)
        })
        .catch((err) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  get uid(): string {
    return this.userData.uid
  }

   //UNUSED
   sendVerificationMail() {
    return this.fireAuth.currentUser
      .then((user) => user.sendEmailVerification())
      .then(() => {
        console.log("Email di verifica spedita")
      });
  }

  //UNUSED
  forgotPassword() {
    return this.fireAuth
      .sendPasswordResetEmail(this.userData.email)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {window.alert(error)});
  }

}
