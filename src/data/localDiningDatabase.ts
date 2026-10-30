export interface LocalDiningRecord {
  id: string;
  restaurant: string;
  locality: string;
  cuisine: string;
  specialties: string;
  spendForTwo: string | null;
  image: string;
  imageNote: string;
  sourceName: string;
  sourceUrl: string;
  checkedOn: string;
}

// Area-level recommendations that are missing from the city/state guides.
// Price figures are directory estimates for two, not menu quotes or live prices.
export const LOCAL_DINING_DATABASE: Record<string, LocalDiningRecord[]> = {
  'old-goa': [
    {
      id: 'old-goa-adlem-goi', restaurant: 'Adlem Goi', locality: 'Dauji Road, Old Goa',
      cuisine: 'Goan, seafood, Indian', specialties: 'Goan seafood and regional dishes; a convenient meal stop around the heritage quarter.',
      spendForTwo: 'About ₹1,100', image: 'https://b.zmtcdn.com/data/pictures/8/19198898/57d0b1de83506e83d988d39f4b489b80.jpg?crop=750%3A500%3B%2A%2C%2A&fit=around%7C750%3A500',
      imageNote: 'Photo: Zomato listing', sourceName: 'Zomato',
      sourceUrl: 'https://www.zomato.com/goa/adlem-goi-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-cafe-tinto', restaurant: 'Café Tinto · The Fern Kadamba', locality: 'Old Goa',
      cuisine: 'Goan, Indian, café', specialties: 'Multi-cuisine dining near the Old Goa heritage precinct.',
      spendForTwo: 'About ₹1,500', image: 'https://b.zmtcdn.com/data/reviews_photos/479/f2104b15296518cf672f823464343479_1757335460.jpg?crop=960%3A500%3B%2A%2C%2A&fit=around%7C960%3A500',
      imageNote: 'Photo: Zomato listing', sourceName: 'Zomato',
      sourceUrl: 'https://www.zomato.com/goa/caf%C3%A9-tinto-the-fern-kadamba-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-the-rasoda', restaurant: 'The Rasoda', locality: 'Old Goa',
      cuisine: 'North Indian, kebab, biryani', specialties: 'North Indian meals and snacks close to the Old Goa area.',
      spendForTwo: 'About ₹1,000', image: 'https://imgmediagumlet.lbb.in/media/2020/01/5e1ec2c0bb9d7b235306804f_1579074240605.jpg',
      imageNote: 'Photo: LBB Goa', sourceName: 'Zomato listing; photo: LBB Goa',
      sourceUrl: 'https://www.zomato.com/goa/the-rasoda-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-miros', restaurant: 'Miros', locality: 'Old Goa',
      cuisine: 'Italian, continental', specialties: 'A continental option listed in the Old Goa dining area.',
      spendForTwo: 'About ₹1,000', image: 'https://b.zmtcdn.com/data/pictures/9/21515869/19794b5b47bdad5b5159fa0d312c04e0.jpeg',
      imageNote: 'Photo: Zomato listing', sourceName: 'Zomato',
      sourceUrl: 'https://www.zomato.com/goa/miros-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-copita', restaurant: 'Copita · Riverside Bistro & Bar', locality: 'Old Goa / Mandovi riverside',
      cuisine: 'Seafood, continental', specialties: 'Riverside dining with seafood and continental dishes.',
      spendForTwo: 'About ₹2,200', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=82',
      imageNote: 'Illustrative riverside dining photo', sourceName: 'Zomato Old Goa listings',
      sourceUrl: 'https://www.zomato.com/goa/best-lunch-in-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-star-bar', restaurant: 'Star Bar & Restaurant', locality: 'Ribandar, near Old Goa',
      cuisine: 'Goan, seafood', specialties: 'Local Goan dishes; fish thali is highlighted in regional food coverage.',
      spendForTwo: 'About ₹1,000', image: 'https://media.assettype.com/gomantaktimes/2025-05-17/q40jsx7a/GT-720x1280-2025-05-17T094232.972.jpg',
      imageNote: 'Photo: Gomantak Times', sourceName: 'Gomantak Times',
      sourceUrl: 'https://www.gomantaktimes.com/ampstories/web-stories/explore-the-culinary-delights-of-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-seafood-inn', restaurant: 'The Seafood Inn', locality: 'Diwar Ferry Road, Old Goa',
      cuisine: 'Goan, seafood, Chinese', specialties: 'Goan thali, seafood and Chinese dishes; the listing is opposite Se Cathedral.',
      spendForTwo: 'About ₹1,100', image: 'https://b.zmtcdn.com/data/pictures/chains/4/21046164/a9583e413cd913ce1b91494e67fcc2d4.jpg',
      imageNote: 'Photo: Zomato listing', sourceName: 'Zomato',
      sourceUrl: 'https://www.zomato.com/goa/the-seafood-inn-old-goa', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-society-cafe', restaurant: 'Society Cafe', locality: 'Old Goa',
      cuisine: 'Seafood, café', specialties: 'Casual café listing in Old Goa; confirm the current menu and service before heading over.',
      spendForTwo: 'About ₹900', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=82',
      imageNote: 'Illustrative dining photo', sourceName: 'Magicpin Old Goa listings',
      sourceUrl: 'https://magicpin.in/india/Goa/Old-Goa/Restaurant/', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-mistur-kud', restaurant: 'Mistur Kud Restaurant', locality: 'Old Goa',
      cuisine: 'Goan, seafood, North Indian, Chinese', specialties: 'A multi-cuisine local option listed around the Old Goa area.',
      spendForTwo: 'About ₹1,000', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=82',
      imageNote: 'Illustrative dining photo', sourceName: 'Magicpin Old Goa listings',
      sourceUrl: 'https://magicpin.in/india/Goa/Old-Goa/Restaurant/', checkedOn: '2026-10-30',
    },
    {
      id: 'old-goa-friends-corner', restaurant: 'Friends Corner Family Restaurant', locality: 'Old Goa',
      cuisine: 'Goan, biryani, North Indian', specialties: 'Budget-friendly family restaurant listing with Goan and North Indian options.',
      spendForTwo: 'About ₹350', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=82',
      imageNote: 'Illustrative dining photo', sourceName: 'Magicpin Old Goa listings',
      sourceUrl: 'https://magicpin.in/india/Goa/Old-Goa/Restaurant/', checkedOn: '2026-10-30',
    },
  ],
};
