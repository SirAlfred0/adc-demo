import { Component } from '@angular/core';
import { ADCDateSplitter, ADCITableCell, ADCITableColumn, ADCITableEvent, ADCITableEventSelectEvent, ADCITableRow } from '@asadi/angular-date-components/core';
import { ADCIResourceSchedulerEvent, ADCIResourceSchedulerResource, ADCIResourceSchedulerTableEvent, AdcResourceSchedulerBaseViewComponent } from '@asadi/angular-date-components/resource-scheduler';

@Component({
  selector: 'app-resource-scheduler-custom-view',
  templateUrl: './resource-scheduler-custom-view.component.html',
  styleUrls: ['./resource-scheduler-custom-view.component.css']
})
export class ResourceSchedulerCustomViewComponent extends AdcResourceSchedulerBaseViewComponent {
  
  private month: number = 0;
  private year: number = 0;
  private totalWeeksOfMonths: string[] = [];

  dateSplitter: ADCDateSplitter = this.dateFormatter.DateSplitter;

  events: ADCIResourceSchedulerEvent[] = [];
  resources: ADCIResourceSchedulerResource[] = [];

  columns: ADCITableColumn[] = [];
  rows: ADCITableRow[] = [];
  cells: ADCITableCell[] = [];
  tableEvents: ADCITableEvent[] = [];

  title: string = '';

  monthsOfYear: string[] = this.dateAdapter.getMonthsOfYear();
  daysOfweek: string[] = this.dateAdapter.getDaysOfWeek();

  viewStart: string = '';
  viewEnd: string = '';

  constructor() {
    super();
    // this.monthsOfYear = this.dateAdapter.getMonthsOfYear();
    // this.daysOfweek = this.dateAdapter.getDaysOfWeek();
  }

  override nextButtonHandler(): void {

    this.month++;
    if(this.month > 5)
    {
      this.month = 0;
      this.year++;
    }

    this.calculateCurrentDate();
  }

  override previousButtonHandler(): void {

    this.month--;
    if(this.month < 0)
    {
      this.month = 5;
      this.year--;
    }

    this.calculateCurrentDate();
  }

  override todayButtonHandler(): void {
    this.year = this.dateAdapter.getCurrentYear();
    const m = this.dateAdapter.getCurrentMonth();

    this.month = m % 2 == 0 ? ((m - 2) / 2) : ((m - 1) / 2);

    this.calculateCurrentDate();
  }

  get isViewReady(): boolean
  {
    return this.rows.length != 0 && this.columns.length != 0 && this.cells.length != 0;
  }
  
  get hasResources(): boolean
  {
    return this.resources.length != 0;
  }

  override eventChangesHandler(): void {
    this.tableEvents = [];

    if(this.isViewReady == false) return;

    this.events = this.resourceSchedulerSource.getEvents(this.viewStart, this.viewEnd);

    this.events.forEach((e: ADCIResourceSchedulerEvent) => {

      const row = this.cells.filter((cell: ADCITableCell) => +cell.rowValue == +e.resourceId);

      if(row.length == 0) return;

      const startCell = row.filter((cell: ADCITableCell) => cell.value.toString().split('T')[0] == e.startDate.split('T')[0])[0];
      const endCell = row.filter((cell: ADCITableCell) => cell.value.toString().split('T')[0] == e.endDate.split('T')[0])[0];

      const startTime = e.startTime == null ? 0 : +e.startTime.toString().split(':')[0];
      const endTime = e.endTime == null ? 24 : +e.endTime.toString().split(':')[0];

      const cellEvent: ADCITableEvent = {
        columnStart: startCell != null ? startCell.columnIndex : null,
        columnEnd: endCell != null ? endCell.columnIndex : null,
        data: e,
        rowStart: row[0].rowIndex,
        rowEnd: row[0].rowIndex,
        offsetX: startTime / 24,
        fractionX: e.allDay == true ? 1 : (endTime / 24)
      };

      this.tableEvents.push(cellEvent);
    });
  }

  override resourceChangesHandler(): void {
    this.resources = this.resourceSchedulerSource.resources;
  }

  override dateChangesHandler(): void {
    this.cells = [];
    this.rows = [];
    this.columns = [];

    if(this.hasResources == false) return;

    const firstMonth = this.month * 2 + 1;
    const secondMonth = this.month * 2 + 2;

    this.resources.forEach((resource: ADCIResourceSchedulerResource, rowIndex: number) => {

      const row: ADCITableRow = 
      {
        label: resource.title,
        classList: '',
        prefix: '',
        suffix: '',
        value: resource.id
      }

      this.rows.push(row);

      this.totalWeeksOfMonths.forEach((week: string) => {

        this.daysOfweek.forEach((day: string, dayIndex: number) => {
          const date = this.dateAdapter.getDateOfDay(this.year, +week, dayIndex);
          const splittedDate = date.split(this.dateSplitter);
  
          if(+splittedDate[1] == firstMonth || +splittedDate[1] == secondMonth)
          {
            const transformedDate = this.dateAdapter.transformDate(+splittedDate[0], +splittedDate[1], +splittedDate[2]);

            if(rowIndex == 0)
            {
              const column: ADCITableColumn = 
              {
                label: day,
                classList: ''.concat(
                  transformedDate.split('T')[0] == this.today ? ' today ' : ' ',
                  this.weekends.includes(dayIndex) || this.holidays.includes(transformedDate.split('T')[0]) ? ' text-holiday ' : ' '
                  ),
                prefix: '',
                suffix: date.split(this.dateSplitter)[1] + this.dateSplitter + date.split(this.dateSplitter)[2],
                value: dayIndex
              }
        
              this.columns.push(column);
            }

            const tableCell: ADCITableCell = 
            {
              classList: '',
              label: '',
              prefix: '',
              suffix: '',
              value: transformedDate,
              rowIndex: rowIndex,
              rowValue: resource.id,
              columnIndex: this.cells.length%this.columns.length,
              columnValue: dayIndex
            };

            this.cells.push(tableCell);
          }
        });
      });
    });
  }

  private calculateCurrentDate(): void
  {
    var firstMonth = this.month * 2 + 1;
    var secondMonth = this.month * 2 + 2;

    this.title = this.year + ' ' + this.monthsOfYear[firstMonth - 1] + '-' + this.monthsOfYear[secondMonth - 1];

    this.totalWeeksOfMonths = this.dateAdapter.getWeeksOfMonth(this.year, firstMonth).concat(this.dateAdapter.getWeeksOfMonth(this.year, secondMonth));
    
    this.viewStart = this.dateAdapter.transformDate(this.year, firstMonth, 1);
    var secondMonthDays = this.dateAdapter.getDaysOfMonth(this.year, secondMonth);
    this.viewEnd = this.dateAdapter.transformDate(this.year, secondMonth, secondMonthDays);

    this.resourceSchedulerSource.onDateRangeChange({startDate: this.viewStart, endDate: this.viewEnd});
  }

  dateFilter(cell1: ADCITableCell, cell2: ADCITableCell): boolean
  {
    return cell1.rowIndex == cell2.rowIndex && cell2.value >= cell1.value;
  }

  onDateRangeSelect(event: ADCITableCell[]): void
  {
    const e: ADCIResourceSchedulerTableEvent = 
    {
      endDate: event[1].value.toString(),
      endTime: '00:00',
      startDate: event[0].value.toString(),
      startTime: '00:00',
      resourceId: event[0].rowValue,
    }
    
    this.resourceSchedulerSource.onDateRangeSelect(e);
  }

  onEventSelect(e: ADCITableEventSelectEvent): void
  {
    const resourceSchedulerEvent: ADCIResourceSchedulerEvent = this.events.filter(item => item.id == e.event.data.id)[0];

    this.resourceSchedulerSource.onEventSelect({dom: e.dom, jsEvent: e.jsEvent, event: resourceSchedulerEvent});
  }
}
