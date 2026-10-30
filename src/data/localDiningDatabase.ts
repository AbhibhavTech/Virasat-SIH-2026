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
  mumbai: [
    {
      id: 'mumbai-aaswad-dadar', restaurant: 'Aaswad', locality: 'Dadar West, Mumbai',
      cuisine: 'Maharashtrian, South Indian', specialties: 'Long-running Dadar dining room known for Maharashtrian snacks and meals.',
      spendForTwo: 'About ₹300–₹400', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/19/ca/83/caption.jpg?h=1400&s=1&w=1400',
      imageNote: 'Photo: Aaswad, Dadar West', sourceName: 'Swiggy Dineout',
      sourceUrl: 'https://www.swiggy.com/restaurants/mumbai/dadar-west/aaswad-74193/dineout', checkedOn: '2026-10-30',
    },
    {
      id: 'mumbai-britannia-ballard-estate', restaurant: 'Britannia & Co.', locality: 'Ballard Estate, Fort',
      cuisine: 'Parsi, Irani, Indian', specialties: 'Historic Ballard Estate dining house; berry pulao and dhansak are signature dishes.',
      spendForTwo: null, image: 'https://images.indianexpress.com/2023/08/13267416_1730579430514056_958241867_n.jpg',
      imageNote: 'Photo: The Indian Express', sourceName: 'The Indian Express (photo)',
      sourceUrl: 'https://www.iranichaimumbai.com/britannia', checkedOn: '2026-10-30',
    },
  ],
  delhi: [
    {
      id: 'delhi-karims-jama-masjid', restaurant: "Karim's", locality: 'Matia Mahal, Jama Masjid, Old Delhi',
      cuisine: 'Mughlai, North Indian, kebab', specialties: 'Long-running Old Delhi kitchen known for Mughlai curries, kebabs and roomali roti.',
      spendForTwo: 'About ₹800–₹1,500', image: 'https://www.themuslimtraveler.net/wp-content/uploads/2024/04/restaurant_683499_restaurant120220510112018-e1711947988634.jpeg',
      imageNote: 'Photo: The Muslim Traveler', sourceName: 'The Delih Guide',
      sourceUrl: 'https://www.thedelihguide.com/city/delhi/articles/dining-in-the-shadow-of-emperors-in-delhi', checkedOn: '2026-10-30',
    },
    {
      id: 'delhi-al-jawahar-jama-masjid', restaurant: 'Al Jawahar', locality: 'Matia Mahal, Jama Masjid, Old Delhi',
      cuisine: 'Mughlai, North Indian', specialties: 'Old Delhi sit-down restaurant known for nihari and korma.',
      spendForTwo: 'About ₹600–₹1,200', image: 'https://img.magicpin.com/4861_cover_0.webp',
      imageNote: 'Photo: Al Jawahar listing', sourceName: 'The Delih Guide',
      sourceUrl: 'https://www.thedelihguide.com/city/delhi/articles/chandni-chowk-on-an-empty-stomach-delhi-s-old-city-food-walk-one-lane-at-a-time', checkedOn: '2026-10-30',
    },
  ],
  jaipur: [
    {
      id: 'jaipur-niros-mi-road', restaurant: 'Niros', locality: 'MI Road, Jaipur',
      cuisine: 'Rajasthani, North Indian, Mughlai, continental', specialties: 'Established central Jaipur restaurant with regional and multi-cuisine dishes.',
      spendForTwo: 'About ₹2,000', image: 'https://cdn.enprimeurclub.com/storage/v1/object/public/images/restaurants/55f0c0c0-cffd-4f2b-81d2-7e010633d801/hero1.jpg?aspect_ratio=1.91%3A1&crop_gravity=center&quality=85&width=1200',
      imageNote: 'Photo: En Primeur Club', sourceName: 'Zomato',
      sourceUrl: 'https://www.zomato.com/jaipur/niros-mi-road', checkedOn: '2026-10-30',
    },
  ],
  agra: [
    {
      id: 'agra-peshawri-itc-mughal', restaurant: 'Peshawri · ITC Mughal', locality: 'Tajganj, Agra',
      cuisine: 'North-West Frontier, Mughlai', specialties: 'Hotel restaurant known for tandoor and frontier-style dishes.',
      spendForTwo: 'About ₹6,000', image: 'https://cache.marriott.com/is/image/marriotts7prod/lc-agrlc-peshawri-19805-12246%3AWide-Hor?fit=constrain&wid=1336',
      imageNote: 'Photo: ITC Mughal / Marriott', sourceName: 'Swiggy Dineout',
      sourceUrl: 'https://www.swiggy.com/restaurants/agra/tajganj/peshawri-itc-mughal-1052112/dineout', checkedOn: '2026-10-30',
    },
    {
      id: 'agra-capri-restaurant', restaurant: 'Capri Restaurant', locality: 'Delhi Gate Road, Hariparwat, Agra',
      cuisine: 'Mughlai, North Indian, Chinese', specialties: 'Long-running Agra restaurant with North Indian and Mughlai dishes.',
      spendForTwo: 'About ₹900', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&auto=format&fit=crop&q=82',
      imageNote: 'Illustrative Mughlai meal photo', sourceName: 'Capri Restaurant',
      sourceUrl: 'https://caprirestaurant.in/menu/capri-restaurant-agra/', checkedOn: '2026-10-30',
    },
  ],
  kolkata: [
    {
      id: 'kolkata-peter-cat-park-street', restaurant: 'Peter Cat', locality: 'Stephen Court, Park Street Area, Kolkata',
      cuisine: 'North Indian, Mughlai, Continental', specialties: 'Park Street dining room known for Chelo Kebab and classic continental dishes.',
      spendForTwo: 'About ₹1,000–₹1,400', image: 'https://th-i.thgim.com/public/incoming/8mdwxb/article67019023.ece/alternates/FREE_1200/Petercat2.jpg',
      imageNote: 'Photo: The Hindu', sourceName: 'Swiggy Dineout; photo: The Hindu',
      sourceUrl: 'https://www.swiggy.com/restaurants/kolkata/park-street/peter-cat-4483/dineout/menu', checkedOn: '2026-10-30',
    },
  ],
  bengaluru: [
    {
      id: 'bengaluru-mtr-st-marks-road', restaurant: 'Mavalli Tiffin Room (MTR)', locality: 'St. Marks Road, Bengaluru',
      cuisine: 'South Indian, vegetarian', specialties: 'Traditional tiffin and South Indian breakfast dishes, including idli and dosa.',
      spendForTwo: 'About ₹400', image: 'https://foodiesonly.in/_next/image?q=75&url=https%3A%2F%2Fs7ap1.scene7.com%2Fis%2Fimage%2Fitcportalprod%2FMavalli%2BTiffin%2BRoom%2B-%2Binset%2Bimage%2B2&w=3840',
      imageNote: 'Photo: Mavalli Tiffin Room', sourceName: 'Swiggy Dineout',
      sourceUrl: 'https://www.swiggy.com/restaurants/bangalore/st-marks-road/mavalli-tiffin-room-mtr-49096/dineout', checkedOn: '2026-10-30',
    },
  ],
  chennai: [
    {
      id: 'chennai-murugan-idli-t-nagar', restaurant: 'Murugan Idli Shop', locality: 'T. Nagar, Chennai',
      cuisine: 'South Indian, vegetarian', specialties: 'Idli, sweet pongal, chutneys, sambar and filter coffee.',
      spendForTwo: 'About ₹200–₹300', image: 'https://imgmediagumlet.lbb.in/media/2018/12/5c232c879f3bc60efdd78cea_1545809031242.jpg',
      imageNote: 'Photo: LBB Chennai', sourceName: 'Swiggy / LBB Chennai',
      sourceUrl: 'https://www.swiggy.com/city/chennai/murugan-idli-shop-100-feet-bypass-road-velachery-rest14724', checkedOn: '2026-10-30',
    },
  ],
  hyderabad: [
    {
      id: 'hyderabad-paradise-hitech-city', restaurant: 'Paradise', locality: 'HITEC City, Madhapur, Hyderabad',
      cuisine: 'Biryani, Indian', specialties: 'A biryani-focused restaurant; check the selected outlet’s current menu before visiting.',
      spendForTwo: 'About ₹800', image: 'https://b.zmtcdn.com/data/pictures/chains/2/91662/5c6f76bd1844f3814073926aadcb49ec.jpg',
      imageNote: 'Photo: Paradise Biryani listing', sourceName: 'Magicpin',
      sourceUrl: 'https://magicpin.in/Hyderabad/Hitech-City/Restaurant/Paradise/store/854cb/menu', checkedOn: '2026-10-30',
    },
  ],
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
