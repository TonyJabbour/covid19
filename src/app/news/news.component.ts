import {Component, OnInit, Output} from '@angular/core';
import {News} from '../shared/News';
import {FirebaseStoreService} from '../services/FirebaseStore/firebase-store.service';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import * as country from '../../assets/countries.json';
import {StringBuilder} from 'typescript-string-operations';

declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})


export class NewsComponent implements OnInit {


  constructor(private firebaseStoreService: FirebaseStoreService) { }

  public news  = new News();

  public form = new FormGroup({

    title: new FormControl('', [Validators.required, Validators.minLength(3)]),

    date: new FormControl(new Date().toDateString(), Validators.required),

    description: new FormControl('', [Validators.required, Validators.minLength(3)]),

    country: new FormControl('', [Validators.required , Validators.minLength(3)]),


  });

  public countryDropdownList = new CountryDropdownList(country);

  callCountryChanged(): void{
    const str = new StringBuilder('The selected value is');
    str.Append(this.news.country);
    console.log(str.ToString());
  }

  ngOnInit(): void {
  }




  public closeModal(): void {
    this.form.reset();
    $('#newsModal').modal('hide');
    $('#news')[0].style.display = 'none';
  }

  submit(): void {
    console.log(this.form.value);
    const values = this.form.value;
    const news = new News(values.title, values.date, values.description, values.country);
    this.firebaseStoreService.addNewsToStore(news).catch(error =>
      console.error(error)).finally(() => {
      this.closeModal();
    });
  }


  isSelected(c: CountryDropdown): boolean{
    const str = new StringBuilder('Is By default selected ');
    str.Append(c.Name);
    console.log(str.ToString());
    return c.Name.localeCompare(this.news.country) === 0;
  }
}

export class CountryDropdownList{
  countryDropdownArray = new Array<CountryDropdown>();

  constructor(countryDropdownArray: any){
    this.countryDropdownArray = countryDropdownArray.default.map((u: any) => {
      return new CountryDropdown(u.Code, u.Name);
    });

  }
}

export class CountryDropdown{
  public Code = '';
  public Name = '';

  constructor(Code: string = '', Name: string= '') {
    this.Code = Code;
    this.Name = Name;
  }
}
