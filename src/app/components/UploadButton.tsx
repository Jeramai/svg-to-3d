export default function UploadButton({ setSVG }: Readonly<{ setSVG: any }>) {
  const onFileChange = (e: any) => {
    if (!e.target.files[0]) return setSVG();
    setSVG(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <input
        type='file'
        accept='.svg'
        onChange={onFileChange}
        className='rounded-full bg-gray-800 hover:bg-gray-900 px-5 py-2 duration-300 cursor-pointer'
      />
    </div>
  );
}
