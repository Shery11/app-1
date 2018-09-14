import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthDataProvider {

	adminPermission:Boolean = false;
	userPermission: Boolean = false;

  constructor() {


		firebase.initializeApp({
  
    
  
      });


}
	




	loginUser(email: string, password: string): Promise<any> {
	  return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	signupUser(email: string, password: string,name:string): Promise<any> {
	  return firebase
	  .auth()
	  .createUserWithEmailAndPassword(email, password)
	  .then( newUser => {
			console.log(newUser);
	    firebase
	    .database()
	    .ref('/userProfile')
	    .child(newUser.uid)
	    .set({ email: email, name : name });
	  });
	}

	resetPassword(email: string): Promise<void> {
	  return firebase.auth().sendPasswordResetEmail(email);
	}

	logoutUser(): Promise<void> {
	  return firebase.auth().signOut();
	}

}