import { Injectable } from '@angular/core';
import { Employe, EmployeAbsence } from '../models/employe.model';
import * as moment from 'moment';
import { ScheduleData } from '../components/administration/administration.component';
import { HttpClient } from '@angular/common/http';
import { Prestation } from '../models/prestation.model';


@Injectable()
export class AdministrationService {
  private employees : Employe[] = []
  private firstDayOfTheMonth = moment().startOf('month').toDate()
  public actualNumberOfMonthAdded : number = 0
  public employeScheduleDatesOfCurrentMonth : ScheduleData[] = []
  public absenceEmployeeTemporaire = <EmployeAbsence>{}
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
    this.generateEmployeScheduleDatesOfCurrentMonth()
  }
  decrementMonthNumber(){
    this.actualNumberOfMonthAdded = this.actualNumberOfMonthAdded - 1
    this.generateEmployeScheduleDatesOfCurrentMonth()
  }

  generateEmployeScheduleDatesOfCurrentMonth(){
    this.employeScheduleDatesOfCurrentMonth = []

    const listDayOfMonth = this.getLisDayOfTheMonth(moment(this.firstDayOfTheMonth).add(this.actualNumberOfMonthAdded,"months").toDate())
    const dateNow = moment().toDate()
    let isBooked : boolean

    listDayOfMonth.forEach(day => {
      isBooked = false
      for (let dayHolyday of this.absenceEmployeeTemporaire.data){
        if(moment(dayHolyday).isSame(moment(day))){
          isBooked = true
          break;
        }
      }
      this.employeScheduleDatesOfCurrentMonth.push({
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
      this.employeScheduleDatesOfCurrentMonth.unshift(dayEmpty)
    }
  }

  addEmptyDateEndSchedule(dayEmpty : ScheduleData){
    for (let day of this.employeScheduleDatesOfCurrentMonth){
      const lengthemployeScheduleDatesOfCurrentMonth = this.employeScheduleDatesOfCurrentMonth.length
      if(lengthemployeScheduleDatesOfCurrentMonth%7 !==0){
        this.employeScheduleDatesOfCurrentMonth.push(dayEmpty)
      }else{
        break;
      }
    }
  }

  getFirstNumericDayOfTheMonth() : number{
    const firstDayOfTheMonthNumeric = moment(moment().startOf('month').add(this.actualNumberOfMonthAdded,"months")).day();
    if(firstDayOfTheMonthNumeric === 0){
      return 6
    }else{
      return moment(moment().startOf('month').add(this.actualNumberOfMonthAdded,"months")).day() - 1
    }
  }

  updateEmployeData(employe:Employe){
      this.updateEmployesBackend(employe).subscribe(employeUpdated => {
        employe = employeUpdated
      })
  }

  updateEmployees(idEmploye:string, prestations: Prestation[]){
    let employeToUpdate = this.employees.find(employe => employe._id === idEmploye)
      if(employeToUpdate){
        employeToUpdate.listeDesPrestations = prestations
      }
  }

  addNewEmploye(employe : Employe){
    return this.http.post<Employe>(`http://www.localhost:3000/api/employes/addEmploye`,employe);
  }

  addNewImage(imageEmployeData : any){
    return this.http.post<void>('http://www.localhost:3000/api/employes/updateImage',imageEmployeData)
  }


  getEmployes(){
    return this.http.get<Employe[]>('http://www.localhost:3000/api/employes/employes')
  }

  updateEmployesBackend(employe:Employe){
    return this.http.post<Employe>(`http://www.localhost:3000/api/employes/updateEmploye`,employe)
  }

  deleteEmploye(id:string){
    return this.http.get<void>(`http://www.localhost:3000/api/employes/deleteEmploye/${id}`)
  }


}
