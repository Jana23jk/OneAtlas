export default function GenerateLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FF] flex flex-col items-center justify-center text-[#1A1F36]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#F8BC42] border-[#E7EAF5]" />
        <span className="text-sm text-[#667085]">Loading Generator...</span>
      </div>
    </div>
  );
}
