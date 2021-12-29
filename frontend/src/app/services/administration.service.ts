import { Injectable } from '@angular/core';
import { Employe, Prestation, EmployeAbsence } from '../models/employe.model';
import * as moment from 'moment';
import { ScheduleData } from '../components/administration/administration.component';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AdministrationService {
  private employees : Employe[] = []
  private firstDayOfTheMonth = moment().startOf('month').toDate()
  public actualNumberOfMonthAdded : number = 0
  public actualListDate : ScheduleData[] = []
  public absenceTemporaire = <EmployeAbsence>{}
  constructor(private http : HttpClient) {

  }

  getLisDayOfTheMonth(firstDayOfTheMonth : Date) : Array<Date>{
    const listDayOfMonth : Date[] = []
    const numberDayInTheMonth = moment(firstDayOfTheMonth).daysInMonth()
    for(let i = 0; i < numberDayInTheMonth; i++){
      listDayOfMonth.push(moment(firstDayOfTheMonth).add(i, 'days').toDate())
    }
    return listDayOfMonth
  }

  // incrementList
  incrementMonthNumber(){
    this.actualNumberOfMonthAdded = this.actualNumberOfMonthAdded +1
    this.generateListDate()
  }
  decrementMonthNumber(){
    this.actualNumberOfMonthAdded = this.actualNumberOfMonthAdded - 1
    this.generateListDate()
  }

  generateListDate(){
    const myHolidayDates = this.absenceTemporaire.data
    console.log(myHolidayDates)
    this.actualListDate = []
    const listDayOfMonth = this.getLisDayOfTheMonth(moment(this.firstDayOfTheMonth).add(this.actualNumberOfMonthAdded,"months").toDate())
    const dateNow = moment().toDate()
    let isBooked : boolean

    listDayOfMonth.forEach(day => {
      isBooked = false
      for (let dayHolyday of myHolidayDates){
        if(moment(dayHolyday).isSame(moment(day))){
          isBooked = true
          break;
        }
      }
      this.actualListDate.push({
        date : day,
        isBooked : isBooked,
        isDisabled : moment(day).isBefore(moment(dateNow)),
        numberOfTheDay : moment(day).format('DD')
      })
    });

    let numberOfWeekToAdd : number = 0

    const dayEmpty : ScheduleData = {
      date : dateNow,
      isBooked : false,
      isDisabled : false,
      numberOfTheDay : '0'
    }

    numberOfWeekToAdd = this.getFirstNumericDayOfTheMonth()

    this.addEmptyDateStartSchedule(numberOfWeekToAdd, dayEmpty)

    this.addEmptyDateEndSchedule(dayEmpty)

  }

  addEmptyDateStartSchedule(numberOfWeekToAdd : number,dayEmpty : ScheduleData){
    for(let i = 0; i < numberOfWeekToAdd; i++){
      this.actualListDate.unshift(dayEmpty)
    }
  }

  addEmptyDateEndSchedule(dayEmpty : ScheduleData){
    for (let day of this.actualListDate){
      const lengthActualListDate = this.actualListDate.length
      if(lengthActualListDate%7 !==0){
        this.actualListDate.push(dayEmpty)
      }else{
        break;
      }
    }
  }

  getFirstNumericDayOfTheMonth() : number{
    const startOfMonth = moment().startOf('month').add(this.actualNumberOfMonthAdded,"months").format('dddd');

    if(startOfMonth === 'Tuesday'){
      return 1
    }
    if(startOfMonth === 'Wednesday'){
      return 2
    }
    if(startOfMonth === 'Thursday'){
      return 3
    }
    if(startOfMonth === 'Friday'){
      return 4
    }
    if(startOfMonth === 'Saturday'){
      return 5
    }
    if(startOfMonth === 'Sunday'){
      return 6
    }
    return 0
  }

  updateEmployeData(employe:Employe){
      this.updateEmployesBackend(employe).subscribe(employeUpdated => {
        employe = employeUpdated
        console.log(employeUpdated)
      })
  }

  updateEmployees(idEmploye:string, prestations: Prestation[]){
    let employeToUpdate = this.employees.find(employe => employe._id === idEmploye)
      if(employeToUpdate){
        employeToUpdate.listeDesPrestations = prestations
      }
  }

  saveNewEmploye(employe : Employe){
    return this.http.post<Employe>(`http://www.localhost:3000/api/employes/saveEmploye`,employe);
  }

  getEmployes(){
    return this.http.get<Employe[]>('http://www.localhost:3000/api/employes/employes')
  }

  updateEmployesBackend(employe:Employe){
    return this.http.post<Employe>(`http://www.localhost:3000/api/employes/updateAbsenceEmploye`,employe)
  }
}
