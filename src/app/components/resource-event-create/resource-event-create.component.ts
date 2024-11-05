import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ADCIResourceSchedulerTableEvent } from '@asadi/angular-date-components/resource-scheduler';
import * as moment from 'jalali-moment';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-resource-event-create',
  templateUrl: './resource-event-create.component.html',
  styleUrls: ['./resource-event-create.component.css']
})
export class ResourceEventCreateComponent {

  form: FormGroup = new FormGroup({
    startDate: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    endDate: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    bgColor: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    title: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    resourceId: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    startTime: new FormControl(null),
    endTime: new FormControl(null),
    allDay: new FormControl(true),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ResourceEventCreateComponent>,
    private eventsService: EventsService,
  ) {}

  ngOnInit(): void {
    this.setFormValues();
  }

  setFormValues(): void
  {
    const event = (this.data.event) as ADCIResourceSchedulerTableEvent;

    this.form.controls['startDate'].setValue(event.startDate.split('T')[0]);
    this.form.controls['endDate'].setValue(event.endDate.split('T')[0]);
    this.form.controls['startTime'].setValue(event.startTime);
    this.form.controls['endTime'].setValue(event.endTime);
    this.form.controls['resourceId'].setValue(event.resourceId);
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

    this.eventsService.createResourceEvent(command).subscribe({
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
