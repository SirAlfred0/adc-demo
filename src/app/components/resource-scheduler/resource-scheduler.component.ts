import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { ADCIDateAdapter, ADCIDateFormatter, ADCILabels, ADC_DATE_ADAPTER, ADC_DATE_FORMATTER, ADC_LABELS } from '@asadi/angular-date-components/core';
import { ADCIResourceSchedulerEvent, ADCIResourceSchedulerEventSelectEvent, ADCIResourceSchedulerResource, ADCIResourceSchedulerTableEvent } from "@asadi/angular-date-components/resource-scheduler";
import { DateAdapterEnglish } from 'src/app/helper/date-adapter-english';
import { DateAdapterPersian } from 'src/app/helper/date-adapter-persian';
import { DateFormatterEnglish } from 'src/app/helper/date-formatter-english';
import { DateFormatterPersian } from 'src/app/helper/date-formatter-persian';
import { DependencyHolder } from 'src/app/helper/dependencyHolder';
import { ADCResourceSchedulerSource } from "@asadi/angular-date-components/resource-scheduler";
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'jalali-moment';
import { MatDialog } from '@angular/material/dialog';
import { ResourceEventCreateComponent } from '../resource-event-create/resource-event-create.component';
import { EventsService } from 'src/app/services/events.service';
import { ResourceEventUpdateComponent } from '../resource-event-update/resource-event-update.component';
import { ADCISchedulerView } from '@asadi/angular-date-components/scheduler';
import { ResourceSchedulerCustomViewComponent } from '../resource-scheduler-custom-view/resource-scheduler-custom-view.component';


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
    year: 'سال',
    daysOfWeek: [
      'یکشنبه',
      'دوشنبه',
      'سه شنبه',
      'چهارشنبه',
      'پنج شنبه',
      'جمعه',
      'شنبه'
    ],
    monthsOfYear: {
      // 'فروردین': '',
      // 'اردیبهشت': '',
      // 'خرداد': '',
      // 'تیر': '',
      // 'مرداد': '',
      // 'شهریور': '',
      // 'مهر': '',
      // 'آبان': '',
      // 'آذر': '',
      // 'دی': '',
      // 'بهمن': '',
      // 'اسفند': '',
      'January': 'ژانویه',
      'February': 'فوریه',
      'March': 'مارس',
      'April': 'اوریل',
      'May': 'مه',
      'June': 'ژوئن',
      'July': 'ژوئیه',
      'August': 'اوت',
      'September': 'سپتامبر',
      'October': 'اکتبر',
      'November': 'نوامبر',
      'December': 'دسامبر',
    },
  };

  const en_labels: ADCILabels = {
    day: 'day',
    month: 'month',
    today: 'today',
    week: 'week',
    year: 'year',
    daysOfWeek: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    monthsOfYear: {
      'فروردین': 'Farvardin',
      'اردیبهشت': 'ordibehesht',
      'خرداد': 'khordad',
      'تیر': 'tir',
      'مرداد': 'mordad',
      'شهریور': 'shahrivar',
      'مهر': 'mehr',
      'آبان': 'aban',
      'آذر': 'azar',
      'دی': 'day',
      'بهمن': 'bahman',
      'اسفند': 'esfand',
      // 'January': 'ژانویه',
      // 'February': 'فوریه',
      // 'March': 'مارس',
      // 'April': 'اوریل',
      // 'May': 'مه',
      // 'June': 'ژوئن',
      // 'July': 'ژوئیه',
      // 'August': 'اوت',
      // 'September': 'سپتامبر',
      // 'October': 'اکتبر',
      // 'November': 'نوامبر',
      // 'December': 'دسامبر',
    },
  }

  return dep.language == 'fa' ? fa_labels : en_labels;
}

@Component({
  selector: 'app-resource-scheduler',
  templateUrl: './resource-scheduler.component.html',
  styleUrls: ['./resource-scheduler.component.css'],
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
export class ResourceSchedulerComponent implements OnInit, AfterContentInit{ 

  customView: ADCISchedulerView = {
    component: ResourceSchedulerCustomViewComponent,
    id: 'custom-resource-scheduler-view',
    name: 'Two Month (custom view)'
  }


  form: FormGroup = new FormGroup({
    WeekEnd: new FormControl([5,6]),
    Holidays: new FormArray<FormControl>([
      new FormControl('2023-10-07'),
      new FormControl('2023-10-08')
    ]),
    Views: new FormControl(['day', 'week', 'month']),
    StartOf: new FormControl(this.dependencyHolder.startOf),
    DisablePrevious: new FormControl(false),
    DisableToday: new FormControl(false),
    DisableNext: new FormControl(false),
  });

  @ViewChild(ADCResourceSchedulerSource) resourceSchedulerDataSource = {} as ADCResourceSchedulerSource;

  private isViewLoadedOnce = false;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private dependencyHolder: DependencyHolder
  )
  {}

  holidays: string[] = [];

  ngOnInit(): void
  {
    this.HolidaysForm.valueChanges.subscribe(data => {
      this.holidays = [];
      data.forEach((item: any) => {
        const holiday = moment(item).format('YYYY-MM-DD');

        this.holidays.push(holiday);
      })
    })

    this.loadResources();
    this.loadEvents();
  }

  ngAfterContentInit(): void {
  }

  loadResources(): void
  {
    this.eventsService.listResource().subscribe(resources => {
      this.resourceSchedulerDataSource.resources = resources;
    });
  }

  loadEvents(): void
  {
    this.eventsService.listResourceEvents().subscribe(events => {

      // if(this.isViewLoadedOnce) return;

      this.resourceSchedulerDataSource.events = events;
      this.isViewLoadedOnce = true;
    });
  }

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

  onEventClick(e: ADCIResourceSchedulerEventSelectEvent): void
  {
    console.log('event clicked: ', e.event);

    const dialogRef = this.dialog.open(ResourceEventUpdateComponent, {
      data: {
        event: e.event,
        roomList: this.resourceSchedulerDataSource.resources
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
    const dialogRef = this.dialog.open(ResourceEventCreateComponent, {
      data: {
        event: event,
        roomList: this.resourceSchedulerDataSource.resources
      }
    });

    dialogRef.afterClosed().subscribe((isChanged: boolean) => {
      if(isChanged && isChanged == true)
      {
        this.loadEvents();
      }
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

  get startOf(): string
  {
    return this.form.controls['StartOf'].value;
  }

  get disablePrevious(): boolean
  {
    return this.form.controls['DisablePrevious'].value
  }

  get disableToday(): boolean
  {
    return this.form.controls['DisableToday'].value
  }

  get disableNext(): boolean
  {
    return this.form.controls['DisableNext'].value
  }

  addNewHoliday(): void
  {
    this.HolidaysForm.push(new FormControl(moment().format('YYYY-MM-DD')));
  }
}
