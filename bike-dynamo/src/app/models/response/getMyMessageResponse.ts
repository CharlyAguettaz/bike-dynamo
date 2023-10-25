export interface GetMyMessageResponse {
    id: string;
    userId: string;
    stickerId: string;
    name: string;
    password: string;
    carbonEmission: number;
    generatedPower: number;
    chargingTime: number;
    distanceTraveled: number;
    speed: number;
}