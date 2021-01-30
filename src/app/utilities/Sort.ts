export class Sort{

  collator = new Intl.Collator(undefined, {
    numeric : true,
    sensitivity : 'base'
  });

  constructor() {
  }


public  startSort(obj: any, trimedValue: string, sortOrder: number): void{

       obj.sort((a: any, b: any) => {
         return this.collator.compare(a[trimedValue], b[trimedValue]) * sortOrder;
       });
}

}
