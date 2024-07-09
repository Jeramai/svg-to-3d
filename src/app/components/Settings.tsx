import gear from '@/../public/assets/gear.svg';
import { ISettings } from '@/types/ISettings';
import Image from 'next/image';
import { Dispatch, useState } from 'react';

export default function Settings({ settings, setSettings }: { settings: ISettings; setSettings: Dispatch<ISettings> }) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const toggleSettings = () => setShowSettingsModal((s) => !s);

  return (
    <>
      {/* Settings icon */}
      <div className='fixed top-4 right-4'>
        <button className='rounded-full bg-gray-800 hover:bg-gray-900 p-4 duration-300 aspect-square' onClick={toggleSettings}>
          <div className={`${showSettingsModal ? 'rotate-0' : 'rotate-[720deg]'} transform transition-all duration-300`}>
            <Image src={gear.src} alt='Settings' width={32} height={32} />
          </div>
        </button>
      </div>

      {/* Settings card */}
      <div
        className={`fixed bottom-1 right-0 ${showSettingsModal ? 'translate-x-0' : 'translate-x-full'} duration-300
          w-full max-w-[450px] bg-zinc-900 text-gray-200 rounded-l-3xl h-[80vh] p-5`}
      >
        <SettingsFields settings={settings} setSettings={setSettings} />
      </div>
    </>
  );
}
function SettingsFields({ settings, setSettings }: { settings: ISettings; setSettings: Dispatch<any> }) {
  return (
    <div>
      <label className='font-semibold' htmlFor='backgroundColor'>
        Background Color
      </label>
      <div className='mt-2'>
        <input
          id='backgroundColor'
          className='rounded-md bg-zinc-700 px-1 cursor-pointer'
          type='color'
          value={settings.backgroundColor || 0x000000}
          onChange={(e) => setSettings((s: ISettings) => ({ ...s, backgroundColor: e.target.value } as ISettings))}
        />
      </div>
    </div>
  );
}
