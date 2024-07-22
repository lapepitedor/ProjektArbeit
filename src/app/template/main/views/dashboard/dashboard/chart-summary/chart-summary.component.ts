import { Component, Input } from '@angular/core';
import { ChartEvent } from 'angular2-highcharts/dist/ChartEvent';


@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.scss']
})
export class ChartSummaryComponent {
  @Input() data!: any;
  // single: any[];
  view: any[] = ['700', '400'];

  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor() {
    console.log(this.data)
  }

  ngOnInit() {
  }
}
