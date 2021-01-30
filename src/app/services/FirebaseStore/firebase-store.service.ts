import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {Observable} from 'rxjs';
import {Countries} from '../covid19/covid19.service';
import {News, NewsArray} from '../../shared/News';
import {AngularFirestore} from '@angular/fire/firestore';

const dateOfToday = new Date().toDateString();
const newsCollectionName = 'News';


@Injectable({
  providedIn: 'root'
})
export class FirebaseStoreService {


  constructor(private afs: AngularFirestore) {
    FirebaseStoreService.db = firebase.firestore();
  }
  public static db: firebase.firestore.Firestore;

  public id: string | undefined = '';

  // tslint:disable-next-line:max-line-length
  public async getSummaryInfoCountryFromToDateFromStore(countriesSummary: Countries, CountryName: string): Promise<firebase.firestore.DocumentSnapshot<Countries>> {

    return await countriesSummary.getCountrySummaryFromFirestore(CountryName);
  }


  public async addSummaryInfoCountryFromToDateToStore(countriesSummary: Countries): Promise<void> {

    return await countriesSummary.setCountrySummaryToFirestore();
  }

  public async getNewsByTitleFromStore(news: News, newsName: string): Promise<firebase.firestore.DocumentSnapshot<News>> {

    return await news.getNewsByTitleFromFirestore(newsName);
  }

  public async getNewsFromStore(news: NewsArray, countryName= 'WorldWide'): Promise<firebase.firestore.QuerySnapshot<News>> {

    return await news.getNewsFromFirestore(countryName);
  }



  public async addNewsToStore(news: News): Promise<void> {

    return await news.setNewsToFirestore();
  }


}
