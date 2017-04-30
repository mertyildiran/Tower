import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
    chart: Array<any> = [];
    sample_data:string = 'data/sample_data.json';

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
        borderColor: 'rgba(148,159,177,0.5)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,0.5)',
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

    public sliderRange = [0,60];
    public sliderConfig: any = {
      behaviour: 'drag',
      connect: true,
      keyboard: true,  // same as [keyboard]="true"
      pageSteps: 10,  // number of page steps, defaults to 10
      step: 5,
      range: {
        min: 0,
        max: 60
      },
      pips: {
        mode: 'count',
        density: 2,
        values: 5,
        stepped: true
      }
    };


    constructor(private http: Http) {
        this.loadChart3();
        this.loadChart4();
        this.loadChart5();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.parseCharts();
        this.loadChart1();
        this.loadChart2();
    }

    parseCharts() {
        this.charts.forEach((child) => {
            this.chart.push(child);
        });
        //console.log(this.chart[0]);
    }

    loadChart1() {
        this.http.get(this.sample_data)
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                var start = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as start point
                var end = new Date("2017-05-01T" + data[0]['Time']); // Get the first datetime as end point
                start.setTime(start.getTime() - ( (60 - this.sliderRange[0])*60*1000 )); // Set the start n x one hour backward
                end.setTime(end.getTime() + ( (this.sliderRange[1])*60*1000 )); // Set the end m x one hour forward
                var data_filtered = []; // Create an empty filtered data for push
                var element_datetime;
                data.forEach(function(element) {
                    element_datetime = new Date("2017-05-01T" + element['Time']);
                    if ( (element_datetime.getTime() > start.getTime()) && (element_datetime.getTime() < end.getTime()) ) { // This is a criteria defined by the range slider.
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
                    if ( new Date("2017-05-01T" + element['Time']).setSeconds(0,0) > this_min.setSeconds(0,0) ) { // If current element's minute is bigger than this_min's minute
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

                let range = n => Array.from(Array(n).keys()) // This is a function decleration. The function is exactly the same as Python's range(n) function. ECMAScript 6 feature used.
                this.lineChart1Labels = range(traffic_per_min.length);
                this.chart[0].chart.config.data.labels = this.lineChart1Labels; // This line is necessary because ng2-charts is not updating the chart's labels automatically

                }
            );
    }

    loadChart2() {
        this.http.get(this.sample_data)
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var message_arr = [];
                var response_arr = [];
                var label_arr = [];

                var data = res; // Create a copy of the response
                var start = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as start point
                var end = new Date("2017-05-01T" + data[0]['Time']); // Get the first datetime as end point
                start.setTime(start.getTime() - ( (60 - this.sliderRange[0])*60*1000 )); // Set the start n x one hour backward
                end.setTime(end.getTime() + ( (this.sliderRange[1])*60*1000 )); // Set the end m x one hour forward
                var data_filtered = []; // Create an empty filtered data for push
                var element_datetime;
                data.forEach(function(element) {
                    element_datetime = new Date("2017-05-01T" + element['Time']);
                    if ( (element_datetime.getTime() > start.getTime()) && (element_datetime.getTime() < end.getTime()) ) { // This is a criteria defined by the range slider.
                        message_arr.push(parseInt(element['Message Size(byte)']));
                        response_arr.push(parseInt(element['Response Time(ms)']));
                        label_arr.push(element['Time'].slice(0, -4));
                    }
                });

                this.lineChart2Data = [ // Update the chart data
                    {data: message_arr, label: 'Message Size(byte)'},
                    {data: response_arr, label: 'Response Time(ms)'}
                ];

                this.lineChart2Labels = label_arr;
                this.chart[1].chart.config.data.labels = this.lineChart2Labels; // This line is necessary because ng2-charts is not updating the chart's labels automatically

                }
            );
    }

    loadChart3() {
        this.http.get(this.sample_data)
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                var start = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as start point
                var end = new Date("2017-05-01T" + data[0]['Time']); // Get the first datetime as end point
                start.setTime(start.getTime() - ( (60 - this.sliderRange[0])*60*1000 )); // Set the start n x one hour backward
                end.setTime(end.getTime() + ( (this.sliderRange[1])*60*1000 )); // Set the end m x one hour forward
                var data_filtered = []; // Create an empty filtered data for push
                var element_datetime;
                data.forEach(function(element) {
                    element_datetime = new Date("2017-05-01T" + element['Time']);
                    if ( (element_datetime.getTime() > start.getTime()) && (element_datetime.getTime() < end.getTime()) ) { // This is a criteria defined by the range slider.
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
        this.http.get(this.sample_data)
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                var start = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as start point
                var end = new Date("2017-05-01T" + data[0]['Time']); // Get the first datetime as end point
                start.setTime(start.getTime() - ( (60 - this.sliderRange[0])*60*1000 )); // Set the start n x one hour backward
                end.setTime(end.getTime() + ( (this.sliderRange[1])*60*1000 )); // Set the end m x one hour forward
                var data_filtered = []; // Create an empty filtered data for push
                var element_datetime;
                data.forEach(function(element) {
                    element_datetime = new Date("2017-05-01T" + element['Time']);
                    if ( (element_datetime.getTime() > start.getTime()) && (element_datetime.getTime() < end.getTime()) ) { // This is a criteria defined by the range slider.
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
        this.http.get(this.sample_data)
            .map((res: Response) => res.json())
            .subscribe((res) => {
                //do your operations with the response here
                res.sort((a, b) => new Date("2017-05-01T" + b.Time).getTime() - new Date("2017-05-01T" + a.Time).getTime()).reverse();

                var data = res; // Create a copy of the response
                var start = new Date("2017-05-01T" + data.slice(-1)[0]['Time']); // Get the last datetime as start point
                var end = new Date("2017-05-01T" + data[0]['Time']); // Get the first datetime as end point
                start.setTime(start.getTime() - ( (60 - this.sliderRange[0])*60*1000 )); // Set the start n x one hour backward
                end.setTime(end.getTime() + ( (this.sliderRange[1])*60*1000 )); // Set the end m x one hour forward
                var data_filtered = []; // Create an empty filtered data for push
                var element_datetime;
                data.forEach(function(element) {
                    element_datetime = new Date("2017-05-01T" + element['Time']);
                    if ( (element_datetime.getTime() > start.getTime()) && (element_datetime.getTime() < end.getTime()) ) { // This is a criteria defined by the range slider.
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

    public onSliderChange(e:any):void {
        //console.log(this.sliderRange);
        this.loadChart1();
        this.loadChart2();
        this.loadChart3();
        this.loadChart4();
        this.loadChart5();
    }

}
