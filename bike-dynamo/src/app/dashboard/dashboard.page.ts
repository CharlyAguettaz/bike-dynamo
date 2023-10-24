import { Component, OnInit } from '@angular/core';
import { BatteryInfo, Device } from '@capacitor/device';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class Dashboard implements OnInit {

  public chart: Chart<"doughnut", string[], string>;
  public remainingTime: any;
  public battery: BatteryInfo = {
    batteryLevel: 0,
    isCharging: false
  };
  public badges: {
    title: string;
    url: string;
    unlocked: boolean;
  }[] = [
    { title: 'phone', url: 'assets/badges/phone.svg', unlocked: true },
    { title: 'phone5', url: 'assets/badges/phone5.svg', unlocked: true },
    { title: 'phone10', url: 'assets/badges/phone10.svg', unlocked: false },
    { title: 'laptop5', url: 'assets/badges/laptop5.svg', unlocked: true },
    { title: 'laptop10', url: 'assets/badges/laptop10.svg', unlocked: false },
    { title: 'laptop20', url: 'assets/badges/laptop20.svg', unlocked: false },
    { title: 'car', url: 'assets/badges/car.svg', unlocked: false },
  ];

  public stickers: {
    title: string;
    url: string;
    canSendTo: string;
  }[] = [
    { title: 'beat-you', url: 'assets/stickers/beat-you.png', canSendTo: 'all' },
    { title: 'catch-you', url: 'assets/stickers/catch-you.png', canSendTo: 'all' },
    { title: 'review-mirror', url: 'assets/stickers/review-mirror.png', canSendTo: 'all' },
  ]

  constructor() {}

  ngOnInit(): void {
    this.remainingTime = '0';
    this.setBattery();
    setInterval(() => this.updateBattery(), 1000);
  }

  async setBattery() {
    await Device.getBatteryInfo().then((info) => {
      this.battery = info;
      if (this.battery.batteryLevel && this.battery.isCharging) this.remainingTime = (3500 * (1 - this.battery.batteryLevel) / 600).toPrecision(2);
      this.createChart();
    })
  }

  async updateBattery() {
    await Device.getBatteryInfo().then((info) => {
      this.battery.isCharging = info.isCharging;
      if (info.batteryLevel !== this.battery.batteryLevel) {
        this.battery = info;
        if (this.battery.batteryLevel) this.chart.data.datasets[0].data = [(this.battery.batteryLevel * 100).toFixed(), (100 - this.battery.batteryLevel * 100).toFixed()];
          this.chart.update();
      }

      if (this.battery.batteryLevel) this.remainingTime = (3500 * (1 - this.battery.batteryLevel) / 600).toPrecision(2);
    })
  }

  createChart(){

    let element = <HTMLCanvasElement> document.getElementById('myChart')
    let ctx = element.getContext('2d');

    const centeredText = {
      id: 'centeredText',
      afterDatasetsDraw(chart: any, args: any, pluginOptions: any) {
        const { ctx, data } = chart;
        ctx.save();

        const text = data.datasets[0].data[0] + '%';

        const x = chart.getDatasetMeta(0).data[0].x;
        const y = chart.getDatasetMeta(0).data[0].y + 4;

        ctx.textAlign = 'center';
        ctx.textABaseline = 'middle';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(text, x, y);
        ctx.fillStyle = 'white';
      }
    }

    if(ctx && this.battery.batteryLevel) {
      this.chart = new Chart(ctx, {
        type: 'doughnut', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Load', 'Remaining time'],
           datasets: [
            {
              data: [ (this.battery.batteryLevel * 100).toFixed(), (100 - this.battery.batteryLevel * 100).toFixed()],
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
