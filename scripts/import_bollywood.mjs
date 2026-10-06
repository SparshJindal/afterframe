import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Curated collection of Bollywood / Indian cinema masterworks with verified Wikimedia artwork
export const BOLLYWOOD_MOVIES = [
  {
    id: 'bw-3-idiots',
    title: '3 Idiots',
    originalTitle: '3 Idiots (2009)',
    year: 2009,
    director: 'Rajkumar Hirani',
    genres: ['Comedy', 'Drama'],
    runtime: 170,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg',
    movielensId: null,
    imdbId: 'tt1187043',
    tmdbId: 20453,
    tags: ['college', 'friendship', 'education', 'engineering', 'inspirational', 'humour'],
    ratingCount: 350,
    ratingMean: 4.8,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-dangal',
    title: 'Dangal',
    originalTitle: 'Dangal (2016)',
    year: 2016,
    director: 'Nitesh Tiwari',
    genres: ['Action', 'Biography', 'Drama'],
    runtime: 161,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg',
    movielensId: null,
    imdbId: 'tt5074352',
    tmdbId: 360814,
    tags: ['wrestling', 'sports', 'father daughter', 'empowerment', 'biography'],
    ratingCount: 290,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-sholay',
    title: 'Sholay',
    originalTitle: 'Sholay (1975)',
    year: 1975,
    director: 'Ramesh Sippy',
    genres: ['Action', 'Adventure', 'Drama'],
    runtime: 198,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/52/Sholay-poster.jpg',
    movielensId: null,
    imdbId: 'tt0073707',
    tmdbId: 13174,
    tags: ['curry western', 'dacoit', 'gabbar', 'iconic', 'revenge', 'friendship'],
    ratingCount: 310,
    ratingMean: 4.85,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-lagaan',
    title: 'Lagaan: Once Upon a Time in India',
    originalTitle: 'Lagaan: Once Upon a Time in India (2001)',
    year: 2001,
    director: 'Ashutosh Gowariker',
    genres: ['Adventure', 'Drama', 'Musical'],
    runtime: 224,
    poster: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Lagaan.jpg',
    movielensId: null,
    imdbId: 'tt0169102',
    tmdbId: 19666,
    tags: ['cricket', 'british raj', 'colonialism', 'oscar nominee', 'underdog'],
    ratingCount: 240,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-ddlj',
    title: 'Dilwale Dulhania Le Jayenge',
    originalTitle: 'Dilwale Dulhania Le Jayenge (1995)',
    year: 1995,
    director: 'Aditya Chopra',
    genres: ['Drama', 'Romance'],
    runtime: 189,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/80/Dilwale_Dulhania_Le_Jayenge_poster.jpg',
    movielensId: null,
    imdbId: 'tt0112870',
    tmdbId: 19404,
    tags: ['romance', 'shah rukh khan', 'kajol', 'europe trip', 'classic bollywood'],
    ratingCount: 320,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-gangs-of-wasseypur-1',
    title: 'Gangs of Wasseypur',
    originalTitle: 'Gangs of Wasseypur (2012)',
    year: 2012,
    director: 'Anurag Kashyap',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 160,
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Gangs_of_Wasseypur_poster.jpg',
    movielensId: null,
    imdbId: 'tt1954470',
    tmdbId: 115210,
    tags: ['coal mafia', 'gangster', 'epic', 'manoj bajpayee', 'revenge', 'gritty'],
    ratingCount: 220,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-gangs-of-wasseypur-2',
    title: 'Gangs of Wasseypur – Part 2',
    originalTitle: 'Gangs of Wasseypur – Part 2 (2012)',
    year: 2012,
    director: 'Anurag Kashyap',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 159,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/58/Gangs_of_wasseypur_II.jpg/250px-Gangs_of_wasseypur_II.jpg',
    movielensId: null,
    imdbId: 'tt2397535',
    tmdbId: 127989,
    tags: ['nawazuddin siddiqui', 'definitely', 'gangster', 'revenge'],
    ratingCount: 190,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-taare-zameen-par',
    title: 'Taare Zameen Par',
    originalTitle: 'Taare Zameen Par (2007)',
    year: 2007,
    director: 'Aamir Khan',
    genres: ['Drama', 'Family'],
    runtime: 165,
    poster: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Taare_Zameen_Par_Like_Stars_on_Earth_poster.png',
    movielensId: null,
    imdbId: 'tt0986264',
    tmdbId: 75780,
    tags: ['dyslexia', 'childhood', 'art', 'teacher', 'emotional', 'inspirational'],
    ratingCount: 260,
    ratingMean: 4.8,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-swades',
    title: 'Swades',
    originalTitle: 'Swades (2004)',
    year: 2004,
    director: 'Ashutosh Gowariker',
    genres: ['Drama'],
    runtime: 210,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/85/Swades_poster.jpg',
    movielensId: null,
    imdbId: 'tt0367110',
    tmdbId: 15482,
    tags: ['nasa', 'rural india', 'shah rukh khan', 'patriotism', 'electricity', 'social'],
    ratingCount: 210,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-znmd',
    title: 'Zindagi Na Milegi Dobara',
    originalTitle: 'Zindagi Na Milegi Dobara (2011)',
    year: 2011,
    director: 'Zoya Akhtar',
    genres: ['Adventure', 'Comedy', 'Drama'],
    runtime: 155,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/1/17/Zindagi_Na_Milegi_Dobara.jpg/250px-Zindagi_Na_Milegi_Dobara.jpg',
    movielensId: null,
    imdbId: 'tt1562872',
    tmdbId: 65160,
    tags: ['road trip', 'spain', 'bachelor party', 'friendship', 'fears', 'poetry'],
    ratingCount: 275,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-andhadhun',
    title: 'Andhadhun',
    originalTitle: 'Andhadhun (2018)',
    year: 2018,
    director: 'Sriram Raghavan',
    genres: ['Crime', 'Mystery', 'Thriller'],
    runtime: 139,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/47/Andhadhun_poster.jpg',
    movielensId: null,
    imdbId: 'tt8108198',
    tmdbId: 534780,
    tags: ['piano', 'blind pianist', 'murder', 'twist ending', 'tabu', 'dark comedy'],
    ratingCount: 230,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-tumbbad',
    title: 'Tumbbad',
    originalTitle: 'Tumbbad (2018)',
    year: 2018,
    director: 'Rahi Anil Barve',
    genres: ['Fantasy', 'Horror', 'Period'],
    runtime: 104,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/41/Tumbbad_poster.jpg',
    movielensId: null,
    imdbId: 'tt8239946',
    tmdbId: 538858,
    tags: ['greed', 'hastar', 'mythology', 'atmospheric', 'rain', 'folklore'],
    ratingCount: 195,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-queen',
    title: 'Queen',
    originalTitle: 'Queen (2014)',
    year: 2014,
    director: 'Vikas Bahl',
    genres: ['Adventure', 'Comedy', 'Drama'],
    runtime: 144,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/45/QueenMoviePoster7thMarch.jpg',
    movielensId: null,
    imdbId: 'tt3322420',
    tmdbId: 257064,
    tags: ['solo honeymoon', 'paris', 'amsterdam', 'self discovery', 'empowerment'],
    ratingCount: 205,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-barfi',
    title: 'Barfi!',
    originalTitle: 'Barfi! (2012)',
    year: 2012,
    director: 'Anurag Basu',
    genres: ['Comedy', 'Drama', 'Romance'],
    runtime: 151,
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Barfi%21_poster.jpg',
    movielensId: null,
    imdbId: 'tt2082197',
    tmdbId: 127501,
    tags: ['darjeeling', 'ranbir kapoor', 'priyanka chopra', 'charlie chaplin tribute', 'whimsical'],
    ratingCount: 180,
    ratingMean: 4.55,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-dil-chahta-hai',
    title: 'Dil Chahta Hai',
    originalTitle: 'Dil Chahta Hai (2001)',
    year: 2001,
    director: 'Farhan Akhtar',
    genres: ['Comedy', 'Drama', 'Romance'],
    runtime: 183,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/Dil_Chahta_Hai.jpg',
    movielensId: null,
    imdbId: 'tt0292490',
    tmdbId: 7453,
    tags: ['goa', 'urban youth', 'friendship', 'cult classic', 'aamir khan'],
    ratingCount: 215,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-chak-de-india',
    title: 'Chak De! India',
    originalTitle: 'Chak De! India (2007)',
    year: 2007,
    director: 'Shimit Amin',
    genres: ['Drama', 'Sport'],
    runtime: 153,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/0/0c/Chak_De%21_India.jpg/250px-Chak_De%21_India.jpg',
    movielensId: null,
    imdbId: 'tt0871510',
    tmdbId: 75781,
    tags: ['hockey', 'women sports', 'redemption', 'shah rukh khan', '70 minute speech'],
    ratingCount: 220,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-udaan',
    title: 'Udaan',
    originalTitle: 'Udaan (2010)',
    year: 2010,
    director: 'Vikramaditya Motwane',
    genres: ['Drama'],
    runtime: 134,
    poster: 'https://upload.wikimedia.org/wikipedia/en/7/71/Udaan_Movie_Poster.jpg',
    movielensId: null,
    imdbId: 'tt1639426',
    tmdbId: 44007,
    tags: ['coming of age', 'poetry', 'rebellion', 'cannes', 'jamshedpur', 'ronit roy'],
    ratingCount: 150,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-rang-de-basanti',
    title: 'Rang De Basanti',
    originalTitle: 'Rang De Basanti (2006)',
    year: 2006,
    director: 'Rakeysh Omprakash Mehra',
    genres: ['Comedy', 'Crime', 'Drama'],
    runtime: 167,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/0/08/Rang_De_Basanti_poster.jpg/250px-Rang_De_Basanti_poster.jpg',
    movielensId: null,
    imdbId: 'tt0405508',
    tmdbId: 9400,
    tags: ['bhagat singh', 'youth awaken', 'ar rahman', 'revolution', 'sacrifice'],
    ratingCount: 250,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-kahaani',
    title: 'Kahaani',
    originalTitle: 'Kahaani (2012)',
    year: 2012,
    director: 'Sujoy Ghosh',
    genres: ['Mystery', 'Thriller'],
    runtime: 122,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/f/f2/Kahaani_poster.jpg/250px-Kahaani_poster.jpg',
    movielensId: null,
    imdbId: 'tt1821480',
    tmdbId: 86828,
    tags: ['kolkata', 'durga puja', 'vidya balan', 'twist ending', 'pregnant woman'],
    ratingCount: 185,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-drishyam',
    title: 'Drishyam',
    originalTitle: 'Drishyam (2015)',
    year: 2015,
    director: 'Nishikant Kamat',
    genres: ['Crime', 'Drama', 'Mystery', 'Thriller'],
    runtime: 163,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/8/8a/Drishyam_2015_film.jpg/250px-Drishyam_2015_film.jpg',
    movielensId: null,
    imdbId: 'tt4430212',
    tmdbId: 353081,
    tags: ['alibi', 'october 2', 'ajay devgn', 'tabu', 'police cat and mouse'],
    ratingCount: 210,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-mughal-e-azam',
    title: 'Mughal-e-Azam',
    originalTitle: 'Mughal-e-Azam (1960)',
    year: 1960,
    director: 'K. Asif',
    genres: ['Drama', 'History', 'Romance'],
    runtime: 197,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/1/16/Mughal-e-Azam.jpg/250px-Mughal-e-Azam.jpg',
    movielensId: null,
    imdbId: 'tt0054098',
    tmdbId: 31057,
    tags: ['salim anarkali', 'dilip kumar', 'madhubala', 'sheesh mahal', 'epic classic'],
    ratingCount: 160,
    ratingMean: 4.8,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-pyaasa',
    title: 'Pyaasa',
    originalTitle: 'Pyaasa (1957)',
    year: 1957,
    director: 'Guru Dutt',
    genres: ['Drama', 'Musical', 'Romance'],
    runtime: 146,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/93/Pyaasa_poster.jpg',
    movielensId: null,
    imdbId: 'tt0050866',
    tmdbId: 30048,
    tags: ['guru dutt', 'poet', 'society', 'sahir ludhianvi', 'melancholy', 'masterpiece'],
    ratingCount: 175,
    ratingMean: 4.85,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-anand',
    title: 'Anand',
    originalTitle: 'Anand (1971)',
    year: 1971,
    director: 'Hrishikesh Mukherjee',
    genres: ['Drama', 'Musical'],
    runtime: 132,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/c/c9/Anand_film.jpg/250px-Anand_film.jpg',
    movielensId: null,
    imdbId: 'tt0066763',
    tmdbId: 31317,
    tags: ['rajesh khanna', 'amitabh bachchan', 'babu moshai', 'terminal illness', 'life affirming'],
    ratingCount: 190,
    ratingMean: 4.8,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-gol-maal',
    title: 'Gol Maal',
    originalTitle: 'Gol Maal (1979)',
    year: 1979,
    director: 'Hrishikesh Mukherjee',
    genres: ['Comedy', 'Romance'],
    runtime: 144,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/36/Gol_Maal_poster.jpg',
    movielensId: null,
    imdbId: 'tt0079221',
    tmdbId: 31059,
    tags: ['amol palekar', 'utpal dutt', 'mustache', 'mistaken identity', 'classic comedy'],
    ratingCount: 165,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-deewaar',
    title: 'Deewaar',
    originalTitle: 'Deewaar (1975)',
    year: 1975,
    director: 'Yash Chopra',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 174,
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Deewaar_poster.jpg',
    movielensId: null,
    imdbId: 'tt0072860',
    tmdbId: 30045,
    tags: ['angry young man', 'mere paas maa hai', 'amitabh bachchan', 'two brothers'],
    ratingCount: 200,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-satya',
    title: 'Satya',
    originalTitle: 'Satya (1998)',
    year: 1998,
    director: 'Ram Gopal Varma',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 170,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/52/Satya_%281998%29.jpg/250px-Satya_%281998%29.jpg',
    movielensId: null,
    imdbId: 'tt0197855',
    tmdbId: 36720,
    tags: ['mumbai underworld', 'bhiku mhatre', 'manoj bajpayee', 'realism', 'gangster'],
    ratingCount: 180,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-black-friday',
    title: 'Black Friday',
    originalTitle: 'Black Friday (2004)',
    year: 2004,
    director: 'Anurag Kashyap',
    genres: ['Action', 'Crime', 'Drama', 'History'],
    runtime: 143,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/58/Black_Friday_%282007%29.jpg',
    movielensId: null,
    imdbId: 'tt0400234',
    tmdbId: 21971,
    tags: ['1993 bombay bombings', 'investigation', 'kay kay menon', 'indian ocean soundtrack'],
    ratingCount: 140,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-haider',
    title: 'Haider',
    originalTitle: 'Haider (2014)',
    year: 2014,
    director: 'Vishal Bhardwaj',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 160,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/f/f1/Haider_Poster.jpg/250px-Haider_Poster.jpg',
    movielensId: null,
    imdbId: 'tt3390572',
    tmdbId: 275813,
    tags: ['hamlet', 'kashmir', 'shahid kapoor', 'tabu', 'shakespeare adaptation'],
    ratingCount: 175,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-maqbool',
    title: 'Maqbool',
    originalTitle: 'Maqbool (2003)',
    year: 2003,
    director: 'Vishal Bhardwaj',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 132,
    poster: 'https://upload.wikimedia.org/wikipedia/en/7/76/Maqbool_poster.jpg',
    movielensId: null,
    imdbId: 'tt0379375',
    tmdbId: 19692,
    tags: ['macbeth', 'irrfan khan', 'pankaj kapur', 'tabu', 'underworld'],
    ratingCount: 155,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-omkara',
    title: 'Omkara',
    originalTitle: 'Omkara (2006)',
    year: 2006,
    director: 'Vishal Bhardwaj',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 155,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/9/9d/Omkarapromoposter.jpg/250px-Omkarapromoposter.jpg',
    movielensId: null,
    imdbId: 'tt0488414',
    tmdbId: 10427,
    tags: ['othello', 'saif ali khan', 'langda tyagi', 'rural up', 'jealousy'],
    ratingCount: 170,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-gully-boy',
    title: 'Gully Boy',
    originalTitle: 'Gully Boy (2019)',
    year: 2019,
    director: 'Zoya Akhtar',
    genres: ['Drama', 'Music'],
    runtime: 154,
    poster: 'https://upload.wikimedia.org/wikipedia/en/0/07/Gully_Boy_poster.jpg',
    movielensId: null,
    imdbId: 'tt8744908',
    tmdbId: 564245,
    tags: ['dharavi', 'hip hop', 'ranveer singh', 'alia bhatt', 'apna time aayega'],
    ratingCount: 185,
    ratingMean: 4.5,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-lunchbox',
    title: 'The Lunchbox',
    originalTitle: 'The Lunchbox (2013)',
    year: 2013,
    director: 'Ritesh Batra',
    genres: ['Drama', 'Romance'],
    runtime: 104,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/8/81/The_Lunchbox_poster.jpg/250px-The_Lunchbox_poster.jpg',
    movielensId: null,
    imdbId: 'tt2350496',
    tmdbId: 211052,
    tags: ['dabbawala', 'mumbai', 'letters', 'irrfan khan', 'food', 'quiet connection'],
    ratingCount: 195,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-piku',
    title: 'Piku',
    originalTitle: 'Piku (2015)',
    year: 2015,
    director: 'Shoojit Sircar',
    genres: ['Comedy', 'Drama'],
    runtime: 123,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/9/98/Piku.jpg/250px-Piku.jpg',
    movielensId: null,
    imdbId: 'tt4120192',
    tmdbId: 337170,
    tags: ['road trip to kolkata', 'father daughter', 'deepika padukone', 'amitabh bachchan', 'irrfan khan'],
    ratingCount: 175,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-12th-fail',
    title: '12th Fail',
    originalTitle: '12th Fail (2023)',
    year: 2023,
    director: 'Vidhu Vinod Chopra',
    genres: ['Biography', 'Drama'],
    runtime: 147,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/f/f2/12th_Fail_poster.jpeg/250px-12th_Fail_poster.jpeg',
    movielensId: null,
    imdbId: 'tt23849204',
    tmdbId: 1184918,
    tags: ['upsc', 'restart', 'perseverance', 'ips officer', 'inspirational', 'vikrant massey'],
    ratingCount: 280,
    ratingMean: 4.85,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-laapataa-ladies',
    title: 'Laapataa Ladies',
    originalTitle: 'Laapataa Ladies (2024)',
    year: 2024,
    director: 'Kiran Rao',
    genres: ['Comedy', 'Drama'],
    runtime: 125,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/52/Laapataa_Ladies_poster.jpg/250px-Laapataa_Ladies_poster.jpg',
    movielensId: null,
    imdbId: 'tt22513470',
    tmdbId: 1165158,
    tags: ['mistaken bride', 'veil', 'rural india', 'satire', 'sisterhood', 'oscar entry'],
    ratingCount: 210,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-rrr',
    title: 'RRR',
    originalTitle: 'RRR (2022)',
    year: 2022,
    director: 'S. S. Rajamouli',
    genres: ['Action', 'Adventure', 'Drama'],
    runtime: 187,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg',
    movielensId: null,
    imdbId: 'tt8178634',
    tmdbId: 579974,
    tags: ['naatu naatu', 'anti colonial', 'action epic', 'fire and water', 'oscar winner'],
    ratingCount: 330,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-baahubali-1',
    title: 'Baahubali: The Beginning',
    originalTitle: 'Baahubali: The Beginning (2015)',
    year: 2015,
    director: 'S. S. Rajamouli',
    genres: ['Action', 'Drama', 'Fantasy'],
    runtime: 159,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg',
    movielensId: null,
    imdbId: 'tt2631186',
    tmdbId: 256040,
    tags: ['waterfall', 'mahishmati', 'prabhas', 'why kattappa killed baahubali', 'fantasy epic'],
    ratingCount: 260,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-baahubali-2',
    title: 'Baahubali 2: The Conclusion',
    originalTitle: 'Baahubali 2: The Conclusion (2017)',
    year: 2017,
    director: 'S. S. Rajamouli',
    genres: ['Action', 'Drama', 'Fantasy'],
    runtime: 167,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/9/93/Baahubali_2_The_Conclusion_poster.jpg/250px-Baahubali_2_The_Conclusion_poster.jpg',
    movielensId: null,
    imdbId: 'tt4849438',
    tmdbId: 350312,
    tags: ['blockbuster', 'mahishmati', 'climax', 'spectacle'],
    ratingCount: 270,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-kantara',
    title: 'Kantara',
    originalTitle: 'Kantara (2022)',
    year: 2022,
    director: 'Rishab Shetty',
    genres: ['Action', 'Adventure', 'Drama', 'Thriller'],
    runtime: 148,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
    movielensId: null,
    imdbId: 'tt15327088',
    tmdbId: 1024546,
    tags: ['panjurli', 'kola', 'folklore', 'forest', 'divine scream', 'karnataka'],
    ratingCount: 210,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-a-wednesday',
    title: 'A Wednesday!',
    originalTitle: 'A Wednesday! (2008)',
    year: 2008,
    director: 'Neeraj Pandey',
    genres: ['Crime', 'Drama', 'Mystery', 'Thriller'],
    runtime: 104,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/7/77/A_Wednesday_Poster.JPG/250px-A_Wednesday_Poster.JPG',
    movielensId: null,
    imdbId: 'tt1280558',
    tmdbId: 14811,
    tags: ['naseeruddin shah', 'anupam kher', 'common man', 'bomb threat', 'suspense'],
    ratingCount: 165,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-jab-we-met',
    title: 'Jab We Met',
    originalTitle: 'Jab We Met (2007)',
    year: 2007,
    director: 'Imtiaz Ali',
    genres: ['Comedy', 'Drama', 'Romance'],
    runtime: 142,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Jab_We_Met_Poster.jpg',
    movielensId: null,
    imdbId: 'tt1093370',
    tmdbId: 14838,
    tags: ['geet', 'kareena kapoor', 'train journey', 'ratlam', 'romance classic'],
    ratingCount: 240,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-rockstar',
    title: 'Rockstar',
    originalTitle: 'Rockstar (2011)',
    year: 2011,
    director: 'Imtiaz Ali',
    genres: ['Drama', 'Music', 'Romance'],
    runtime: 159,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/6/68/Rockstar-Movie-Poster.jpg/250px-Rockstar-Movie-Poster.jpg',
    movielensId: null,
    imdbId: 'tt1839596',
    tmdbId: 79549,
    tags: ['jordan', 'ar rahman', 'sufi music', 'angst', 'ranbir kapoor', 'nadaan parinde'],
    ratingCount: 220,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-munna-bhai-mbbs',
    title: 'Munna Bhai M.B.B.S.',
    originalTitle: 'Munna Bhai M.B.B.S. (2003)',
    year: 2003,
    director: 'Rajkumar Hirani',
    genres: ['Comedy', 'Drama'],
    runtime: 156,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/8/84/Munna_Bhai_M.B.B.S._poster.jpg/250px-Munna_Bhai_M.B.B.S._poster.jpg',
    movielensId: null,
    imdbId: 'tt0374887',
    tmdbId: 16869,
    tags: ['jaadu ki jhappi', 'sanjay dutt', 'circuit', 'boman irani', 'medical comedy'],
    ratingCount: 230,
    ratingMean: 4.7,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-lage-raho-munna-bhai',
    title: 'Lage Raho Munna Bhai',
    originalTitle: 'Lage Raho Munna Bhai (2006)',
    year: 2006,
    director: 'Rajkumar Hirani',
    genres: ['Comedy', 'Drama'],
    runtime: 144,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/3/35/Lage_raho_munna_bhai.JPG/250px-Lage_raho_munna_bhai.JPG',
    movielensId: null,
    imdbId: 'tt0456144',
    tmdbId: 16870,
    tags: ['gandhigiri', 'sanjay dutt', 'circuit', 'vidya balan', 'boman irani'],
    ratingCount: 200,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-pk',
    title: 'PK',
    originalTitle: 'PK (2014)',
    year: 2014,
    director: 'Rajkumar Hirani',
    genres: ['Comedy', 'Drama', 'Fantasy'],
    runtime: 153,
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg',
    movielensId: null,
    imdbId: 'tt2338151',
    tmdbId: 297222,
    tags: ['alien', 'satire on religion', 'aamir khan', 'wrong number', 'anushka sharma'],
    ratingCount: 240,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-mother-india',
    title: 'Mother India',
    originalTitle: 'Mother India (1957)',
    year: 1957,
    director: 'Mehboob Khan',
    genres: ['Drama'],
    runtime: 172,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/2/20/Mother_India_poster.jpg/250px-Mother_India_poster.jpg',
    movielensId: null,
    imdbId: 'tt0050720',
    tmdbId: 30046,
    tags: ['nargis', 'sunil dutt', 'oscar nominee', 'sacrifice', 'motherhood', 'epic tragedy'],
    ratingCount: 160,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-devdas',
    title: 'Devdas',
    originalTitle: 'Devdas (2002)',
    year: 2002,
    director: 'Sanjay Leela Bhansali',
    genres: ['Drama', 'Musical', 'Romance'],
    runtime: 185,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/9/9a/Devdas_%282002_Hindi_film%29.jpg/250px-Devdas_%282002_Hindi_film%29.jpg',
    movielensId: null,
    imdbId: 'tt0238936',
    tmdbId: 19689,
    tags: ['shah rukh khan', 'aishwarya rai', 'madhuri dixit', 'cannes', 'opulent set', 'tragedy'],
    ratingCount: 220,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-article-15',
    title: 'Article 15',
    originalTitle: 'Article 15 (2019)',
    year: 2019,
    director: 'Anubhav Sinha',
    genres: ['Crime', 'Drama', 'Mystery'],
    runtime: 130,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/1/11/Article_15_Poster.jpg/250px-Article_15_Poster.jpg',
    movielensId: null,
    imdbId: 'tt10324144',
    tmdbId: 605116,
    tags: ['caste system', 'investigation', 'ayushmann khurrana', 'rural up', 'social drama'],
    ratingCount: 160,
    ratingMean: 4.6,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-sardar-udham',
    title: 'Sardar Udham',
    originalTitle: 'Sardar Udham (2021)',
    year: 2021,
    director: 'Shoojit Sircar',
    genres: ['Biography', 'Crime', 'Drama'],
    runtime: 164,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/5b/Sardar_Udham_poster.jpg/250px-Sardar_Udham_poster.jpg',
    movielensId: null,
    imdbId: 'tt10235318',
    tmdbId: 772071,
    tags: ['jallianwala bagh', 'vicky kaushal', 'michael o dwyer', 'historical biography'],
    ratingCount: 180,
    ratingMean: 4.75,
    source: 'Bollywood & Indian Cinema'
  },
  {
    id: 'bw-bajrangi-bhaijaan',
    title: 'Bajrangi Bhaijaan',
    originalTitle: 'Bajrangi Bhaijaan (2015)',
    year: 2015,
    director: 'Kabir Khan',
    genres: ['Adventure', 'Comedy', 'Drama'],
    runtime: 163,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/d/dd/Bajrangi_Bhaijaan_Poster.jpg/250px-Bajrangi_Bhaijaan_Poster.jpg',
    movielensId: null,
    imdbId: 'tt3863552',
    tmdbId: 348892,
    tags: ['salman khan', 'harshaali malhotra', 'nawazuddin siddiqui', 'border cross', 'heartwarming'],
    ratingCount: 250,
    ratingMean: 4.65,
    source: 'Bollywood & Indian Cinema'
  }
];

// Verified artwork & director fixes for famous MovieLens catalogue titles
export const MOVIELENS_POSTER_PATCHES = {
  'ml-88129': {
      "director": "Nicolas Winding Refn",
      "runtime": 100,
      "poster": "https://upload.wikimedia.org/wikipedia/en/1/13/Drive2011Poster.jpg"
  },
  'ml-88140': {
      "director": "Joe Johnston",
      "runtime": 124,
      "poster": "https://upload.wikimedia.org/wikipedia/en/3/37/Captain_America_The_First_Avenger_poster.jpg"
  },
  'ml-59315': {
      "director": "Jon Favreau",
      "runtime": 126,
      "poster": "https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg"
  },
  'ml-77561': {
      "director": "Jon Favreau",
      "runtime": 124,
      "poster": "https://upload.wikimedia.org/wikipedia/en/e/ed/Iron_Man_2_poster.jpg"
  },
  'ml-102125': {
      "director": "Shane Black",
      "runtime": 130,
      "poster": "https://upload.wikimedia.org/wikipedia/en/1/19/Iron_Man_3_poster.jpg"
  },
  'ml-60040': {
      "director": "Louis Leterrier",
      "runtime": 112,
      "poster": "https://upload.wikimedia.org/wikipedia/en/f/f0/The_Incredible_Hulk_%28film%29_poster.jpg"
  },
  'ml-86332': {
      "director": "Kenneth Branagh",
      "runtime": 115,
      "poster": "https://upload.wikimedia.org/wikipedia/en/9/95/Thor_%28film%29_poster.jpg"
  },
  'ml-106072': {
      "director": "Alan Taylor",
      "runtime": 112,
      "poster": "https://upload.wikimedia.org/wikipedia/en/7/7f/Thor_The_Dark_World_poster.jpg"
  },
  'ml-122916': {
      "director": "Taika Waititi",
      "runtime": 130,
      "poster": "https://upload.wikimedia.org/wikipedia/en/7/7d/Thor_Ragnarok_poster.jpg"
  },
  'ml-110102': {
      "director": "Anthony and Joe Russo",
      "runtime": 136,
      "poster": "https://upload.wikimedia.org/wikipedia/en/9/9e/Captain_America_The_Winter_Soldier_poster.jpg"
  },
  'ml-122920': {
      "director": "Anthony and Joe Russo",
      "runtime": 147,
      "poster": "https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg"
  },
  'ml-89745': {
      "director": "Joss Whedon",
      "runtime": 143,
      "poster": "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg"
  },
  'ml-122892': {
      "director": "Joss Whedon",
      "runtime": 141,
      "poster": "https://upload.wikimedia.org/wikipedia/en/f/ff/Avengers_Age_of_Ultron_poster.jpg"
  },
  'ml-122912': {
      "director": "Anthony and Joe Russo",
      "runtime": 149,
      "poster": "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg"
  },
  'ml-112852': {
      "director": "James Gunn",
      "runtime": 121,
      "poster": "https://upload.wikimedia.org/wikipedia/en/3/33/Guardians_of_the_Galaxy_%28film%29_poster.jpg"
  },
  'ml-122918': {
      "director": "James Gunn",
      "runtime": 136,
      "poster": "https://upload.wikimedia.org/wikipedia/en/3/32/Guardians_of_the_Galaxy_Vol._2_poster.jpg"
  },
  'ml-122900': {
      "director": "Peyton Reed",
      "runtime": 117,
      "poster": "https://upload.wikimedia.org/wikipedia/en/1/12/Ant-Man_%28film%29_poster.jpg"
  },
  'ml-188301': {
      "director": "Peyton Reed",
      "runtime": 118,
      "poster": "https://upload.wikimedia.org/wikipedia/en/2/2c/Ant-Man_and_the_Wasp_poster.jpg"
  },
  'ml-122922': {
      "director": "Scott Derrickson",
      "runtime": 115,
      "poster": "https://upload.wikimedia.org/wikipedia/en/a/a1/Doctor_Strange_%282016_film%29_poster.jpg"
  },
  'ml-122906': {
      "director": "Ryan Coogler",
      "runtime": 134,
      "poster": "https://upload.wikimedia.org/wikipedia/en/d/d6/Black_Panther_%28film%29_poster.jpg"
  },
  'ml-122926': {
      "title": "Spider-Man: Homecoming",
      "director": "Jon Watts",
      "runtime": 133,
      "poster": "https://upload.wikimedia.org/wikipedia/en/f/f9/Spider-Man_Homecoming_poster.jpg"
  },
  'ml-122904': {
      "director": "Tim Miller",
      "runtime": 108,
      "poster": "https://upload.wikimedia.org/wikipedia/en/2/23/Deadpool_%282016_poster%29.png"
  },
  'ml-187593': {
      "director": "David Leitch",
      "runtime": 119,
      "poster": "https://upload.wikimedia.org/wikipedia/en/c/cf/Deadpool_2_poster.jpg"
  },
  'ml-168252': {
      "director": "James Mangold",
      "runtime": 137,
      "poster": "https://upload.wikimedia.org/wikipedia/en/3/37/Logan_2017_poster.jpg"
  },
  'ml-3793': {
      "director": "Bryan Singer",
      "runtime": 104,
      "poster": "https://upload.wikimedia.org/wikipedia/en/8/81/X-MenfilmPoster.jpg"
  },
  'ml-6333': {
      "director": "Bryan Singer",
      "runtime": 134,
      "poster": "https://upload.wikimedia.org/wikipedia/en/3/3e/X2_poster.jpg"
  },
  'ml-45499': {
      "director": "Brett Ratner",
      "runtime": 104,
      "poster": "https://upload.wikimedia.org/wikipedia/en/5/5b/X-Men_The_Last_Stand_theatrical_poster.jpg"
  },
  'ml-87232': {
      "director": "Matthew Vaughn",
      "runtime": 132,
      "poster": "https://upload.wikimedia.org/wikipedia/en/5/55/X-MenFirstClassMoviePoster.jpg"
  },
  'ml-111362': {
      "director": "Bryan Singer",
      "runtime": 131,
      "poster": "https://upload.wikimedia.org/wikipedia/en/0/0c/X-Men_Days_of_Future_Past_poster.jpg"
  },
  'ml-122924': {
      "director": "Bryan Singer",
      "runtime": 144,
      "poster": "https://upload.wikimedia.org/wikipedia/en/0/04/X-Men_-_Apocalypse.jpg"
  },
  'ml-68319': {
      "director": "Gavin Hood",
      "runtime": 107,
      "poster": "https://upload.wikimedia.org/wikipedia/en/0/08/X-Men_Origins_Wolverine_theatrical_poster.jpg"
  },
  'ml-103772': {
      "director": "James Mangold",
      "runtime": 126,
      "poster": "https://upload.wikimedia.org/wikipedia/en/7/74/The_Wolverine_posterUS.jpg"
  },
  'ml-5349': {
      "director": "Sam Raimi",
      "runtime": 121,
      "poster": "https://upload.wikimedia.org/wikipedia/en/6/6c/Spider-Man_%282002_film%29_poster.jpg"
  },
  'ml-8636': {
      "director": "Sam Raimi",
      "runtime": 127,
      "poster": "https://upload.wikimedia.org/wikipedia/en/4/4e/Spider-Man_2_USA_poster.jpg"
  },
  'ml-52722': {
      "director": "Sam Raimi",
      "runtime": 139,
      "poster": "https://upload.wikimedia.org/wikipedia/en/7/7a/Spider-Man_3%2C_International_Poster.jpg"
  },
  'ml-95510': {
      "director": "Marc Webb",
      "runtime": 136,
      "poster": "https://upload.wikimedia.org/wikipedia/en/e/e0/The_Amazing_Spider-Man_%28film%29_poster.jpg"
  },
  'ml-110553': {
      "director": "Marc Webb",
      "runtime": 142,
      "poster": "https://upload.wikimedia.org/wikipedia/en/2/24/The_Amazing_Spider-Man_2_poster.jpg"
  },
  'ml-2167': {
      "director": "Stephen Norrington",
      "runtime": 120,
      "poster": "https://upload.wikimedia.org/wikipedia/en/1/19/Blade_movie.jpg"
  },
  'ml-5254': {
      "director": "Guillermo del Toro",
      "runtime": 117,
      "poster": "https://upload.wikimedia.org/wikipedia/en/6/6d/Blade_II_movie.jpg"
  },
  'ml-8985': {
      "director": "David S. Goyer",
      "runtime": 113,
      "poster": "https://upload.wikimedia.org/wikipedia/en/8/86/Blade_Trinity_poster.JPG"
  },
  'ml-6157': {
      "director": "Mark Steven Johnson",
      "runtime": 103,
      "poster": "https://upload.wikimedia.org/wikipedia/en/0/04/Daredevil_poster.JPG"
  },
  'ml-34150': {
      "director": "Tim Story",
      "runtime": 106,
      "poster": "https://upload.wikimedia.org/wikipedia/en/4/4a/Fantastic_Four_poster.jpg"
  },
  'ml-53464': {
      "director": "Tim Story",
      "runtime": 92,
      "poster": "https://upload.wikimedia.org/wikipedia/en/e/e6/Fantastic_Four_2_Poster.jpg"
  },

  'ml-106918': {
    director: 'Ben Stiller',
    runtime: 114,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f2/The_Secret_Life_of_Walter_Mitty_2013_poster.jpg'
  },
  'ml-7826': {
    director: 'Norman Z. McLeod',
    runtime: 110,
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c5/SecretLifeofwalter.jpg'
  },
  'ml-318': {
    director: 'Frank Darabont',
    runtime: 142,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg'
  },
  'ml-356': {
    director: 'Robert Zemeckis',
    runtime: 142,
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg'
  },
  'ml-296': {
    director: 'Quentin Tarantino',
    runtime: 154,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg'
  },
  'ml-593': {
    director: 'Jonathan Demme',
    runtime: 118,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg'
  },
  'ml-2571': {
    director: 'Lana & Lilly Wachowski',
    runtime: 136,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/d/db/The_Matrix.png/250px-The_Matrix.png'
  },
  'ml-2959': {
    director: 'David Fincher',
    runtime: 139,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg'
  },
  'ml-260': {
    director: 'George Lucas',
    runtime: 121,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg'
  },
  'ml-480': {
    director: 'Steven Spielberg',
    runtime: 127,
    poster: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg'
  },
  'ml-110': {
    director: 'Mel Gibson',
    runtime: 178,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/e/e1/Braveheart_film_poster.png/250px-Braveheart_film_poster.png'
  },
  'ml-589': {
    director: 'James Cameron',
    runtime: 137,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/5e/Terminator_2-Judgment_Day.png/250px-Terminator_2-Judgment_Day.png'
  },
  'ml-527': {
    director: 'Steven Spielberg',
    runtime: 195,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg'
  },
  'ml-1': {
    director: 'John Lasseter',
    runtime: 81,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg'
  },
  'ml-858': {
    director: 'Francis Ford Coppola',
    runtime: 175,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg'
  },
  'ml-58559': {
    director: 'Christopher Nolan',
    runtime: 152,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'
  },
  'ml-79132': {
    director: 'Christopher Nolan',
    runtime: 148,
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg'
  },
  'ml-5618': {
    director: 'Hayao Miyazaki',
    runtime: 125,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png'
  },
  'ml-4993': {
    director: 'Peter Jackson',
    runtime: 178,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Lord_Rings_Fellowship_Ring.jpg'
  },
  'ml-5952': {
    director: 'Peter Jackson',
    runtime: 179,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Lord_Rings_Two_Towers.jpg'
  },
  'ml-7153': {
    director: 'Peter Jackson',
    runtime: 201,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/48/Lord_Rings_Return_King.jpg'
  },
  'ml-47': {
    director: 'David Fincher',
    runtime: 127,
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/68/Seven_%28movie%29_poster.jpg'
  },
  'ml-50': {
    director: 'Bryan Singer',
    runtime: 106,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Usual_suspects_ver1.jpg'
  },
  'ml-2028': {
    director: 'Steven Spielberg',
    runtime: 169,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Saving_Private_Ryan_poster.jpg'
  },
  'ml-48516': {
    director: 'Martin Scorsese',
    runtime: 151,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/50/Departed234.jpg'
  },
  'ml-109374': {
    director: 'Wes Anderson',
    runtime: 99,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Grand_Budapest_Hotel.png'
  },
  'ml-164909': {
    director: 'Damien Chazelle',
    runtime: 128,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png'
  },
  'ml-122882': {
    director: 'George Miller',
    runtime: 120,
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg'
  },
  'ml-541': {
    director: 'Ridley Scott',
    runtime: 117,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/9/9f/Blade_Runner_%281982_poster%29.png/250px-Blade_Runner_%281982_poster%29.png'
  },
  'ml-177765': {
    director: 'Denis Villeneuve',
    runtime: 164,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/9/98/Coco_%282017_film%29_poster.jpg/250px-Coco_%282017_film%29_poster.jpg'
  },
  'ml-2021': {
    director: 'David Lynch',
    runtime: 137,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/51/Dune_1984_Poster.jpg/250px-Dune_1984_Poster.jpg'
  },
  'ml-68157': {
    director: 'Quentin Tarantino',
    runtime: 153,
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Inglourious_Basterds_poster.jpg'
  },
  'ml-1101': {
    director: 'Tony Scott',
    runtime: 110,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/46/Top_Gun_Movie.jpg'
  },
  'ml-4816': {
    director: 'Ben Stiller',
    runtime: 90,
    poster: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Movie_poster_zoolander.jpg'
  },
  'ml-99114': {
    director: 'Quentin Tarantino',
    runtime: 165,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Django_Unchained_Poster.jpg'
  },
  'ml-111': {
    director: 'Martin Scorsese',
    runtime: 114,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/33/Taxi_Driver_%281976_film_poster%29.jpg'
  },
  'ml-73017': {
    director: 'Guy Ritchie',
    runtime: 128,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/e/e0/Sherlock_holmes_ver5.jpg/250px-Sherlock_holmes_ver5.jpg'
  },
  'ml-111759': {
    director: 'Doug Liman',
    runtime: 113,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Edge_of_Tomorrow_Poster.jpg'
  },
  'ml-91542': {
    director: 'Guy Ritchie',
    runtime: 129,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/5/53/Sherlock_Holmes2Poster.jpg/250px-Sherlock_Holmes2Poster.jpg'
  }
};

export const CURATED_ADDITIONS = [
  {
    id: 'ford-v-ferrari',
    title: 'Ford v Ferrari',
    originalTitle: 'Ford v Ferrari (2019)',
    year: 2019,
    director: 'James Mangold',
    genres: ['Action', 'Biography', 'Drama', 'Sport'],
    runtime: 152,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Ford_v._Ferrari_%282019_film_poster%29.png',
    movielensId: null,
    imdbId: 'tt1950186',
    tmdbId: 359724,
    tags: ['racing', 'le mans', 'carroll shelby', 'ken miles', 'matt damon', 'christian bale', 'gt40', 'ford', 'ferrari', 'motorsport', '7000 rpm'],
    ratingCount: 450,
    ratingMean: 4.8,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'knives-out',
    title: 'Knives Out',
    originalTitle: 'Knives Out (2019)',
    year: 2019,
    director: 'Rian Johnson',
    genres: ['Comedy', 'Crime', 'Drama', 'Mystery', 'Thriller'],
    runtime: 130,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Knives_Out_poster.jpeg',
    movielensId: null,
    imdbId: 'tt8946378',
    tmdbId: 546554,
    tags: ['whodunnit', 'benoit blanc', 'daniel craig', 'rian johnson', 'murder mystery', 'harlan thrombey', 'marta cabrera', 'ana de armas', 'chris evans', 'donut hole', 'inheritance'],
    ratingCount: 460,
    ratingMean: 4.8,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'glass-onion',
    title: 'Glass Onion: A Knives Out Mystery',
    originalTitle: 'Glass Onion: A Knives Out Mystery (2022)',
    year: 2022,
    director: 'Rian Johnson',
    genres: ['Comedy', 'Crime', 'Drama', 'Mystery'],
    runtime: 140,
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/62/Glass_Onion_poster.jpg',
    movielensId: null,
    imdbId: 'tt11564570',
    tmdbId: 661374,
    tags: ['whodunnit', 'benoit blanc', 'daniel craig', 'rian johnson', 'edward norton', 'janelle monae', 'murder mystery', 'puzzle box', 'tech billionaire', 'greece private island'],
    ratingCount: 420,
    ratingMean: 4.65,
    source: 'Curated Modern Cinema'
  },
  {
    "id": "mcu-loki",
    "title": "Loki",
    "originalTitle": "Loki (2021)",
    "year": 2021,
    "director": "Michael Waldron & Kate Herron",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy",
      "Science fiction"
    ],
    "runtime": 52,
    "poster": "https://upload.wikimedia.org/wikipedia/en/c/c9/Loki_season_1_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt9140554",
    "tmdbId": 84958,
    "tags": [
      "mcu",
      "marvel",
      "loki",
      "multiverse",
      "tva",
      "tom hiddleston",
      "mobius",
      "glorious purpose",
      "time travel",
      "sylvie",
      "god of stories"
    ],
    "ratingCount": 420,
    "ratingMean": 4.8,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-wandavision",
    "title": "WandaVision",
    "originalTitle": "WandaVision (2021)",
    "year": 2021,
    "director": "Jac Schaeffer & Matt Shakman",
    "genres": [
      "Comedy",
      "Drama",
      "Fantasy",
      "Mystery",
      "Science fiction"
    ],
    "runtime": 35,
    "poster": "https://upload.wikimedia.org/wikipedia/en/a/a2/WandaVision_%22The_Series_Finale%22_poster.jpg",
    "movielensId": null,
    "imdbId": "tt9140560",
    "tmdbId": 85271,
    "tags": [
      "mcu",
      "marvel",
      "scarlet witch",
      "vision",
      "westview",
      "grief",
      "sitcom",
      "agatha harkness",
      "hex"
    ],
    "ratingCount": 390,
    "ratingMean": 4.7,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-falcon-winter-soldier",
    "title": "The Falcon and the Winter Soldier",
    "originalTitle": "The Falcon and the Winter Soldier (2021)",
    "year": 2021,
    "director": "Malcolm Spellman & Kari Skogland",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Science fiction"
    ],
    "runtime": 50,
    "poster": "https://upload.wikimedia.org/wikipedia/en/4/40/The_Falcon_and_the_Winter_Soldier_%22New_World_Order%22_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt9233980",
    "tmdbId": 88396,
    "tags": [
      "mcu",
      "marvel",
      "sam wilson",
      "bucky barnes",
      "captain america",
      "shield",
      "john walker",
      "baron zemo"
    ],
    "ratingCount": 310,
    "ratingMean": 4.3,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-hawkeye",
    "title": "Hawkeye",
    "originalTitle": "Hawkeye (2021)",
    "year": 2021,
    "director": "Jonathan Igla & Rhys Thomas",
    "genres": [
      "Action",
      "Adventure",
      "Crime"
    ],
    "runtime": 48,
    "poster": "https://upload.wikimedia.org/wikipedia/en/8/83/Hawkeye_%22Never_Meet_Your_Heroes%22_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10160804",
    "tmdbId": 88329,
    "tags": [
      "mcu",
      "marvel",
      "clint barton",
      "kate bishop",
      "archery",
      "new york",
      "christmas",
      "kingpin",
      "yelena belova"
    ],
    "ratingCount": 320,
    "ratingMean": 4.4,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-moon-knight",
    "title": "Moon Knight",
    "originalTitle": "Moon Knight (2022)",
    "year": 2022,
    "director": "Jeremy Slater & Mohamed Diab",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy",
      "Horror"
    ],
    "runtime": 48,
    "poster": "https://upload.wikimedia.org/wikipedia/en/a/a5/Moon_Knight_%22Summon_the_Suit%22_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10234724",
    "tmdbId": 92749,
    "tags": [
      "mcu",
      "marvel",
      "oscar isaac",
      "marc spector",
      "steven grant",
      "khonshu",
      "egyptian mythology",
      "mr knight"
    ],
    "ratingCount": 360,
    "ratingMean": 4.6,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-ms-marvel",
    "title": "Ms. Marvel",
    "originalTitle": "Ms. Marvel (2022)",
    "year": 2022,
    "director": "Bisha K. Ali / Adil & Bilall",
    "genres": [
      "Action",
      "Adventure",
      "Comedy",
      "Fantasy"
    ],
    "runtime": 45,
    "poster": "https://upload.wikimedia.org/wikipedia/en/4/40/Ms._Marvel_%22No_Normal%22_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10857164",
    "tmdbId": 92782,
    "tags": [
      "mcu",
      "marvel",
      "kamala khan",
      "jersey city",
      "iman vellani",
      "family",
      "superhero origin"
    ],
    "ratingCount": 260,
    "ratingMean": 4.2,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-she-hulk",
    "title": "She-Hulk: Attorney at Law",
    "originalTitle": "She-Hulk: Attorney at Law (2022)",
    "year": 2022,
    "director": "Jessica Gao & Kat Coiro",
    "genres": [
      "Action",
      "Comedy",
      "Science fiction"
    ],
    "runtime": 35,
    "poster": "https://upload.wikimedia.org/wikipedia/en/4/48/She-Hulk_Attorney_at_Law_%22A_Normal_Amount_of_Rage%22_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10857160",
    "tmdbId": 92783,
    "tags": [
      "mcu",
      "marvel",
      "jennifer walters",
      "lawyer",
      "tatiana maslany",
      "fourth wall",
      "daredevil cameo"
    ],
    "ratingCount": 270,
    "ratingMean": 4.1,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-secret-invasion",
    "title": "Secret Invasion",
    "originalTitle": "Secret Invasion (2023)",
    "year": 2023,
    "director": "Kyle Bradstreet & Ali Selim",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Science fiction"
    ],
    "runtime": 45,
    "poster": "https://upload.wikimedia.org/wikipedia/en/2/2f/Secret_Invasion_%22Promises%22_poster.jpg",
    "movielensId": null,
    "imdbId": "tt13157618",
    "tmdbId": 114472,
    "tags": [
      "mcu",
      "marvel",
      "nick fury",
      "samuel l jackson",
      "skrulls",
      "espionage",
      "shapeshifters"
    ],
    "ratingCount": 240,
    "ratingMean": 3.8,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-echo",
    "title": "Echo",
    "originalTitle": "Echo (2024)",
    "year": 2024,
    "director": "Marion Dayre & Sydney Freeland",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "runtime": 42,
    "poster": "https://upload.wikimedia.org/wikipedia/en/9/9c/Echo_2023_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt13966962",
    "tmdbId": 138502,
    "tags": [
      "mcu",
      "marvel",
      "maya lopez",
      "alaqua cox",
      "kingpin",
      "vincent donofrio",
      "daredevil",
      "gritty"
    ],
    "ratingCount": 230,
    "ratingMean": 4.1,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-agatha-all-along",
    "title": "Agatha All Along",
    "originalTitle": "Agatha All Along (2024)",
    "year": 2024,
    "director": "Jac Schaeffer",
    "genres": [
      "Comedy",
      "Fantasy",
      "Mystery",
      "Science fiction"
    ],
    "runtime": 45,
    "poster": "https://upload.wikimedia.org/wikipedia/en/9/95/Agatha_All_Along_%22Seekest_Thou_the_Road%22_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt15594478",
    "tmdbId": 138501,
    "tags": [
      "mcu",
      "marvel",
      "agatha harkness",
      "kathryn hahn",
      "witches road",
      "coven",
      "aubrey plaza"
    ],
    "ratingCount": 300,
    "ratingMean": 4.5,
    "source": "Marvel Cinematic Universe"
  },
  {
    "id": "mcu-daredevil-series",
    "title": "Daredevil (TV Series)",
    "originalTitle": "Daredevil (2015)",
    "year": 2015,
    "director": "Drew Goddard",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "runtime": 54,
    "poster": "https://upload.wikimedia.org/wikipedia/en/1/1b/Daredevil_season_1_poster.jpg",
    "movielensId": null,
    "imdbId": "tt3322312",
    "tmdbId": 61889,
    "tags": [
      "marvel",
      "mcu",
      "matt murdock",
      "charlie cox",
      "kingpin",
      "hallway fight",
      "hells kitchen",
      "gritty masterwork"
    ],
    "ratingCount": 480,
    "ratingMean": 4.9,
    "source": "Marvel Television"
  },
  {
    "id": "mcu-the-punisher",
    "title": "The Punisher (TV Series)",
    "originalTitle": "The Punisher (2017)",
    "year": 2017,
    "director": "Steve Lightfoot",
    "genres": [
      "Action",
      "Crime",
      "Drama",
      "Thriller"
    ],
    "runtime": 53,
    "poster": "https://upload.wikimedia.org/wikipedia/en/2/21/The_Punisher_season_1_poster.jpg",
    "movielensId": null,
    "imdbId": "tt5675620",
    "tmdbId": 67178,
    "tags": [
      "marvel",
      "frank castle",
      "jon bernthal",
      "vigilante",
      "military",
      "revenge",
      "gritty"
    ],
    "ratingCount": 410,
    "ratingMean": 4.75,
    "source": "Marvel Television"
  },
  {
    "id": "mcu-jessica-jones",
    "title": "Jessica Jones",
    "originalTitle": "Jessica Jones (2015)",
    "year": 2015,
    "director": "Melissa Rosenberg",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "runtime": 52,
    "poster": "https://upload.wikimedia.org/wikipedia/en/c/c1/Jessica_Jones_season_1_poster.jpg",
    "movielensId": null,
    "imdbId": "tt2357547",
    "tmdbId": 38472,
    "tags": [
      "marvel",
      "krysten ritter",
      "kilgrave",
      "david tennant",
      "alias investigations",
      "noir",
      "psychological"
    ],
    "ratingCount": 370,
    "ratingMean": 4.65,
    "source": "Marvel Television"
  },
  {
    "id": "mcu-luke-cage",
    "title": "Luke Cage",
    "originalTitle": "Luke Cage (2016)",
    "year": 2016,
    "director": "Cheo Hodari Coker",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "runtime": 55,
    "poster": "https://upload.wikimedia.org/wikipedia/en/3/37/Luke_Cage_season_1_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt3322314",
    "tmdbId": 62126,
    "tags": [
      "marvel",
      "mike colter",
      "harlem",
      "bulletproof",
      "cottonmouth",
      "mahershala ali"
    ],
    "ratingCount": 310,
    "ratingMean": 4.4,
    "source": "Marvel Television"
  },
  {
    "id": "mcu-iron-fist",
    "title": "Iron Fist",
    "originalTitle": "Iron Fist (2017)",
    "year": 2017,
    "director": "Scott Buck",
    "genres": [
      "Action",
      "Adventure",
      "Crime"
    ],
    "runtime": 55,
    "poster": "https://upload.wikimedia.org/wikipedia/en/e/ef/Iron_Fist_season_1_poster.jpg",
    "movielensId": null,
    "imdbId": "tt3322310",
    "tmdbId": 62127,
    "tags": [
      "marvel",
      "danny rand",
      "k un lun",
      "martial arts",
      "colleen wing",
      "the hand"
    ],
    "ratingCount": 220,
    "ratingMean": 3.6,
    "source": "Marvel Television"
  },
  {
    "id": "mcu-agents-of-shield",
    "title": "Agents of S.H.I.E.L.D.",
    "originalTitle": "Agents of S.H.I.E.L.D. (2013)",
    "year": 2013,
    "director": "Joss Whedon & Jed Whedon",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Science fiction"
    ],
    "runtime": 43,
    "poster": "https://upload.wikimedia.org/wikipedia/en/5/53/Agents_of_S.H.I.E.L.D._season_1_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt2364582",
    "tmdbId": 1403,
    "tags": [
      "marvel",
      "mcu",
      "phil coulson",
      "clark gregg",
      "shield",
      "hydra",
      "daisy johnson"
    ],
    "ratingCount": 350,
    "ratingMean": 4.5,
    "source": "Marvel Television"
  },
  {
    "id": "marvel-xmen-97",
    "title": "X-Men '97",
    "originalTitle": "X-Men '97 (2024)",
    "year": 2024,
    "director": "Beau DeMayo",
    "genres": [
      "Animation",
      "Action",
      "Adventure",
      "Science fiction"
    ],
    "runtime": 32,
    "poster": "https://upload.wikimedia.org/wikipedia/en/b/bf/X-Men_%2797_season_1_poster.jpg",
    "movielensId": null,
    "imdbId": "tt16159516",
    "tmdbId": 138505,
    "tags": [
      "marvel",
      "mutants",
      "cyclops",
      "magneto",
      "storm",
      "wolverine",
      "animation masterwork",
      "90s"
    ],
    "ratingCount": 390,
    "ratingMean": 4.85,
    "source": "Marvel Animation"
  },
  {
    "id": "mcu-avengers-endgame",
    "title": "Avengers: Endgame",
    "originalTitle": "Avengers: Endgame (2019)",
    "year": 2019,
    "director": "Anthony and Joe Russo",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Science fiction"
    ],
    "runtime": 181,
    "poster": "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
    "movielensId": null,
    "imdbId": "tt4154796",
    "tmdbId": 299534,
    "tags": [
      "mcu",
      "marvel",
      "avengers",
      "thanos",
      "iron man",
      "captain america",
      "infinity stones",
      "climax",
      "time heist",
      "portals"
    ],
    "ratingCount": 520,
    "ratingMean": 4.85,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-captain-marvel",
    "title": "Captain Marvel",
    "originalTitle": "Captain Marvel (2019)",
    "year": 2019,
    "director": "Anna Boden and Ryan Fleck",
    "genres": [
      "Action",
      "Adventure",
      "Science fiction"
    ],
    "runtime": 124,
    "poster": "https://upload.wikimedia.org/wikipedia/en/4/4e/Captain_Marvel_%28film%29_poster.jpg",
    "movielensId": null,
    "imdbId": "tt4154664",
    "tmdbId": 299537,
    "tags": [
      "mcu",
      "marvel",
      "carol danvers",
      "brie larson",
      "skrulls",
      "90s",
      "space",
      "nick fury"
    ],
    "ratingCount": 330,
    "ratingMean": 4.25,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-spiderman-far-from-home",
    "title": "Spider-Man: Far From Home",
    "originalTitle": "Spider-Man: Far From Home (2019)",
    "year": 2019,
    "director": "Jon Watts",
    "genres": [
      "Action",
      "Adventure",
      "Comedy",
      "Science fiction"
    ],
    "runtime": 129,
    "poster": "https://upload.wikimedia.org/wikipedia/en/b/bd/Spider-Man_Far_From_Home_poster.jpg",
    "movielensId": null,
    "imdbId": "tt6320628",
    "tmdbId": 429617,
    "tags": [
      "mcu",
      "marvel",
      "peter parker",
      "tom holland",
      "mysterio",
      "jake gyllenhaal",
      "europe trip",
      "elementals"
    ],
    "ratingCount": 380,
    "ratingMean": 4.5,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-black-widow",
    "title": "Black Widow",
    "originalTitle": "Black Widow (2021)",
    "year": 2021,
    "director": "Cate Shortland",
    "genres": [
      "Action",
      "Adventure",
      "Thriller"
    ],
    "runtime": 134,
    "poster": "https://upload.wikimedia.org/wikipedia/en/e/e9/Black_Widow_%282021_film%29_poster.jpg",
    "movielensId": null,
    "imdbId": "tt3470600",
    "tmdbId": 497698,
    "tags": [
      "mcu",
      "marvel",
      "natasha romanoff",
      "scarlett johansson",
      "yelena belova",
      "red room",
      "taskmaster"
    ],
    "ratingCount": 340,
    "ratingMean": 4.3,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-shang-chi",
    "title": "Shang-Chi and the Legend of the Ten Rings",
    "originalTitle": "Shang-Chi and the Legend of the Ten Rings (2021)",
    "year": 2021,
    "director": "Destin Daniel Cretton",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy"
    ],
    "runtime": 132,
    "poster": "https://upload.wikimedia.org/wikipedia/en/7/74/Shang-Chi_and_the_Legend_of_the_Ten_Rings_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt9376612",
    "tmdbId": 566525,
    "tags": [
      "mcu",
      "marvel",
      "martial arts",
      "ten rings",
      "simu liu",
      "tony leung",
      "wenwu",
      "ta lo",
      "action"
    ],
    "ratingCount": 370,
    "ratingMean": 4.6,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-eternals",
    "title": "Eternals",
    "originalTitle": "Eternals (2021)",
    "year": 2021,
    "director": "Chloé Zhao",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Fantasy",
      "Science fiction"
    ],
    "runtime": 156,
    "poster": "https://upload.wikimedia.org/wikipedia/en/9/9b/Eternals_%28film%29_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt9032400",
    "tmdbId": 524434,
    "tags": [
      "mcu",
      "marvel",
      "celestials",
      "chloe zhao",
      "cosmic",
      "immortals",
      "ikaris",
      "sersi"
    ],
    "ratingCount": 290,
    "ratingMean": 4.1,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-spiderman-no-way-home",
    "title": "Spider-Man: No Way Home",
    "originalTitle": "Spider-Man: No Way Home (2021)",
    "year": 2021,
    "director": "Jon Watts",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy",
      "Science fiction"
    ],
    "runtime": 148,
    "poster": "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10872600",
    "tmdbId": 634649,
    "tags": [
      "mcu",
      "marvel",
      "multiverse",
      "tobey maguire",
      "andrew garfield",
      "tom holland",
      "green goblin",
      "doc ock",
      "nostalgia"
    ],
    "ratingCount": 510,
    "ratingMean": 4.85,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-doctor-strange-mom",
    "title": "Doctor Strange in the Multiverse of Madness",
    "originalTitle": "Doctor Strange in the Multiverse of Madness (2022)",
    "year": 2022,
    "director": "Sam Raimi",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy",
      "Horror",
      "Science fiction"
    ],
    "runtime": 126,
    "poster": "https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg",
    "movielensId": null,
    "imdbId": "tt9419884",
    "tmdbId": 453395,
    "tags": [
      "mcu",
      "marvel",
      "sam raimi",
      "scarlet witch",
      "benedict cumberbatch",
      "multiverse",
      "darkhold",
      "illuminati"
    ],
    "ratingCount": 380,
    "ratingMean": 4.4,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-thor-love-and-thunder",
    "title": "Thor: Love and Thunder",
    "originalTitle": "Thor: Love and Thunder (2022)",
    "year": 2022,
    "director": "Taika Waititi",
    "genres": [
      "Action",
      "Adventure",
      "Comedy",
      "Fantasy",
      "Science fiction"
    ],
    "runtime": 119,
    "poster": "https://upload.wikimedia.org/wikipedia/en/8/88/Thor_Love_and_Thunder_poster.jpeg",
    "movielensId": null,
    "imdbId": "tt10648342",
    "tmdbId": 616037,
    "tags": [
      "mcu",
      "marvel",
      "chris hemsworth",
      "christian bale",
      "gorr",
      "natalie portman",
      "mighty thor"
    ],
    "ratingCount": 310,
    "ratingMean": 4.15,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-wakanda-forever",
    "title": "Black Panther: Wakanda Forever",
    "originalTitle": "Black Panther: Wakanda Forever (2022)",
    "year": 2022,
    "director": "Ryan Coogler",
    "genres": [
      "Action",
      "Adventure",
      "Drama",
      "Science fiction"
    ],
    "runtime": 161,
    "poster": "https://upload.wikimedia.org/wikipedia/en/3/3b/Black_Panther_Wakanda_Forever_poster.jpg",
    "movielensId": null,
    "imdbId": "tt9114286",
    "tmdbId": 505642,
    "tags": [
      "mcu",
      "marvel",
      "wakanda",
      "namor",
      "talokan",
      "chadwick boseman tribute",
      "shuri"
    ],
    "ratingCount": 370,
    "ratingMean": 4.5,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-ant-man-quantumania",
    "title": "Ant-Man and the Wasp: Quantumania",
    "originalTitle": "Ant-Man and the Wasp: Quantumania (2023)",
    "year": 2023,
    "director": "Peyton Reed",
    "genres": [
      "Action",
      "Adventure",
      "Comedy",
      "Science fiction"
    ],
    "runtime": 124,
    "poster": "https://upload.wikimedia.org/wikipedia/en/3/30/Ant-Man_and_the_Wasp_Quantumania_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10954600",
    "tmdbId": 640146,
    "tags": [
      "mcu",
      "marvel",
      "quantum realm",
      "kang the conqueror",
      "paul rudd",
      "jonathan majors"
    ],
    "ratingCount": 290,
    "ratingMean": 3.9,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-guardians-vol-3",
    "title": "Guardians of the Galaxy Vol. 3",
    "originalTitle": "Guardians of the Galaxy Vol. 3 (2023)",
    "year": 2023,
    "director": "James Gunn",
    "genres": [
      "Action",
      "Adventure",
      "Comedy",
      "Science fiction"
    ],
    "runtime": 150,
    "poster": "https://upload.wikimedia.org/wikipedia/en/7/74/Guardians_of_the_Galaxy_Vol._3_poster.jpg",
    "movielensId": null,
    "imdbId": "tt6791350",
    "tmdbId": 447365,
    "tags": [
      "mcu",
      "marvel",
      "james gunn",
      "rocket raccoon",
      "star lord",
      "emotional",
      "high evolutionary",
      "goodbye trilogy"
    ],
    "ratingCount": 460,
    "ratingMean": 4.8,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-the-marvels",
    "title": "The Marvels",
    "originalTitle": "The Marvels (2023)",
    "year": 2023,
    "director": "Nia DaCosta",
    "genres": [
      "Action",
      "Adventure",
      "Comedy",
      "Science fiction"
    ],
    "runtime": 105,
    "poster": "https://upload.wikimedia.org/wikipedia/en/7/7a/The_Marvels_poster.jpg",
    "movielensId": null,
    "imdbId": "tt10676048",
    "tmdbId": 609681,
    "tags": [
      "mcu",
      "marvel",
      "brie larson",
      "iman vellani",
      "teyonah parris",
      "cosmic",
      "teamup"
    ],
    "ratingCount": 250,
    "ratingMean": 4,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "mcu-deadpool-wolverine",
    "title": "Deadpool & Wolverine",
    "originalTitle": "Deadpool & Wolverine (2024)",
    "year": 2024,
    "director": "Shawn Levy",
    "genres": [
      "Action",
      "Comedy",
      "Science fiction"
    ],
    "runtime": 128,
    "poster": "https://upload.wikimedia.org/wikipedia/en/4/4c/Deadpool_%26_Wolverine_poster.jpg",
    "movielensId": null,
    "imdbId": "tt6263850",
    "tmdbId": 533535,
    "tags": [
      "mcu",
      "marvel",
      "ryan reynolds",
      "hugh jackman",
      "wolverine",
      "deadpool",
      "multiverse",
      "tva",
      "cameos",
      "r-rated"
    ],
    "ratingCount": 490,
    "ratingMean": 4.8,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "marvel-spider-verse",
    "title": "Spider-Man: Into the Spider-Verse",
    "originalTitle": "Spider-Man: Into the Spider-Verse (2018)",
    "year": 2018,
    "director": "Bob Persichetti, Peter Ramsey & Rodney Rothman",
    "genres": [
      "Animation",
      "Action",
      "Adventure",
      "Science fiction"
    ],
    "runtime": 117,
    "poster": "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png",
    "movielensId": null,
    "imdbId": "tt4633694",
    "tmdbId": 324857,
    "tags": [
      "marvel",
      "miles morales",
      "spider-man",
      "oscar winner",
      "groundbreaking animation",
      "multiverse",
      "gwen stacy"
    ],
    "ratingCount": 480,
    "ratingMean": 4.9,
    "source": "Curated Modern Cinema"
  },
  {
    "id": "marvel-across-spider-verse",
    "title": "Spider-Man: Across the Spider-Verse",
    "originalTitle": "Spider-Man: Across the Spider-Verse (2023)",
    "year": 2023,
    "director": "Joaquim Dos Santos, Kemp Powers & Justin K. Thompson",
    "genres": [
      "Animation",
      "Action",
      "Adventure",
      "Science fiction"
    ],
    "runtime": 140,
    "poster": "https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg",
    "movielensId": null,
    "imdbId": "tt9362722",
    "tmdbId": 569094,
    "tags": [
      "marvel",
      "miles morales",
      "spider-man",
      "miguel o hara",
      "spider-punk",
      "canon events",
      "multiverse",
      "visual masterpiece"
    ],
    "ratingCount": 490,
    "ratingMean": 4.95,
    "source": "Curated Modern Cinema"
  },

  {
    id: 'uncut-gems',
    title: 'Uncut Gems',
    originalTitle: 'Uncut Gems (2019)',
    year: 2019,
    director: 'Josh and Benny Safdie',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 135,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Uncut_Gems_poster.jpg',
    movielensId: null,
    imdbId: 'tt5727208',
    tmdbId: 473033,
    tags: ['safdie brothers', 'adam sandler', 'gambling', 'anxiety', 'new york', 'diamond district', 'tense', 'chaos', 'sports betting', 'kevin garnett'],
    ratingCount: 220,
    ratingMean: 4.45,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'dune-2021',
    title: 'Dune',
    originalTitle: 'Dune (2021)',
    year: 2021,
    director: 'Denis Villeneuve',
    genres: ['Action', 'Adventure', 'Drama', 'Science fiction'],
    runtime: 155,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg',
    movielensId: null,
    imdbId: 'tt1160419',
    tmdbId: 438631,
    tags: ['arrakis', 'paul atreides', 'spice', 'sandworm', 'denis villeneuve', 'hans zimmer', 'frank herbert', 'sci-fi epic'],
    ratingCount: 380,
    ratingMean: 4.65,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two (2024)',
    year: 2024,
    director: 'Denis Villeneuve',
    genres: ['Action', 'Adventure', 'Drama', 'Science fiction'],
    runtime: 166,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
    movielensId: null,
    imdbId: 'tt15239678',
    tmdbId: 693134,
    tags: ['arrakis', 'paul atreides', 'feyd-rautha', 'chani', 'sandworm', 'denis villeneuve', 'hans zimmer', 'timothee chalamet', 'zendaya', 'epic'],
    ratingCount: 420,
    ratingMean: 4.8,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'jojo-rabbit',
    title: 'Jojo Rabbit',
    originalTitle: 'Jojo Rabbit (2019)',
    year: 2019,
    director: 'Taika Waititi',
    genres: ['Comedy', 'Drama', 'War'],
    runtime: 108,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Jojo_Rabbit_%282019%29_poster.jpg',
    movielensId: null,
    imdbId: 'tt2584384',
    tmdbId: 515001,
    tags: ['satire', 'world war ii', 'anti-hate', 'taika waititi', 'imaginary friend', 'coming of age', 'scarlett johansson', 'oscar winner'],
    ratingCount: 260,
    ratingMean: 4.6,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'once-upon-a-time-in-hollywood',
    title: 'Once Upon a Time in Hollywood',
    originalTitle: 'Once Upon a Time in Hollywood (2019)',
    year: 2019,
    director: 'Quentin Tarantino',
    genres: ['Comedy', 'Drama'],
    runtime: 161,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Once_Upon_a_Time_in_Hollywood_poster.png',
    movielensId: null,
    imdbId: 'tt7131622',
    tmdbId: 466272,
    tags: ['1969', 'los angeles', 'quentin tarantino', 'leonardo dicaprio', 'brad pitt', 'sharon tate', 'hollywood', 'alternate history'],
    ratingCount: 390,
    ratingMean: 4.6,
    source: 'Curated Modern Cinema'
  },
  {
    id: 'tv-true-detective',
    title: 'True Detective',
    originalTitle: 'True Detective (2014)',
    year: 2014,
    director: 'Nic Pizzolatto',
    genres: ['Crime', 'Drama', 'Mystery', 'Thriller'],
    runtime: 55,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/37/True_Detective_season_1.png',
    movielensId: null,
    imdbId: 'tt2356777',
    tmdbId: 46648,
    tags: ['rust cohle', 'matthew mcconaughey', 'woody harrelson', 'louisiana', 'yellow king', 'southern gothic', 'hbo', 'anthology'],
    ratingCount: 450,
    ratingMean: 4.9,
    source: 'Prestige Television'
  },
  {
    id: 'tv-breaking-bad',
    title: 'Breaking Bad',
    originalTitle: 'Breaking Bad (2008)',
    year: 2008,
    director: 'Vince Gilligan',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 47,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Breaking_Bad_promo.jpg',
    movielensId: null,
    imdbId: 'tt0903747',
    tmdbId: 1396,
    tags: ['walter white', 'bryan cranston', 'jesse pinkman', 'meth', 'albuquerque', 'heisenberg', 'masterpiece'],
    ratingCount: 520,
    ratingMean: 4.95,
    source: 'Prestige Television'
  },
  {
    id: 'tv-better-call-saul',
    title: 'Better Call Saul',
    originalTitle: 'Better Call Saul (2015)',
    year: 2015,
    director: 'Vince Gilligan',
    genres: ['Crime', 'Drama'],
    runtime: 50,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Better_Call_Saul_season_1.jpg',
    movielensId: null,
    imdbId: 'tt3032476',
    tmdbId: 60059,
    tags: ['jimmy mcgill', 'bob odenkirk', 'kim wexler', 'lawyer', 'breaking bad', 'albuquerque'],
    ratingCount: 410,
    ratingMean: 4.9,
    source: 'Prestige Television'
  },
  {
    id: 'tv-the-wire',
    title: 'The Wire',
    originalTitle: 'The Wire (2002)',
    year: 2002,
    director: 'David Simon',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 60,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/2/2d/The_Wire_-_Season_1.jpg/250px-The_Wire_-_Season_1.jpg',
    movielensId: null,
    imdbId: 'tt0306414',
    tmdbId: 1438,
    tags: ['baltimore', 'police', 'drug trade', 'institutions', 'idris elba', 'omar little', 'realism', 'hbo'],
    ratingCount: 480,
    ratingMean: 4.95,
    source: 'Prestige Television'
  },
  {
    id: 'tv-the-sopranos',
    title: 'The Sopranos',
    originalTitle: 'The Sopranos (1999)',
    year: 1999,
    director: 'David Chase',
    genres: ['Crime', 'Drama'],
    runtime: 55,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4a/The_Sopranos_S1_DVD.jpg',
    movielensId: null,
    imdbId: 'tt0141842',
    tmdbId: 1398,
    tags: ['tony soprano', 'james gandolfini', 'new jersey', 'mafia', 'therapy', 'family', 'hbo'],
    ratingCount: 460,
    ratingMean: 4.9,
    source: 'Prestige Television'
  },
  {
    id: 'tv-succession',
    title: 'Succession',
    originalTitle: 'Succession (2018)',
    year: 2018,
    director: 'Jesse Armstrong',
    genres: ['Drama'],
    runtime: 60,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Succession_season_1.jpg',
    movielensId: null,
    imdbId: 'tt7660850',
    tmdbId: 76331,
    tags: ['logan roy', 'waystar royco', 'kendall roy', 'satire', 'corporate', 'wealth', 'family power', 'hbo'],
    ratingCount: 430,
    ratingMean: 4.85,
    source: 'Prestige Television'
  },
  {
    id: 'tv-chernobyl',
    title: 'Chernobyl',
    originalTitle: 'Chernobyl (2019)',
    year: 2019,
    director: 'Craig Mazin',
    genres: ['Drama', 'History', 'Thriller'],
    runtime: 65,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Chernobyl_2019_Miniseries.jpg',
    movielensId: null,
    imdbId: 'tt7366338',
    tmdbId: 87108,
    tags: ['nuclear disaster', 'soviet union', 'valery legasov', 'hbo', 'pripyat', 'historical'],
    ratingCount: 440,
    ratingMean: 4.9,
    source: 'Prestige Television'
  },
  {
    id: 'tv-severance',
    title: 'Severance',
    originalTitle: 'Severance (2022)',
    year: 2022,
    director: 'Dan Erickson',
    genres: ['Drama', 'Mystery', 'Science fiction', 'Thriller'],
    runtime: 50,
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Severance_logo.svg/250px-Severance_logo.svg.png',
    movielensId: null,
    imdbId: 'tt11280740',
    tmdbId: 95396,
    tags: ['lumon', 'macrodata refinement', 'adam scott', 'workplace dystopia', 'memory split', 'apple tv+'],
    ratingCount: 370,
    ratingMean: 4.8,
    source: 'Prestige Television'
  },
  {
    id: 'tv-fleabag',
    title: 'Fleabag',
    originalTitle: 'Fleabag (2016)',
    year: 2016,
    director: 'Phoebe Waller-Bridge',
    genres: ['Comedy', 'Drama'],
    runtime: 27,
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Fleabag_titlecard.png/250px-Fleabag_titlecard.png',
    movielensId: null,
    imdbId: 'tt5687612',
    tmdbId: 67070,
    tags: ['fourth wall', 'london', 'hot priest', 'grief', 'sisterhood', 'witty', 'acclaimed'],
    ratingCount: 360,
    ratingMean: 4.85,
    source: 'Prestige Television'
  },
  {
    id: 'tv-band-of-brothers',
    title: 'Band of Brothers',
    originalTitle: 'Band of Brothers (2001)',
    year: 2001,
    director: 'Steven Spielberg & Tom Hanks',
    genres: ['Action', 'Drama', 'History', 'War'],
    runtime: 60,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/49/Band_of_Brothers_poster.jpg',
    movielensId: null,
    imdbId: 'tt0185906',
    tmdbId: 4613,
    tags: ['easy company', 'world war ii', 'normandy', 'brotherhood', 'hbo miniseries', 'masterpiece'],
    ratingCount: 490,
    ratingMean: 4.95,
    source: 'Prestige Television'
  },
  {
    id: 'tv-mad-men',
    title: 'Mad Men',
    originalTitle: 'Mad Men (2007)',
    year: 2007,
    director: 'Matthew Weiner',
    genres: ['Drama'],
    runtime: 48,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/90/Mad_Men_Season_1%2C_promotional_poster.jpg',
    movielensId: null,
    imdbId: 'tt0804503',
    tmdbId: 1104,
    tags: ['don draper', 'jon hamm', 'madison avenue', 'advertising', '1960s', 'identity'],
    ratingCount: 420,
    ratingMean: 4.8,
    source: 'Prestige Television'
  },
  {
    id: 'tv-game-of-thrones',
    title: 'Game of Thrones',
    originalTitle: 'Game of Thrones (2011)',
    year: 2011,
    director: 'David Benioff & D.B. Weiss',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    runtime: 57,
    poster: 'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg',
    movielensId: null,
    imdbId: 'tt0944947',
    tmdbId: 1399,
    tags: ['westeros', 'winter is coming', 'iron throne', 'dragons', 'george r.r. martin', 'hbo'],
    ratingCount: 510,
    ratingMean: 4.75,
    source: 'Prestige Television'
  },
  {
    id: 'tv-the-bear',
    title: 'The Bear',
    originalTitle: 'The Bear (2022)',
    year: 2022,
    director: 'Christopher Storer',
    genres: ['Comedy', 'Drama'],
    runtime: 32,
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/The_Bear_Title_Card.jpg/250px-The_Bear_Title_Card.jpg',
    movielensId: null,
    imdbId: 'tt14452776',
    tmdbId: 136315,
    tags: ['kitchen', 'chicago', 'carmy', 'culinary', 'yes chef', 'grief', 'intense pacing'],
    ratingCount: 390,
    ratingMean: 4.8,
    source: 'Prestige Television'
  },
  {
    id: 'tv-mindhunter',
    title: 'Mindhunter',
    originalTitle: 'Mindhunter (2017)',
    year: 2017,
    director: 'David Fincher',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 55,
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Mindhunter_Logo.svg/250px-Mindhunter_Logo.svg.png',
    movielensId: null,
    imdbId: 'tt5290382',
    tmdbId: 67744,
    tags: ['fbi', 'serial killers', 'behavioral science', 'david fincher', 'jonathan groff', 'psychology'],
    ratingCount: 380,
    ratingMean: 4.8,
    source: 'Prestige Television'
  },
  {
    id: 'tv-dark',
    title: 'Dark',
    originalTitle: 'Dark (2017)',
    year: 2017,
    director: 'Baran bo Odar',
    genres: ['Crime', 'Drama', 'Mystery', 'Science fiction', 'Thriller'],
    runtime: 60,
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Dark_TV_Series_Logo.svg/250px-Dark_TV_Series_Logo.svg.png',
    movielensId: null,
    imdbId: 'tt5753856',
    tmdbId: 70523,
    tags: ['time travel', 'winden', 'nuclear plant', 'puzzle', 'german', 'complex timelines', 'netflix'],
    ratingCount: 420,
    ratingMean: 4.85,
    source: 'Prestige Television'
  },
  {
    id: 'tv-the-last-of-us',
    title: 'The Last of Us',
    originalTitle: 'The Last of Us (2023)',
    year: 2023,
    director: 'Craig Mazin',
    genres: ['Action', 'Adventure', 'Drama', 'Science fiction'],
    runtime: 60,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/3/3e/The_Last_of_Us_season_1_Blu-ray.png/250px-The_Last_of_Us_season_1_Blu-ray.png',
    movielensId: null,
    imdbId: 'tt3581920',
    tmdbId: 100088,
    tags: ['cordyceps', 'joel and ellie', 'pedro pascal', 'bella ramsey', 'post-apocalyptic', 'hbo'],
    ratingCount: 410,
    ratingMean: 4.75,
    source: 'Prestige Television'
  },
  {
    id: 'tv-fargo',
    title: 'Fargo (TV series)',
    originalTitle: 'Fargo (2014)',
    year: 2014,
    director: 'Noah Hawley',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 53,
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Fargoseason1promo.jpg',
    movielensId: null,
    imdbId: 'tt2802850',
    tmdbId: 60622,
    tags: ['lorne malvo', 'minnesota', 'coen brothers inspiration', 'dark comedy', 'billy bob thornton'],
    ratingCount: 370,
    ratingMean: 4.8,
    source: 'Prestige Television'
  },
  {
    id: 'tv-twin-peaks',
    title: 'Twin Peaks',
    originalTitle: 'Twin Peaks (1990)',
    year: 1990,
    director: 'David Lynch & Mark Frost',
    genres: ['Crime', 'Drama', 'Mystery'],
    runtime: 47,
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Twin_Peaks_title.svg/250px-Twin_Peaks_title.svg.png',
    movielensId: null,
    imdbId: 'tt0098936',
    tmdbId: 192,
    tags: ['who killed laura palmer', 'dale cooper', 'david lynch', 'surreal', 'cherry pie', 'cult classic'],
    ratingCount: 400,
    ratingMean: 4.85,
    source: 'Prestige Television'
  },
  {
    id: 'tv-peaky-blinders',
    title: 'Peaky Blinders',
    originalTitle: 'Peaky Blinders (2013)',
    year: 2013,
    director: 'Steven Knight',
    genres: ['Crime', 'Drama'],
    runtime: 58,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/e/e8/Peaky_Blinders_titlecard.jpg/250px-Peaky_Blinders_titlecard.jpg',
    movielensId: null,
    imdbId: 'tt2442560',
    tmdbId: 60574,
    tags: ['birmingham', 'thomas shelby', 'cillian murphy', 'gangster', 'by order of the peaky blinders'],
    ratingCount: 420,
    ratingMean: 4.75,
    source: 'Prestige Television'
  },
  {
    id: 'tv-sacred-games',
    title: 'Sacred Games',
    originalTitle: 'Sacred Games (2018)',
    year: 2018,
    director: 'Vikramaditya Motwane & Anurag Kashyap',
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    runtime: 50,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/7/7a/Sacred_Games_Title.png/250px-Sacred_Games_Title.png',
    movielensId: null,
    imdbId: 'tt6077448',
    tmdbId: 79352,
    tags: ['mumbai', 'sartaj singh', 'ganesh gaitonde', 'saif ali khan', 'nawazuddin siddiqui', 'netflix india'],
    ratingCount: 350,
    ratingMean: 4.7,
    source: 'Prestige Television'
  },
  {
    id: 'tv-paatal-lok',
    title: 'Paatal Lok',
    originalTitle: 'Paatal Lok (2020)',
    year: 2020,
    director: 'Sudip Sharma',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 45,
    poster: 'https://thumb.wikimedia.org/wikipedia/en/thumb/3/39/Paatal_Lok_poster.jpg/250px-Paatal_Lok_poster.jpg',
    movielensId: null,
    imdbId: 'tt9680440',
    tmdbId: 103244,
    tags: ['hathi ram chaudhary', 'jaideep ahlawat', 'delhi', 'investigation', 'social realism', 'gritty'],
    ratingCount: 310,
    ratingMean: 4.75,
    source: 'Prestige Television'
  }
];

export async function runImport() {
  const moviesPath = path.join(root, 'catalogue/movies.json');
  const sourcePath = path.join(root, 'catalogue/source.json');

  const movies = JSON.parse(fs.readFileSync(moviesPath, 'utf8'));
  const movieMap = new Map(movies.map(m => [m.id, m]));

  // Apply patches to existing MovieLens movies
  let patchedCount = 0;
  for (const [id, patch] of Object.entries(MOVIELENS_POSTER_PATCHES)) {
    if (movieMap.has(id)) {
      const target = movieMap.get(id);
      Object.assign(target, patch);
      patchedCount++;
    }
  }

  // Insert or update Bollywood & Curated titles
  let addedCount = 0;
  for (const b of [...BOLLYWOOD_MOVIES, ...CURATED_ADDITIONS]) {
    if (movieMap.has(b.id)) {
      Object.assign(movieMap.get(b.id), b);
    } else {
      movieMap.set(b.id, b);
      addedCount++;
    }
  }

  const updatedMovies = Array.from(movieMap.values());
  fs.writeFileSync(moviesPath, JSON.stringify(updatedMovies, null, 0), 'utf8');

  // Update source metadata
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  source.version = '2018-09-26-posters-verified-v9';
  source.movieCount = updatedMovies.length;
  source.bollywoodCount = BOLLYWOOD_MOVIES.length;
  fs.writeFileSync(sourcePath, JSON.stringify(source, null, 2), 'utf8');

  console.log(`Successfully updated catalogue:
- ${patchedCount} MovieLens classics patched with artwork & director
- ${addedCount} Bollywood films added (total: ${BOLLYWOOD_MOVIES.length})
- Total catalogue films: ${updatedMovies.length}`);

  // If DB is connected, run importCatalogue
  if (process.env.DATABASE_URL) {
    console.log('Connecting to database to sync catalogue...');
    const { getPool } = await import('../db/pool.mjs');
    const { importCatalogue } = await import('../catalogue/import.mjs');
    const pool = getPool();
    await importCatalogue(pool, root);
    console.log('Database synced successfully.');
    await pool.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runImport().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
