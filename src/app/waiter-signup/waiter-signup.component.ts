import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from '../../Services/global.service'
import {DriverService} from '../../Services/driver.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
@Component({
  selector: 'app-waiter-signup',
  templateUrl: './waiter-signup.component.html',
  styleUrls: ['./waiter-signup.component.css']
})
export class WaiterSignupComponent implements OnInit {

  Waiter = this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.email,Validators.required]],
    phone:['',[Validators.required]],
    identity:['',[Validators.required]],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    state:['',[Validators.required]],
    yourself:['',[Validators.required,Validators.minLength(100)]],
    password:['',[Validators.required]]
  })
  constructor(private toastr:ToastrService,private router:Router, private global:GlobalService,private fb:FormBuilder,private driverService:DriverService) { }

  ngOnInit() {
    this.global.header = 2;
  }
  get name(){
    return this.Waiter.get('name');
  }

  get email(){
    return this.Waiter.get('email');
  }
  get phone(){
    return this.Waiter.get('phone');
  }

  get identity(){
    return this.Waiter.get('identity');
  }
  get address(){
    return this.Waiter.get('address');
  }
  get city(){
    return this.Waiter.get('city');
  }
  get state(){
    return this.Waiter.get('state');
  }
  get yourself(){
    return this.Waiter.get('yourself');
  }
  get password(){
    return this.Waiter.get('password');
  }
  waiterSignup(){
   this.driverService.WaiterSignup(this.Waiter.value).subscribe((data:any)=>{
     if(!data.error){
       this.toastr.success('your form has been submit');
       this.router.navigate(['/'])
     }
   })
  }
}
