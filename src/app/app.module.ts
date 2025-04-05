import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ADCSchedulerComponent } from "@asadi/angular-date-components/scheduler";
import { ADCResourceSchedulerComponent } from "@asadi/angular-date-components/resource-scheduler";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';


import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { ResourceSchedulerComponent } from './components/resource-scheduler/resource-scheduler.component';
import { ResourceEventCreateComponent } from './components/resource-event-create/resource-event-create.component';
import { ResourceEventUpdateComponent } from './components/resource-event-update/resource-event-update.component';
import { SchedulerCustomViewComponent } from './components/scheduler-custom-view/scheduler-custom-view.component';
import { ResourceSchedulerCustomViewComponent } from './components/resource-scheduler-custom-view/resource-scheduler-custom-view.component';
import { ADCTableComponent } from '@asadi/angular-date-components/core';
import { MatDividerModule} from '@angular/material/divider';


@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    EventCreateComponent,
    EventEditComponent,
    ResourceSchedulerComponent,
    ResourceEventCreateComponent,
    ResourceEventUpdateComponent,
    SchedulerCustomViewComponent,
    ResourceSchedulerCustomViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ADCSchedulerComponent,
    ADCResourceSchedulerComponent,
    ADCTableComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




