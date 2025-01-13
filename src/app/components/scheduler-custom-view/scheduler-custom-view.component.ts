import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ADC_OPTIONS, ADCCommonService, ADCDateSplitter, ADCIOptions, ADCITableCell, ADCITableColumn, ADCITableEvent, ADCITableEventSelectEvent, ADCITableRow, ADCStaticValues } from '@asadi/angular-date-components/core';
import { ADCISchedulerDateRangeSelectEvent, ADCISchedulerEvent, AdcSchedulerBase } from '@asadi/angular-date-components/scheduler';

@Component({
  selector: 'app-scheduler-custom-view',
  templateUrl: './scheduler-custom-view.component.html',
  styleUrls: ['./scheduler-custom-view.component.css']
})
export class SchedulerCustomViewComponent extends AdcSchedulerBase implements OnInit, OnDestroy {

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

  monthsOfYear: string[] = this.dateAdapter.getMonthsOfYear();
  daysOfweek: string[] = ADCStaticValues.getDaysOfWeek();

  viewStart: string = '';
  viewEnd: string = '';

  weekends: number[] = [];
  holidays: string[] = [];

  readonly today = this.dateAdapter.today();
  readonly commonService = new ADCCommonService(this.dateAdapter, this.labels);

  constructor(
    @Inject(ADC_OPTIONS) private options: ADCIOptions
  ) {
    super();
  }

  ngOnInit(): void 
  {
    super.init();
  }

  override initViewHanlder(): void 
  {
    if(this.startOf == null)
    {
      this.todayButtonHandler();
    }
    else
    {
      this.year = this.dateAdapter.getYearOf(this.startOf);
      const m = this.dateAdapter.getMonthOf(this.startOf);
  
      this.month = m % 2 == 0 ? ((m - 2) / 2) : ((m - 1) / 2);
  
      this.calculateCurrentDate();
    }
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

  // get isViewReady(): boolean
  // {
  //   return this.rows.length != 0 && this.columns.length != 0 && this.cells.length != 0;
  // }

  override eventChangesHandler(schedulerEvents: ADCISchedulerEvent[]): void {
    this.tableEvents = [];

    this.events = schedulerEvents;
    
    const viewEvents = this.tools.scheduler.getEventsBetweenDateRange(this.viewStart, this.viewEnd, this.events);

    viewEvents.forEach((e: ADCISchedulerEvent) => {

      const startCellIndex = this.cells.findIndex((cell: ADCITableCell) => cell.value.toString().split('T')[0] == e.startDate.split('T')[0]);
      const endCellIndex = this.cells.findIndex((cell: ADCITableCell) => cell.value.toString().split('T')[0] == e.endDate.split('T')[0]);

      const startCell = startCellIndex == -1 ? this.cells[0] : this.cells[startCellIndex];
      const endCell = endCellIndex == -1 ? this.cells[this.cells.length -1] : this.cells[endCellIndex];

      const startTime = e.startTime == null ? 0 : +e.startTime.toString().split(':')[0];
      const endTime = e.endTime == null ? 24 : +e.endTime.toString().split(':')[0];

      const cellEvent: ADCITableEvent = {
        columnStart: startCellIndex != -1 ? startCell.columnIndex : null,
        columnEnd: endCellIndex != -1 ? endCell.columnIndex : null,
        data: e,
        rowStart: startCell.rowIndex,
        rowEnd:  endCell.rowIndex,
        offsetX: startTime / 24,
        fractionX: e.allDay == true ? 1 : (endTime / 24),
        overlapTolerance: this.options.eventOverlapTolerance / 24
      };

      this.tableEvents.push(cellEvent);
    });
  }

  dateChangesHandler(): void {
    this.cells = [];
    this.rows = [];
    this.columns = [];

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
            const dIndex = this.commonService.getDayIndex(dayIndex);

            const column: ADCITableColumn = 
            {
              label: this.labels?.daysOfWeek[dIndex] || day,
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
    
    this.markViewAsReady();
  }

  override weekendsChangesHandler(weekends: number[]): void 
  {
    this.weekends = weekends;
    this.dateChangesHandler();
  }

  override holidaysChangesHandler(holidays: string[]): void 
  {
    this.holidays = holidays;
    this.dateChangesHandler();
  }

  private calculateCurrentDate(): void
  {
    var firstMonth = this.month * 2 + 1;
    var secondMonth = this.month * 2 + 2;

    const firstMonthName = this.monthsOfYear[firstMonth - 1];
    const secondMonthName = this.monthsOfYear[secondMonth - 1];

    this.title = this.year + ' ' + (this.commonService.getMonthName(firstMonthName) || firstMonthName) 
    + '-' + (this.commonService.getMonthName(secondMonthName) || secondMonthName) ;

    this.totalWeeksOfMonths = [...new Set(this.dateAdapter.getWeeksOfMonth(this.year, firstMonth).concat(this.dateAdapter.getWeeksOfMonth(this.year, secondMonth)))];
    
    this.viewStart = this.dateAdapter.transformDate(this.year, firstMonth, 1);
    var secondMonthDays = this.dateAdapter.getDaysOfMonth(this.year, secondMonth);
    this.viewEnd = this.dateAdapter.transformDate(this.year, secondMonth, secondMonthDays);

    this.dateChangesHandler();
    super.dateRangeChange({startDate: this.viewStart, endDate: this.viewEnd});
  }

  dateFilter(cell1: ADCITableCell, cell2: ADCITableCell): boolean
  {
    return cell2.value >= cell1.value;
  }

  onDateRangeSelect(event: ADCITableCell[]): void
  {
    const e: ADCISchedulerDateRangeSelectEvent = 
    {
      endDate: event[1].value.toString(),
      endTime: '00:00',
      startDate: event[0].value.toString(),
      startTime: '00:00',
    }
    
    super.dateRangeSelect(e);
  }

  onEventSelect(e: ADCITableEventSelectEvent): void
  {
    const schedulerEvent: ADCISchedulerEvent = this.events.filter((item: any) => item.id == e.event.data.id)[0];

    super.eventSelect({dom: e.dom, jsEvent: e.jsEvent, event: schedulerEvent});
  }

  ngOnDestroy(): void 
  {
    super.destroy();
  }

}
