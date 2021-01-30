import {Location} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, ParamMap, Router} from '@angular/router';
import {Case, CasesArray, Countries, Covid19Service, SummaryObject} from '../services/covid19/covid19.service';
import {ObjectMap} from '../utilities/ObjectMap';
import {Color, Label} from 'ng2-charts';
import {Charts} from '../utilities/Charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FirebaseStoreService} from '../services/FirebaseStore/firebase-store.service';


const today = new Date();
const previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  summaryObjectFromToDate: CasesArray = new CasesArray();


  public pieChartData: number[] = [];
  public pieChartLabels: string[] = ['Dead Cases', 'Active Cases', 'Recovered Cases'];
  public pieChartType: any = 'pie';

  public summaryDayOneCountry: CasesArray = new CasesArray();


  // Define colors of chart segments
  public pieChartColors: Color[] = [
    {
      backgroundColor: ['pink', 'yellow', 'blue']
    }
  ];

  public pieChartLegend = true;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {xAxes: [{}], yAxes: [{}]}
  };

  public barChartLabels: Label[] = [];
  public barChartData: ChartDataSets[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public lineChartLabels: Label[] = [];
  public lineChartData: ChartDataSets[] = [];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';



  charts: Charts = new Charts();

  map: ObjectMap = new ObjectMap();
  countryObj: Countries = new Countries();
  summaryObjectMap = new Map<number, Map<string, string>>();

  constructor(  private route: ActivatedRoute, /* Keeps information of the activated route */
                private location: Location,
                private router: Router,
                private coivd19Service: Covid19Service,
                private firebaseStoreService: FirebaseStoreService
  ) {}

  ngOnInit(): void {
this.subscribeToRouteParam();
this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  // events
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  private subscribeToRouteParam(): void {
      this.route.params.subscribe((params) => {
      const countryName = params.id;
      console.log('country is :', countryName);
      this.getCountrySummary(countryName);
      this.getSummaryInfoDayOneCountry(countryName);
      this.getSummaryInfoCountryFromToDate(countryName, previousWeek, today);

      });
  }

  setVos(countryObj: Countries): void
  {
    this.map.setSummaryObjectMap(countryObj, this.summaryObjectMap);
    this.pieChartData = this.charts.setPiSummaryObjectMap(countryObj);
  }


  public getCountrySummary(countryName: string): void {

      this.firebaseStoreService.getSummaryInfoCountryFromToDateFromStore(this.countryObj, countryName).then(doc => {
        const firebaseData = doc.data();
        const  id = firebaseData?.id;
        const  date = firebaseData?.Date;

        if (id === undefined || date !== today.toDateString() )
        {
          this.coivd19Service.getSummaryInfo()
            .subscribe((data: any) => {
              const u = data.Countries.find((Value: any) => Value.Country === countryName);
              // tslint:disable-next-line:max-line-length
              this.countryObj = new Countries(u.ID, u.Country, u.CountryCode, u.Slug, u.NewConfirmed, u.TotalConfirmed, u.NewDeaths, u.TotalDeaths, u.NewRecovered, u.TotalRecovered, u.Date);
              this.countryObj.ActiveCases = this.countryObj.TotalCases - this.countryObj.TotalRecovered;
              this.countryObj.ActiveCasesRate = (this.countryObj.ActiveCases / this.countryObj.TotalCases) * 100;
              this.countryObj.MortalityRate = (this.countryObj.TotalDeaths / this.countryObj.TotalCases) * 100;
              this.countryObj.RecoveryRate = (this.countryObj.TotalRecovered / this.countryObj.TotalCases) * 100;

              this.firebaseStoreService.addSummaryInfoCountryFromToDateToStore(this.countryObj).then(() => {
                this.setVos(this.countryObj);

              }).catch(error =>
                console.error(error));
            });
        }

        else if (firebaseData !== undefined) {

          this.setVos(firebaseData);
        }



      }).catch(error =>
       console.error(error));

}

getSummaryInfoCountryFromToDate(country: string , from: Date , to: Date): void{


      this.coivd19Service.getSummaryInfoCountryFromToDate(country, from, to).subscribe((data: any[]) => {
        this.summaryObjectFromToDate.cases = data.map((u: any) => {
          return new Case(u.ID , u.Country, u.Confirmed, u.Deaths, u.Recovered, u.Date);
        });

        this.barChartData = this.charts.setBarChartData(this.summaryObjectFromToDate);
        this.barChartLabels = this.charts.setBarChartLabels(previousWeek, today);
      } , (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occurred.');
        } else {
          console.log('Server-side error occurred.');
        }
      });



  }

getSummaryInfoDayOneCountry(countryName: string): void {
    this.coivd19Service.getSummaryInfoDayOneCountry(countryName).subscribe((data: any[]) => {
      this.summaryDayOneCountry.cases = data.map((u: any) => {
        return new Case(u.ID , countryName , u.Confirmed, u.Deaths, u.Recovered, u.Date);
      });

      this.lineChartData = this.charts.setLineChartData(this.summaryDayOneCountry);
      this.lineChartLabels = this.charts.setLineChartLabels(this.summaryDayOneCountry);

    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occurred.');
      } else {
        console.log('Server-side error occurred.');
      }
    });

  }



  }

