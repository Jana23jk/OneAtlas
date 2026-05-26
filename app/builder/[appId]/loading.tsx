export default function BuilderLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FF] text-[#1A1F36]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E7EAF5] border-t-[#7A73FF]" />
        <span className="text-sm text-[#667085]">Loading builder workspace…</span>
      </div>
    </div>
  );
}
