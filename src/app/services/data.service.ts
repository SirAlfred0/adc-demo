import { Injectable } from '@angular/core';
import { ADCIEvent } from '@asadi/angular-date-components/core';


export class DataService {

  private events: ADCIEvent[] = [
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
      id: '5',
      startTime: '06:00:00',
    },
    {
      startDate: '2023-10-09T06:00:00',
      endDate: '2023-10-13T12:30:00',
      bgColor: 'orange',
      title: 'رویداد چهارم زیر ترم',
      id: '6',
      startTime: '06:00:00',
      endTime: '12:30:00'
    },
    {
      startDate: '2023-09-25T12:00:00',
      endDate: '2023-09-25',
      bgColor: 'orange',
      title: 'تست یک روزه',
      id: '7',
      startTime: '12:00:00',
    },
    {
      startDate: '2023-11-11T12:30:00',
      endDate: '2023-11-16T23:15:00',
      bgColor: 'orange',
      title: 'تست ماه بعد',
      id: '8',
      startTime: '12:30:00',
      endTime: '23:15:00'
    },
    {
      startDate: '2023-11-11T12:15:00',
      endDate: '2023-11-11T18:45:00',
      bgColor: 'blue',
      title: 'تست یک روز از 15 تا 45',
      id: '9',
      startTime: '12:15:00',
      endTime: '18:45:00'
    },
    {
      startDate: '2023-11-11T12:45:00',
      endDate: '2023-11-11T18:15:00',
      bgColor: 'red',
      title: 'تست یک روز از 45 تا 15',
      id: '10',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: true
    },
    {
      startDate: '2023-11-11T12:45:00',
      endDate: '2023-11-11T18:15:00',
      bgColor: 'green',
      title: 'تست یک روز از 45 تا 15',
      id: '13',
      startTime: '12:45:00',
      endTime: '18:15:00',
      allDay: false
    },
  ];

  constructor() { }

  add(data: any): boolean
  {
    const maxId = this.events.map((e: ADCIEvent) => +e.id).sort((a,b) => a - b).reverse()[0];
    data.id = maxId + 1;
    console.log(data);
    this.events.push(data);
    return true;
  }

  update(data: ADCIEvent): boolean
  {
    const index = this.events.findIndex(e => +e.id == +data.id);
    console.log(index);
    if(index == -1) return false;

    this.events[index] = data;
    return true;
  }

  getList(): ADCIEvent[]
  {
    return this.events;
  }
}
