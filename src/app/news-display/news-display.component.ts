import { Component, OnInit } from '@angular/core';
import {News, NewsArray} from '../shared/News';
import {FirebaseStoreService} from '../services/FirebaseStore/firebase-store.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-news-display',
  templateUrl: './news-display.component.html',
  styleUrls: ['./news-display.component.css']
})
export class NewsDisplayComponent implements OnInit {

  countryName = 'WorldWide';

  newsArray = new NewsArray();

  constructor(private firebaseStoreService: FirebaseStoreService, private route: ActivatedRoute) {
  }

  private subscribeToRouteParam(): void {
    this.route.params.subscribe((params) => {
      let data = this.countryName;
      if (params?.id !== undefined) {
        data = params.id;
      }

      this.getNews(data);
      console.log('country is :', data);
    });
  }

  ngOnInit(): void {
    this.subscribeToRouteParam();
  }

  getNews(countryName: string): void{
    this.firebaseStoreService.getNewsFromStore(this.newsArray, countryName).then((data => {
      this.newsArray.news = data.docs.map(u => u.data());
    })).catch( e => console.error(e));
  }

}
