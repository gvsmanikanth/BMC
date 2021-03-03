import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'epdVersion'
})
export class EPDVersionPipe implements PipeTransform{
    transform(versionSN: string): string {
        return versionSN.split('.').slice(1).join('.');
    }
}