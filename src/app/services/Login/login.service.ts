import {Injectable, OnDestroy, OnInit} from '@angular/core';
import firebase from 'firebase';
import {Roles, User} from '../../shared/GoogleUser';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class LoginService implements  OnDestroy{


  user$?: Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
  public updatedFirebaseUser?: BehaviorSubject<User>;
  /** User object snapshot */
  private sub?: Subscription;
  public googleUser?: BehaviorSubject<firebase.User>;

  public subscribeObservable(): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>{
    return this.afs.firestore.doc(`users/${this.googleUser?.getValue().uid}`).get();


  }

  constructor(readonly fire: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {
    const userStr = localStorage.getItem('user');


    if (userStr !== null && this.googleUser !== null && this.googleUser !== undefined)
    {
      this.googleUser = JSON.parse(userStr);
      //// Get auth data, then get firestore user document || null
      // Keeps a snapshot of the current user object
      this.sub = this.fire.user.subscribe( (user) => {
        this.user$ = this.subscribeObservable();
      });
      }

    else {
      // Keeps a snapshot of the current user object
      this.sub = this.fire.user.subscribe( (user) => {
        if (this.googleUser == null && user !== null)
        {
          this.googleUser = new BehaviorSubject<firebase.User>(user);
        }
        else if (this.googleUser !== null && user !== null) {
          this.googleUser?.next(user) ;
        }

        this.user$ = this.subscribeObservable();

      });
      }

}

  ///// Role-based Authorization //////

  public canRead(user: User): boolean {
    const allowed = ['admin', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  public canEdit(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    for (const role of allowedRoles) {
      // @ts-ignore
      if ( user.roles[role] ) {
        return true;
      }
    }
    return false;
  }

  public async updateUserData(user: firebase.User | null): Promise<void> {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.collection('users').doc(`${user?.uid}`);
    const data: User = {
      uid: user?.uid,
      email: user?.email,
      roles: {
        subscriber: true
      }
    };
    return await userRef.set(data, {merge: true});
  }


  public googleSignIn(): Promise<firebase.auth.UserCredential>
  {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    return this.fire.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  facebookSignIn(): void{
    /*TODO */
  }

  twitterSignIn(): void{
    /*TODO */
  }

  ngOnDestroy(): void {
    localStorage.setItem('user', JSON.stringify(this.googleUser));

    this.sub?.unsubscribe();
  }

  getUser(): Observable<any> {
    return this.fire.user;
  }
}

