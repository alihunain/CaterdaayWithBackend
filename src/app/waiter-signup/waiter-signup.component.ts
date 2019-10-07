import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from '../../Services/global.service'
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
    yourself:['',[Validators.required,Validators.minLength(100)]]
  })
  constructor(private global:GlobalService,private fb:FormBuilder) { }

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
  waiterSignup(){
    console.log("API Requeired");
  }
}
