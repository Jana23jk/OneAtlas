export default function TemplatesLoading() {
  return (
    <div className="min-h-screen bg-[#1A1F36] flex flex-col items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#7A73FF] border-white/20" />
        <span className="text-sm text-white/60">Loading Templates...</span>
      </div>
    </div>
  );
}
