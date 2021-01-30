import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  source = 'COVID-19 API/Johns Hopkins CSSE ';

  constructor() { }

  ngOnInit(): void {
  }

}
