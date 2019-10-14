import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  Subscribe = this.fb.group({
    email:['',[Validators.required,Validators.email]]
  })
  get email(){
    return this.Subscribe.get('email');
  }
  constructor(private user:UserService,private toastr: ToastrService,private fb:FormBuilder) { }

  ngOnInit() {
  }
  onSubscribe()
  {
    let body = {
      email:this.email.value
    }
    this.user.AddSubscriber(body).subscribe((data:any)=>{
      console.log(data);
      if(data.error){
        this.toastr.error("You already have been subscribe to newsletter");
      }else{
        this.toastr.success("You have been subscripted for newsletter");
      }
    },(error)=>{
      this.toastr.error(error);
    })
  }
}
