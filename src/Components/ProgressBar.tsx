const ProgressBar = () => {
  // Create an array of 8 items to map through
  const segments = Array(5).fill(null);

  return (
    <div className="fixed top-0 left-0 w-screen h-10 px-6 py-3 bg-white border-b border-[#f2f4f7] justify-start items-center gap-4 inline-flex">
      {segments.map((_, index) => (
        <div
          key={index}
          className="grow shrink basis-0 p-1.5 rounded flex-col justify-start items-start inline-flex"
        >
          <div className="self-stretch h-2 bg-[#f2f4f7] rounded" />
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
