﻿import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;
    selected_duration:number = 60;
    charts: Array<any> = [];

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
      }
    ];
    public lineChart1Legend:boolean = true;
    public lineChart1Type:string = 'line';


    // events
    public chartClicked(e:any):void {
      console.log(e);
    }

    public chartHovered(e:any):void {
      console.log(e);
    }


    // lineChart2
    public lineChart2Data:Array<any> = [
        {data: [], label: 'Message Size(byte)'},
        {data: [], label: 'Response Time(ms)'}
    ];
    public lineChart2Labels:Array<any> = new Array(60);
    public lineChart2Options:any = {
        responsive: true,
        elements: {
            point: { radius: 0 },
            line: { tension: 0 }
        },
        tooltips: {enabled: false},
        hover: {mode: null},
        scales: {
                yAxes : [{
                    ticks : {
                        max : 1000,
                        min : 0
                    }
                }]
            }
    };
    public lineChart2Colors:Array<any> = [
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
      }
    ];
    public lineChart2Legend:boolean = true;
    public lineChart2Type:string = 'line';


    // barChart3
    public barChart3Options:any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChart3Labels:string[] = ['Status'];
    public barChart3Type:string = 'bar';
    public barChart3Legend:boolean = true;

    public barChart3Data:any[] = [
        {data: [89], label: 'Succesful'},
        {data: [14], label: 'Failed'}
    ];
    public barChart3Colors:Array<any> = [
      { // green
        backgroundColor: 'lightgreen',
        borderColor: 'green'
      },
      { // red
        backgroundColor: 'pink',
        borderColor: 'red'
      }
    ];


    // Doughnut
    public doughnutChartLabels:string[] = ['Firefox', 'Safari', 'Chrome'];
    public doughnutChartData:number[] = [0,0,0];
    public doughnutChartType:string = 'doughnut';

    // Pie
    public pieChartLabels:string[] = ['OSX', 'Windows', 'Linux'];
    public pieChartData:number[] = [0,0,0];
    public pieChartType:string = 'pie';


    constructor(private http: Http) {
        this.loadChart1();
        this.loadChart2();
        this.loadChart3();
        this.loadChart4();
        this.loadChart5();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.parseCharts();
    }

    parseCharts() {
        this.chart.forEach((child) => {
            this.charts.push(child);
        });
        console.log(this.charts[0]);
    }

    loadChart1() {
        this.http.get('assets/sample_data.json')
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                var thresh = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as threshold
                thresh.setTime(thresh.getTime() - (this.selected_duration*60*1000)); // Set the threshold one hour back
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

                let range = n => Array.from(Array(n).keys())
                this.lineChart1Labels = range(traffic_per_min.length);
                this.charts[0].chart.config.data.labels = this.lineChart1Labels;

                }
            );
    }

    loadChart2() {
        this.http.get('assets/sample_data.json')
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var message_arr = [];
                var response_arr = [];

                var data = res; // Create a copy of the response
                var thresh = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as threshold
                thresh.setTime(thresh.getTime() - (this.selected_duration*60*1000)); // Set the threshold one hour back
                var data_filtered = []; // Create an empty filtered data for push
                data.forEach(function(element) {
                    if (new Date("2017-05-01T" + element['Time']).getTime() > thresh.getTime()) {
                        message_arr.push(parseInt(element['Message Size(byte)']));
                        response_arr.push(parseInt(element['Response Time(ms)']));
                    }
                });

                this.lineChart2Data = [ // Update the chart data
                    {data: message_arr, label: 'Message Size(byte)'},
                    {data: response_arr, label: 'Response Time(ms)'}
                ];

                this.lineChart2Labels = new Array(message_arr.length);
                this.charts[1].chart.config.data.labels = this.lineChart2Labels;

                }
            );
    }

    loadChart3() {
        this.http.get('assets/sample_data.json')
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                //console.log(data.length)
                var thresh = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as threshold
                thresh.setTime(thresh.getTime() - (this.selected_duration*60*1000)); // Set the threshold one hour back
                var data_filtered = []; // Create an empty filtered data for push
                data.forEach(function(element) {
                    if (new Date("2017-05-01T" + element['Time']).getTime() > thresh.getTime()) {
                        data_filtered.push(element);
                    }
                });

                var succesful_counter = 0;
                var failed_counter = 0;
                data_filtered.forEach(function(element) {
                    if (element['Status'] == "Succesful") {
                        succesful_counter += 1;
                    } else if (element['Status'] == "Failed") {
                        failed_counter += 1;
                    }
                });

                this.barChart3Data = [
                    {data: [succesful_counter], label: 'Succesful'},
                    {data: [failed_counter], label: 'Failed'}
                ];

                }
            );
    }

    loadChart4() {
        this.http.get('assets/sample_data.json')
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                //console.log(data.length)
                var thresh = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as threshold
                thresh.setTime(thresh.getTime() - (this.selected_duration*60*1000)); // Set the threshold one hour back
                var data_filtered = []; // Create an empty filtered data for push
                data.forEach(function(element) {
                    if (new Date("2017-05-01T" + element['Time']).getTime() > thresh.getTime()) {
                        data_filtered.push(element);
                    }
                });

                var browser_counter = [0,0,0] // Firefox, Safari, Chrome
                data_filtered.forEach(function(element) {
                    if (element['Browser Type'] == "Firefox") {
                        browser_counter[0] += 1;
                    } else if (element['Browser Type'] == "Safari") {
                        browser_counter[1] += 1;
                    } else if (element['Browser Type'] == "Chrome") {
                        browser_counter[2] += 1;
                    }
                });

                this.doughnutChartData = browser_counter;

                }
            );
    }

    loadChart5() {
        this.http.get('assets/sample_data.json')
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                //console.log(data.length)
                var thresh = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as threshold
                thresh.setTime(thresh.getTime() - (this.selected_duration*60*1000)); // Set the threshold one hour back
                var data_filtered = []; // Create an empty filtered data for push
                data.forEach(function(element) {
                    if (new Date("2017-05-01T" + element['Time']).getTime() > thresh.getTime()) {
                        data_filtered.push(element);
                    }
                });

                var os_counter = [0,0,0] // Firefox, Safari, Chrome
                data_filtered.forEach(function(element) {
                    if (element['Device Type'] == "OSX") {
                        os_counter[0] += 1;
                    } else if (element['Device Type'] == "Windows") {
                        os_counter[1] += 1;
                    } else if (element['Device Type'] == "Linux") {
                        os_counter[2] += 1;
                    }
                });

                this.pieChartData = os_counter;

                }
            );
    }

}
