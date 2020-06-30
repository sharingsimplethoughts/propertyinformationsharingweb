import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs'
import { Observable } from "rxjs/Observable"
import * as firebase from 'firebase';
import { firebaseSW} from '../../../src/firebase-messaging-sw.js'

import {environment} from '../../environments/environment'

@Injectable()
export class MessagingService {
// firebaseSW = firebaseSW
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
      debugger  
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
       
        
      }
    )
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, token) {
    debugger
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
        this.angularFireDB.object('fcmTokens/').update(data)
      })
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId) {
    debugger
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        debugger
        console.log(token,"Notification Token");
        localStorage.setItem("NToken", token)
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  
  }


//   requestPermission(userId) {
//       var that = this
//       debugger
//     navigator.serviceWorker.register('firebase-messaging-sw.js').then(function(reg){
// debugger
//         var userToken = "3";

//         firebase.messaging().useServiceWorker(reg);
//         firebase.messaging().requestPermission().then(() => firebase.messaging().getToken())
//         .then(token => {
//           debugger
//           userToken = token;
//           console.log(userToken,'userToken')
//           window.localStorage.setItem('rentoDeviceToken', userToken);
//           if(userToken){
//        }
//         })
//         .catch(err => {
//           console.log('Denied', err)
//           window.location.reload();
//         })
//     })
//   }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    debugger
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      }, error => {
        console.log(error.error.message);
        
      })
  }
}