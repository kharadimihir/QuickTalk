const Title = ({ text }) => {
  return (
    <div className="relative">
      <h6 className="uppercase tracking-wider text-slate-400 pl-4 md:pl-6 font-medium text-xs mb-1 relative">
        {text}
      </h6>
      <div className="absolute bottom-0 left-4 md:left-6 w-6 md:w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
    </div>
  );
};

export default Title;
