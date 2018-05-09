import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'Firebase';
/**
 * Generated class for the QuestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html',
})
export class QuestionsPage {

  @ViewChild(Content) content: Content;

data = { type:'', nickname:'', message:'' };
chats = [];
userKey:string;
nickname:string;
offStatus:boolean = false;
loading = this.loadingCtrl.create();


constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private storage : Storage) {

    console.log(this.navParams.get('userId'));

    this.loading.present();

      if( !(this.navParams.get('userId')=== undefined)){

             this.userKey = this.navParams.get('userId');
          
              firebase.database().ref('userProfile/'+this.userKey).once('value').then((snapShot)=>{
                
                console.log(snapShot.val());
                this.loading.dismiss();

              
                
                this.nickname = "Admin";
                this.data.type = 'message';
                this.data.nickname = this.nickname;

                firebase.database().ref('userProfile/'+this.userKey+'/chats').on('value', resp => {
                  this.chats = [];
                  this.chats = snapshotToArray(resp);
                  setTimeout(() => {
                    if(this.offStatus === false) {
                      this.content.scrollToBottom(30);
                    }
                  }, 1000);
                });

              },err=>{

                this.loading.dismiss();
                alert("unable to load messages");
              })  


          

      }else{
        storage.get('userKey').then((val) => {
          console.log('User key is', val);
           this.userKey = val;
       
          firebase.database().ref('userProfile/'+this.userKey).once('value').then((snapShot)=>{
             
            console.log(snapShot.val());
            this.loading.dismiss();

            var userdata = snapShot.val();
         
            this.userKey = val;
            this.nickname = userdata.name;
            this.data.type = 'message';
            this.data.nickname = this.nickname;

            firebase.database().ref('userProfile/'+this.userKey+'/chats').on('value', resp => {
              this.chats = [];
              this.chats = snapshotToArray(resp);
              setTimeout(() => {
                if(this.offStatus === false) {
                  this.content.scrollToBottom(30);
                }
              }, 1000);
            });

          },err=>{

            this.loading.dismiss();
            alert("unable to load messages");
          })  


      });
      }
      
       
}

sendMessage() {
  if(! (this.data.message=== "")){

  
    let newData = firebase.database().ref('userProfile/'+this.userKey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date(),
      senderID: this.userKey,
      adminID:"T4xKLEILbjP3RQtvFRb9J4fAyDA3"

    });
    this.data.message = '';

  }  
}

}


export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
