import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import {LoginService} from '../services/Login/login.service';
import {User} from '../shared/GoogleUser';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public googleUser?: firebase.User|null;
  public user?: User|null;


  constructor(public loginService: LoginService) {

  }

  ngOnInit(): void {
    this.loginService.googleUser?.asObservable().subscribe(data => this.googleUser);
  }

  addNews(): void{
    $('#news')[0].style.display = 'block';
    $('#newsModal').modal('show');
  }


  signInOut(): void{
    const text = $('#signIn').html();

    switch (text) {
      case 'Sign In':
        $('#login')[0].style.display = 'block';
        $('#loginModal').modal('show');
        break;
      case 'Sign Out':
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
          $('#signIn').html('Sign In');
          $('#user')[0].style.display = 'none';
          $('#addNews')[0].style.display = 'none';
          $('#close').click();
        }).catch((error) => {
          // An error happened.
          $('#close').click();
        });
        break;
    }
  }


}
