import { Component, OnInit, ViewChild } from '@angular/core';
import { BatteryInfo, Device } from '@capacitor/device';
import { Chart, registerables } from 'chart.js';
import { IonModal, ModalController } from '@ionic/angular';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class Dashboard implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

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
    description: string;
  }[] = [
    { title: 'phone', url: 'assets/badges/phone.svg', unlocked: true, description: 'You have generated the equivalent of a phone battery by bike, this represent approximately 3500mA/h' },
    { title: 'phone5', url: 'assets/badges/phone5.svg', unlocked: true, description: 'You have generated the equivalent of 5 phone battery by bike, this represent approximately 17500mA/h' },
    { title: 'phone10', url: 'assets/badges/phone10.svg', unlocked: false, description: 'You have generated the equivalent of 10 phone battery by bike, this represent approximately 35000mA/h' },
    { title: 'laptop5', url: 'assets/badges/laptop5.svg', unlocked: true, description: 'You have generated the equivalent of 5 laptop battery by bike, this represent approximately 40000mA/h' },
    { title: 'laptop10', url: 'assets/badges/laptop10.svg', unlocked: false, description: 'You have generated the equivalent of 10 laptop battery by bike, this represent approximately 80000mA/h' },
    { title: 'laptop20', url: 'assets/badges/laptop20.svg', unlocked: false, description: 'You have generated the equivalent of 20 laptop battery by bike, this represent approximately 160000mA/h' },
    { title: 'car', url: 'assets/badges/car.svg', unlocked: false, description: 'You have generated the equivalent to make a full load of a car by bike, this represent approximately 400000mA/h' },
  ];

  public stickers: {
    title: string;
    url: string;
    description: string;
  }[] = [
    { title: 'beat-you', url: 'assets/stickers/beat-you.png', description: 'You can send this sticker to every friend that unloacked the same badges as you' },
    { title: 'catch-you', url: 'assets/stickers/catch-you.png',  description: 'You can send this sticker to every friend that unloacked more badges than you' },
    { title: 'review-mirror', url: 'assets/stickers/review-mirror.png', description: 'You can send this sticker to every friend that unloacked less badges than you' },
  ]

  public myProduction = 26000;

  public friends = [
    { id: 1, name:'Mathieu', production: 15000 },
    { id: 2, name:'Lucas', production: 20000 },
    { id: 3, name:'Emma', production: 36000 },
  ]

  constructor(private modalCntrl: ModalController) {}

  ngOnInit(): void {
    this.remainingTime = '0';
    this.setBattery();
    setInterval(() => this.updateBattery(), 1000);
  }

  isStickerSendable(production: number, sticker: string): boolean {
    switch (sticker) {
      case 'beat-you':
        if (this.getProductionStep(production) == this.getProductionStep(this.myProduction)) {
          return true;
        } else {
          return false;
        }

      case 'catch-you':
        if (this.getProductionStep(production) > this.getProductionStep(this.myProduction)) {
          return true;
        } else {
          return false;
        }

      case 'review-mirror':
        if (this.getProductionStep(production) < this.getProductionStep(this.myProduction)) {
          return true;
        } else {
          return false;
        }

      default :
        return false;
    }
  }

  getProductionStep(production: number): number {
    if (production <= 3500) {
      return 0;
    } else if (production > 3500 && production <= 17500) {
      return 1;
    } else if (production > 17500 && production <= 35000) {
      return 2;
    } else if (production > 35000 && production <= 40000) {
      return 3;
    } else if (production > 40000 && production <= 80000) {
      return 4;
    } else if (production > 80000 && production <= 160000) {
      return 5;
    } else if (production > 160000 && production <= 400000) {
      return 6;
    } else if (production > 400000) {
      return 7;
    } else {
      return 0;
    }
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

  close(title: string) {
    this.modalCntrl.dismiss(null, '', title);
  }
}
