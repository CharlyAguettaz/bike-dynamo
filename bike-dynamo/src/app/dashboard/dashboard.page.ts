import { Component, OnInit, ViewChild } from '@angular/core';
import { BatteryInfo, Device } from '@capacitor/device';
import { Chart, registerables } from 'chart.js';
import { IonModal, ModalController } from '@ionic/angular';
import { AssetsService } from '../services/assets.service';
import { PostLoginResponse } from '../models/response/postLoginResponse';
import { DynamoApiService } from '../services/dynamo-api.service';
import { GetFriendsResponse } from '../models/response/getFriendsResponse';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class Dashboard implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  public chart: Chart<"doughnut", string[], string>;
  public remainingTime: any = 0;
  public battery: BatteryInfo = {
    batteryLevel: 0,
    isCharging: false
  };
  public badges: {
    title: string;
    url: string;
    unlocked: boolean;
    description: string;
  }[] = AssetsService.getBadges();

  public stickers: {
    title: string;
    url: string;
    description: string;
  }[] = AssetsService.getStickers();

  public user: PostLoginResponse;

  public targetId: string;

  public friends: GetFriendsResponse[] = [];

  isMessageToastOpen: boolean = false;

  constructor(private modalCntrl: ModalController) {}

  ngOnInit(): void {
    
    const userStr = localStorage.getItem('DYNAMO_USER_KEY');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.unlockProductionStep();
    } 
    this.setBattery();
    this.getFriend();
    setInterval(() => this.updateBattery(), 1000);
  }

  getFriend() {
    DynamoApiService.getFriends().then((data: GetFriendsResponse[]) => {
      this.friends = [...data]
    })
  }

  sendSticker(stickerId: string) {
    if (this.targetId) {
      DynamoApiService.postMessage(this.targetId, stickerId).then(() => {
        this.setOpen(true);
      });
    }
  }

  setOpen(isOpen: boolean) {
    this.isMessageToastOpen = isOpen;
  }

  isStickerSendable(production: number, sticker: string): boolean {
    switch (sticker) {
      case 'beat-you':
        if (this.getProductionStep(production) == this.getProductionStep(this.user.generatedPower)) {
          return true;
        } else {
          return false;
        }

      case 'catch-you':
        if (this.getProductionStep(production) > this.getProductionStep(this.user.generatedPower)) {
          return true;
        } else {
          return false;
        }

      case 'review-mirror':
        if (this.getProductionStep(production) < this.getProductionStep(this.user.generatedPower)) {
          return true;
        } else {
          return false;
        }

      default :
        return false;
    }
  }

  unlockProductionStep() {
    let step = this.getProductionStep(this.user.generatedPower);
    this.badges.forEach((badge) => {
      if (step > 0) {
        badge.unlocked = true;
        step--;
      }
    })
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
