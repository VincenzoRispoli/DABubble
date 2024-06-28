import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpPrivateNotificationComponent } from './pop-up-private-notification.component';

describe('PopUpPrivateNotificationComponent', () => {
  let component: PopUpPrivateNotificationComponent;
  let fixture: ComponentFixture<PopUpPrivateNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpPrivateNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpPrivateNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
