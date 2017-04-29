﻿import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    // lineChart1
    public lineChart1Data:Array<any> = [
        {data: [], label: 'Traffic(byte)'},
        {data: [], label: 'Latency(ms)'}
    ];
    public lineChart1Labels:Array<any> = new Array(60);
    public lineChart1Options:any = {
      responsive: true
    };
    public lineChart1Colors:Array<any> = [
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
    public lineChart1Legend:boolean = true;
    public lineChart1Type:string = 'line';


    // events
    public chart1Clicked(e:any):void {
      console.log(e);
    }

    public chart1Hovered(e:any):void {
      console.log(e);
    }

    constructor(private http: Http) {
      this.http.get('assets/sample_data.json')
        .map((res: Response) => res.json())
        .subscribe((res) => {
             //do your operations with the response here
             res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

             var data = res; // Create a copy of the response
             var thresh = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as threshold
             thresh.setTime(thresh.getTime() - (60*60*1000)); // Set the threshold one hour back
             var data_filtered = []; // Create an empty filtered data for push
             data.forEach(function(element) {
                if (new Date("2017-05-01T" + element['Time']).getTime() > thresh.getTime()) {
                    data_filtered.push(element);
                }
            });

            var this_min = new Date("2017-05-01T" + data_filtered[0]['Time']); // Get the datetime of first element
            var traffic_per_min = [];
            var latency_per_min = [];
            var subtotal = 0;
            var subtotal2 = 0;
            var counter = 0;
            data_filtered.forEach(function(element) {
                if ( (new Date("2017-05-01T" + element['Time']).getTime() - this_min.getTime()) > (1*60*1000) ) { // If current element's datetime is more than a minute ahead of current this_min
                    this_min.setTime(this_min.getTime() + (1*60*1000)); // Update this_min = this_min + 1 minute
                    traffic_per_min.push(subtotal/counter); // Push sub-average
                    latency_per_min.push(subtotal2/counter); // Push sub-average
                    // Reset the variables
                    subtotal = 0;
                    subtotal2 = 0;
                    counter = 0;
                }
                subtotal += parseInt(element['Message Size(byte)']); // Each turn increase subtotal by Message Size
                subtotal2 += parseInt(element['Response Time(ms)']); // Each turn increase subtotal by Response Time
                counter += 1;
            });

             this.lineChart1Data = [ // Update the chart data
               {data: traffic_per_min, label: 'Traffic(byte)'},
               {data: latency_per_min, label: 'Average Latency(ms)'}
             ];

            }
        );
    }

      ngOnInit() {
      }

}
