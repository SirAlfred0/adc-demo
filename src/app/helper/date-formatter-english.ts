import { ADCIDateFormatter, ADCDateSplitter } from "@angular-date-components/scheduler";

export class DateFormatterEnglish implements ADCIDateFormatter
{
    get DateSplitter(): ADCDateSplitter {
        return ADCDateSplitter.hyphen
    }

}