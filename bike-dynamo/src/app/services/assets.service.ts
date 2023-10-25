import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() { }

  static getBadges() {
    return [
      { title: 'phone', url: 'assets/badges/phone.svg', unlocked: false, description: 'You have generated the equivalent of a phone battery by bike, this represent approximately 3500mA/h' },
      { title: 'phone5', url: 'assets/badges/phone5.svg', unlocked: false, description: 'You have generated the equivalent of 5 phone battery by bike, this represent approximately 17500mA/h' },
      { title: 'phone10', url: 'assets/badges/phone10.svg', unlocked: false, description: 'You have generated the equivalent of 10 phone battery by bike, this represent approximately 35000mA/h' },
      { title: 'laptop5', url: 'assets/badges/laptop5.svg', unlocked: false, description: 'You have generated the equivalent of 5 laptop battery by bike, this represent approximately 40000mA/h' },
      { title: 'laptop10', url: 'assets/badges/laptop10.svg', unlocked: false, description: 'You have generated the equivalent of 10 laptop battery by bike, this represent approximately 80000mA/h' },
      { title: 'laptop20', url: 'assets/badges/laptop20.svg', unlocked: false, description: 'You have generated the equivalent of 20 laptop battery by bike, this represent approximately 160000mA/h' },
      { title: 'car', url: 'assets/badges/car.svg', unlocked: false, description: 'You have generated the equivalent to make a full load of a car by bike, this represent approximately 400000mA/h' },
    ]
  }

  static getStickers() {
    return [
      { title: 'beat-you', id: '1', url: 'assets/stickers/beat-you.png', description: 'You can send this sticker to every friend that unloacked the same badges as you' },
      { title: 'catch-you', id: '2', url: 'assets/stickers/catch-you.png',  description: 'You can send this sticker to every friend that unloacked more badges than you' },
      { title: 'review-mirror', id: '3', url: 'assets/stickers/review-mirror.png', description: 'You can send this sticker to every friend that unloacked less badges than you' },
    ]
  }
}
