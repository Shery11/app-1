import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthDataProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { LoginPage } from '../login/login';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public loginForm: FormGroup;
  public loading;
  public signupForm: FormGroup;
  
    constructor(public navCtrl: NavController, 
      public authProvider: AuthDataProvider,
      public formBuilder: FormBuilder, 
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController
      ) {
  
  
    this.signupForm = formBuilder.group({
          email: ['', 
            Validators.compose([Validators.required, EmailValidator.isValid])],
          password: ['', 
            Validators.compose([Validators.minLength(6), Validators.required])],
            name: ['', 
            Validators.compose([Validators.minLength(6), Validators.required])]
        });
  
    }
  
  
  
  
  
    signupUser(){
  
    
      
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email, 
        this.signupForm.value.password, this.signupForm.value.name)
      .then( authData => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(LoginPage);
        });
      }, error => {
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
        // });
      });
    });
  
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  
    } 
  }
  
  loginPage(){
    this.navCtrl.setRoot(LoginPage);
  }
  
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad SignupPage');
    }
  

}
