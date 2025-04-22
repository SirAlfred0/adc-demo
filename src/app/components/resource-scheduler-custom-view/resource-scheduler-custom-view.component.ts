import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { ADC_OPTIONS, ADCCommonService, ADCDateSplitter, ADCIOptions, ADCITableCell, ADCITableColumn, ADCITableEvent, ADCITableEventSelectEvent, ADCITableRow, ADCStaticValues, FlatEventBuilder, TableSelection } from '@asadi/angular-date-components/core';
import { ADCIResourceSchedulerEvent, ADCIResourceSchedulerResource, ADCIResourceSchedulerTableEvent, AdcResourceSchedulerBase,  } from '@asadi/angular-date-components/resource-scheduler';

@Component({
  selector: 'app-resource-scheduler-custom-view',
  templateUrl: './resource-scheduler-custom-view.component.html',
  styleUrls: ['./resource-scheduler-custom-view.component.css']
})
export class ResourceSchedulerCustomViewComponent extends AdcResourceSchedulerBase implements OnInit, OnDestroy{
  
  private month: number = 0;
  private year: number = 0;
  private totalWeeksOfMonths: string[] = [];

  dateSplitter: ADCDateSplitter = this.dateFormatter.DateSplitter;

  events: ADCIResourceSchedulerEvent[] = [];
  resources: ADCIResourceSchedulerResource[] = [];

  rows: ADCITableRow[] = [];

  title: string = '';

  monthsOfYear: string[] = this.dateAdapter.getMonthsOfYear();;
  daysOfweek: string[] = ADCStaticValues.getDaysOfWeek();

  viewStart: string = '';
  viewEnd: string = '';

  holidays: string[] = [];
  weekends: number[] = [];

  readonly commonService = new ADCCommonService(this.dateAdapter, this.labels);
  readonly today: string = this.dateAdapter.today();
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

  override eventChangesHandler(events: ADCIResourceSchedulerEvent[]): void {

    const tableEvents: ADCITableEvent[] = [];

    this.events = events;
  
    const viewEvents = this.tools.resourceScheduler.getEventsBetweenDateRange(this.viewStart, this.viewEnd, this.events);

    viewEvents.forEach((e: ADCIResourceSchedulerEvent) => {

      const rowIndex = this.rows.findIndex((r) => r.value === e.resourceId);

      if(rowIndex == -1) return;

      const row = this.rows[rowIndex];

      const startDate = this.tools.dateTime.dateOnly(e.startDate);
      const endDate = this.tools.dateTime.dateOnly(e.endDate);

      const startColumnIndex = row.columns.findIndex((c: ADCITableColumn) => this.tools.dateTime.dateOnly(c.value) == startDate);
      const endColumnIndex = row.columns.findIndex((c: ADCITableColumn) => this.tools.dateTime.dateOnly(c.value) == endDate);

      const startTime = +this.tools.dateTime.hourOrDefault(e.startTime, '00');
      const endTime = +this.tools.dateTime.hourOrDefault(e.endTime, '24');

      const cellEvent: ADCITableEvent = {
        columnStart: startColumnIndex != -1 ? startColumnIndex : null,
        columnEnd: endColumnIndex != -1 ? endColumnIndex : null,
        data: e,
        rowStart: rowIndex,
        rowEnd: rowIndex,
        offsetX: startTime / 24,
        fractionX: e.allDay == true ? 1 : (endTime / 24),
        overlapTolerance: this.options.eventOverlapTolerance / 24
      };

      tableEvents.push(cellEvent);
    });

    this.eventBuilder.data = tableEvents;
  }

  override resourceChangesHandler(resources: ADCIResourceSchedulerResource[]): void {
    this.resources = resources;
    this.dateChangesHandler();
  }

  dateChangesHandler(): void {
    this.rows = this.initialRowValues();

    if(this.resources.length == 0) return;

    const firstMonth = this.month * 2 + 1;
    const secondMonth = this.month * 2 + 2;

    this.resources.forEach((resource: ADCIResourceSchedulerResource, rowIndex: number) => {

      const row: ADCITableRow = 
      {
        label: resource.title,
        classList: '',
        prefix: '',
        suffix: '',
        value: resource.id,
        columns: [],
        horizontalAlign: 'center',
        verticalAlign: 'center',
      }

      this.totalWeeksOfMonths.forEach((week: string) => {

        this.daysOfweek.forEach((day: string, dayIndex: number) => {
          const date = this.dateAdapter.getDateOfDay(this.year, +week, dayIndex);
          const splittedDate = date.split(this.dateSplitter);
  
          if(+splittedDate[1] == firstMonth || +splittedDate[1] == secondMonth)
          {
            const transformedDate = this.dateAdapter.transformDate(+splittedDate[0], +splittedDate[1], +splittedDate[2]);


            const tableCell: ADCITableColumn = 
            {
              classList: '',
              label: '',
              prefix: '',
              suffix: '',
              value: transformedDate.split('T')[0],
              horizontalAlign: 'start',
              verticalAlign: 'start',
              selectable: true
            };

            row.columns.push(tableCell)
          }
        });
      });
      
      this.rows.push(row);
    });
  }

  override holidaysChangesHandler(holidays: string[]): void 
  {
    this.holidays = holidays;
    this.dateChangesHandler();
  }

  override weekendChangesHandler(weekends: number[]): void 
  {
    this.weekends = weekends;
    this.dateChangesHandler();
  }

  private calculateCurrentDate(): void
  {
    var firstMonth = this.month * 2 + 1;
    var secondMonth = this.month * 2 + 2;

    const firstMonthName = this.monthsOfYear[firstMonth - 1];
    const secondMonthName = this.monthsOfYear[secondMonth - 1];

    this.title = this.year + ' ' + (this.commonService.getMonthName(firstMonthName) || firstMonthName) 
    + '-' + (this.commonService.getMonthName(secondMonthName) || secondMonthName);

    this.totalWeeksOfMonths = [...new Set(this.dateAdapter.getWeeksOfMonth(this.year, firstMonth).concat(this.dateAdapter.getWeeksOfMonth(this.year, secondMonth)))];
    
    this.viewStart = this.dateAdapter.transformDate(this.year, firstMonth, 1);
    var secondMonthDays = this.dateAdapter.getDaysOfMonth(this.year, secondMonth);
    this.viewEnd = this.dateAdapter.transformDate(this.year, secondMonth, secondMonthDays);

    this.dateChangesHandler();
    super.dateRangeChange({startDate: this.viewStart, endDate: this.viewEnd});
  }

  dateFilter(cell1: ADCITableCell, cell2: ADCITableCell): boolean
  {
    return cell1.rowIndex == cell2.rowIndex && cell2.columnValue >= cell1.columnValue;
  }

  onDateRangeSelect(start: ADCITableCell, end: ADCITableCell): void
  {
    const e: ADCIResourceSchedulerTableEvent = 
    {
      endDate: end.columnValue,
      endTime: '00:00',
      startDate: start.columnValue,
      startTime: '00:00',
      resourceId: start.rowValue,
    }
    
    super.dateRangeSelect(e);
  }

  override onEventClick(event: ADCITableEvent, dom: HTMLElement, jsEvent: MouseEvent): void 
  {
    const resourceSchedulerEvent: ADCIResourceSchedulerEvent = this.events.filter(item => item.id == event.data.id)[0];

    super.eventClick({dom: dom, jsEvent: jsEvent, event: resourceSchedulerEvent});
  }

  ngOnDestroy(): void 
  {
    super.destory();
  }

  private initialRowValues(): ADCITableRow[]
  {
    const firstMonth = this.month * 2 + 1;
    const secondMonth = this.month * 2 + 2;

    const columns: ADCITableColumn[] = [];

    this.totalWeeksOfMonths.forEach((week: string) => {

      this.daysOfweek.forEach((day: string, dayIndex: number) => {
        const date = this.dateAdapter.getDateOfDay(this.year, +week, dayIndex);
        const splittedDate = date.split(this.dateSplitter);

        if(+splittedDate[1] == firstMonth || +splittedDate[1] == secondMonth)
        {
          const transformedDate = this.dateAdapter.transformDate(+splittedDate[0], +splittedDate[1], +splittedDate[2]);

          const dIndex = this.commonService.getDayIndex(dayIndex);

          const column: ADCITableColumn = 
          {
            label: this.labels?.daysOfWeek[dIndex] || day,
            classList: ''.concat(
              transformedDate.split('T')[0] == this.today ? ' today ' : ' ',
              this.weekends.includes(dayIndex) || this.holidays.includes(transformedDate.split('T')[0]) ? ' holiday ' : ' '
              ),
            prefix: '',
            suffix: date.split(this.dateSplitter)[1] + this.dateSplitter + date.split(this.dateSplitter)[2],
            horizontalAlign: 'center',
            selectable: false,
            verticalAlign: 'center',
            value: dayIndex.toString()
          }
    
          columns.push(column);

        }
      });
    });

    return [{
      classList: '',
      horizontalAlign: 'center',
      verticalAlign: 'center',
      label: '',
      prefix: '',
      suffix: '',
      value: '',
      columns: columns
    }]
  }
}
