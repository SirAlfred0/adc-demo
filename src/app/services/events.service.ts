import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, delay, of } from 'rxjs';
import { ADCIEvent } from '@asadi/angular-date-components/core';

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


  list(): Observable<ADCIEvent[]>
  {
    return of(this.dataService.getList()).pipe(
      delay(500)
    );
  }

}
