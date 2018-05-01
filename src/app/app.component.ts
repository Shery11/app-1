import { AboutPage } from './../pages/about/about';
import { QuestionsPage } from './../pages/questions/questions';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { UserListPage } from '../pages/user-list/user-list';

import { AuthDataProvider } from '../providers/auth/auth';
import { FcmProvider } from '../providers/fcm/fcm';

import { Storage } from '@ionic/storage';


import * as firebase from 'firebase';

import { ToastController } from 'ionic-angular';

import { tap } from 'rxjs/operators';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  dontSetRoot: Boolean = false;

  
  // adminPermission: Boolean = false;
  // userPermission : Boolean =  false;

  pages: Array<{title: string, component: any,icon: string}>;
  pagess: Array<{title: string, component: any,icon: string}>;

  constructor( public fcm: FcmProvider,public toastCtrl: ToastController,public storage : Storage, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public authProvider: AuthDataProvider) {
    
    this.initializeApp();

  
    const unsubscribe = firebase.auth().onAuthStateChanged( user => {
    if (!user) {
      // alert(user)
      this.rootPage = LoginPage;
      unsubscribe();
    } else { 
      console.log(user);
      this.storage.set('userKey', user.uid);
      if(user.email === 'datequette@gmail.com'){
        this.authProvider.adminPermission = true;
        if(!this.dontSetRoot)
         this.rootPage = HomePage;
      }else{
        this.authProvider.userPermission = true;
        if(!this.dontSetRoot)
         this.rootPage = ListPage;
      }
     
      unsubscribe();
    }
  });

  
    // used for an example of ngFor and navigation
    // for admin
    this.pages = [
      { title: 'ADD TIPS', component: HomePage , icon:'add-circle'},
      { title: 'TIPS', component: ListPage, icon:'bulb' },
      { title: 'USER LIST', component: UserListPage, icon:'people' },
      { title: 'ABOUT', component: AboutPage, icon:'more'  }
    ];

    // for users
    this.pagess = [
      { title: 'TIPS', component: ListPage, icon:'bulb' },
      { title: 'QUESTIONS', component: QuestionsPage, icon:'chatbubbles' },
      { title: 'ABOUT', component: AboutPage, icon:'more'  }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.fcm.listenToNotifications().pipe(
        tap(msg => {
            // alert(JSON.stringify(msg));
            this.storage.get('userKey').then(val=>{
              
              if(msg.tap && val==="T4xKLEILbjP3RQtvFRb9J4fAyDA3"){
                //  its admin and we need to go to userList page page
                // here we will also get user id and take admin to chat page of that user
                // alert((msg))

                this.dontSetRoot = true;
                this.nav.setRoot(QuestionsPage,{userId : msg.userID});

              }else if(msg.tap && val !== "T4xKLEILbjP3RQtvFRb9J4fAyDA3"){
                // its user we need to go to chat page
                this.dontSetRoot = true;
                this.nav.setRoot(QuestionsPage);
              }else if(!msg.tap && val==="T4xKLEILbjP3RQtvFRb9J4fAyDA3"){
                // message is not tapped and user is admin
                // alert((msg))
                if(! (this.nav.getActive().name === "QuestionsPage")){
                  const toast = this.toastCtrl.create({
                    message: "New message from "+msg.name,
                    duration: 3000
                  });
                  toast.present();
                  //alert controller if ok is pressed take him to that page if not then stay on that page
                }

              }else if(!msg.tap && val!=="T4xKLEILbjP3RQtvFRb9J4fAyDA3"){
                //  message is not tapped and user is not admin
              
                if(! (this.nav.getActive().name === "QuestionsPage")){
                  const toast = this.toastCtrl.create({
                    message: "New message from Datequette",
                    duration: 3000
                  });
                  toast.present();
                }
               
              }
           
          // show a toast
           

          }) 
        })
      )
      .subscribe()
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  logout(){
    firebase.auth().signOut().then(()=>{
      this.authProvider.adminPermission = false;
      this.authProvider.userPermission = false;
      this.nav.setRoot(LoginPage);
    },err=>{

      console.log(err);

    })
  }
}
