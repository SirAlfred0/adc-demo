import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ADC_DATE_ADAPTER, ADC_DATE_FORMATTER, ADCIDateAdapter, ADCIDateFormatter, ADCILabels, ADC_LABELS } 
from '@asadi/angular-date-components/core';
import { ADCISchedulerEvent, ADCISchedulerEventSelectEvent, ADCISchedulerView }from "@asadi/angular-date-components/scheduler"; 
import { ADCSchedulerSource } from '@asadi/angular-date-components/scheduler';
import * as moment from 'jalali-moment';
import { DateAdapterPersian } from 'src/app/helper/date-adapter-persian';
import { DateAdapterEnglish } from 'src/app/helper/date-adapter-english';
import { DateFormatterPersian } from 'src/app/helper/date-formatter-persian';
import { DateFormatterEnglish } from 'src/app/helper/date-formatter-english';
import { DependencyHolder } from 'src/app/helper/dependencyHolder';
import { EventCreateComponent } from '../event-create/event-create.component';
import { EventsService } from 'src/app/services/events.service';
import { EventEditComponent } from '../event-edit/event-edit.component';
import { SchedulerCustomViewComponent } from '../scheduler-custom-view/scheduler-custom-view.component';


function AdapterResolver(dep: DependencyHolder): ADCIDateAdapter
{
  const Type = dep.calendarType;

  return Type == 1 ? new DateAdapterPersian() : new DateAdapterEnglish();
}

function FormatterResolver(dep: DependencyHolder): ADCIDateFormatter
{
  const Type = dep.calendarType;

  return Type == 1 ? new DateFormatterPersian() : new DateFormatterEnglish();
}

function jcLabels(dep: DependencyHolder): ADCILabels
{
  const fa_labels: ADCILabels = {
    day: 'روز',
    month: 'ماه',
    today: 'امروز',
    week: 'هفته',
    year: 'سال'
  };

  const en_labels: ADCILabels = {
    day: 'day',
    month: 'month',
    today: 'today',
    week: 'week',
    year: 'year'
  }

  return dep.language == 'fa' ? fa_labels : en_labels;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [
    {
      provide: ADC_DATE_ADAPTER,
      useFactory: AdapterResolver,
      deps: [DependencyHolder]
    },
    {
      provide: ADC_DATE_FORMATTER,
      useFactory: FormatterResolver,
      deps: [DependencyHolder]
    },
    {
      provide: ADC_LABELS,
      useFactory: jcLabels,
      deps: [DependencyHolder]
    },
  ]
})
export class SchedulerComponent implements OnInit {


  customView: ADCISchedulerView = {
    component: SchedulerCustomViewComponent,
    id: 'custom-scheduler-view',
    name: 'Two Month (custom view)'
  } 

  form: FormGroup = new FormGroup({
    WeekEnd: new FormControl([5,6]),
    Holidays: new FormArray<FormControl>([
      new FormControl('2023-10-07'),
      new FormControl('2023-10-08')
    ]),
    Views: new FormControl(['day', 'week', 'month']),
  });

  @ViewChild(ADCSchedulerSource) adcEventsSource: ADCSchedulerSource = {} as ADCSchedulerSource;

  constructor(
    private dialog: MatDialog,
    private eventService: EventsService
  )
  {

  }

  ngOnInit(): void {
    this.HolidaysForm.valueChanges.subscribe(data => {
      this.holidays = [];
      data.forEach((item: any) => {
        const holiday = moment(item).format('YYYY-MM-DD');

        this.holidays.push(holiday);
      })
    })
  }

  holidays: string[] = [];

  onDateChange(date: any): void
  {
    console.log('Date Change called', date);

    this.loadEvents();
  }

  onNext(): void
  {
    console.log('Next called');
  }

  onPrevius(): void
  {
    console.log('Previous called');
  }

  onViewChange(view: string): void
  {
    console.log('View Changed', view);
  }

  onEventClick(e: ADCISchedulerEventSelectEvent): void
  {
    console.log('event clicked: ', e.event);

    const dialogRef = this.dialog.open(EventEditComponent, {
      data: {
        event: e.event
      }
    })

    dialogRef.afterClosed().subscribe((isChanged: boolean) => {
      if(isChanged && isChanged == true)
      {
        this.loadEvents();
      }
    })
  }

  onDateSelect(event: any): void
  {
    console.log('date selected:', event);
    const dialogRef = this.dialog.open(EventCreateComponent, {
      data: {
        event: event
      }
    });

    dialogRef.afterClosed().subscribe((isChanged: boolean) => {
      if(isChanged && isChanged == true)
      {
        this.loadEvents();
      }
    })
  }

  private loadEvents(): void
  {
    this.eventService.list().subscribe({
      next: (res: ADCISchedulerEvent[]) =>
      {
        this.adcEventsSource.events = res;
      },
    })
  }

  get HolidaysForm(): FormArray<FormControl>
  {
    return this.form.controls['Holidays'] as FormArray<FormControl>;
  }

  get weekEnds(): number[]
  {
    return this.form.controls['WeekEnd'].value
  }
  
  get Views(): string[]
  {
    return this.form.controls['Views'].value;
  }

  addNewHoliday(): void
  {
    this.HolidaysForm.push(new FormControl(moment().format('YYYY-MM-DD')));
  }
}
