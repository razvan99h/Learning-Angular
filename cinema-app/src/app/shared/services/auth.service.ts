import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
  }

  doRegister(user: User): Promise<any> {
    console.log('doRegister <<< user:', user);
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(
          res => {
            console.log('doRegister >>> res:', res);
            resolve(res);
          }, err => {
            console.error('doRegister >>> err:', err);
            reject(err);
          }
        );
    });
  }

  doLogin(user: User): Promise<any> {
    console.log('doLogin <<< user:', user);
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(
          res => {
            console.log('doLogin >>> res:', res);
            resolve(res);
          }, err => {
            console.error('doLogin >>> err:', err);
            reject(err);
          }
        );
    });
  }

  doLogout(): Promise<any> {
    console.log('doLogout <<< ');
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        console.log('doLogout >>>');
        resolve();
      } else {
        console.error('doLogout >>> No user logged in!');
        reject();
      }
    });
  }

  getCurrentUser(): Promise<any> {
    console.log('getCurrentUser <<< ');
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('getCurrentUser >>> user:', user);
          resolve(user);
        } else {
          console.log('getCurrentUser >>> No user logged in!');
          reject('No user logged in');
        }
      });
    });
  }

  updateCurrentUser(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(
        res => {
          resolve(res);
        }, err => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  doGoogleLogin(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }
}
