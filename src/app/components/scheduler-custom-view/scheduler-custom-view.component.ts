import { Component } from '@angular/core';
import { ADCDateSplitter, ADCIDateAdapter, ADCITableCell, ADCITableColumn, ADCITableEvent, ADCITableRow } from '@asadi-m/angular-date-components/core';
import { ADCISchedulerDateRangeSelectEvent, ADCISchedulerEvent, AdcSchedulerBaseViewComponent } from '@asadi-m/angular-date-components/scheduler';

@Component({
  selector: 'app-scheduler-custom-view',
  templateUrl: './scheduler-custom-view.component.html',
  styleUrls: ['./scheduler-custom-view.component.css']
})
export class SchedulerCustomViewComponent extends AdcSchedulerBaseViewComponent {

  private month: number = 0;
  private year: number = 0;
  private totalWeeksOfMonths: string[] = [];

  dateSplitter: ADCDateSplitter = this.dateFormatter.DateSplitter;

  events: ADCISchedulerEvent[] = [];

  columns: ADCITableColumn[] = [];
  rows: ADCITableRow[] = [];
  cells: ADCITableCell[] = [];
  tableEvents: ADCITableEvent[] = [];

  title: string = '';

  monthsOfYear: string[] = [];
  daysOfweek: string[] = [];

  viewStart: string = '';
  viewEnd: string = '';

  constructor() {
    super();
    this.monthsOfYear = this.dateAdapter.getMonthsOfYear();
    this.daysOfweek = this.dateAdapter.getDaysOfWeek();
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

  override eventChangesHandler(): void {
    this.tableEvents = [];

    if(this.isViewReady == false) return;

    this.events = this.schedulerSource.getEvents(this.viewStart, this.viewEnd);

    this.events.forEach((e: ADCISchedulerEvent) => {

      const startCellIndex = this.cells.findIndex((cell: ADCITableCell) => cell.value.toString().split('T')[0] == e.startDate.split('T')[0]);
      const endCellIndex = this.cells.findIndex((cell: ADCITableCell) => cell.value.toString().split('T')[0] == e.endDate.split('T')[0]);

      const startCell = startCellIndex == -1 ? this.cells[0] : this.cells[startCellIndex];
      const endCell = endCellIndex == -1 ? this.cells[this.cells.length -1] : this.cells[endCellIndex];

      const startTime = e.startTime == null ? 0 : +e.startTime.toString().split(':')[0];
      const endTime = e.endTime == null ? 24 : +e.endTime.toString().split(':')[0];

      const cellEvent: ADCITableEvent = {
        height: 40,
        columnStart: startCellIndex != -1 ? startCell.columnIndex : null,
        columnEnd: endCellIndex != -1 ? endCell.columnIndex : null,
        data: e,
        rowStart: startCell.rowIndex,
        rowEnd:  endCell.rowIndex,
        offsetX: startTime / 24,
        fractionX: e.allDay == true ? 1 : (endTime / 24)
      };

      this.tableEvents.push(cellEvent);
    });
  }

  override dateChangesHandler(): void {
    this.cells = [];
    this.rows = [];
    this.columns = [];
    this.tableEvents = [];

    const month = this.dateAdapter.getCurrentMonth();
    const firstMonth = this.month * 2 + 1;
    const secondMonth = this.month * 2 + 2;

    this.totalWeeksOfMonths.forEach((week: string, weekIndex: number) => {
        const row: ADCITableRow = 
        {
          label: week,
          classList: '',
          prefix: '',
          suffix: '',
          value: +week
        }
        this.rows.push(row);

        this.daysOfweek.forEach((day: string, dayIndex: number) => {

          if(weekIndex == 0)
          {
            const column: ADCITableColumn = 
            {
              label: day,
              classList: '',
              prefix: '',
              suffix: '',
              value: dayIndex
            }
            this.columns.push(column);
          }

          const date = this.dateAdapter.getDateOfDay(this.year, +week, dayIndex);
          const splittedDate = date.split(this.dateSplitter);
          const transformedDate = this.dateAdapter.transformDate(+splittedDate[0], +splittedDate[1], +splittedDate[2]);
          

          const tableCell: ADCITableCell = 
          {
            classList: ''.concat(
              transformedDate.split('T')[0] == this.today && month == +splittedDate[1] ? ' today ' : ' ',
              this.weekends.includes(dayIndex) || this.holidays.includes(transformedDate.split('T')[0]) ? ' text-holiday ' : ' ',
              firstMonth != +splittedDate[1] && secondMonth != +splittedDate[1]  ? ' unavailable ' : ' '
            ),
            label: splittedDate[1] + this.dateSplitter + splittedDate[2],
            prefix: '',
            suffix: '',
            value: transformedDate,
            rowIndex: weekIndex,
            rowValue: +week,
            columnIndex: this.cells.length%this.columns.length,
            columnValue: dayIndex
          };
          this.cells.push(tableCell);

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

    this.schedulerSource.onDateRangeChange({startDate: this.viewStart, endDate: this.viewEnd});
  }

  dateFilter(cell1: ADCITableCell, cell2: ADCITableCell): boolean
  {
    return cell2.value >= cell1.value;
  }

  onTableCellSelect(event: ADCITableCell[]): void
  {
    const e: ADCISchedulerDateRangeSelectEvent = 
    {
      endDate: event[1].value.toString(),
      endTime: '00:00',
      startDate: event[0].value.toString(),
      startTime: '00:00',
    }
    
    this.schedulerSource.onDateRangeSelect(e);
  }

  onTableEventClick(event: ADCITableEvent): void
  {
    const e: ADCISchedulerEvent = this.events.filter((item: any) => item.id == event.data.id)[0];
    this.schedulerSource.onEventSelect(e);
  }

}
