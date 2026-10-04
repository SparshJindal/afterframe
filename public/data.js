const ASPECTS = [
 {id:'story',name:'Story & structure',short:'Story',question:'Did the story earn its ending?',hint:'Think about setup, progression, internal logic and payoff. Judge an experimental film by its own intentions—not by a three-act template.',cue:'What does the film make you want to happen—or understand?'},
 {id:'characters',name:'Characters & human insight',short:'Characters',question:'Did the people feel convincing?',hint:'Look for believable motivations and meaningful relationships. A character need not be likeable, realistic or transformed to work.',cue:'Watch what people do when they aren’t saying what they mean.'},
 {id:'performance',name:'Performances',short:'Performance',question:'What did the performances bring to life?',hint:'Notice expression, delivery, chemistry, physicality and restraint. For animation, include voice acting and character animation.',cue:'Notice a glance, a pause, a gesture. Does it reveal something?'},
 {id:'visuals',name:'Visual storytelling',short:'Visuals',question:'What did the images say?',hint:'Consider framing, lighting, camera movement, locations and design. Beautiful is not the same as purposeful; expensive is not the same as effective.',cue:'What is placed inside the frame—and what is left outside?'},
 {id:'sound',name:'Sound & music',short:'Sound',question:'How did the film sound—and fall silent?',hint:'Listen for atmosphere, dialogue, sound effects and musical choices. A memorable soundtrack is only one part of the picture.',cue:'Would this moment feel different without its sound?'},
 {id:'editing',name:'Editing & pacing',short:'Editing',question:'Did the rhythm serve the film?',hint:'Think about cuts, transitions, scene length and breathing room. Slow is not automatically boring; fast is not automatically engaging.',cue:'When did your attention drift? Was it the film, or a distraction?'},
 {id:'ideas',name:'Ideas & expression',short:'Ideas',question:'Did the film make its point well?',hint:'Consider its themes, humour, observations or perspective. Judge expression, not whether you agree. A simple idea can be brilliantly expressed.',cue:'What is the film exploring beneath the plot?'},
 {id:'impact',name:'Personal impact',short:'Impact',question:'What stayed with you?',hint:'Laughter, fear, discomfort, curiosity or reflection all count. Think about the experience you actually had—not the one you were expected to have.',cue:'Which moment would you tell someone about tomorrow?'}
];
const ANCHORS = [
 {name:'Undermines',description:'Actively hurts the film.'},
 {name:'Weak',description:'Some effective moments; substantial problems.'},
 {name:'Works',description:'Serves the film. Mixed or unremarkable.'},
 {name:'Strong',description:'Consistently effective, with clear strengths.'},
 {name:'Exceptional',description:'A defining strength you can point to.'}
];
const MOVIES = [
 {id:'interstellar',title:'Interstellar',year:2014,director:'Christopher Nolan',genres:['Science fiction','Drama'],runtime:169,poster:'assets/interstellar.jpg',wallpaper:'assets/hero.jpg',tagline:'Love. Time. Everything in between.',heroKicker:'The art of paying attention',heroHeading:'Go beyond<br>the stars.',heroSubtitle:'Eight questions. One film.<br>A better way to know what moved you.',cue:'Notice the quiet.'},
 {id:'parasite',title:'Parasite',year:2019,director:'Bong Joon-ho',genres:['Thriller','Drama'],runtime:132,poster:'assets/parasite.jpg',wallpaper:'assets/parasite-hero.jpg',tagline:'Every frame has another floor.',heroKicker:'Architecture & hidden depths',heroHeading:'Look below<br>the surface.',heroSubtitle:'Eight questions. One film.<br>Score the craft behind the masterwork.',cue:'Watch the stairs.'},
 {id:'whiplash',title:'Whiplash',year:2014,director:'Damien Chazelle',genres:['Drama','Music'],runtime:107,poster:'assets/whiplash.jpg',wallpaper:'assets/whiplash-hero.jpg',tagline:'Listen to what ambition sounds like.',heroKicker:'Tempo, pulse & obsession',heroHeading:'Push past<br>the limit.',heroSubtitle:'Eight questions. One film.<br>Notice what ambition demands.',cue:'Feel the pulse.'},
 {id:'past-lives',title:'Past Lives',year:2023,director:'Celine Song',genres:['Drama','Romance'],runtime:106,poster:'assets/past-lives.jpg',wallpaper:'assets/past-lives-hero.jpg',tagline:'A lifetime inside a silence.',heroKicker:'Memory, distance & in-yeon',heroHeading:'Measure the<br>moments between.',heroSubtitle:'Eight questions. One film.<br>Eight aspects to explore quiet connection.',cue:'Stay in the silence.'}
];
if(typeof window !== 'undefined') Object.assign(window,{ASPECTS,ANCHORS,MOVIES});
