import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public development = {
    ms1 : 'http://localhost:4014/',
    ms2 : 'http://localhost:4024/',
    ms3 : 'http://localhost:4034/',
    ms4 : 'http://localhost:4044/',
    ms6 : 'http://localhost:4064/'
}
  constructor() { }
}
