import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StringBuilder } from 'typescript-string-operations';
import {FirebaseStoreService} from '../FirebaseStore/firebase-store.service';
import firebase from 'firebase';
import DocumentData = firebase.firestore.DocumentData;

const summary = 'https://api.covid19api.com/summary';
const wipFromToDate = 'https://api.covid19api.com/world?';
const dayOneCountry = 'https://api.covid19api.com/dayone/country/';
const countryFromToDate = 'https://api.covid19api.com/total/country/';
const summaryCountriesCollectionName = 'SummaryByCountry';

const headerDict = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': '*',
  Connection : 'keep-alive'
};

const requestOptions = {
  headers: new HttpHeaders(headerDict),
};

@Injectable({
  providedIn: 'root'
})
export class Covid19Service implements OnDestroy {

  constructor(private http: HttpClient) {
  }

  getSummaryInfo(): Observable<any> {
    return this.http.get(summary);

      }
  getSummaryInfoFromToDate(from: Date, to?: Date): Observable<any> {

    const link =   new StringBuilder(wipFromToDate);
    const re = /-/gi;
    link.Append('from=');
    link.Append(String( from.toISOString().split('T')[0].replace(re , ':')));
    if (to != null)
    {
      link.Append('&to=');
      link.Append(String(to.toISOString().split('T')[0].replace(re, ':')));
    }

    return this.http.get(link.ToString(), requestOptions);

  }

  getSummaryInfoCountryFromToDate(country: string, from: Date, to: Date): Observable<any> {

    const link =   new StringBuilder(countryFromToDate);
    const re = /-/gi;
    link.Append(country);
    link.Append('?from=');
    link.Append(String( from.toISOString().split('T')[0].replace(re , ':')));
    link.Append('&to=');
    link.Append(String(to.toISOString().split('T')[0].replace(re, ':')));
    return this.http.get(link.ToString(), requestOptions);

  }

  getSummaryInfoDayOneCountry(country: string): Observable<any> {
    const link =   new StringBuilder(dayOneCountry);
    link.Append(country);
    return this.http.get(link.ToString(), requestOptions);
  }

  ngOnDestroy(): void {
  }




}

export class Case {
  id = '';
  Country = '';
  Confirmed = 0;
  NewDeaths = 0;
  NewRecovered = 0;
  Date = '';

  // tslint:disable-next-line:max-line-length
  constructor(id: string = '', Country: string = '', NewConfirmed: number= 0, NewDeaths: number = 0, NewRecovered: number = 0, date: string = new Date().toDateString())
  {
     this.id = id;
     this.Country = Country;
     this.Confirmed = NewConfirmed;
     this.NewDeaths = NewDeaths;
     this.NewRecovered = NewRecovered;
     this.Date = new Date(date).toDateString();
  }

}

export class CasesArray {
  cases: Case[] = [];


   constructor() {

    }


}

export class Countries {
  id = '';
  Country = '';
  CountryCode = '';
  Slug = '';
  NewCases = 0;
  ActiveCases = 0;
  ActiveCasesRate = 0;
  TotalCases = 0;
  NewDeaths = 0;
  TotalDeaths = 0;
  MortalityRate = 0;
  NewRecovered = 0;
  TotalRecovered = 0;
  RecoveryRate = 0;
  Date = '';


  // tslint:disable-next-line:max-line-length
  constructor(id: string= '', country: string = '', countryCode: string = '', Slug: string = '', newConfirmed: number =  0, totalConfirmed: number = 0, newDeaths: number = 0 , totalDeaths: number = 0, newRecovered: number = 0, totalRecovered: number = 0, date: string = new Date().toDateString(), ActiveCases: number= 0, ActiveCasesRate: number = 0, MortalityRate: number= 0, RecoveryRate: number= 0)

  {
     this.id = id;
     this.Country = country;
     this.CountryCode = countryCode;
     this.Slug = Slug;
     this.NewCases = newConfirmed;
     this.TotalCases = totalConfirmed;
     this.NewDeaths = newDeaths;
     this.TotalDeaths = totalDeaths;
     this.NewRecovered = newRecovered;
     this.TotalRecovered = totalRecovered;
     this.Date = new Date(date).toDateString();
     this.ActiveCases = ActiveCases;
     this.ActiveCasesRate = ActiveCasesRate;
     this.MortalityRate = MortalityRate;
     this.RecoveryRate = RecoveryRate;
  }

  // Firestore data converter
  countriesConverter = {
    toFirestore(countrySummary: Countries): DocumentData {
      return  {
        id: countrySummary.id,
        Country : countrySummary.Country,
        CountryCode : countrySummary.CountryCode,
        NewConfirmed: countrySummary.NewCases,
        TotalConfirmed : countrySummary.TotalCases,
        NewDeaths : countrySummary.NewDeaths,
        TotalDeaths: countrySummary.TotalDeaths,
        NewRecovered: countrySummary.NewRecovered,
        TotalRecovered: countrySummary.TotalRecovered,
        ActiveCases : countrySummary.ActiveCases,
        ActiveCasesRate : countrySummary.ActiveCasesRate,
        MortalityRate : countrySummary.MortalityRate,
        RecoveryRate : countrySummary.RecoveryRate,
        Date: countrySummary.Date
      };
    },
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ): Countries {


      // tslint:disable-next-line:no-non-null-assertion
      const data = snapshot.data(options)!;

      // tslint:disable-next-line:max-line-length
      return new Countries(data.id, data.Country, data.CountryCode, data.Slug, data.NewConfirmed, data.TotalConfirmed, data.NewDeaths, data.TotalDeaths, data.NewRecovered, data.TotalRecovered, data.Date, data.ActiveCases, data.ActiveCasesRate , data.MortalityRate, data.RecoveryRate);

    }

  };

  public async setCountrySummaryToFirestore(): Promise<void>{
      return await FirebaseStoreService.db
        .collection(summaryCountriesCollectionName)
        .withConverter(this.countriesConverter)
        .doc(this.Country)
        .set(this);

  }

  public async getCountrySummaryFromFirestore(countryName: string): Promise<firebase.firestore.DocumentSnapshot<Countries>>{
    return await FirebaseStoreService.db
      .collection(summaryCountriesCollectionName)
      .withConverter(this.countriesConverter)
      .doc(countryName).get();
  }


}


export class Global{
  TotalCases = 0;
  NewCases = 0;
  ActiveCases = 0;
  ActiveCasesRate = 0;
  TotalDeaths = 0;
  NewDeaths  = 0;
  MortalityRate = 0;
  TotalRecovered = 0;
  NewRecovered = 0;
  RecoveryRate = 0;


  constructor()
  {

  }

}

export class SummaryObject {
  global: Global = new Global();
  countries: Countries[] = [];

  constructor()
  {

  }

}
