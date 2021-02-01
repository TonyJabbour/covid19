import {Component, Input, OnInit} from '@angular/core';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import {LoginService} from '../services/Login/login.service';
import firebase from 'firebase';
import {User} from '../shared/GoogleUser';

declare var $: any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {

  faUser = faUser;
  faLock = faLock;

  public message = '';
  @Input() public googleUser?: firebase.User;
  @Input() public user?: User;

  constructor(private loginService: LoginService) {
    // As httpOnly cookies are to be used, do not persist any state client side.
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => this.googleSignIn());
  }



  public googleSignIn(): void
  {

    const user = this.loginService.user$?.getValue();
    // tslint:disable-next-line:max-line-length
    if (user !== null && user !== undefined && this.loginService.canEdit(user)) {
      $('#addNews')[0].style.display = 'block';
    } else {
      $('#addNews')[0].style.display = 'none';
    }

    // tslint:disable-next-line:max-line-length
    if (this.loginService.googleUser !== null && this.googleUser?.displayName !== undefined)
    {
      this.googleUser?.getIdToken();
      $('#signIn').html('Sign Out');
      $('#user')[0].style.display = 'block';
      if (this.googleUser !== undefined && this.user !== undefined && this.loginService.canEdit(this.user)) {
        $('#addNews')[0].style.display = 'block';
      }
    }

    else{

      // As httpOnly cookies are to be used, do not persist any state client side.
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.loginService.googleSignIn().then((result) => {



          this.loginService.updateUserData(result.user).then(() => {

            $('#user')[0].style.display = 'block';

          });
        });

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;

        console.error(error.message);

        // ...
      }).finally(() => {
        $('#close').click();
        $('#loginModal').modal('hide');
        $('#login')[0].style.display = 'none';
      });
    }

  }

  facebookSignIn(): void{
    this.loginService.facebookSignIn();
  }

  twitterSignIn(): void{
    this.loginService.twitterSignIn();
  }

ngOnInit(): void {

}

}
