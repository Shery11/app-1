import { FcmProvider } from './../../providers/fcm/fcm';
import { ListPage } from './../list/list';
import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthDataProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';
import { RegisterPage } from '../register/register';

import { Storage } from '@ionic/storage';

// @IonicPage({
//   name: 'login'
// })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public loading;

  constructor(public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,public authProvider: AuthDataProvider, 
    public formBuilder: FormBuilder, public loadingCtrl : LoadingController,private storage: Storage,public fcm : FcmProvider) {

      this.loginForm = formBuilder.group({
        email: ['', 
        Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', 
        Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }



  loginUser(): void {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email, 
        this.loginForm.value.password)
      .then( authData => {
        console.log(authData);
        this.loading.dismiss().then( () => {
          if(authData.email === "datequette@gmail.com"){
            // alert("Its admin");
            this.fcm.getToken(authData.uid);
            this.storage.set('userKey', authData.uid);
           this.authProvider.adminPermission = true;
            this.navCtrl.setRoot(HomePage);
          }else{
            // alert("its user");
            this.fcm.getToken(authData.uid);
            this.storage.set('userKey', authData.uid);
            this.authProvider.userPermission = true;
            
            this.navCtrl.setRoot(ListPage);
          } 
          
        });
      }, error => {

        console.log(error)
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
              });
            });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }


        goToSignup(){ 
          this.navCtrl.setRoot(RegisterPage); 
        }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
