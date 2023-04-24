import {Stages, StagesTimeValue} from '@/types';

export const secondToMinuteAndSecondString = (second: number): string => {
  return (
    `${second / 60 < 10 ? '0' : ''}${Math.floor(second / 60)}` +
    ':' +
    `${second % 60 < 10 ? '0' : ''}${Math.floor(second % 60)}`
  );
};

export const createDefaultStages = (timeValue: StagesTimeValue): Stages => {
  return {
    pomodoro: {
      name: 'Pomodoro',
      shortName: 'Pomo',
      timeValue: timeValue.pomodoro,
      color: 'red',
    },
    shortBreak: {
      name: 'Short Break',
      shortName: 'Short',
      timeValue: timeValue.shortBreak,
      color: 'coban',
    },
    longBreak: {
      name: 'Long Break',
      shortName: 'Long',
      timeValue: timeValue.longBreak,
      color: 'blue',
    },
  };
};
