import { Injectable } from '@angular/core';
import axios, { GenericFormData, toFormData } from 'axios';
import { GetMyMessageResponse } from '../models/response/getMyMessageResponse';
import { PostLoginResponse } from '../models/response/postLoginResponse';
import { GetMyMessageRequest } from '../models/request/getMyMessageRequest';
import { PostLoginRequest } from '../models/request/postLoginRequest';
import { PostMessageRequest } from '../models/request/postMessageRequest';
import { GetFriendsRequest } from '../models/request/getFriendsRequest';

export const BASE_URL = 'http://localhost/bike-dynamo/api/controllers/';
export const GET_MESSAGE_ENDPOINT = 'message/read.php';
export const POST_LOGIN_ENDPOINT = 'user/login.php';
export const POST_MESSAGE_ENDPOINT = 'message/create.php';
export const GET_USER_ENDPOINT = 'user/read.php';

@Injectable({
  providedIn: 'root'
})
export class DynamoApiService {

  constructor() { }

    static async postLogin(name: string, password: string) {
      const postLogin: PostLoginRequest = { name, password }
      const body: GenericFormData = toFormData(postLogin);
      const response = await axios({
          method: 'post',
          url: BASE_URL + POST_LOGIN_ENDPOINT,
          data: body,
      })

      return response.data
    }

    static async getFriends() {
      const userLocalStr = localStorage.getItem('DYNAMO_USER_KEY');
      if (userLocalStr) {
        const user: PostLoginResponse = JSON.parse(userLocalStr);
        const getFriends: GetFriendsRequest = { userId: user.id }
        const body: GenericFormData = toFormData(getFriends);
        const response = await axios({
            method: 'post',
            url: BASE_URL + GET_USER_ENDPOINT,
            data: body
        })

        return response.data
      } else {
        return null;
      }
    }

    static async getMyMessage() {
      const userLocalStr = localStorage.getItem('DYNAMO_USER_KEY');
      if (userLocalStr) {
        const user: PostLoginResponse = JSON.parse(userLocalStr);
        const getMyMessage: GetMyMessageRequest = { userId: user.id }
        const body: GenericFormData = toFormData(getMyMessage);
        const response = await axios({
            method: 'post',
            url: BASE_URL + GET_MESSAGE_ENDPOINT,
            data: body,
        })

        return response.data
      } else {
        return null;
      }
  }

  static async postMessage(targetId: string, stickerId: string) {
    const userLocalStr = localStorage.getItem('DYNAMO_USER_KEY');
    if (userLocalStr) {
      const user: PostLoginResponse = JSON.parse(userLocalStr);
      const postMessage: PostMessageRequest = { userId: user.id,  targetId, stickerId}
      const body: GenericFormData = toFormData(postMessage);
      const response = await axios({
          method: 'post',
          url: BASE_URL + POST_MESSAGE_ENDPOINT,
          data: body,
      })

      return response.data
    } else {
      return null;
    }
}

}
