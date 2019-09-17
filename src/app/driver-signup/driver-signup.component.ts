import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import {DriverService} from '../../Services/driver.service'

@Component({
  selector: 'app-driver-signup',
  templateUrl: './driver-signup.component.html',
  styleUrls: ['./driver-signup.component.css']
})
export class DriverSignupComponent implements OnInit {
  Driver = this.fb.group({
    firstname:['',[Validators.required]],
    lastname:['',[Validators.required]],
    email:['',[Validators.email,Validators.required]],
    phone:['',[Validators.required]],
    dob:['',[Validators.required]],
    identity:['',[Validators.required]],
    license:['',[Validators.required]],
    about:[''],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    state:['',[Validators.required]],
    yourself:['',[Validators.required,Validators.minLength(100)]]
  })
  constructor(private fb:FormBuilder,private driver:DriverService) { }

  ngOnInit() {
  }
  get firstname(){
    return this.Driver.get('firstname');
  }
  get lastname(){
    return this.Driver.get('lastname');
  }
  get email(){
    return this.Driver.get('email');
  }
  get phone(){
    return this.Driver.get('phone');
  }
  get dob(){
    return this.Driver.get('dob');
  }
  get identity(){
    return this.Driver.get('identity');
  }
  get address(){
    return this.Driver.get('address');
  }
  get city(){
    return this.Driver.get('city');
  }
  get state(){
    return this.Driver.get('state');
  }
  get yourself(){
    return this.Driver.get('yourself');
  }
  get license(){
    return this.Driver.get('license');
  }
  get about(){
    return this.Driver.get('about').value;
  }
  driverSignup(){
    let driverDetails = this.Driver.value;
    this.driver.Signup(driverDetails).subscribe((data:any)=>{
      console.log(data)
    },(error:any)=>{
console.log(error);
    })
  }

}
