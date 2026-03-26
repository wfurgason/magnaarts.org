// src/data/events.ts
// Single source of truth for 2025 event data.
// TODO: Replace with Supabase query in Phase 2.

export interface Event {
  id: string;
  type: 'concert' | 'film' | 'festival' | 'class' | 'openmic';
  date: string;         // display date, e.g. "June 13"
  isoDate: string;      // for sorting, e.g. "2025-06-13"
  day: string;          // full display, e.g. "Friday, June 13, 2025"
  time: string;
  title: string;
  subtitle?: string;    // supporting act or paired film title
  subtitleType?: 'band' | 'film';
  location: string;
  address?: string;
  description?: string;
  image?: string;       // path relative to /public
  tags: string[];
}

export const events: Event[] = [
  {
    id: 'runaway-fire-despicable-me-4',
    type: 'concert',
    date: 'Jun 13',
    isoDate: '2025-06-13',
    day: 'Friday, June 13, 2025',
    time: '8:00 PM',
    title: 'Runaway Fire',
    subtitle: 'Despicable Me 4',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'Kick off the summer series with Runaway Fire followed by a screening of Despicable Me 4 on our 35-ft inflatable screen. Free admission — bring a blanket and the whole family.',
    tags: ['Concert', 'Film'],
  },
  {
    id: 'buster-if',
    type: 'concert',
    date: 'Jun 20',
    isoDate: '2025-06-20',
    day: 'Friday, June 20, 2025',
    time: '8:00 PM',
    title: 'Buster',
    subtitle: 'IF',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'Salt Lake City rock band Buster takes the stage, followed by a screening of IF. Buster features Wes Furgason (drums), Karl Gilchrist (guitar/vocals), Dave Call (bass), and Jon Beutler (lead guitar).',
    image: '/images/concerts/Creature Vs.1.png',
    tags: ['Concert', 'Film'],
  },
  {
    id: 'ghost-of-spring-harold-purple-crayon',
    type: 'concert',
    date: 'Jun 27',
    isoDate: '2025-06-27',
    day: 'Friday, June 27, 2025',
    time: '8:00 PM',
    title: 'Ghost of Spring',
    subtitle: 'Harold and the Purple Crayon',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'Ghost of Spring performs live, followed by a showing of Harold and the Purple Crayon. A great night for families.',
    tags: ['Concert', 'Film'],
  },
  {
    id: 'dirt-cheap-captain-america',
    type: 'concert',
    date: 'Jul 11',
    isoDate: '2025-07-11',
    day: 'Friday, July 11, 2025',
    time: '8:00 PM',
    title: 'Dirt Cheap',
    subtitle: 'Captain America: Brave New World',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: "Dirt Cheap, Salt Lake City's premier AC/DC tribute band, brings the thunder. Followed by a screening of Captain America: Brave New World.",
    tags: ['Concert', 'Film', 'Tribute'],
  },
  {
    id: 'flying-coffee-beans-moana-2',
    type: 'concert',
    date: 'Jul 18',
    isoDate: '2025-07-18',
    day: 'Friday, July 18, 2025',
    time: '8:00 PM',
    title: 'The Flying Coffee Beans',
    subtitle: 'Moana 2',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'Heavy jazzy genrefluid jam rock from Utah. The Flying Coffee Beans blend funky bass lines, shreddy guitar, and tight drumming into something you have to hear. Followed by Moana 2.',
    tags: ['Concert', 'Film'],
  },
  {
    id: 'minecraft-movie',
    type: 'film',
    date: 'Jul 25',
    isoDate: '2025-07-25',
    day: 'Friday, July 25, 2025',
    time: '9:00 PM',
    title: 'The Minecraft Movie',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'From Warner Bros. and Legendary Pictures, starring Jason Momoa and Jack Black. The first-ever live-action Minecraft film comes to our 35-ft inflatable screen. Free admission.',
    tags: ['Film'],
  },
  {
    id: 'penrose-wonka',
    type: 'concert',
    date: 'Aug 1',
    isoDate: '2025-08-01',
    day: 'Friday, August 1, 2025',
    time: '8:00 PM',
    title: 'Penrose',
    subtitle: 'Wonka',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'Modern indie rock from Salt Lake City featuring vocalist Madison Penrose — American Idol Top 30 Finalist and Utah Idol 2014 winner. High energy, dynamic live performance. Followed by Wonka.',
    tags: ['Concert', 'Film'],
  },
  {
    id: 'anime-girlfriend-transformers-one',
    type: 'concert',
    date: 'Aug 8',
    isoDate: '2025-08-08',
    day: 'Friday, August 8, 2025',
    time: '8:00 PM',
    title: 'Anime Girlfriend',
    subtitle: 'Transformers One',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: 'An all-female rock group from Salt Lake City blending Rock, Midwest Emo, Shoegaze, Indie, and Pop into what they call "Mountain West Emo." Followed by Transformers One.',
    tags: ['Concert', 'Film'],
  },
  {
    id: 'mouth-wild-robot',
    type: 'concert',
    date: 'Aug 15',
    isoDate: '2025-08-15',
    day: 'Friday, August 15, 2025',
    time: '8:00 PM',
    title: 'Mouth',
    subtitle: 'Wild Robot',
    subtitleType: 'film',
    location: 'Pleasant Green Park',
    address: '3250 S 8400 W, Magna, UT 84044',
    description: "Salt Lake City's Mouth is a female-fronted alt punk outfit that blends catchy pop hooks with riot grrrl tenacity. Founded in 2019 by Rachel Clark and Jordan Clark. Followed by Wild Robot.",
    tags: ['Concert', 'Film'],
  },
  {
    id: 'arts-festival-2025',
    type: 'festival',
    date: 'Aug 2025',
    isoDate: '2025-08-01',
    day: 'August 2025',
    time: 'TBA',
    title: 'Magna Main Street Arts Festival',
    location: 'Historic Magna Main Street',
    description: 'Our annual flagship event draws 5,000–7,000 people to Historic Magna Main Street for a full day of live music, a fine arts contest, street performers, and arts and food vendors. Free and open to all.',
    tags: ['Festival', 'Family'],
  },
];

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}
