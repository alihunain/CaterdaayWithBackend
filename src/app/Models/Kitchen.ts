export class Kitchen {
    public city: string;
    public country: string;
    public cousine: string;
    public favourite: string;
    public lat: string;
    public lng: string;
    public range: number;
    public sortby: string;
    public getState() {
        console.log(this.country);
        return {
            country: this.country,
            lng: this.lng,
            lat: this.lat
        }
    }
}
