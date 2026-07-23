export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface NavGroup {
  readonly title: string;
  readonly items: readonly NavItem[];
}

/** Hauptnavigation (Header, Desktop + Mobil). */
export const mainNav: readonly NavItem[] = [
  { label: 'Leistungen', href: '/leistungen/' },
  { label: 'Arbeiten', href: '/arbeiten/' },
  { label: 'Branchen', href: '/branchen/' },
  { label: 'Agentur', href: '/agentur/' },
  { label: 'Prozess', href: '/prozess/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

/** Primärer Handlungsaufruf (Header). */
export const primaryCta: NavItem = { label: 'Projekt besprechen', href: '/kontakt/' };

/** Footer-Navigation, thematisch gruppiert. */
export const footerNav: readonly NavGroup[] = [
  {
    title: 'Leistungen',
    items: [
      { label: 'Websites', href: '/leistungen/websites/' },
      { label: 'Google-Unternehmensprofil', href: '/leistungen/google-unternehmensprofil/' },
      { label: 'Unternehmensvideo', href: '/leistungen/unternehmensvideo/' },
      { label: 'Social Media', href: '/leistungen/social-media/' },
      { label: 'KI & Automatisierung', href: '/leistungen/ki-automatisierung/' },
    ],
  },
  {
    title: 'Branchen',
    items: [
      { label: 'Handwerk', href: '/branchen/handwerk/' },
      { label: 'Zahnarztpraxen', href: '/branchen/zahnarztpraxen/' },
      { label: 'Gastronomie & Hotels', href: '/branchen/gastronomie-hotels/' },
      { label: 'Lokale Dienstleister', href: '/branchen/lokale-dienstleister/' },
      { label: 'B2B-Mittelstand', href: '/branchen/b2b-mittelstand/' },
    ],
  },
  {
    title: 'Studio',
    items: [
      { label: 'Agentur', href: '/agentur/' },
      { label: 'Prozess', href: '/prozess/' },
      { label: 'Arbeiten', href: '/arbeiten/' },
      { label: 'FAQ', href: '/faq/' },
      { label: 'Kontakt', href: '/kontakt/' },
    ],
  },
  {
    title: 'Rechtliches',
    items: [
      { label: 'Impressum', href: '/impressum/' },
      { label: 'Datenschutz', href: '/datenschutz/' },
      { label: 'Barrierefreiheit', href: '/barrierefreiheit/' },
    ],
  },
];
