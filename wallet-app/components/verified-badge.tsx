export default function VerifiedBadge() {
  return (
    <div className="bg-black bg-opacity-70 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      <span className="text-white text-[10px] font-medium whitespace-nowrap">Photo verified</span>
    </div>
  )
}
