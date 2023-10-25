import { Component, OnInit } from '@angular/core';
import { DynamoApiService } from './services/dynamo-api.service';
import { PostLoginResponse } from './models/response/postLoginResponse';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  name: string;
  password: string;

  ngOnInit(): void {
    document.body.classList.toggle('dark', true);
  }

  public isLogged(): boolean {
    const userStr = localStorage.getItem('DYNAMO_USER_KEY');
    return userStr ? true : false;
  }

  public postLogin() {
    DynamoApiService.postLogin(this.name, this.password).then((data: PostLoginResponse) => {
      if (data) {
        console.log(data);
        localStorage.setItem('DYNAMO_USER_KEY', JSON.stringify(data));
      }
    })
  }
}
