import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';

import { AuthDataProvider } from '../../providers/auth/auth';




@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  
  public posts : any = [] ;
  loading = this.loadingCtrl.create();

  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public storage : Storage,public authProvider: AuthDataProvider) {
    
    this.loading.present();
    firebase.database().ref('posts').on('value',snapShot=>{
      console.log(snapShot.val());
      this.loading.dismiss();

      this.posts = snapshotToArray(snapShot);
       this.posts = this.posts.reverse();
    },err=>{
      this.loading.dismiss();
      alert("Error occured");
      console.log(err);
    })
 
  }


  like(post){

    console.log(post);
    
    this.storage.get('userKey').then(val=>{
      console.log(val);
      let bool = false;
      let likeCount;

      post.likeIds.forEach(element => {
        if(element === val)
         bool = true;
      })

        if(!bool){
         likeCount = post.like + 1;
         post.likeIds.push(val);

         firebase.database().ref('posts/'+post.key).update({
          like : likeCount,
          likeIds : post.likeIds
        }) 
  
        
        }
    })
  }


  deletePost(post){

    console.log(post);
   

    let alertt = this.alertCtrl.create({
      title: 'Are you sure',
      message: 'Do you want to Permenantly delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            firebase.database().ref('posts/'+post.key).remove().then(data=>{

              alert("Post deleted successfully");
      
            }, err=>{
              alert("Try again,Err while deleting Post");
            });
          }
        }
      ]
    });

    alertt.present();
    
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

