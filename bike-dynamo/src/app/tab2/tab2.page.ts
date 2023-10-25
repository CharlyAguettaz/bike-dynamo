import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  carbonEmission: number = 0;
  generatedPower: number = 0;
  chargingTime: number = 0;
  distanceTraveled: number = 0;
  speed: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.carbonEmission = 2000;
    this.generatedPower = 15;
    this.chargingTime = 35;
    this.distanceTraveled = 20;
    this.speed = 19;
  }

}
