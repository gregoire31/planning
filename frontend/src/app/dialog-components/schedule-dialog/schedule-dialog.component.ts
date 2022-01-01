import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScheduleData } from 'src/app/components/administration/administration.component';
import * as moment from 'moment';
import { AdministrationService } from 'src/app/services/administration.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit {

  public dayOfTheWeek = ['Lu','Ma','Me','Je','Ve','Sa','Di']
  public currentMonth : string = ''
  public schedule: ScheduleData[] = []

  constructor(public dialogRef: MatDialogRef<ScheduleDialogComponent>, private administrationService : AdministrationService) { }

  ngOnInit(): void {
    this.schedule = this.administrationService.employeScheduleDatesOfCurrentMonth
    this.currentMonth = moment(this.schedule[0].date).format('MMMM YYYY')
  }

  updateAbsenceDay(scheduleDay: ScheduleData){
    scheduleDay.isBooked = !scheduleDay.isBooked
    if(scheduleDay.isBooked){
      this.administrationService.absenceEmployeeTemporaire.data.push(scheduleDay.date)
    }else{
      const indexOfAbsence = this.administrationService.absenceEmployeeTemporaire.data.findIndex(absence => moment(absence).toDate().getDate() === scheduleDay.date.getDate())
      this.administrationService.absenceEmployeeTemporaire.data.splice(indexOfAbsence,1)
    }
  }

  incrementMonthNumber(){
    this.administrationService.incrementMonthNumber()
    this.schedule = this.administrationService.employeScheduleDatesOfCurrentMonth
    this.currentMonth = moment(this.currentMonth).add(1,'months').format('MMMM YYYY')
  }

  decrementMonthNumber(){
    this.administrationService.decrementMonthNumber()
    this.schedule = this.administrationService.employeScheduleDatesOfCurrentMonth
    this.currentMonth = moment(this.currentMonth).subtract(1,'months').format('MMMM YYYY')
  }

}
