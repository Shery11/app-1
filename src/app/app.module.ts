import { UserListPage } from './../pages/user-list/user-list';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { AboutPage } from './../pages/about/about';
import { QuestionsPage } from './../pages/questions/questions';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';



import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthDataProvider } from '../providers/auth/auth';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { FcmProvider } from '../providers/fcm/fcm';

import {Firebase} from '@ionic-native/firebase';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    QuestionsPage,
    UserListPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    MomentModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    QuestionsPage,
    UserListPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    AndroidPermissions,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthDataProvider,
    Firebase,
    FcmProvider
  ]
})
export class AppModule {}
