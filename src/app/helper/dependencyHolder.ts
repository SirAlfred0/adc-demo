import { Injectable } from "@angular/core";
import * as moment from "jalali-moment";


@Injectable({
    providedIn: 'root',
})
export class DependencyHolder
{
    private _calendarType: number = 2;
    private _language: string = 'en';
    private _startOf: string | null = null;

    get calendarType(): number
    {
        return this._calendarType;
    }

    set calendarType(value: number)
    {
        this._calendarType = value;
    }

    get language(): string
    {
        return this._language;
    }

    set language(value: string)
    {
        this._language = value;
    }

    set startOf(value: string | null)
    {
        if(value != null)
        {
            this._startOf = moment(value).locale('en').format('YYYY-MM-DD');
        }
        else
        {
            this._startOf = value;
        }

        console.log(this._startOf);
    }
    get startOf(): string | null
    {
        return this._startOf;
    }
}