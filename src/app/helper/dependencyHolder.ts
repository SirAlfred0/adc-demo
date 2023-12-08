import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
})
export class DependencyHolder
{
    private _calendarType: number = 2;
    private _language: string = 'en';

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
}