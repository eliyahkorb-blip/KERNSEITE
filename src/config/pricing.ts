/** Unverbindlicher Budgetrahmen für B2B-Projekte; Umfang wird im Angebot vereinbart. */
export const websiteOffer = {
  range: '1.500–3.600 €',
  note: 'Orientierungsrahmen für Unternehmenswebsites. Nettopreise, zuzüglich gesetzlicher Umsatzsteuer, soweit diese anfällt. Den verbindlichen Umfang und Preis erhältst du im Angebot.',
  includes: [
    'Struktur und individuelle Gestaltung deiner Seiten',
    'Abgestimmte Texte und Einbindung deiner Bilder',
    'Responsive Umsetzung für Smartphone und Desktop',
    'Technische SEO-Grundlage und klare Kontaktwege',
    'Gemeinsame Prüfung und Begleitung beim Live-Gang',
  ],
  additionalCosts:
    'Domain, Hosting und laufende Betreuung werden separat vereinbart. Zusätzliche Fotografie, Video und Rechtsberatung sind nicht im Orientierungsrahmen enthalten.',
} as const;
