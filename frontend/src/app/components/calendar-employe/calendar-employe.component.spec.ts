import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEmployeComponent } from './calendar-employe.component';

describe('CalendarEmployeComponent', () => {
  let component: CalendarEmployeComponent;
  let fixture: ComponentFixture<CalendarEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarEmployeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
