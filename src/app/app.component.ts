import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ADC_OPTIONS } from '@asadi-m/angular-date-components/core';
import { SchedulerOptionsPersian } from './helper/scheduler-options-persian';
import { DependencyHolder } from './helper/dependencyHolder';


const options: SchedulerOptionsPersian = new SchedulerOptionsPersian();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: ADC_OPTIONS,
      useValue: options
    }
  ]
})
export class AppComponent implements OnInit {

  loading: boolean = true;

  form: FormGroup = new FormGroup({
    CalendarType: new FormControl(this.depHolder.calendarType),
    Direction: new FormControl(options.direction),
    InitialView: new FormControl(options.initialView),
    Language: new FormControl(this.depHolder.language)
  });

  constructor(
    private depHolder: DependencyHolder,
  )
  { 
  }

  ngOnInit(): void {
    this.loading = false;
  }

  onSubmit(): void
  {
    this.loading = true;
    const formValue = this.form.value;
    options.direction = formValue.Direction;
    options.initialView = formValue.InitialView;
    this.depHolder.calendarType = formValue.CalendarType;
    this.depHolder.language = formValue.Language;


    setTimeout(() => {
      this.loading = false;
    }, 500)
  }
}
