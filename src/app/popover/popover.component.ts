import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit {

  constructor(public authService : AuthService,
    private router : Router, 
    private popOverController : PopoverController) { }

  ngOnInit() {}

  logout(){
    this.authService.logout().subscribe(
      data => {this.router.navigate(['login'])
              this.popOverController.dismiss()},
      err => console.log(err)
    )
  }

}
