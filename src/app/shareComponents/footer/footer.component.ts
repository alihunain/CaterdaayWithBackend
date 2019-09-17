import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/Services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  email:any;
  constructor(private user:UserService,private toastr: ToastrService) { }

  ngOnInit() {
  }
  Subscribe()
  {
    this.user.AddSubscriber(this.email).subscribe((data:any)=>{
      console.log(data);
      if(data.error){
        this.toastr.error(data.data);
      }else{
        this.toastr.success("You have been subscripted for newsletter");
      }
    },(error)=>{
      this.toastr.error(error);
    })
  }
}
