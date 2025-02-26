import { Injectable } from '@angular/core';
import { ADCIResourceSchedulerEvent, ADCIResourceSchedulerResource } from '@asadi/angular-date-components/resource-scheduler';
import { ADCISchedulerEvent } from '@asadi/angular-date-components/scheduler';


export class DataService {

  private events: ADCISchedulerEvent[] = [
    {
      id: '1',
      bgColor: '#f00',
      endDate: '2025-02-15',
      startDate: '2025-02-10',
      title: 'hello',
      allDay: true,
      isClickable: true,
      tooltip: 'this is a long tooltip test, full on non-sense text just for testing',
    }
  ];

  private resources: ADCIResourceSchedulerResource[] = [
    {
      id: 1,
      title: 'Room 1'
    },
    {
      id: 2,
      title: 'Room 2'
    },
    {
      id: 3,
      title: 'Room 3'
    },
    {
      id: 4,
      title: 'Room 4'
    }
  ];
  
  private resourceEvents: ADCIResourceSchedulerEvent[] = [];

  constructor() { }

  add(data: any): boolean
  {
    const maxId = this.events.map((e: ADCISchedulerEvent) => +e.id).sort((a,b) => a - b).reverse()[0] ?? 0;
    data.id = maxId + 1;

    this.events.push(data);
    return true;
  }

  update(data: ADCISchedulerEvent): boolean
  {
    const index = this.events.findIndex(e => +e.id == +data.id);

    if(index == -1) return false;

    this.events[index] = data;
    return true;
  }

  getList(): ADCISchedulerEvent[]
  {
    return this.events;
  }

  addResourceScheduler(data: any): boolean
  {
    const maxId = this.resourceEvents.map((e: ADCIResourceSchedulerEvent) => +e.id).sort((a,b) => a - b).reverse()[0] ?? 0;
    data.id = maxId + 1;

    this.resourceEvents.push(data);
    return true;
  }

  updateResourceScheduler(data: any): boolean
  {
    const index = this.resourceEvents.findIndex(e => +e.id == +data.id);

    if(index == -1) return false;

    this.resourceEvents[index] = data;
    return true;
  }

  getListResourceSchedulerEvent(): ADCIResourceSchedulerEvent[]
  {
    return this.resourceEvents;
  }

  getListResourceSchedulerResource(): ADCIResourceSchedulerResource[]
  {
    return this.resources;
  }
}
