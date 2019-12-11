import { Component, AfterViewInit } from '@angular/core';
// declare var functionality: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  title = 'caterdaay';
  showCart = false;
  ngAfterViewInit(): void {
   
    this.loadScript('../assets/js/bootstrap.min.js');
    this.loadScript('../assets/js/popper.min.js');
   
  }
  public loadScript(url: string) {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
