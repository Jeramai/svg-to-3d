import gear from '@/../public/assets/gear.svg';
import { ISettings } from '@/types/ISettings';
import Image from 'next/image';
import { Dispatch, useState } from 'react';

export default function Settings({
  settings,
  setSettings,
  background,
  setBackground
}: Readonly<{ settings: ISettings; setSettings: Dispatch<ISettings>; background: string; setBackground: Dispatch<string> }>) {
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
        className={`fixed top-24 right-0 ${showSettingsModal ? 'translate-x-0' : 'translate-x-full'} duration-300
          max-w-[450px] bg-zinc-900 text-gray-200 rounded-l-3xl p-5`}
      >
        <SettingsFields settings={settings} setSettings={setSettings} background={background} setBackground={setBackground} />
      </div>
    </>
  );
}
function SettingsFields({
  settings,
  setSettings,
  background,
  setBackground
}: Readonly<{ settings: ISettings; setSettings: Dispatch<any>; background: string; setBackground: Dispatch<string> }>) {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <label className='font-semibold' htmlFor='backgroundColor'>
          Background Color
        </label>
        <div className='mt-2'>
          <input
            id='backgroundColor'
            className='rounded-md bg-zinc-700 px-1 cursor-pointer'
            type='color'
            value={background || 0x000000}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className='font-semibold' htmlFor='modelDepth'>
          3D depth
        </label>
        <div className='mt-1'>
          <input
            id='modelDepth'
            className='rounded-md bg-zinc-700 px-1 cursor-pointer'
            type='number'
            value={settings?.depth || 0}
            onChange={(e) => setSettings((s: ISettings) => ({ ...s, depth: e.target.valueAsNumber }))}
          />
        </div>
      </div>
    </div>
  );
}
