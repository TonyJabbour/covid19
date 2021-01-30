import {Case, CasesArray, Countries, SummaryObject} from '../services/covid19/covid19.service';
import {Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';

export class Charts {

  public setPiSummaryObjectMap(obj: any): number[]{
    return [obj.MortalityRate, obj.ActiveCasesRate, obj.RecoveryRate];
  }

  public setLineChartLabels(data: any): Label[] {

    return data.cases.map((u: any) => {
      return u.Date;
    });

  }

  public setLineChartData(obj: CasesArray): ChartDataSets[] {
    const newConfirmedArray: number[] = [];
    const newDeathsArray: number[] = [];
    const newRecoveredArray: number[] = [];


    obj.cases.forEach((u: any) => {
      newConfirmedArray.push(u.Confirmed);
      newDeathsArray.push(u.NewDeaths);
      newRecoveredArray.push(u.NewRecovered);
    });

    return [{data: newDeathsArray, backgroundColor: 'pink', label: 'Daily Deaths'},
      {data: newRecoveredArray, backgroundColor: 'yellow', label: 'Daily Recovered'},
      {data: newConfirmedArray, backgroundColor: 'blue', label: 'Daily New Cases'}];
  }


  public setBarChartLabels(fromDate: Date , toDate?: Date): Label[]{
    const barChartLabels: Label[] = [];
    const date: Date = fromDate;

    if (toDate === null)
    {
      toDate = new Date();
    }

    while (toDate != null  && date <= toDate)
    {
     barChartLabels.push(date.toDateString());
     date.setDate(date.getDate() + 1);
    }

    return barChartLabels;
  }

  public setBarChartData(obj: any): ChartDataSets[]{
    const newConfirmedArray: number[] = [];
    const newDeathsArray: number[] = [];
    const newRecoveredArray: number[] = [];

    obj.cases.forEach( (u: any) => {
      newConfirmedArray.push(u.Confirmed);
      newDeathsArray.push(u.NewDeaths);
      newRecoveredArray.push(u.NewRecovered);
    });

    return [{data: newDeathsArray , backgroundColor: 'pink', label: 'Daily Deaths'},
      {data: newRecoveredArray , backgroundColor: 'yellow', label: 'Daily Recovered'},
      {data: newConfirmedArray , backgroundColor: 'blue', label: 'Daily New Cases'}];

  }


  constructor() {
  }
}
