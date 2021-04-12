import React from 'react';

import dtf from '../../../modules/helpers/date';

import './date.scss';

export default class DateWidget extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      date: '',
      weekNumber: ''
    };
  }

  getWeekNumber(date) {
    const dateToday = new Date(date.valueOf());
    const dayNumber = (dateToday.getDay() + 6) % 7;

    dateToday.setDate(dateToday.getDate() - dayNumber + 3);
    const firstThursday = dateToday.valueOf();
    dateToday.setMonth(0, 1);

    if (dateToday.getDay() !== 4) {
      dateToday.setMonth(0, 1 + ((4 - dateToday.getDay()) + 7) % 7);
    }

    this.setState({
      weekNumber: `${window.language.widgets.date.week} ${1 + Math.ceil((firstThursday - dateToday) / 604800000)}`
    });
  }

  getDate() {
    const date = new Date();

    if (localStorage.getItem('weeknumber') === 'true') {
      this.getWeekNumber(date);
    }

    if (localStorage.getItem('dateType') === 'short') {
      const dateDay = date.getDate();
      const dateMonth = date.getMonth() + 1;
      const dateYear = date.getFullYear();

      let day = dateDay;
      let month = dateMonth;
      let year = dateYear;

      switch (localStorage.getItem('dateFormat')) {
        case 'MDY':
          day = dateMonth;
          month = dateDay;
          break;
        case 'YMD':
          day = dateYear;
          year = dateDay;
          break;
        // DMY
        default: break;
      }

      let format;
      switch (localStorage.getItem('shortFormat')) {
        case 'dots':
          format = `${day}.${month}.${year}`;
          break;
        case 'dash':
          format = `${day}-${month}-${year}`;
          break;
        case 'gaps':
          format = `${day} - ${month} - ${year}`;
          break;
        case 'slashes':
          format = `${day}/${month}/${year}`;
          break;
        default: break;
      }

      this.setState({
        date: format
      });
    } else {
      // Long date
      const lang = localStorage.getItem('language').split('_')[0];

      const nth = (localStorage.getItem('datenth') === 'true') ? dtf.nth(date.getDate()) : date.getDate();

      const day = (localStorage.getItem('dayofweek') === 'true') ? date.toLocaleDateString(lang, { weekday: 'long' }) : '';
      const month = date.toLocaleDateString(lang, { month: 'long' });

      this.setState({
        date: `${day} ${nth} ${month} ${date.getFullYear()}`
      });
    }
  }

  componentDidMount() {
    this.getDate();
  }

  render() {
    return <span className='date'>{this.state.date} <br/> {this.state.weekNumber}</span>;
  }
}
