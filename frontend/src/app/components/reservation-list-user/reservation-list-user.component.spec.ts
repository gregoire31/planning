import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationListUserComponent } from './reservation-list-user.component';

describe('ReservationListUserComponent', () => {
  let component: ReservationListUserComponent;
  let fixture: ComponentFixture<ReservationListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationListUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
