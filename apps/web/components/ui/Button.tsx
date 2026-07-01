export function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
