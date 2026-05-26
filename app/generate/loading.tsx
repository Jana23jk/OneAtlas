export default function GenerateLoading() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#635BFF] border-white/20" />
        <span className="text-sm text-white/60">Loading Generator...</span>
      </div>
    </div>
  );
}
