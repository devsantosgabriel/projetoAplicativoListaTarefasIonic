import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService : AuthService, public router : Router) { 
    this.authService.logged().subscribe(
      data => {
        if(data != null) this.router.navigate(['home'])
      },
      err => console.log(err)
    )
  }
  ngOnInit() {
  }

}
