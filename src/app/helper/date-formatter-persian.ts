import { ADCIDateFormatter, ADCDateSplitter } from "@angular-date-components/scheduler";

export class DateFormatterPersian implements ADCIDateFormatter
{
    get DateSplitter(): ADCDateSplitter {
        return ADCDateSplitter.slash
    }

}