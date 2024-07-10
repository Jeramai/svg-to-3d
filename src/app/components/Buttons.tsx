'use client';

import add from '@/../public/assets/arrow-counterclockwise.svg';
import Image from 'next/image';
import { Object3D } from 'three';

export default function Buttons({
  model,
  restart,
  name = 'svg-to-3d'
}: Readonly<{ model: Object3D; restart: any; name?: string }>) {
  const download = async () => {
    const GLTFExporter = (await import('three/addons/exporters/GLTFExporter.js')).GLTFExporter;
    const exporter = new GLTFExporter();

    exporter.parse(
      model,
      (result: any): void => {
        const blob = new Blob([result], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        link.href = URL.createObjectURL(blob);
        link.download = `${name}.glb`;
        link.click();
      },
      (error) => console.log('An error happened during parsing', error),
      { onlyVisible: false, binary: true }
    );
  };

  return (
    <div className='fixed bottom-3 w-full flex justify-center items-center'>
      <button
        className='rounded-full bg-gray-800 hover:bg-gray-900 p-3 aspect-square rotate-0 hover:rotate-[-360deg] transform transition-all duration-300'
        onClick={restart}
        disabled={!model}
      >
        <Image src={add.src} alt='Restart SVG to 3D' width={19} height={19} />
      </button>
      <span className='mx-3'>{' | '}</span>
      <button className='rounded-full bg-gray-800 hover:bg-gray-900 px-5 py-2 duration-300' onClick={download} disabled={!model}>
        Download
      </button>
      <span className='mx-3'>{' | '}</span>
      <form action='https://www.paypal.com/donate' method='post' target='_top'>
        <input type='hidden' name='hosted_button_id' value='DC2N4CH8AJCYW' />
        <button
          className='rounded-full bg-[#ffc439] hover:bg-[#9e7e34] text-black hover:text-white font-semibold px-5 py-2 duration-300'
          disabled={!model}
        >
          Donate
        </button>
      </form>
    </div>
  );
}
