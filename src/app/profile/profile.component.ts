import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service'
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userdata:any;
  Profile = this.fb.group({
    email:['',[Validators.required]],
    lastname:['',[Validators.required]],
    firstname:['',[Validators.required]],
    homephone:['',[Validators.required]],
    dob:['',[Validators.required]],
    cellphone:['',[Validators.required]]
  })
  Card = this.fb.group({
    address: ['',[Validators.required]],
    cardnumber: ['',[Validators.required],[Validators.minLength(15)],[Validators.maxLength(17)]],
    cvv: ['',[Validators.required],[Validators.minLength(2)],[Validators.maxLength(4)]],
    expirymonth: ['',[Validators.required],[Validators.minLength(1)],[Validators.maxLength(3)]],
    expiryyear: ['',[Validators.required],[Validators.minLength(1)],[Validators.maxLength(3)]],
    fname: ['',[Validators.required]],
    lname: ['',[Validators.required]],
    zip:['',[Validators.required]]
  })
  constructor(private users:UserService,private fb:FormBuilder,private toastr:ToastrService) { }

  ngOnInit() {
    this.userdata ={ accounttype: "customer",
    cardinfo: [],
    customeraddresses: [],
    customerfavrestro: [],
    customerpoints: 15,
    dtype: "Customer",
    email: "ali.hunain@koderlabs.com",
    firstname: "Ali Hunain",
    lastname: "Narsinh",
    password: "123456",
    status: true,
    username: "ali.hunain@koderlabs.com",
    __v: 0,
    _id: "5d8caeb843e7df31d8330208"
    }
    this.Profile.controls['email'].setValue(this.userdata.email);
    this.Profile.controls['lastname'].setValue(this.userdata.lastname);
    
    this.Profile.controls['firstname'].setValue(this.userdata.firstname);
  }
  get cellphone(){
    return this.Profile.get('cellphone');
  }
  get dob(){
    return this.Profile.get('dob');
  }
  get homephone(){
    return this.Profile.get('homephone');
  }
  get firstname(){
    return this.Profile.get('firstname');
  }
  get lastname(){
    return this.Profile.get('lastname');
  }
  get email(){
    return this.Profile.get('email');
  }
  get address(){
    return this.Card.get('address');
  }
  get cardnumber(){
    return this.Card.get('cardnumber');
  }
  get cvv(){
    return this.Card.get('cvv');
  }
  get expirymonth(){
    return this.Card.get('expirymonth');
  }
  get expiryyear(){
    return this.Card.get('expiryyear');
  }
  get fname(){
    return this.Card.get('fname');
  }
  get lname(){
    return this.Card.get('lname');
  }
  get zip(){
    return this.Card.get('zip');
  }
  updateProfile(){
  let postProfile = this.Profile.value;
  postProfile._id = this.userdata._id;
  postProfile.username = postProfile.email;

    this.users.UpdateProfile(this.userdata._id,postProfile).subscribe((data:any)=>{
    if(!data.error){
      this.toastr.success("Profile Updated !");
    }else{
      this.toastr.error(data.message);
    }
    },(error)=>{
      this.toastr.success("Unexpected Error");
    });
  }

}
