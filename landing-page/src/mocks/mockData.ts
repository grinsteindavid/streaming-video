import { Video, VideoCategory, Subtitle } from '@/types/video';

// Mock subtitles
const englishSubtitles: Subtitle = {
  language: 'en',
  url: '/subtitles/en.vtt'
};

const spanishSubtitles: Subtitle = {
  language: 'es',
  url: '/subtitles/es.vtt'
};

const frenchSubtitles: Subtitle = {
  language: 'fr',
  url: '/subtitles/fr.vtt'
};

// Mock videos data
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'The Tomorrow War',
    description: 'A family man is drafted to fight in a future war where the fate of humanity relies on his ability to confront the past.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BNTI2YTI0MWEtNGQ4OS00ODIzLWE1MWEtZGJiN2E3ZmM1OWI1XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    videoUrl: 'https://example.com/videos/tomorrow-war.m3u8',
    duration: 8280, // 2h 18m in seconds
    releaseDate: '2021-07-02',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Chris Pratt', 'Yvonne Strahovski', 'J.K. Simmons'],
    director: 'Chris McKay',
    rating: 6.6,
    isFeatured: true,
    isNew: false,
    subtitles: [englishSubtitles, spanishSubtitles, frenchSubtitles]
  },
  {
    id: '2',
    title: 'The Wheel of Time',
    description: 'Set in a high fantasy world where magic exists, but only some can access it, a woman named Moiraine crosses paths with five young men and women. This sparks a dangerous, world-spanning journey.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BYzA2Nzk5M2EtNWY4Yi00ZDY4LThkZTgtYjhhNWEyMGY0MjFjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    videoUrl: 'https://example.com/videos/wheel-of-time.m3u8',
    duration: 3600, // 1h in seconds
    releaseDate: '2021-11-19',
    genre: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    cast: ['Rosamund Pike', 'Daniel Henney', 'Madeleine Madden'],
    director: 'Rafe Judkins',
    rating: 7.1,
    isFeatured: true,
    isNew: true,
    subtitles: [englishSubtitles, spanishSubtitles]
  },
  {
    id: '3',
    title: 'The Boys',
    description: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BOTEyNDJhMDAtY2U5ZS00OTMzLTkwODktMjU3MjFkZWVlMGYyXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/the-boys.m3u8',
    duration: 3600, // 1h in seconds
    releaseDate: '2019-07-26',
    genre: ['Action', 'Comedy', 'Crime', 'Sci-Fi'],
    cast: ['Karl Urban', 'Jack Quaid', 'Antony Starr'],
    director: 'Eric Kripke',
    rating: 8.7,
    isFeatured: true,
    isNew: false,
    subtitles: [englishSubtitles]
  },
  {
    id: '4',
    title: 'Invincible',
    description: 'An adult animated series based on the Skybound/Image comic about a teenager whose father is the most powerful superhero on the planet.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BNWYwNGEyNTgtMDNkZS00OTk0LWFhMmQtY2M0MWRlMzVjMjQ2XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    videoUrl: 'https://example.com/videos/invincible.m3u8',
    duration: 2700, // 45m in seconds
    releaseDate: '2021-03-26',
    genre: ['Animation', 'Action', 'Adventure', 'Drama'],
    cast: ['Steven Yeun', 'J.K. Simmons', 'Sandra Oh'],
    director: 'Robert Kirkman',
    rating: 8.7,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles, spanishSubtitles]
  },
  {
    id: '5',
    title: 'The Marvelous Mrs. Maisel',
    description: 'A housewife in the early 1960s decides to become a stand-up comic.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BMzk2ZmFhNjMtOWM1Yy00YWM2LWFiZjYtZDdlYzVjMzc3OWVmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    videoUrl: 'https://example.com/videos/mrs-maisel.m3u8',
    duration: 3300, // 55m in seconds
    releaseDate: '2017-03-17',
    genre: ['Comedy', 'Drama'],
    cast: ['Rachel Brosnahan', 'Alex Borstein', 'Michael Zegen'],
    director: 'Amy Sherman-Palladino',
    rating: 8.7,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles, frenchSubtitles]
  },
  {
    id: '6',
    title: 'The Underground Railroad',
    description: 'A young woman named Cora makes an amazing discovery during her attempt to break free from slavery in the deep south.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BM2EwMmRhMmUtMzBmMS00ZDQ3LTg4OGEtNjlkODk3ZTMxMmJlXkEyXkFqcGdeQXVyMjM5ODk1NDU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/underground-railroad.m3u8',
    duration: 3600, // 1h in seconds
    releaseDate: '2021-05-14',
    genre: ['Drama', 'History', 'War'],
    cast: ['Thuso Mbedu', 'Chase W. Dillon', 'Joel Edgerton'],
    director: 'Barry Jenkins',
    rating: 7.7,
    isFeatured: false,
    isNew: true,
    subtitles: [englishSubtitles, spanishSubtitles]
  },
  {
    id: '7',
    title: 'Fleabag',
    description: 'A comedy series adapted from the award-winning play about a young woman trying to cope with life in London whilst coming to terms with a recent tragedy.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BMjA4MzU5NzQxNV5BMl5BanBnXkFtZTgwOTg3MDA5NzM@._V1_.jpg',
    videoUrl: 'https://example.com/videos/fleabag.m3u8',
    duration: 1800, // 30m in seconds
    releaseDate: '2016-07-21',
    genre: ['Comedy', 'Drama'],
    cast: ['Phoebe Waller-Bridge', 'Sian Clifford', 'Olivia Colman'],
    director: 'Phoebe Waller-Bridge',
    rating: 8.7,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles]
  },
  {
    id: '8',
    title: 'Good Omens',
    description: 'A tale of the bungling of Armageddon features an angel, a demon, an eleven-year-old Antichrist, and a doom-saying witch.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BNzY1YjIxOGMtOTAyZC00YTcyLWFhMzQtZTJkYTljYzU0MGRlXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/good-omens.m3u8',
    duration: 3300, // 55m in seconds
    releaseDate: '2019-05-31',
    genre: ['Comedy', 'Fantasy'],
    cast: ['David Tennant', 'Michael Sheen', 'Frances McDormand'],
    director: 'Douglas Mackinnon',
    rating: 8.1,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles, spanishSubtitles, frenchSubtitles]
  },
  {
    id: '9',
    title: 'The Expanse',
    description: 'In the 24th century, a disparate band of antiheroes unravel a vast conspiracy that threatens the Solar System\'s fragile state of cold war.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BZDVmMDljM2QtZDkzZC00ZDU3LWI0ODQtN2EyZjlkMjU2ZmVjXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/the-expanse.m3u8',
    duration: 3600, // 1h in seconds
    releaseDate: '2015-12-14',
    genre: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
    cast: ['Steven Strait', 'Dominique Tipper', 'Wes Chatham'],
    director: 'Mark Fergus',
    rating: 8.5,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles, spanishSubtitles]
  },
  {
    id: '10',
    title: 'The Grand Tour',
    description: 'Follow Jeremy, Richard, and James, as they embark on an adventure across the globe, driving new and exciting automobiles from manufacturers all over the world.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BYjkyOGViMjgtYmViYS00ZTVjLWIxZmYtNDgxYmMyY2YzODFkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/grand-tour.m3u8',
    duration: 3600, // 1h in seconds
    releaseDate: '2016-11-18',
    genre: ['Comedy', 'Talk-Show'],
    cast: ['Jeremy Clarkson', 'Richard Hammond', 'James May'],
    director: 'Phil Churchward',
    rating: 8.7,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles]
  },
  {
    id: '11',
    title: 'Reacher',
    description: 'Jack Reacher, a veteran military police investigator, has recently entered civilian life when he is falsely accused of murder.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BNzQ4MGYzYzAtNjJlOC00NTdkLTlmNTAtMmZjMzZmZTg3YWEwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/reacher.m3u8',
    duration: 3000, // 50m in seconds
    releaseDate: '2022-02-04',
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    cast: ['Alan Ritchson', 'Malcolm Goodwin', 'Willa Fitzgerald'],
    director: 'Nick Santora',
    rating: 8.1,
    isFeatured: false,
    isNew: true,
    subtitles: [englishSubtitles, spanishSubtitles]
  },
  {
    id: '12',
    title: 'Upload',
    description: 'A man is able to choose his own afterlife after his untimely death by having his consciousness uploaded into a virtual world.',
    thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BNWRhYTY4ZDEtYzRiNy00YTBjLWJlZDYtNTJlM2M2YmU5ZmZlXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    videoUrl: 'https://example.com/videos/upload.m3u8',
    duration: 1800, // 30m in seconds
    releaseDate: '2020-05-01',
    genre: ['Comedy', 'Mystery', 'Sci-Fi'],
    cast: ['Robbie Amell', 'Andy Allo', 'Allegra Edwards'],
    director: 'Greg Daniels',
    rating: 8.0,
    isFeatured: false,
    isNew: false,
    subtitles: [englishSubtitles, frenchSubtitles]
  }
];

// Mock categories data
export const mockCategories: VideoCategory[] = [
  {
    id: 'cat1',
    name: 'Featured',
    videos: mockVideos.filter(video => video.isFeatured)
  },
  {
    id: 'cat2',
    name: 'New Releases',
    videos: mockVideos.filter(video => video.isNew)
  },
  {
    id: 'cat3',
    name: 'Action & Adventure',
    videos: mockVideos.filter(video => 
      video.genre.includes('Action') || video.genre.includes('Adventure')
    )
  },
  {
    id: 'cat4',
    name: 'Comedy',
    videos: mockVideos.filter(video => video.genre.includes('Comedy'))
  },
  {
    id: 'cat5',
    name: 'Drama',
    videos: mockVideos.filter(video => video.genre.includes('Drama'))
  },
  {
    id: 'cat6',
    name: 'Sci-Fi & Fantasy',
    videos: mockVideos.filter(video => 
      video.genre.includes('Sci-Fi') || video.genre.includes('Fantasy')
    )
  },
  {
    id: 'cat7',
    name: 'Top Rated',
    videos: [...mockVideos].sort((a, b) => b.rating - a.rating).slice(0, 6)
  }
];
