export interface StageInfo {
  name: string;
  shortName: string;
  timeValue: number; //second
  color: ColorTheme;
}

export type StageName = 'pomodoro' | 'shortBreak' | 'longBreak';

export type ColorTheme = 'red' | 'coban' | 'blue';

export type StagesTimeValue = Record<StageName, number>;

export type Stages = Record<StageName, StageInfo>;

export enum StorageKey {
  AUTO_START_BREAK = 'autoStartBreak',
  AUTO_START_POMO = 'autoStartPomo',
  LONG_BREAK_INTERVAL = 'longBreakInterval',
  STAGES_TIME = 'stagesTime',
}
