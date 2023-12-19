
import { ADCIOptions } from "@asadi/angular-date-components/core";


export class SchedulerOptionsPersian implements ADCIOptions
{
    private _considerTime: boolean = true;
    private _direction: 'rtl' | 'ltr' = 'rtl';
    private _initialView: "month" | "week" | "day" = "month";


    get considerTime(): boolean {
        return this._considerTime;
    }
    
    set considerTime(value: boolean)
    {
        this._considerTime = value;
    }

    get direction(): "ltr" | "rtl" {
        return this._direction
    }

    set direction(value: 'rtl' | 'ltr')
    {
        this._direction = value;
    }

    get initialView(): "month" | "week" | "day" {
        return this._initialView;
    }

    set initialView(value: "month" | "week" | "day")
    {
        this._initialView = value;
    }
}