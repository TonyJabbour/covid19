import {Case, CasesArray, Countries, Global, SummaryObject} from '../services/covid19/covid19.service';

export class ObjectMap{
 constructor() {
 }

  setSummaryObjectMap(dataValues: any, objectMap: Map<number, Map<string, string>>): void{
    let values: Map<string, string> = new Map<string, string>();

    if (dataValues instanceof Global || dataValues instanceof Countries) {
      values.set('Total Cases', String(dataValues.TotalCases));
      objectMap.set(0, values);
      values = new Map<string, string>();

      values.set('New Cases', String(dataValues.NewCases));
      objectMap.set(1, values);
      values = new Map<string, string>();

      values.set('Active Cases', String(dataValues.ActiveCases));
      objectMap.set(2, values);
      values = new Map<string, string>();

      values.set('Total Recovered', String(dataValues.TotalRecovered));
      objectMap.set(3, values);
      values = new Map<string, string>();


      values.set('New Recovered', String(dataValues.NewRecovered));
      objectMap.set(4, values);
      values = new Map<string, string>();

      values.set('Recovery Rate', String(dataValues.RecoveryRate));
      objectMap.set(5, values);
      values = new Map<string, string>();

      values.set('Total Deaths', String(dataValues.TotalDeaths));
      objectMap.set(6, values);
      values = new Map<string, string>();

      values.set('New Deaths', String(dataValues.NewDeaths));
      objectMap.set(7, values);
      values = new Map<string, string>();

      values.set('Mortality Rate', String(dataValues.MortalityRate));
      objectMap.set(8, values);

    }
  }


  mapDataObjectModel(model: any , data: any): void {

    if (model instanceof SummaryObject)
    {
      model.countries = data.map((u: any) => {
      // tslint:disable-next-line:max-line-length
      const country: Countries = new Countries(u.ID, u.Country, u.CountryCode, u.Slug, u.NewConfirmed, u.TotalConfirmed, u.NewDeaths, u.TotalDeaths, u.NewRecovered, u.TotalRecovered, u.Date);
      country.ActiveCases = country.TotalCases - country.TotalRecovered;
      country.ActiveCasesRate = (country.ActiveCases / country.TotalCases) * 100;
      country.MortalityRate = (country.TotalDeaths / country.TotalCases) * 100;
      country.RecoveryRate = (country.TotalRecovered / country.TotalCases) * 100;
      return country;
    });

    }

    else if (model instanceof CasesArray)
    {
      model.cases = data.map((u: any) => {
        return new Case(u.ID, u.Confirmed, u.NewDeaths, u.NewRecovered, u.Date);
      });
    }

  }
}
