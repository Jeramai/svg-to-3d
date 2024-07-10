import add from '@/../public/assets/plus-circle.svg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function UploadField({ setSVG }: Readonly<{ setSVG: any }>) {
  const timeoutId = useRef<NodeJS.Timeout>();
  const [isCorrectFileType, setIsCorrectFileType] = useState<boolean>(true);

  const onFileChange = (e: any) => {
    if (!e.target.files[0]) return setSVG();
    setSVG(URL.createObjectURL(e.target.files[0]));
  };
  const handleFileDrop = (e: any) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles?.[0]?.type === 'image/svg+xml') {
      setSVG(URL.createObjectURL(droppedFiles[0]));
    } else {
      setIsCorrectFileType(false);
    }
  };
  const handleFileDrag = (e: any) => {
    e.preventDefault();
    setIsCorrectFileType(true);
  };

  // After 3 seconds of incorrect file, set back to true
  useEffect(() => {
    if (!isCorrectFileType) {
      clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
        setIsCorrectFileType(true);
      }, 3000);

      return () => clearTimeout(timeoutId.current);
    }
  }, [isCorrectFileType]);

  return (
    <button
      className='w-full h-full flex justify-center items-center p-10 pt-8 cursor-default'
      onDrop={handleFileDrop}
      onDragOver={handleFileDrag}
    >
      <label
        htmlFor='fileUpload'
        className={`w-full h-full flex flex-col justify-center items-center gap-3 rounded-3xl border-2 border-dashed p-5 cursor-pointer hover:bg-gray-800/20
           duration-300 ${isCorrectFileType ? 'border-gray-400 hover:border-gray-600' : 'border-red-400 hover:border-red-600'}`}
      >
        <Image src={add.src} alt='Add SVG' width={30} height={30} />
        <span>Drag & drop or click to choose SVG file</span>
      </label>

      <input
        id='fileUpload'
        type='file'
        accept='.svg'
        onChange={onFileChange}
        className='hidden rounded-full bg-gray-800 hover:bg-gray-900 px-5 py-2 duration-300 cursor-pointer'
      />
    </button>
  );
}
