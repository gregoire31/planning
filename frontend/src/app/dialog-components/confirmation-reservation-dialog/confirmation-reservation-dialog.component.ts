import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation-reservation-dialog',
  templateUrl: './confirmation-reservation-dialog.component.html',
  styleUrls: ['./confirmation-reservation-dialog.component.scss']
})
export class ConfirmationReservationDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmationReservationDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
