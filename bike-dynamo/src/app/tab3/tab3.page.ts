import { Component, OnInit } from '@angular/core';
import { GetFriendsResponse } from '../models/response/getFriendsResponse';
import { DynamoApiService } from '../services/dynamo-api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor() {}

  public friends: GetFriendsResponse[] = [];

  ngOnInit(): void {
    this.getFriend();
  }

  getFriend() {
    DynamoApiService.getFriends().then((data: GetFriendsResponse[]) => {
      this.friends = [...data]
    })
  }

  public logout() {
    localStorage.removeItem('DYNAMO_USER_KEY');
  }

}
