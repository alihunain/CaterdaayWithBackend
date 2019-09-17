import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  constructor() { }
public  development = {
  ms1 : 'https://mealdaay.com:4014/',
  ms2 : 'https://mealdaay.com:4024/',
  ms3 : 'https://mealdaay.com:4034/',
  ms4 : 'https://mealdaay.com:4044/',
  ms6 : 'https://mealdaay.com:4004/'
}
}

