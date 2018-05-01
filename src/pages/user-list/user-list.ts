import { QuestionsPage } from './../questions/questions';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';


/**
 * Generated class for the UserListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {

  usersList :any = [];
  loadUserList:Array<any>;
  loading = this.loadingCtrl.create();
 

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    
    this.loading.present();
   
    firebase.database().ref('userProfile').on('value', countryList => {
      let users = [];
      this.loading.dismiss();
      countryList.forEach( user => {
        users.push({
          key : user.key,
          data: user.val()
        });
        return false;
      });
    
      this.usersList = users;
      this.loadUserList = users;
    },err=>{
      this.loading.dismiss();
      alert("Error occured");
      console.log(err);
    });



  }
  

  initializeItems(): void {
    this.usersList = this.loadUserList;
  }


  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
  
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
  
  
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }
  
    this.usersList = this.usersList.filter((v) => {
      if(v.data.name && q) {
        if (v.data.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  
    // console.log(q, this.usersList.length);
  
  }

  openChatPage(userId){

    this.navCtrl.push(QuestionsPage, {userId : userId});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
  }

}
