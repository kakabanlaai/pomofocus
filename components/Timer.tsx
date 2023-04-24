import useInterval from '@/hooks/useInterval';
import {StageInfo, StagesTimeValue} from '@/types';
import {createDefaultStages, secondToMinuteAndSecondString} from '@/utils';
import {useEffect, useState} from 'react';
import {BiSkipNext} from 'react-icons/bi';

interface TimerProps {
  stagesTimeValue: StagesTimeValue;
  autoStartBreak: boolean;
  autoStartPomo: boolean;
  longBreakInterval: number;
}

export const Timer = ({
  stagesTimeValue,
  autoStartBreak,
  autoStartPomo,
  longBreakInterval,
}: TimerProps) => {
  const [defaultStages, setDefaultStages] = useState(
    createDefaultStages(stagesTimeValue)
  );
  const [stage, setStage] = useState<StageInfo>(defaultStages.pomodoro);
  const [time, setTime] = useState(defaultStages.pomodoro.timeValue);
  const [countPomo, setCountPomo] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const [alarm, setAlarm] = useState<HTMLAudioElement | null>(null);
  // const [openModal, setOpenModal] = useState(false);
  // const [modalYesCallback, setModalYesCallback] = useState<() => void>(() => {});

  useEffect(() => {
    setAlarm(new Audio('/mlg-airhorn.mp3'));
  }, []);

  const displayTime = secondToMinuteAndSecondString(time);
  if (typeof window !== 'undefined') {
    document.title =
      displayTime +
      (stage.name === defaultStages.pomodoro.name
        ? ' - Time to focus!'
        : ' - Time for a break!');
  }

  useInterval(
    () => {
      setTime((prev) => prev - 1);
      if (time === 0) {
        skipStage();
        alarm?.play();
      }
    },
    isRunning ? 1000 : null
  );

  useEffect(() => {
    const newStages = createDefaultStages(stagesTimeValue);
    setDefaultStages(newStages);
    const newCurStatge = Object.values(newStages).find(
      (el) => (el as StageInfo).name === stage.name
    );
    switchStage(newCurStatge as StageInfo);
  }, [stagesTimeValue]);

  useEffect(() => {
    handleAutoStart();
  }, [stage]);

  const handleAutoStart = () => {
    if (autoStartPomo && stage.name === defaultStages.pomodoro.name) {
      setRunning(true);
    }
    if (
      autoStartBreak &&
      (stage.name === defaultStages.longBreak.name ||
        stage.name === defaultStages.shortBreak.name)
    ) {
      setRunning(true);
    }
  };

  const switchStage = (stage: StageInfo) => {
    setRunning(false);
    setStage(stage);
    setTime(stage.timeValue);
  };

  const skipStage = () => {
    switch (stage.name) {
      case defaultStages.pomodoro.name:
        setCountPomo((prev) => prev + 1);

        switchStage(
          countPomo % longBreakInterval === longBreakInterval - 1
            ? defaultStages.longBreak
            : defaultStages.shortBreak
        );
        break;
      default:
        switchStage(defaultStages.pomodoro);
        break;
    }
  };

  return (
    <>
      <div className='max-w-md mx-auto bg-white bg-opacity-20 rounded-md pt-5 pb-8'>
        {/*pomodoro stage*/}
        <div className='flex items-center justify-center'>
          {Object.values(defaultStages).map((el, idx) => (
            <button
              key={idx}
              className={
                'px-3 py-[2px] rounded-md ' +
                (el.name === stage.name && 'bg-gray-800 bg-opacity-30 font-bold')
              }
              onClick={() => {
                if (isRunning) {
                  if (
                    window.confirm(
                      'Timer is running, are you sure you want to switch?'
                    )
                  ) {
                    switchStage(el);
                  }
                } else {
                  switchStage(el);
                }
              }}
            >
              {el.name}
            </button>
          ))}
        </div>

        {/*time value*/}
        <div className='flex items-center justify-center text-9xl font-semibold mt-5 '>
          {displayTime}
        </div>

        {/*start / pause*/}
        <div className='relative flex items-center justify-center mt-5'>
          <button
            className={
              'w-48 h-14 rounded-md bg-white text-2xl font-bold text-primary-red hover:bg-opacity-90 ' +
              (!isRunning && 'border-b-gray-300 border-b-[5px]')
            }
            onClick={() => {
              setRunning((prev) => !prev);
            }}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>

          {/*skip stage*/}
          <div
            className={
              'absolute right-0 w-[calc((100%-200px)/2+5%)] flex items-center justify-center ' +
              (!isRunning ? 'hidden' : '')
            }
          >
            <button onClick={skipStage}>
              <BiSkipNext className='w-12 h-12' />
            </button>
          </div>
        </div>
      </div>
      {/* <Modal
        open={openModal}
        onClose={handleClose}
        content='Timer is running, are you sure you want to switch?'
        yesCallback={modalYesCallback}
        noCallback={handleClose}
      ></Modal> */}
      <div className=' max-w-md mx-auto flex justify-center mt-5 text-lg'>
        <button
          onClick={() => {
            if (window.confirm('Do you want refresh pomodoro count?')) {
              setCountPomo(0);
            }
          }}
          className=' hover:underline'
        >
          {'#' + countPomo}
        </button>
      </div>
    </>
  );
};
