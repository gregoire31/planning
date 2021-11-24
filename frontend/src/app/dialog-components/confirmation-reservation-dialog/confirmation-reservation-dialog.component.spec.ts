import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationReservationDialogComponent } from './confirmation-reservation-dialog.component';

describe('ConfirmationReservationDialogComponent', () => {
  let component: ConfirmationReservationDialogComponent;
  let fixture: ComponentFixture<ConfirmationReservationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationReservationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
