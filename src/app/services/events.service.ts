import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, delay, of } from 'rxjs';
import { ADCISchedulerEvent } from '@asadi-m/angular-date-components/scheduler';
import { ADCIResourceSchedulerEvent, ADCIResourceSchedulerResource } from '@asadi-m/angular-date-components/resource-scheduler';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  dataService: DataService = new DataService();
  constructor(
  ) { }

  create(data: any): Observable<boolean>
  {
    return of(this.dataService.add(data)).pipe(
      delay(500)
    );
  }

  update(data: any): Observable<boolean>
  {
    return of(this.dataService.update(data)).pipe(
      delay(500)
    );
  }


  list(): Observable<ADCISchedulerEvent[]>
  {
    return of(this.dataService.getList()).pipe(
      delay(500)
    );
  }

  createResourceEvent(data: any): Observable<boolean>
  {
    return of(this.dataService.addResourceScheduler(data)).pipe(
      delay(500)
    );
  }

  updateResourceEvent(data: any): Observable<boolean>
  {
    return of(this.dataService.updateResourceScheduler(data)).pipe(
      delay(500)
    );
  }

  listResourceEvents(): Observable<ADCIResourceSchedulerEvent[]>
  {
    return of(this.dataService.getListResourceSchedulerEvent()).pipe(
      delay(500)
    );
  }

  listResource(): Observable<ADCIResourceSchedulerResource[]>
  {
    return of(this.dataService.getListResourceSchedulerResource()).pipe(
      delay(500)
    );
  }

}
