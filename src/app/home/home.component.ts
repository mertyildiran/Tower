import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    data;
    chart1Data;
    chart1Labels;

    // lineChart
    public lineChartData:Array<any> = [
      {data: [], label: 'Series A'}
    ];
    public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions:any = {
      responsive: true
    };
    public lineChartColors:Array<any> = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      },
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';


    // events
    public chartClicked(e:any):void {
      console.log(e);
    }

    public chartHovered(e:any):void {
      console.log(e);
    }

    constructor(private http: Http) {
      this.http.get('assets/sample_data.json')
        .map((res: Response) => res.json())
        .subscribe((res) => {
             //do your operations with the response here
             res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();
             this.data = res.slice(0, 7);

             this.chart1Data = this.data.map(function(element) {
                 //return { x: new Date("2017-05-01T" + element['Time']), y: parseInt(element['Message Size(byte)'])};
                 return parseInt(element['Message Size(byte)']);
             });
             this.chart1Labels = this.data.map(function(element) {
                 return element['Time'];
             });

             this.lineChartData = [
               {data: this.chart1Data, label: 'Series A'}
             ];
             console.dir(this.lineChartLabels);
             this.lineChartLabels = this.chart1Labels;

             this.printTheData();
            }
        );
    }

      printTheData(){
          //console.dir(this.data);
          //console.dir(this.chart1Data);
          console.dir(this.lineChartLabels);
      }

      ngOnInit() {
      }

}
