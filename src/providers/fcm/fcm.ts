import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import * as firebase from 'Firebase';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(
    public firebaseNative: Firebase,
  
    private platform: Platform
  ) {}

  // Get permission from the user
  async getToken(userId) {
    let token;

   

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    } 
  
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 

    
  
    
    return this.saveTokenToDatabase(token,userId)
   }

  // Save the token to firestore
  private saveTokenToDatabase(token,userId) {
    if (!token) return;

    const devicesRef =  firebase.database().ref('devices/'+userId); //this.afs.collection('devices')
  
    const docData = { 
      token: token,
      userId: userId,
    }
  
    return devicesRef.set(docData);
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}
