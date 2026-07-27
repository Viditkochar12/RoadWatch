function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-slate-300 border-t-yellow-400 rounded-full animate-spin"></div>

      {/* Loading Text */}
      <p className="mt-6 text-lg font-semibold text-slate-600">
        {text}
      </p>
    </div>
  );
}

export default Loader;