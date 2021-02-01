import {Component, OnInit} from '@angular/core';
import { faArrowUp,  faArrowDown} from '@fortawesome/free-solid-svg-icons';
import { Sort } from '../utilities/Sort';
import {
  Case,
  CasesArray,
  Countries,
  Covid19Service,
  Global,
  SummaryObject
} from '../services/covid19/covid19.service';
import {Color, Label} from 'ng2-charts';
import {ChartColor, ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {HttpErrorResponse} from '@angular/common/http';
import {ObjectMap} from '../utilities/ObjectMap';
import {Charts} from '../utilities/Charts';
import {Subject} from 'rxjs';



declare var $: any;



const today = new Date();
const previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
const date = new Date(2020, 4, 13);


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
  dtOptions: any = {}; // declare the dtOption
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  dataTable: any;

  constructor(private covid19: Covid19Service) {



  }

  map: ObjectMap = new ObjectMap();


  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  summaryObject: SummaryObject = new SummaryObject();
  summaryObjectFromToDate: CasesArray = new CasesArray();
  summaryDayOneFrance: CasesArray = new CasesArray();



  summaryObjectMap = new Map<number, Map<string, string>>();
  summaryTitlesMap: Map<number, string> = new Map<number, string>();

  charts: Charts = new Charts();

  private sort: Sort = new Sort();


  public pieChartData: number[] = [];
  public pieChartLabels: string[] = ['Dead Cases', 'Active Cases', 'Recovered Cases'];
  public pieChartType: any = 'pie';

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

  public orderColumnByAscending(value: string): void{
    const trimedValue = value.replace(/\s/g, '');
    this.sort.startSort(this.summaryObject.countries, trimedValue, 1);
  }


  public orderColumnByDescending(value: string): void{
    const trimedValue = value.replace(/\s/g, '');
    this.sort.startSort(this.summaryObject.countries, trimedValue, -1);
  }






  // events
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {
      this.getSummaryInfo();
      this.getSummaryInfoFromToDate(previousWeek, today);
      this.getSummaryInfoFromDateWoldWide(date);

  }




  getSummaryInfoFromToDate(from: Date , to: Date): void{
     this.covid19.getSummaryInfoFromToDate(from, to).subscribe((data: any[]) => {
      this.map.mapDataObjectModel(this.summaryObjectFromToDate, data);
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



  refreshDatasetDataLabels(labels: any[]): void {
    labels = labels.slice(1, labels.length);
  }


  setSummaryCountriesObjectMap(): void{

    this.summaryTitlesMap.set(0, 'Country');
    this.summaryTitlesMap.set(1, 'New Cases');
    this.summaryTitlesMap.set(2, 'Total Cases');
    this.summaryTitlesMap.set(3, 'New Recovered');
    this.summaryTitlesMap.set(4, 'Total Recovered');
    this.summaryTitlesMap.set(5, 'New Deaths');
    this.summaryTitlesMap.set(6, 'Total Deaths');

  }





  setSummaryObject(global: any): void{
    this.summaryObject.global.TotalCases = global.TotalConfirmed;
    this.summaryObject.global.NewCases = global.NewConfirmed;
    this.summaryObject.global.TotalDeaths = global.TotalDeaths;
    this.summaryObject.global.NewDeaths = global.NewDeaths;
    this.summaryObject.global.MortalityRate = (this.summaryObject.global.TotalDeaths / this.summaryObject.global.TotalCases) * 100;
    this.summaryObject.global.TotalRecovered = global.TotalRecovered;
    this.summaryObject.global.NewRecovered = global.NewRecovered;
    this.summaryObject.global.RecoveryRate = (this.summaryObject.global.TotalRecovered / this.summaryObject.global.TotalCases) * 100;
    this.summaryObject.global.ActiveCases = this.summaryObject.global.TotalCases - this.summaryObject.global.TotalRecovered;
    this.summaryObject.global.ActiveCasesRate =  (this.summaryObject.global.ActiveCases / this.summaryObject.global.TotalCases) * 100;
  }

  setSummaryByCountriesInfo(countries: any[]): void {
    this.map.mapDataObjectModel(this.summaryObject, countries);

    const objectCountries = this.summaryObject.countries;

    this.dtOptions = {
      data: this.summaryObject.countries,
      columns: [
        {title: 'Country', data: 'Country'},
        {title: 'Total Cases', data: 'TotalCases'},
        {title: 'New Recovered', data: 'NewRecovered'},
        {title: 'Total Recovered', data: 'TotalRecovered'},
        {title: 'New Deaths', data: 'NewDeaths'},
        {title: 'Total Deaths', data: 'TotalDeaths'}

      ],
      paging  : false,
      ordering: false,
      info    : false
    };

    this.dataTable = $('datatable');
    this.dataTable.DataTable(this.dtOptions);
    this.dtTrigger.next();
  }


  getSummaryInfo(): void {
    this.covid19.getSummaryInfo().subscribe(data => {
      const global = data.Global;
      const countries = data.Countries;



      this.setSummaryObject(global);
      this.setSummaryByCountriesInfo(countries);
      this.map.setSummaryObjectMap(this.summaryObject.global, this.summaryObjectMap);
      this.setSummaryCountriesObjectMap();
      this.pieChartData = this.charts.setPiSummaryObjectMap(this.summaryObject.global);

      console.log('success');
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occurred.');
      } else {
        console.log('Server-side error occurred.');
      }
    });
  }


  getSummaryInfoFromDateWoldWide(from: Date): void{
    this.covid19.getSummaryInfoFromToDate(from).subscribe(data => {
      this.summaryDayOneFrance.cases = data.map((u: any) => {
            return new Case(u.ID, 'WorldWide' , u.Confirmed, u.Deaths, u.Recovered, u.Date);
      });

      this.lineChartData = this.charts.setLineChartData(this.summaryDayOneFrance);
      this.lineChartLabels = this.charts.setLineChartLabels(this.summaryDayOneFrance);

    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occurred.');
      } else {
        console.log('Server-side error occurred.');
      }
    });

  }


}

