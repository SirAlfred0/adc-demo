import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'jalali-moment';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent {

  form: FormGroup = new FormGroup({
    startDate: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    endDate: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    bgColor: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    title: new FormControl(null, {validators: Validators.compose([Validators.required])}),
    startTime: new FormControl(null),
    endTime: new FormControl(null),
    allDay: new FormControl(true),
    id: new FormControl(null),
    tooltip: new FormControl(null),
    isClickable: new FormControl(false),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EventEditComponent>,
    private eventsService: EventsService,
  ) {}

  ngOnInit(): void {
    this.setFormValues();
  }

  setFormValues(): void
  {
    const event = this.data.event;

    this.form.setValue({
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      bgColor: event.bgColor,
      title: event.title,
      startTime: event.startTime?.substring(0,5) ?? null,
      endTime:  event.endTime?.substring(0,5) ?? null,
      allDay: event.allDay === true ? true : false,
      id: event.id,
      tooltip: event.tooltip,
      isClickable: event.isClickable
    })

  }

  get colorValue(): string
  {
    return this.form.controls['bgColor'].value as string;
  }
  
  onSubmit(): void
  {
    const model = {...this.form.value};

    model.startDate = moment.from(model.startDate, 'en').format('YYYY-MM-DD');
    model.endDate = moment.from(model.endDate, 'en').format('YYYY-MM-DD');

    this.eventsService.update(model).subscribe({
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
