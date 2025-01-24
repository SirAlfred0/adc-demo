import { Injectable } from '@angular/core';
import { ADCIResourceSchedulerEvent, ADCIResourceSchedulerResource } from '@asadi/angular-date-components/resource-scheduler';
import { ADCISchedulerEvent } from '@asadi/angular-date-components/scheduler';


export class DataService {

  private events: ADCISchedulerEvent[] = [
    {
      startDate: '2023-10-03T12:00:00',
      endDate: '2023-10-23T06:00:00',
      bgColor: 'red',
      title: 'ترم والد',
      id: '1',
      startTime: '12:00:00',
      endTime: '06:15:00'
    },
    {
      startDate: '2023-10-03T12:00:00',
      endDate: '2023-10-23T06:00:00',
      bgColor: 'violet',
      title: 'ترم والد',
      id: '11',
      startTime: '12:00:00',
      endTime: '06:15:00'
    },
    {
      startDate: '2023-10-03T12:00:00',
      endDate: '2023-10-23T06:00:00',
      bgColor: 'black',
      title: 'ترم والد',
      id: '12',
      startTime: '12:00:00',
      endTime: '06:15:00'
    },
    {
      startDate: '2023-10-07T00:00:00',
      endDate: '2023-10-13T12:00:00',
      bgColor: 'blue',
      title: 'زیر ترم',
      id: '2',
      startTime: '00:00:00',
      endTime: '12:00:00'
    },
    {
      startDate: '2023-10-07',
      endDate: '2023-10-10',
      bgColor: 'green',
      title: 'رویداد زیر ترم',
      id: '3',
    },
    {
      startDate: '2023-10-09',
      endDate: '2023-10-13T12:00:00',
      bgColor: 'purple',
      title: 'رویداد دوم زیر ترم',
      id: '4',
      endTime: '12:00:00'
    },
    {
      startDate: '2023-10-09T06:00:00',
      endDate: '2023-10-13',
      bgColor: 'pink',
      title: 'رویداد سوم زیر ترم',
      id: '94',
      startTime: '06:00:00',
    },
    {
      endDate: '2025-01-19',
      startDate: '2025-01-19',
      bgColor: 'green',
      title: 'تست یک روز از 45 تا 15',
      id: '95',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: false
    },
    {
      endDate: '2025-01-20',
      startDate: '2025-01-20',
      bgColor: 'green',
      title: 'تست یک روز از 45 تا 15',
      id: '96',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: false
    },
    {
      endDate: '2025-01-21',
      startDate: '2025-01-21',
      bgColor: 'green',
      title: 'تست یک روز از 45 تا 15',
      id: '97',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: false
    },
    {
      endDate: '2025-01-22',
      startDate: '2025-01-22',
      bgColor: 'green',
      title: 'تست یک روز از 45 تا 15',
      id: '98',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: false
    },
    {
      endDate: '2025-01-23',
      startDate: '2025-01-23',
      bgColor: 'green',
      title: 'تست یک روز از 45 تا 15',
      id: '99',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: false
    },
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
  
  private resourceEvents: ADCIResourceSchedulerEvent[] = [
    {
      bgColor: 'red',
      endDate: '2024-01-30T00:00:00',
      startDate: '2024-01-26T00:00:00',
      resourceId: 1,
      id: 1,
      title: 'test event',
      startTime: '18:30:00',
      endTime: '21:45:00',
      allDay: false,
    },
    {
      bgColor: 'blue',
      endDate: '2024-02-15',
      startDate: '2023-12-25',
      resourceId: 1,
      id: 2,
      title: 'test event',
      startTime: '18:00:00',
      endTime: '18:00:00',
      allDay: false,
    },
    {
      bgColor: 'green',
      endDate: '2024-01-15',
      startDate: '2023-12-25',
      resourceId: 1,
      id: 3,
      title: 'test event',
      startTime: '18:00:00',
      endTime: '12:00:00',
      allDay: false,
    },
    {
      bgColor: 'violet',
      endDate: '2024-02-15',
      startDate: '2024-01-14',
      resourceId: 1,
      id: 4,
      title: 'test event',
      startTime: '15:00:00',
      endTime: '18:00:00',
      allDay: false,
    },
    {
      bgColor: 'purple',
      endDate: '2024-01-14',
      startDate: '2024-01-14',
      resourceId: 1,
      id: 5,
      title: 'test event',
      startTime: '09:00:00',
      endTime: '21:00:00',
      allDay: false,
    },
    {
      bgColor: 'red',
      endDate: '2024-01-30T00:00:00',
      startDate: '2024-01-26T00:00:00',
      resourceId: 3,
      id: 6,
      title: 'test event',
      startTime: '18:00:00',
      endTime: '18:00:00',
      allDay: false,
    },
    {
      bgColor: 'blue',
      endDate: '2024-02-15',
      startDate: '2023-12-25',
      resourceId: 3,
      id: 7,
      title: 'test event',
      startTime: '12:30:00',
      endTime: '18:00:00',
      allDay: false,
    },
    {
      bgColor: 'green',
      endDate: '2024-01-15',
      startDate: '2023-12-25',
      resourceId: 3,
      id: 8,
      title: 'test event',
      endTime: '12:00:00',
      allDay: false,
    },
    {
      bgColor: 'violet',
      endDate: '2024-02-15',
      startDate: '2024-01-14',
      resourceId: 3,
      id: 9,
      title: 'test event',
      startTime: '15:00:00',
      endTime: '18:00:00',
      allDay: false,
    },
    {
      bgColor: 'purple',
      endDate: '2025-01-08',
      startDate: '2025-01-08',
      resourceId: 3,
      id: 10,
      title: 'test event',
      startTime: '09:00:00',
      endTime: '21:00:00',
      allDay: true,
    },
  ];

  constructor() { }

  add(data: any): boolean
  {
    const maxId = this.events.map((e: ADCISchedulerEvent) => +e.id).sort((a,b) => a - b).reverse()[0];
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
    const maxId = this.resourceEvents.map((e: ADCIResourceSchedulerEvent) => +e.id).sort((a,b) => a - b).reverse()[0];
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
