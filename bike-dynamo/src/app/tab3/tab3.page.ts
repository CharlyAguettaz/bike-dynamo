import { Component, OnInit } from '@angular/core';
import { GetFriendsResponse } from '../models/response/getFriendsResponse';
import { DynamoApiService } from '../services/dynamo-api.service';
import { PostLoginResponse } from '../models/response/postLoginResponse';
import { Chart, registerables } from 'chart.js';
import { GetMyMessageResponse } from '../models/response/getMyMessageResponse';
import { AssetsService } from '../services/assets.service';
Chart.register(...registerables);

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor() {}

  public friends: GetFriendsResponse[] = [];
  user: PostLoginResponse;
  chart: Chart;
  messages: GetMyMessageResponse[] = [];
  stickers = AssetsService.getStickers();

  ngOnInit(): void {
    const userStr = localStorage.getItem('DYNAMO_USER_KEY');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
    this.getFriend();
    this.getMessage();
  }

  updateChartData(i: number) {
    this.chart.data.datasets = [];
    
    this.chart.data.datasets.push({
      label: 'Your data',
      data: [
       this.user.carbonEmission > this.friends[i].carbonEmission ? this.user.carbonEmission / this.user.carbonEmission * 100 : this.user.carbonEmission / this.friends[i].carbonEmission * 100,
       this.user.generatedPower > this.friends[i].generatedPower ? this.user.generatedPower / this.user.generatedPower * 100 : this.user.generatedPower / this.friends[i].generatedPower * 100 ,
       this.user.chargingTime > this.friends[i].chargingTime ? this.user.chargingTime / this.user.chargingTime * 100 : this.user.chargingTime / this.friends[i].chargingTime * 100,
       this.user.distanceTraveled > this.friends[i].distanceTraveled ? this.user.distanceTraveled / this.user.distanceTraveled * 100 : this.user.distanceTraveled / this.friends[i].distanceTraveled * 100,
       this.user.speed > this.friends[i].speed ? this.user.speed / this.user.speed * 100 : this.user.speed / this.friends[i].speed * 100,
      ],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    })
    this.chart.data.datasets.push({
      label: this.friends[i].name + ' data',
      data: [
        this.user.carbonEmission > this.friends[i].carbonEmission ? this.friends[i].carbonEmission / this.user.carbonEmission * 100 : this.friends[i].carbonEmission / this.friends[i].carbonEmission * 100,
        this.user.generatedPower > this.friends[i].generatedPower ? this.friends[i].generatedPower / this.user.generatedPower * 100 : this.friends[i].generatedPower / this.friends[i].generatedPower * 100 ,
        this.user.chargingTime > this.friends[i].chargingTime ? this.friends[i].chargingTime / this.user.chargingTime * 100 : this.friends[i].chargingTime / this.friends[i].chargingTime * 100,
        this.user.distanceTraveled > this.friends[i].distanceTraveled ? this.friends[i].distanceTraveled / this.user.distanceTraveled * 100 : this.friends[i].distanceTraveled / this.friends[i].distanceTraveled * 100, 
        this.user.speed > this.friends[i].speed ? this.friends[i].speed / this.user.speed * 100 : this.friends[i].speed / this.friends[i].speed * 100, 
      ],
      fill: true,
      backgroundColor: 'rgba(99, 255, 255, 0.2)',
      borderColor: 'rgb(99, 255, 255)',
      pointBackgroundColor: 'rgb(99, 255, 255)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(99, 255, 255)'
    });
    this.chart.update();
  }

  generateChart() {
    let element = <HTMLCanvasElement> document.getElementById('friendChart');
    let ctx = element.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Saved CO2',
            'Generated power',
            'Charging time',
            'Traveled distance',
            'Speed',
          ],
          datasets: [{
            label: 'Your data',
            data: [this.user.carbonEmission, this.user.generatedPower / this.user.generatedPower * 100, this.user.chargingTime / this.user.chargingTime * 100, this.user.distanceTraveled, this.user.speed],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }]
        },
        options: {
          scales: {
            r: {
              ticks: {
                display: false
              },
              pointLabels: {
                color: 'white'
              },
              angleLines: {
                color: '#22bb88'
              },
              grid: {
                color: '#22bb8880'
              }
            }
          },
          plugins: {
            tooltip: {
              enabled: false
            },
          },
          elements: {
            line: {
              borderWidth: 3
            }
          }
        },
      })
    }
  }

  getFriend() {
    DynamoApiService.getFriends().then((data: GetFriendsResponse[]) => {
      this.friends = [...data];
      this.generateChart();
    })
  }

  getMessage() {
    DynamoApiService.getMyMessage().then((data: GetMyMessageResponse[]) => {
      this.messages = data;
    })
  }

  isUserMessage(user: number, user2: number) {
    return user == user2
  }

  getMessageSticker(id: string) {
    return this.stickers.find((sticker) => sticker.id == id)?.url
  }

  public logout() {
    localStorage.removeItem('DYNAMO_USER_KEY');
  }

}
