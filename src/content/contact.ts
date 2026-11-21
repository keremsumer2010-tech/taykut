// İletişim bilgileri tek yerde. E-posta kullanıcı onaylayana kadar yer tutucu; telefon yayınlanmaz.
export const CONTACT = {
  /** TODO_EMAIL: kullanıcı onayı bekleniyor. Yer tutucu iken e-posta düğmeleri gizlenir. */
  email: 'TODO_EMAIL',
  instagram: 'teamtaykut',
  instagramUrl: 'https://www.instagram.com/teamtaykut/',
};

export const hasEmail = () => !CONTACT.email.startsWith('TODO_');
