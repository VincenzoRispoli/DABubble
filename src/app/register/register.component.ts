import { Component, HostListener, OnInit, inject } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { User } from '../shared/models/user.class';
import { Router } from '@angular/router';
import { AvatarPickerComponent } from './avatar-picker/avatar-picker.component';
import { SignupService } from '../shared/services/signup/signup.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SignupComponent, AvatarPickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  router = inject(Router)
  signupService = inject(SignupService)
  user = new User();
 
  next = false;
  signupSuccessful = false;
  smallScreen = false;

  @HostListener('window:resize', ['$event'])
  handleResize(event:Event ) {
    if (window.innerWidth <= 760) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }

  ngOnInit(): void {
    if (window.innerWidth <= 760) {
      this.smallScreen = true;
    }
  }

  goToAvatarPicker($event: boolean) {
    this.next = $event;
  }

  getUserDetail($event: User) {
    this.user = $event;
  }

  async signup($event: boolean) {
    await this.signupService.register()
    .then(() => this.signupSuccessful = $event)
  }
}
