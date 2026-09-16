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
  { label: 'Websites', href: '/leistungen/websites/' },
  { label: 'Leistungen', href: '/leistungen/' },
  { label: 'Projekte', href: '/arbeiten/' },
  { label: 'Agentur', href: '/agentur/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

/** Primärer Handlungsaufruf (Header). */
export const primaryCta: NavItem = { label: 'Website anfragen', href: '/kontakt/' };

/** Footer-Navigation, thematisch gruppiert. */
export const footerNav: readonly NavGroup[] = [
  {
    title: 'Leistungen',
    items: [
      { label: 'Alle Leistungen', href: '/leistungen/' },
      { label: 'Websites', href: '/leistungen/websites/' },
      { label: 'SEO & GEO', href: '/leistungen/seo-geo/' },
      { label: 'Google-Unternehmensprofil', href: '/leistungen/google-unternehmensprofil/' },
      { label: 'Unternehmensvideo', href: '/leistungen/unternehmensvideo/' },
      { label: 'Social Media', href: '/leistungen/social-media/' },
      { label: 'KI & Automatisierung', href: '/leistungen/ki-automatisierung/' },
    ],
  },
  {
    title: 'Branchen',
    items: [
      { label: 'Alle Branchen', href: '/branchen/' },
      { label: 'Handwerk', href: '/branchen/handwerk/' },
      { label: 'Zahnarztpraxen', href: '/branchen/zahnarztpraxen/' },
      { label: 'Gastronomie & Hotels', href: '/branchen/gastronomie-hotels/' },
      { label: 'Lokale Dienstleister', href: '/branchen/lokale-dienstleister/' },
      { label: 'B2B-Mittelstand', href: '/branchen/b2b-mittelstand/' },
    ],
  },
  {
    title: 'KERNSEITE',
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
      { label: 'AGB', href: '/agb/' },
      { label: 'Bildnachweise', href: '/bildnachweise/' },
    ],
  },
];
