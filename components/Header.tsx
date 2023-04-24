import Link from 'next/link';
import {IoMdSettings} from 'react-icons/io';
import {RiTimerFlashFill} from 'react-icons/ri';

interface HeaderProps {
  settingCallback: () => void;
}

function Header({settingCallback}: HeaderProps) {
  return (
    <div className='flex items-center justify-between h-16 border-b-1 border-b-zinc-800 border-opacity-20 '>
      <Link className='flex gap-1 items-center text-xl font-bold' href={'/'}>
        <RiTimerFlashFill className='w-6 h-6' />
        Pomofocus
      </Link>

      <div>
        <button
          onClick={settingCallback}
          className='flex gap-1 items-center px-4 py-2 text-sm bg-white bg-opacity-20 rounded-md hover:bg-opacity-15'
        >
          <IoMdSettings className='w-5 h-5' />
          Setting
        </button>
      </div>
    </div>
  );
}

export default Header;
