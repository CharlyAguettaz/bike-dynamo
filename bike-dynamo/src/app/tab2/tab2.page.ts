import {Component, OnInit} from '@angular/core';
import { PostLoginResponse } from '../models/response/postLoginResponse';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  user: PostLoginResponse;

  constructor() {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('DYNAMO_USER_KEY');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } 
  }
}
