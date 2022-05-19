import { Component, OnInit } from '@angular/core';
import { Employe } from 'src/app/models/employe.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { MatDialog } from '@angular/material/dialog';
import { PrestationDialogComponent } from 'src/app/dialog-components/prestation-dialog/prestation-dialog.component';
import { ScheduleDialogComponent } from 'src/app/dialog-components/schedule-dialog/schedule-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PrestationService } from 'src/app/services/prestation.service';
import { Prestation } from 'src/app/models/prestation.model';

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
  private dialog: MatDialog, private _sanitizer: DomSanitizer,private prestationService : PrestationService) { }

  ngOnInit(): void {
    this.prestationService.getAllPrestations().subscribe((prestations) => {
      const listeDesPrestations : Prestation[] = prestations.map(prestation => Object.assign(prestation,{acquis : false}))
      this.employeEdit = {
        _id : '0',
        absences : [],
        jourTravaille : [],
        listeDesPrestations : listeDesPrestations,
        nom : '',
        pauseEntrePrestation : 0,
        photo : '',
        profession : 'masseuse',
        hasBeenUpdate : false
      }
    })

    this.administrationService.getEmployes().subscribe(employes => {
      this.employees = employes
    })
  }

  compressImage(src:any, newX:number, newY:number) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx?.drawImage(img, 0, 0, newX, newY);
        const data = ctx?.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }

  findEmployeById(id: string) : Employe{
    const employeToReturn = this.employees.find(employe => employe._id === id)

    if(employeToReturn){
      return employeToReturn
    }else{
      return this.employeEdit
    }
  }

  selectFile(event:any, id?:string){

    const employeToUpdate = id ? this.findEmployeById(id) : this.employeEdit
    console.log(employeToUpdate)
    if(event.target.files[0]){
      var self = this
      const imageBlob = event.target.files[0]
      const ext = imageBlob.name.split('.').pop().toLowerCase()
      var reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = function() {
        var base64data = reader.result?.toString();
        self.compressImage(base64data, 332, 415).then((compressed:any) => {
          employeToUpdate.image = {
            base64 : compressed.split(',')[1],
            ext:ext
          }
            employeToUpdate.photo = self._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + compressed.split(',')[1]);

          employeToUpdate.hasBeenUpdate = true
        })
      }
    }
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

  generateImageData(employe:Employe, image : any){
    const imageStoragePath = `./src/public/${employe._id}.${image.ext}`
    const imageFrontPath= `http://localhost:3000/public/${employe._id}.${image.ext}`

    const imageEmployeData  =  {
      imagebase64 : image.base64,
      imageStoragePath : imageStoragePath,
      imageFrontPath : imageFrontPath,
      _id: employe._id
    }
    return imageEmployeData
  }

  addNewEmploye(){
    this.employeEdit.photo = ''
    const image = JSON.parse(JSON.stringify(this.employeEdit.image))
    delete this.employeEdit.image

    this.administrationService.addNewEmploye(this.employeEdit).subscribe((employe:Employe) =>{
      const imageEmployeData = this.generateImageData(employe, image)
      this.administrationService.addNewImage(imageEmployeData).subscribe(() =>{
        employe.photo = imageEmployeData.imageFrontPath
        this.employees = [...this.employees, employe]
      })
    })
  }

  deleteEmploye(id:string){
    this.administrationService.deleteEmploye(id).subscribe(() => {
      const indexEmployeToRemove = this.employees.findIndex(employe => employe._id === id)
      this.employees.splice(indexEmployeToRemove,1)
    })
  }

  updateEmploye(employee_ID : string){
    const employee = this.findEmployeById(employee_ID)
    if(employee.image){
      const image = JSON.parse(JSON.stringify(employee.image))
      const imageEmployeData = this.generateImageData(employee, image)
      this.administrationService.addNewImage(imageEmployeData).subscribe(() =>{
        employee.photo = imageEmployeData.imageFrontPath
      })
    }
    this.administrationService.updateEmployeData(employee)
    employee.hasBeenUpdate = false
  }

  showAbsence(employeeId: string) {

    const employees = this.employees
    const indexOfEmployeeToUpdate = employees.findIndex(employee => employee._id === employeeId)
    this.administrationService.absenceEmployeeTemporaire.data = [...employees[indexOfEmployeeToUpdate].absences]
    this.administrationService.absenceEmployeeTemporaire.id = employeeId
    this.administrationService.actualNumberOfMonthAdded = 0
    this.administrationService.generateEmployeScheduleDatesOfCurrentMonth()

    const confirmDialog = this.dialog.open(ScheduleDialogComponent, {
      maxWidth: '50vh',
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        employees[indexOfEmployeeToUpdate].hasBeenUpdate = this.absenceArrayHasChanged(employees[indexOfEmployeeToUpdate].absences,this.administrationService.absenceEmployeeTemporaire.data)
        employees[indexOfEmployeeToUpdate].absences = this.administrationService.absenceEmployeeTemporaire.data
      }
      this.administrationService.absenceEmployeeTemporaire.data = []
    })
  }

  absenceArrayHasChanged(absenceEmployee : any[] , absenceEmployeeTemporaire : any[] ) : boolean{

    absenceEmployee = absenceEmployee.map((absenceEmployee: any) => {
      if(absenceEmployee instanceof Date){
        return absenceEmployee.toDateString()
      }else{
        return new Date(absenceEmployee).toDateString()
      }
    })

    absenceEmployeeTemporaire = absenceEmployeeTemporaire.map((absenceEmployee: any) => {
      if(absenceEmployee instanceof Date){
        return absenceEmployee.toDateString()
      }else{
        return new Date(absenceEmployee).toDateString()
      }
    })

    let absenceArrayHasChanged : boolean = false
    if(absenceEmployeeTemporaire.length !== absenceEmployee.length) return true
    for(let absEmp of absenceEmployee){
      let isContain : boolean = false
      for(let absTmp of absenceEmployeeTemporaire){
        if(absTmp === absEmp){
          isContain = true
        }
      }
      if(!isContain){
        absenceArrayHasChanged = true
        break;
      }
    }
    return absenceArrayHasChanged
  }
}

