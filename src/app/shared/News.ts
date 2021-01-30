import firebase from 'firebase';
import DocumentData = firebase.firestore.DocumentData;
import {FirebaseStoreService} from '../services/FirebaseStore/firebase-store.service';
const newsCollectionName = 'News';

export class  NewsArray{
  public news = new Array<News>();

  constructor() {
  }

  public async getNewsFromFirestore(countryName: string = 'WorldWide'): Promise<firebase.firestore.QuerySnapshot<News>>{
    return await FirebaseStoreService.db
      .collection(newsCollectionName)
      .withConverter(News.newsConverter)
      .where('country', '==', countryName)
      .get();
  }

}

export class News {

  constructor(title: string = '', date: string = new Date().toDateString(), description: string = '', country: string = '') {
    this.title = title;
    this.date = date;
    this.description = description;
    this.country = country;
  }


  // Firestore data converter
  public static newsConverter = {
    toFirestore(news: News): DocumentData {
      return {
        title: news.title,
        date: news.date,
        description: news.description,
        country: news.country,
      };
    },
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ): News {


      // tslint:disable-next-line:no-non-null-assertion
      const data = snapshot.data(options)!;

      // tslint:disable-next-line:max-line-length
      return new News(data.title, data.date, data.description, data.country);
    }
  };
  title = '';
  date = new Date().toDateString();
  description = '';
  country = '';



  public async getNewsByTitleFromFirestore(newsName: string): Promise<firebase.firestore.DocumentSnapshot<News>>{
    return await FirebaseStoreService.db
      .collection(newsCollectionName)
      .withConverter(News.newsConverter)
      .doc(newsName)
      .get();
  }

  public async setNewsToFirestore(): Promise<void>{
    return await FirebaseStoreService.db
      .collection(newsCollectionName)
      .withConverter(News.newsConverter)
      .doc(this.title)
      .set(this);

  }
}
