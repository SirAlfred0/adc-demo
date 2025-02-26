import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'jalali-moment';
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
    tooltip: new FormControl(null),
    allDay: new FormControl(true),
    isClickable: new FormControl(true),
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
    const event = this.data.event;
    
    const startDate = event.startDate;
    const endDate = event.endDate;
    const startTime = event.startTime
    const endTime = event.endTime;

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
    const command = {...this.form.value};

    command.startDate = moment(command.startDate).format('YYYY-MM-DD');
    command.endDate = moment(command.endDate).format('YYYY-MM-DD');

    this.eventsService.create(command).subscribe({
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
