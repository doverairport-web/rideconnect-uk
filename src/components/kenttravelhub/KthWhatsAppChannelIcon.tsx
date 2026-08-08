/** Official WhatsApp Channels tab icon — green rounded square with megaphone. */
export function KthWhatsAppChannelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="24" height="24" rx="5.5" fill="#25D366" />
      <path
        fill="#fff"
        d="M7.25 9.5c0-.69.56-1.25 1.25-1.25h.9l5.35-2.35v11.2l-5.35-2.35h-.9c-.69 0-1.25-.56-1.25-1.25V9.5zm10.1 1.65 6.15 2.8v1.1l-6.15 2.8v-6.7zm1.4 3.35 4.6 2.1v.3l-4.6 2.1v-4.5z"
      />
    </svg>
  );
}
