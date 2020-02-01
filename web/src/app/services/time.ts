import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  timeDiff(firstDate: moment.Moment, secondDate: moment.Moment) {
    const timeDifference = firstDate.diff(secondDate);
    const duration = moment.duration(timeDifference);

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes());
    const localMinutes = Math.floor(duration.minutes());
    const seconds = Math.floor(duration.asSeconds());
    const localSeconds = Math.floor(duration.seconds());

    const pluralRules = new Intl.PluralRules('ru-RU');
    const dayForms = {
      one: 'день',
      few: 'дня',
      many: 'дней'
    };
    const hourForms = {
      one: 'час',
      few: 'часа',
      many: 'часов'
    };
    const minuteForms = {
      one: 'минута',
      few: 'минуты',
      many: 'минут'
    };
    const secondForms = {
      one: 'секунда',
      few: 'секунды',
      many: 'секунд'
    };

    if (days > 2) {
      const dayForm = dayForms[pluralRules.select(days)];
      return `${days} ${dayForm}`;
    }

    if (hours > 2) {
      const hourForm = hourForms[pluralRules.select(hours)];
      const minuteForm = minuteForms[pluralRules.select(localMinutes)];
      return `${hours} ${hourForm} ${localMinutes} ${minuteForm}`;
    }

    if (minutes > 10) {
      const minuteForm = minuteForms[pluralRules.select(minutes)];
      return `${minutes} ${minuteForm}`;
    }

    if (seconds > 90) {
      const minuteForm = minuteForms[pluralRules.select(minutes)];
      // tslint:disable-next-line:no-shadowed-variable
      const secondForm = secondForms[pluralRules.select(localSeconds)];

      return `${minutes} ${minuteForm} ${localSeconds} ${secondForm}`;
    }

    const secondForm = secondForms[pluralRules.select(seconds)];
    return `${seconds} ${secondForm}`;
  }
}