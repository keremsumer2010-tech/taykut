// Takım üyeleri (kullanıcı beyanı, 2026-11-21). Sıra kullanıcının verdiği sıradır.
// Rol bilinmiyorsa null: arayüz rol satırını gizler. Fotoğraf yok (varsayılan: illüstrasyon amblemi).
export type Emblem = 'wheel' | 'rocker' | 'arm' | 'antenna' | 'gear' | 'camera' | 'drill' | 'compass';

export interface Member {
  name: string;
  role: 'captain' | null;
  emblem: Emblem;
}

export const MEMBERS: Member[] = [
  { name: 'Kerem Sümer', role: 'captain', emblem: 'compass' },
  { name: 'Mehmet Revaha Emuce', role: null, emblem: 'wheel' },
  { name: 'Yağız Eymen Yanık', role: null, emblem: 'rocker' },
  { name: 'Kerem Şakir', role: null, emblem: 'arm' },
  { name: 'Ahmet Özhan Öztürk', role: null, emblem: 'antenna' },
  { name: 'Mehmet Emir Erdoğmuş', role: null, emblem: 'gear' },
  { name: 'İbrahim Enes Yeşil', role: null, emblem: 'camera' },
];

export const ADVISOR = { name: 'Mustafa Seyhan', emblem: 'drill' as Emblem };
