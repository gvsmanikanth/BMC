import { Injectable } from "@angular/core";

declare var gtag;

@Injectable({
    providedIn: 'root'
})

export class GoogleAnalyticsService {

    public sendPageView(url: string) {
        gtag('config', 'GA_MEASUREMENT_ID', {
            'page_path': url
        });
    }

    public sendEvent(action: string, category: string, label: string = null, value: number = null) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }

    public measureTime(name: string, value: number, event_category: string = null) {
        gtag('event', 'timing_complete', {
            'name': name,
            'value': value,
            'event_category': event_category,
        });
    }

    public catchError(error: string, fatalError: boolean = false) {
        gtag('event', 'exception', {
            'description': error,
            'fatal': fatalError   // set to true if the error is fatal
        });
    }
}