const Logo = () => {
  return (
    <div className="flex p-3 md:p-4 justify-start items-center gap-2 md:gap-3 hover:bg-slate-800/50 rounded-xl transition-colors duration-200">
      <div className="relative flex-shrink-0">
        <svg
          id="logo-38"
          width="60"
          height="24"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg md:w-[78px] md:h-[32px]"
        >
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className="ccustom"
            fill="#8338ec"
          ></path>
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className="ccompli1"
            fill="#975aed"
          ></path>
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className="ccompli2"
            fill="#a16ee8"
          ></path>
        </svg>
      </div>
      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent truncate">
        QuickTalk
      </span>
    </div>
  );
};

export default Logo;
