import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  form: FormGroup = new FormGroup({
    startDate: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    endDate: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    bgColor: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    title: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    startTime: new FormControl(null),
    endTime: new FormControl(null),
    allDay: new FormControl(true),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EventCreateComponent>,
    private eventsService: EventsService,
  ) {}

  ngOnInit(): void {
    this.setFormValues();
  }

  setFormValues(): void
  {
    const startDate = (this.data.startDate as string);
    const endDate = (this.data.endDate as string);
    const startTime = startDate.split('T')[1].substring(0, 5);
    const endTime = endDate.split('T')[1].substring(0, 5);

    this.form.controls['startDate'].setValue(startDate.split('T')[0]);
    this.form.controls['endDate'].setValue(endDate.split('T')[0]);
    this.form.controls['startTime'].setValue(startTime);
    this.form.controls['endTime'].setValue(endTime);
  }

  get colorValue(): string
  {
    return this.form.controls['bgColor'].value as string;
  }
  
  onSubmit(): void
  {
    this.eventsService.create(this.form.value).subscribe({
      next: () => {
        this.dialogRef.close(true);
      }
    });
  }

  onClose(): void 
  {
    this.dialogRef.close();
  }
}
