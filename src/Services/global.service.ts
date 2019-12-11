import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  constructor() { }
  public  header:Number = 2;
public  development = {
  // ms1 : 'http://localhost:4014/',
  // ms2 : 'http://localhost:4024/',
  // ms3 : 'http://localhost:4034/',
  // ms4 : 'http://localhost:4044/',
  // ms6 : 'http://localhost:4004/'


   ms1 : 'https://www.caterdaay.com:4014/',
   ms2 : 'https://www.caterdaay.com:4024/',
  ms3 : 'https://www.caterdaay.com:4034/',
  ms4 : 'https://www.caterdaay.com:4044/',
   ms6 : 'https://www.caterdaay.com:4004/'
}
}

