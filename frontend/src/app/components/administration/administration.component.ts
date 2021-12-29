import { Component, OnInit } from '@angular/core';
import { Employe } from 'src/app/models/employe.model';
import { Prestation } from 'src/app/models/employe.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { MatDialog } from '@angular/material/dialog';
import { PrestationDialogComponent } from 'src/app/dialog-components/prestation-dialog/prestation-dialog.component';
import { ScheduleDialogComponent } from 'src/app/dialog-components/schedule-dialog/schedule-dialog.component';

export interface ScheduleData {
  date: Date,
  isBooked: boolean,
  isDisabled: boolean,
  numberOfTheDay: string
}

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  public employees: Employe[] = []
  public employeEdit  = <Employe>{}
  constructor(private administrationService: AdministrationService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.employeEdit = {
      _id : '0',
      absences : [],
      jourTravaille : [],
      listeDesPrestations : [
        {
          id:"619026968a03ad3f9c868caf",
          nom: "Suedois",
          acquis:false
        },
        {
          id:"619026968a03ad3f9c868cb0",
          nom: "Californien",
          acquis:false
        },
        {
          id:"619026968a03ad3f9c868cb1",
          nom: "Thailandais",
          acquis:false
        },
        {
          id:"619026968a03ad3f9c868cb2",
          nom: "Sportif",
          acquis:false
        },
        {
          id:"619026968a03ad3f9c868cb3",
          nom: "Francais",
          acquis:false
        }
      ],
      nom : '',
      pauseEntrePrestation : 0,
      photo : '../../../assets/employe2.jpg',
      profession : 'masseuse',
      hasBeenUpdate : false
    }
    this.administrationService.getEmployes().subscribe(employes => {
      this.employees = employes
    })
  }

  updatePrestations(idEmploye: string, prestations: Prestation[]) {
    const confirmDialog = this.dialog.open(PrestationDialogComponent, {
      data: JSON.parse(JSON.stringify(prestations)), //Needed to do not send prestations as reference
      maxHeight: '50vh'
    });
    confirmDialog.afterClosed().subscribe((prestations: Prestation[]) => {
      if (!prestations) return
      let employeToUpdate = this.employees.find(employee => employee._id === idEmploye)
      if (employeToUpdate) {
        employeToUpdate.listeDesPrestations = prestations
        employeToUpdate.hasBeenUpdate = true
      }else{
        this.employeEdit.listeDesPrestations = prestations
        this.employeEdit.hasBeenUpdate = true
      }
    });
  }

  saveNewEmploye(){
    this.administrationService.saveNewEmploye(this.employeEdit).subscribe(data => {
      this.employees = [...this.employees,data]
    })
  }

  updateEmploye(employee : Employe){
    this.administrationService.updateEmployeData(employee)
  }

  showAbsence(employeeId: string) {

    const employees = this.employees
    const indexOfEmployeeToUpdate = employees.findIndex(employee => employee._id === employeeId)
    this.administrationService.absenceTemporaire.data = [...employees[indexOfEmployeeToUpdate].absences]
    this.administrationService.absenceTemporaire.id = employeeId
    this.administrationService.actualNumberOfMonthAdded = 0
    this.administrationService.generateListDate()

    const confirmDialog = this.dialog.open(ScheduleDialogComponent, {
      maxWidth: '50vh',
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        employees[indexOfEmployeeToUpdate].hasBeenUpdate = this.checkAbsenceArrayHasChanged(employees[indexOfEmployeeToUpdate].absences,this.administrationService.absenceTemporaire.data)
        employees[indexOfEmployeeToUpdate].absences = this.administrationService.absenceTemporaire.data
      }
      this.administrationService.absenceTemporaire.data = []
    })
  }

  checkAbsenceArrayHasChanged(employeAbsence : any[] , absenceTemporaire : any[] ) : boolean{

    employeAbsence = employeAbsence.map((employeAbsence: any) => {
      if(employeAbsence instanceof Date){
        return employeAbsence.toDateString()
      }else{
        return new Date(employeAbsence).toDateString()
      }
    })

    absenceTemporaire = absenceTemporaire.map((employeAbsence: any) => {
      if(employeAbsence instanceof Date){
        return employeAbsence.toDateString()
      }else{
        return new Date(employeAbsence).toDateString()
      }
    })

    let checkAbsenceArrayCahged : boolean = false
    if(absenceTemporaire.length !== employeAbsence.length) return true
    for(let empAbs of employeAbsence){
      let isContain : boolean = false
      for(let absTmp of absenceTemporaire){
        if(absTmp === empAbs){
          isContain = true
        }
      }
      if(!isContain){
        checkAbsenceArrayCahged = true
        break;
      }
    }
    return checkAbsenceArrayCahged
  }
}

