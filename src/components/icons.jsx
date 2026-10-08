// Logo akar — menggantikan ikon api pada streak kehadiran komsel (revisi v3).
export function RootIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 12V6" />
      <path d="M12 8c0-3 2-5 6-5 0 4-2 6-6 5z" />
      <path d="M12 9.5c0-2-1.5-3.5-4.5-3.5C7.5 9 9 10.5 12 9.5z" />
      <path d="M12 12c0 3-2 4.5-5 5.5" />
      <path d="M12 12c0 3 2 4.5 5 5.5" />
      <path d="M12 12v9" />
      <path d="M7 17.5 5 20M17 17.5l2 2.5" />
    </svg>
  )
}
