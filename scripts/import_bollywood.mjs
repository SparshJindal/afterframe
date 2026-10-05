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
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Gangs_of_Wasseypur_Part_2_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/3d/Zindagi_Na_Milegi_Dobara.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Chak_De%21_India_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/88/Udaan_2010_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Rang_De_Basanti_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Kahaani_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Drishyam_2015_film_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f0/Mughal-e-Azam_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/52/Pyaasa_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/23/Anand_1971_film_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Gol_Maal_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/90/Deewaar_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Satya_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Black_Friday_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Haider_Poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/30/Maqbool_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/18/Omkara_film_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/85/The_Lunchbox_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c4/Piku_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/51/Laapataa_Ladies_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_the_Conclusion_Poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/30/A_Wednesday_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Rockstar_Poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Munnabhai_M.B.B.S._poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/0/00/Lage_Raho_Munna_Bhai_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Mother_India_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Devdas_%282002_Hindi_film%29.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Article_15_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Sardar_Udham_poster.jpg',
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Bajrangi_Bhaijaan_Poster.jpg',
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
  'ml-106918': {
    director: 'Ben Stiller',
    runtime: 114,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/The_Secret_Life_of_Walter_Mitty_poster.jpg'
  },
  'ml-7826': {
    director: 'Norman Z. McLeod',
    runtime: 110,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/91/Secret_Life_of_Walter_Mitty_%281947%29_poster.jpg'
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg'
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Jurassic_Park_poster.jpg'
  },
  'ml-110': {
    director: 'Mel Gibson',
    runtime: 178,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/55/Braveheart_imp.jpg'
  },
  'ml-589': {
    director: 'James Cameron',
    runtime: 137,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/85/Terminator2poster.jpg'
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_%282001%29.jpg'
  },
  'ml-5952': {
    director: 'Peter Jackson',
    runtime: 179,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/ad/Lord_of_the_Rings_-_The_Two_Towers.jpg'
  },
  'ml-7153': {
    director: 'Peter Jackson',
    runtime: 201,
    poster: 'https://upload.wikimedia.org/wikipedia/en/b/be/The_Lord_of_the_Rings_-_The_Return_of_the_King.jpg'
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
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a6/The_Grand_Budapest_Hotel_poster.JPG'
  },
  'ml-164909': {
    director: 'Damien Chazelle',
    runtime: 128,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png'
  },
  'ml-88140': {
    director: 'Nicolas Winding Refn',
    runtime: 100,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/13/Drive2011Poster.jpg'
  },
  'ml-122882': {
    director: 'George Miller',
    runtime: 120,
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg'
  },
  'ml-541': {
    director: 'Ridley Scott',
    runtime: 117,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_%281982_poster%29.png'
  },
  'ml-177765': {
    director: 'Denis Villeneuve',
    runtime: 164,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_logo.png'
  },
  'ml-2021': {
    director: 'David Lynch',
    runtime: 137,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune1984Poster.jpg'
  }
};

export const CURATED_ADDITIONS = [
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
  source.version = '2018-09-26-bollywood-v3';
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
