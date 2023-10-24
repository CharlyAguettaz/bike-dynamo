import { Component, OnInit } from '@angular/core';
import { Chart, registerables, Plugin } from 'chart.js';
import PluginService from 'chart.js/dist/core/core.plugins';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class Dashboard implements OnInit {

  public chart: any;
  public remainingTime: any;
  public battery: any;

  constructor() {}

  ngOnInit(): void {
    this.createChart();
    this.remainingTime = '1h';
    this.battery = '20%';
  }

  createChart(){

    let element = <HTMLCanvasElement> document.getElementById('myChart')
    let ctx = element.getContext('2d');

    const centeredText = {
      id: 'centeredText',
      afterDatasetsDraw(chart: any, args: any, pluginOptions: any) {
        const { ctx, data } = chart;
        ctx.save();

        const text = data.labels[data.labels.length];

        const x = chart.getDatasetMeta(0).data[0].x;
        const y = chart.getDatasetMeta(0).data[0].y;

        ctx.fillRect(x - 10, y - 10, 20);
        ctx.fillText(text, x, y);
      }
    }

    if(ctx) {
      this.chart = new Chart(ctx, {
        type: 'doughnut', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Load', 'Remaining time'],
           datasets: [
            {
              data: ['20','80'],
              backgroundColor: ['#22BB88', '#22BB8850'],
              borderRadius: [3, 0],
              borderAlign: 'center',
              borderColor: ['#22BB88', '#22BB8800']
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          responsive: true,
        },
        plugins: [centeredText]
      });
      this.chart.resize(100, 100);
    }
  }
}
