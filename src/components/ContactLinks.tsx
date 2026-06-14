import {
  email,
  phones,
  telHref,
  whatsappDisplay,
  whatsappHref,
} from "@/lib/contact";
import {
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_URL,
  YELL_LISTING_URL,
  YELL_REVIEW_URL,
} from "@/lib/directories";

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {phones.map((phone) => (
        <li key={phone}>
          <a
            href={`tel:${telHref(phone)}`}
            className="hover:text-brand-green"
          >
            {phone}
          </a>
        </li>
      ))}
      <li>
        <a href={`mailto:${email}`} className="hover:text-brand-green">
          {email}
        </a>
      </li>
      <li>
        <a
          href={whatsappHref("Hi, I'd like to book a taxi.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-brand-green"
        >
          WhatsApp {whatsappDisplay}
        </a>
      </li>
      <li>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-green"
        >
          Google Maps
        </a>
      </li>
      <li>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-green"
        >
          Leave a Google review
        </a>
      </li>
      <li>
        <a
          href={YELL_LISTING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-green"
        >
          Find us on Yell
        </a>
      </li>
      <li>
        <a
          href={YELL_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-green"
        >
          Leave a Yell review
        </a>
      </li>
    </ul>
  );
}
