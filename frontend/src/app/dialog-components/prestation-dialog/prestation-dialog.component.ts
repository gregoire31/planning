import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prestation } from 'src/app/models/prestation.model';

@Component({
  selector: 'app-prestation-dialog',
  templateUrl: './prestation-dialog.component.html',
  styleUrls: ['./prestation-dialog.component.scss']
})
export class PrestationDialogComponent {

  constructor(public dialogRef: MatDialogRef<PrestationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public prestations: Prestation[]) { }

    updatePrestation(prestation:Prestation){
      prestation.acquis = !prestation.acquis
    }
    updateWeekWork(){

    }


}
