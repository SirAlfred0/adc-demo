import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { ADC_OPTIONS, ADCCommonService, ADCDateSplitter, ADCIOptions, ADCITableCell, ADCITableColumn, ADCITableEvent, ADCITableEventSelectEvent, ADCITableRow, ADCStaticValues, FlatEventBuilder, TableSelection } from '@asadi/angular-date-components/core';
import { ADCISchedulerDateRangeSelectEvent, ADCISchedulerEvent, AdcSchedulerBase } from '@asadi/angular-date-components/scheduler';

@Component({
  selector: 'app-scheduler-custom-view',
  templateUrl: './scheduler-custom-view.component.html',
  styleUrls: ['./scheduler-custom-view.component.css']
})
export class SchedulerCustomViewComponent extends AdcSchedulerBase implements OnInit, OnDestroy{
  
  private month: number = 0;
  private year: number = 0;
  private totalWeeksOfMonths: string[] = [];

  dateSplitter: ADCDateSplitter = this.dateFormatter.DateSplitter;

  events: ADCISchedulerEvent[] = [];
  rows: ADCITableRow[] = [];

  title: string = '';

  monthsOfYear: string[] = this.dateAdapter.getMonthsOfYear();
  daysOfweek: string[] = ADCStaticValues.getDaysOfWeek();

  viewStart: string = '';
  viewEnd: string = '';

  weekends: number[] = [];
  holidays: string[] = [];

  readonly today = this.dateAdapter.today();
  readonly commonService = new ADCCommonService(this.dateAdapter, this.labels);

  readonly selectionManager = new TableSelection(this.dateFilter);
  readonly eventBuilder = new FlatEventBuilder();

  constructor(
  ) {
    super();
  }

  ngOnInit(): void 
  {
    super.init();

    this.selectionManager.cellSelectionStream.subscribe(event => this.onDateRangeSelect(event.start, event.end));

    this.eventBuilder.eventSelectionStream.subscribe(e => this.onEventClick(e.event, e.dom, e.jsEvent));
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

  override eventChangesHandler(schedulerEvents: ADCISchedulerEvent[]): void {

    this.events = schedulerEvents;

    const tableEvents: ADCITableEvent[] = [];
    
    const viewEvents = this.tools.scheduler.getEventsBetweenDateRange(this.viewStart, this.viewEnd, this.events);

    viewEvents.forEach((e: ADCISchedulerEvent) => {

      const startDate = this.tools.dateTime.dateOnly(e.startDate);
      const startRowIndex = this.rows.findIndex((r, i) => {

        if(i == 0) return;

        return r.columns.map(c => this.tools.dateTime.dateOnly(c.value)).includes(startDate)
      });

      const startColumnIndex = startRowIndex != -1 ? 
      this.rows[startRowIndex].columns.findIndex(c => this.tools.dateTime.dateOnly(c.value) == startDate) : null;

      const endDate = this.tools.dateTime.dateOnly(e.endDate);

      const endRowIndex = this.rows.findIndex((r, i) => {

        if(i == 0) return;

        return r.columns.map(c => this.tools.dateTime.dateOnly(c.value)).includes(endDate)
      });

      const endColumnIndex = endRowIndex != -1 ?
      this.rows[endRowIndex].columns.findIndex(c => this.tools.dateTime.dateOnly(c.value) == endDate) : null;

      const startTime = e.startTime == null ? 0 : +e.startTime.toString().split(':')[0];
      const endTime = e.endTime == null ? 24 : +e.endTime.toString().split(':')[0];

      const cellEvent: ADCITableEvent = {
        columnStart: startColumnIndex,
        columnEnd: endColumnIndex,
        data: e,
        rowStart: startRowIndex != -1 ? startRowIndex : 0,
        rowEnd:  endRowIndex != -1 ? endRowIndex : this.rows.length - 1,
        offsetX: startTime / 24,
        fractionX: e.allDay == true ? 1 : (endTime / 24),
        overlapTolerance: this.options.eventOverlapTolerance / 24
      };

      tableEvents.push(cellEvent);
    });

    console.log(tableEvents);

    this.eventBuilder.data = tableEvents;
  }

  dateChangesHandler(): void {
    this.rows = this.getRowIntialValue();

    const month = this.dateAdapter.getCurrentMonth();
    const firstMonth = this.month * 2 + 1;
    const secondMonth = this.month * 2 + 2;

    this.totalWeeksOfMonths.forEach((week: string, weekIndex: number) => {

        const row: ADCITableRow = 
        {
          label: '',
          classList: '',
          prefix: '',
          suffix: '',
          value: week,
          horizontalAlign: 'center',
          verticalAlign: 'center',
          columns: []
        }

        this.daysOfweek.forEach((day: string, dayIndex: number) => {

          const date = this.dateAdapter.getDateOfDay(this.year, +week, dayIndex);
          const splittedDate = date.split(this.dateSplitter);
          const transformedDate = this.dateAdapter.transformDate(+splittedDate[0], +splittedDate[1], +splittedDate[2]);
          

          const column: ADCITableColumn = 
          {
            classList: ''.concat(
              transformedDate.split('T')[0] == this.today && month == +splittedDate[1] ? ' today ' : ' ',
              this.weekends.includes(dayIndex) || this.holidays.includes(transformedDate.split('T')[0]) ? ' text-holiday ' : ' ',
              firstMonth != +splittedDate[1] && secondMonth != +splittedDate[1]  ? ' unavailable ' : ' '
            ),
            label: splittedDate[1] + this.dateSplitter + splittedDate[2],
            prefix: '',
            suffix: '',
            value: transformedDate.split('T')[0],
            verticalAlign: 'start',
            horizontalAlign: 'start',
            selectable: true
          };

          row.columns.push(column);

        });

        this.rows.push(row);
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
    return cell2.columnValue >= cell1.columnValue;
  }

  onDateRangeSelect(start: ADCITableCell, end: ADCITableCell): void
  {
    const e: ADCISchedulerDateRangeSelectEvent = 
    {
      endDate: end.columnValue,
      endTime: '00:00',
      startDate: start.columnValue,
      startTime: '00:00',
    }
    
    super.dateRangeSelect(e);
  }


  override onEventClick(event: ADCITableEvent, dom: HTMLElement, jsEvent: MouseEvent): void 
  {
    const schedulerEvent: ADCISchedulerEvent = this.events.filter((item: any) => item.id == event.data.id)[0];

    super.eventClick({dom: dom, jsEvent: jsEvent, event: schedulerEvent});
  }

  ngOnDestroy(): void 
  {
    super.destroy();
  }

  getRowIntialValue(): ADCITableRow[]
  {
    return [{
      classList: '',
      prefix: '',
      suffix: '',
      label: '',
      value: '',
      verticalAlign:'start',
      horizontalAlign: 'center',
      columns: this.daysOfweek.map((day, index) => {

        const dIndex = this.commonService.getDayIndex(index);

        return {
          classList: this.weekends.includes(index) ? 'holiday' : '',
          prefix: '',
          suffix: '',
          label: this.labels?.daysOfWeek[dIndex] || day,
          horizontalAlign: 'center',
          verticalAlign: 'center',
          selectable: false,
          value: index.toString()
        }
      })
    }]
  }
}
