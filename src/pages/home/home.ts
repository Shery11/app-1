import { Component } from '@angular/core';
import { NavController,LoadingController,NavParams,ViewController,AlertController} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import {DatePipe} from '@angular/common';


import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sourceSelection;
    submitAttempt: boolean = false;
    image : any;
    text;
    title;

   

    base64Image;
    
 
    constructor(public navCtrl: NavController,private androidPermissions: AndroidPermissions, public navParams: NavParams,public viewCtrl: ViewController,public camera:Camera, public alertCtrl: AlertController,public loadingCtrl: LoadingController,public datepipe : DatePipe) {
        
           this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            success => console.log('Permission granted'),
            err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
          );


   
    }


    takePicture(source){
     
             
         if(source=="camera"){
            this.sourceSelection = this.camera.PictureSourceType.CAMERA;
         }else if(source=="gallery"){
            this.sourceSelection = this.camera.PictureSourceType.PHOTOLIBRARY;
            // alert(source);
        }
          this.camera.getPicture({
              sourceType:this.sourceSelection,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              quality: 100
           }).then((imageData) => {
             this.base64Image = "data:image/jpeg;base64," + imageData;
          }, (err) => {
              console.log(err);
              alert(err);
             
          });
    }


    save(){


     

      if(this.text && this.title){
        
        let storageRef = firebase.storage().ref();
        const filename = Math.floor(Date.now() / 1000);
        const imageRef = storageRef.child(`images/${filename}.jpg`);
         var loading = this.loadingCtrl.create({
            content: `<div class="custom-spinner-container">
                        <div class="custom-spinner-box">Uploading image to firebase</div>
                     </div>`
          })

         loading.present();
        imageRef.putString(this.base64Image, 'data_url').then((snapshot)=> {
       
        
        //  saving post in firebase
         firebase
         .database()
         .ref().child('posts')
         .push({ 
           text: this.text, 
           imgUrl : snapshot.downloadURL,
           time : this.datepipe.transform(new Date, 'short'),
           title : this.title,
           like:0,
           likeIds : ['d3hIE21QNzW5Usa2hEqzoTVpift1']
           
           
         }).then(()=>{
           loading.dismiss();
           alert("Post has been published");
         },(err)=>{
          loading.dismiss();
          alert("err: unable to post");
        });
      
         this.text = "";
         this.title = "";
         this.base64Image = undefined;

      

        }, (err)=>{
            alert(err);
        });
        
      }else{
         alert("Post title or text is missing")
      }   
  
        

    }
}
