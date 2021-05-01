import * as moment from 'moment';
import {useIntl, FormattedDate, defineMessages} from 'react-intl'

export type TimeServiceType = {
  timeDiff: (firstDate: moment.Moment, secondDate: moment.Moment) => string,
};

export const TimeService: TimeServiceType = {
  timeDiff(firstDate: moment.Moment, secondDate: moment.Moment) {
    const intl = useIntl();
    const timeDifference = firstDate.diff(secondDate);
    const duration = moment.duration(timeDifference);

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes());
    const localMinutes = Math.floor(duration.minutes());
    const seconds = Math.floor(duration.asSeconds());
    const localSeconds = Math.floor(duration.seconds());

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
      const dayForm = formatTime(days, dayForms);
      return `${days} ${dayForm}`;
    }

    if (hours > 2) {      
      const hourForm = formatTime(hours, hourForms);
      const minuteForm = formatTime(localMinutes, minuteForms);
      return `${hours} ${hourForm} ${localMinutes} ${minuteForm}`;
    }

    if (minutes > 10) {
      const minuteForm = formatTime(minutes, minuteForms);
      return `${minutes} ${minuteForm}`;
    }

    if (seconds > 90) {
      const minuteForm = formatTime(minutes, minuteForms);
      // tslint:disable-next-line:no-shadowed-variable
      const secondForm = formatTime(seconds, secondForms);

      return `${minutes} ${minuteForm} ${localSeconds} ${secondForm}`;
    }

    const secondForm = formatTime(seconds, secondForms);;
    return `${seconds} ${secondForm}`;
  }
}


export type Forms = {
  'one': string,
  'few': string,
  'many': string,
}

const formatTime = (time: number, forms: Forms) => {
  const val = time % 10;

  if (val === 1) {
    return forms['one'];
  } else if (val < 5) {
    return forms['few'];
  } else {
    return forms['many'];
  }
};