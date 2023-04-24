'use client';

import Header from '@/components/Header';
import {Timer} from '@/components/Timer';
import {StagesTimeValue, StorageKey} from '@/types';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';

type Setting = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreak: boolean;
  autoStartPomo: boolean;
};

const initStorage = () => {
  if (localStorage.getItem(StorageKey.AUTO_START_BREAK) === null) {
    localStorage.setItem(StorageKey.AUTO_START_BREAK, JSON.stringify(false));
  }
  if (localStorage.getItem(StorageKey.AUTO_START_POMO) === null) {
    localStorage.setItem(StorageKey.AUTO_START_POMO, JSON.stringify(false));
  }
  if (
    localStorage.getItem(StorageKey.LONG_BREAK_INTERVAL) === null ||
    JSON.parse(localStorage.getItem(StorageKey.LONG_BREAK_INTERVAL) as string) <
      1
  ) {
    localStorage.setItem(StorageKey.LONG_BREAK_INTERVAL, JSON.stringify(4));
  }
  if (localStorage.getItem(StorageKey.STAGES_TIME) === null) {
    localStorage.setItem(
      StorageKey.STAGES_TIME,
      JSON.stringify({
        longBreak: 15 * 60,
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
      } as StagesTimeValue)
    );
  }
};
initStorage();

export default function Home() {
  const [stagesTimeValue, setStagesTimeValue] = useState<StagesTimeValue>({
    longBreak: 15 * 60,
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
  });
  const [autoPomo, setAutoPomo] = useState(false);
  const [autoBreak, setAutoBreak] = useState(false);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [text, setText] = useState(14);
  const [openSetting, setOpenSetting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: {errors},
  } = useForm<Setting>({});

  const handleSaveSetting = () => {
    const time = JSON.parse(
      localStorage.getItem(StorageKey.STAGES_TIME) as string
    );
    localStorage.setItem(
      StorageKey.STAGES_TIME,
      JSON.stringify({...time, pomodoro: text} as StagesTimeValue)
    );
    refreshData();
  };
  const onSubmit: SubmitHandler<Setting> = (data) => {
    localStorage.setItem(
      StorageKey.AUTO_START_BREAK,
      JSON.stringify(data.autoStartBreak)
    );
    localStorage.setItem(
      StorageKey.AUTO_START_POMO,
      JSON.stringify(data.autoStartPomo)
    );
    localStorage.setItem(
      StorageKey.STAGES_TIME,
      JSON.stringify({
        pomodoro: data.pomodoro < 1 ? 60 : data.pomodoro * 60,
        longBreak: data.longBreak < 1 ? 60 : data.longBreak * 60,
        shortBreak: data.shortBreak < 1 ? 60 : data.shortBreak * 60,
      } as StagesTimeValue)
    );
    refreshData();
    setOpenSetting(false);
  };

  const refreshData = () => {
    setStagesTimeValue(
      JSON.parse(localStorage.getItem(StorageKey.STAGES_TIME) as string)
    );
    setAutoPomo(
      JSON.parse(localStorage.getItem(StorageKey.AUTO_START_POMO) as string)
    );
    setAutoBreak(
      JSON.parse(localStorage.getItem(StorageKey.AUTO_START_BREAK) as string)
    );
    setLongBreakInterval(
      JSON.parse(localStorage.getItem(StorageKey.LONG_BREAK_INTERVAL) as string)
    );
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getStageTimeValue = () => {
    return JSON.parse(
      localStorage.getItem(StorageKey.STAGES_TIME) as string
    ) as StagesTimeValue;
  };

  const getAllSettingFromStorage = () => {
    const result = {} as Setting;
    const time = JSON.parse(
      localStorage.getItem(StorageKey.STAGES_TIME) as string
    );
    Object.keys(time).forEach((el) => {
      result[el as 'pomodoro' | 'shortBreak' | 'longBreak'] = Math.floor(
        time[el] / 60
      );
    });
    result[StorageKey.AUTO_START_POMO] = JSON.parse(
      localStorage.getItem(StorageKey.AUTO_START_POMO) as string
    );
    result[StorageKey.AUTO_START_BREAK] = JSON.parse(
      localStorage.getItem(StorageKey.AUTO_START_BREAK) as string
    );
    return result;
  };

  const handleOpenSetting = () => {
    setOpenSetting(true);
    reset(getAllSettingFromStorage());
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
  };

  return (
    <main>
      <div className='mim-h-screen min-w-full bg-primary-red text-white'>
        <div className='max-w-2xl min-h-screen mx-auto px-3'>
          <Header settingCallback={handleOpenSetting} />
          <div className='pt-10'>
            <Timer
              stagesTimeValue={stagesTimeValue}
              autoStartBreak={autoBreak}
              autoStartPomo={autoPomo}
              longBreakInterval={longBreakInterval}
            />
          </div>
        </div>
      </div>

      {/*setting modal*/}
      <div
        id='popup-modal'
        className={
          'fixed flex items-center justify-center top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto inset-0 max-h-full bg-black bg-opacity-40 ' +
          (!openSetting && ' hidden')
        }
        onClick={(e) => {
          e.stopPropagation();
          handleCloseSetting();
        }}
      >
        <div
          className='relative w-full max-w-md max-h-full'
          onClick={(event) => event.stopPropagation()}
        >
          <div className='relative bg-white rounded-lg shadow '>
            <button
              type='button'
              className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center '
              data-modal-hide='popup-modal'
              onClick={handleCloseSetting}
            >
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clip-rule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='p-6 w-full'>
                {/*time*/}
                <div className='mb-6 mt-5 w-full flex justify-between'>
                  <div className='max-w-[25%]'>
                    <label
                      for='pomo'
                      className='block mb-2 text-lg font-medium text-gray-500 '
                    >
                      Pomodoro
                    </label>
                    <input
                      id='pomo'
                      type='number'
                      // defaultValue={Math.floor(
                      //   getStageTimeValue().pomodoro / 60
                      // )}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-md p-2 w-full'
                      {...register('pomodoro')}
                      required
                    />
                  </div>
                  <div className='max-w-[25%]'>
                    <label
                      for='short'
                      className='block mb-2 text-lg font-medium text-gray-500 '
                    >
                      Short Break
                    </label>
                    <input
                      id='short'
                      type='number'
                      // defaultValue={Math.floor(
                      //   getStageTimeValue().shortBreak / 60
                      // )}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-md p-2 w-full'
                      {...register('shortBreak')}
                      required
                    />
                  </div>
                  <div className='max-w-[25%]'>
                    <label
                      for='long'
                      className='block mb-2 text-lg font-medium text-gray-500 '
                    >
                      Long Break
                    </label>
                    <input
                      id='long'
                      type='number'
                      // defaultValue={Math.floor(
                      //   getStageTimeValue().longBreak / 60
                      // )}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-md p-2 w-full'
                      {...register('longBreak')}
                      required
                    />
                  </div>
                </div>
                <div className='w-full'>
                  <label className='relative flex justify-between items-center mb-4 cursor-pointer'>
                    <span className='text-lg font-medium text-gray-500 '>
                      Auto start pomodoro
                    </span>
                    <div className='relative inline-flex items-center'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        // checked={getValues('autoStartPomo')}
                        {...register('autoStartPomo')}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </div>
                  </label>
                </div>
                <div className='w-full'>
                  <label className='relative flex justify-between items-center mb-4 cursor-pointer'>
                    <span className='text-lg font-medium text-gray-500 '>
                      Auto start break
                    </span>
                    <div className='relative inline-flex items-center'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        // checked={getValues('autoStartBreak')}
                        {...register('autoStartBreak')}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </div>
                  </label>
                </div>
                {/*auto*/}
                <button
                  data-modal-hide='popup-modal'
                  type='submit'
                  className='mt-5 text-white bg-primary-red hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2'
                >
                  {'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
