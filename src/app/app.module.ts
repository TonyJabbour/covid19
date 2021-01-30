import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {  faGoogle , faFacebook , faTwitter} from '@fortawesome/free-brands-svg-icons';
import firebase from 'firebase';
import { HomePageComponent } from './home-page/home-page.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import {RouterModule, Routes} from '@angular/router';
import { CountryComponent } from './country/country.component';
import { NewsComponent } from './news/news.component';
import { NewsDisplayComponent } from './news-display/news-display.component';
import {DataTablesModule} from 'angular-datatables';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'country/:id', component: CountryComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    CountryComponent,
    NewsComponent,
    NewsDisplayComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    ChartsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    FontAwesomeModule,
    DataTablesModule
  ],
  exports: [ RouterModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
      library.addIcons(faGoogle, faFacebook, faTwitter);
      firebase.initializeApp(environment.firebase);
      firebase.auth().useDeviceLanguage();
  }
}
