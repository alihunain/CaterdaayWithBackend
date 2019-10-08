import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder , Validators, FormControl} from '@angular/forms'
import { Contact } from '../Models/ContactUs'
import {ContactUsService} from '../../Services/contact-us.service'
import { GlobalService } from '../../Services/global.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  
  @Input() control:FormControl;
  ContactUs = this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.email]],
    phone:['',[Validators.required]],
    message:['',[Validators.required]]
  })
  get name(){
    return this.ContactUs.get('name');
  }
  get email(){
    return this.ContactUs.get('email');
  }
  get phone(){
    return this.ContactUs.get('phone');
  }
  get message(){
    return this.ContactUs.get('message');
  }
  Contact = new Contact();
  constructor(private global:GlobalService,private fb:FormBuilder,private ContactService:ContactUsService,private toastr:ToastrService) { }

  ngOnInit() {
    this.global.header = 2;
  }
  onSubmit(){
    this.Contact = this.ContactUs.value;
    this.ContactService.ContactPost(this.Contact).subscribe(data=>{
      this.toastr.success('Your Message Has Been Sent')
    },(error)=>{
      console.log(error);
    })
  }
  
}
