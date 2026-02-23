/**
 * typing.js — TalionType
 * ════════════════════════════════════════════════════════════════
 * A TalionLabs product · https://talionlabs.github.io
 *
 * SECTIONS:
 *  1.  Config & Constants
 *  2.  Firebase Setup Instructions
 *  3.  Word Banks & Text Content
 *  4.  Global State
 *  5.  DOM Cache
 *  6.  WPM-Based Level System (3 WPM = 1 level, max level 100 at 300+ WPM)
 *  7.  Text Generation (Words / Sentences / Code / Punctuation / Numbers / Custom)
 *  8.  Arena Rendering (dual-layer overlay)
 *  9.  Cursor Positioning (live + ghost)
 *  10. Ghost Race Engine (record → replay → animate)
 *  11. Adaptive Difficulty
 *  12. Timer Engine
 *  13. Metric Calculations
 *  14. Anti-Cheat Module
 *  15. Input Handler
 *  16. Live HUD
 *  17. Finish Test & Results
 *  18. Init / Reset
 *  19. Pause / Resume
 *  20. WPM Canvas Chart
 *  21. Error Breakdown
 *  22. Key Heatmap
 *  23. Confetti
 *  24. Local Leaderboard
 *  25. Firebase Leaderboard (Global / Weekly / Monthly + Tie-breakers)
 *  26. Leaderboard Rendering & Filters
 *  27. Auth (Google + Email)
 *  28. Personal Stats & History
 *  29. 35-Achievement System (Common / Rare / Epic)
 *  30. Daily Challenge
 *  31. Social Sharing
 *  32. Sound Engine
 *  33. Pro / Gumroad
 *  34. Settings
 *  35. Theme
 *  36. Event Bindings & Boot
 * ════════════════════════════════════════════════════════════════
 */
;(function () {
'use strict';

/* ═══════════════════════════════════════════════════════════
   §1  CONFIG & CONSTANTS
═══════════════════════════════════════════════════════════ */
const VER         = '3.0.0';
const HOME_URL    = 'https://talionlabs.github.io';
const GUMROAD_URL = 'https://gumroad.com/l/taliontype-pro'; // update this
const MAX_LEVEL   = 100;
const WPM_PER_LVL = 3;   // Whole number — 300 WPM = Level 100 (350 WPM cap enforced by anti-cheat)
const LB_MAX      = 50;   // top-50 per leaderboard

// Adaptive difficulty breakpoints (avg WPM of last 5 tests)
const ADAPT_THRESHOLDS = { easy: 35, medium: 70 }; // <35=easy, <70=medium, else=hard

/* ═══════════════════════════════════════════════════════════
   §3  WORD BANKS & TEXT CONTENT
═══════════════════════════════════════════════════════════ */
const WORDS = {
  easy: [
    'the','be','to','of','and','a','in','that','have','it','for','not','on',
    'with','he','as','you','do','at','this','but','his','by','from','they','we',
    'say','her','she','or','an','will','my','one','all','would','there','their',
    'what','so','up','out','if','about','who','get','which','go','me','when',
    'make','can','like','time','no','just','him','know','take','people','into',
    'year','your','good','some','could','them','see','than','then','now','look',
    'only','come','its','over','think','also','back','after','two','how','our',
    'work','well','way','even','new','want','any','give','day','most','us','too',
    'big','man','old','ask','part','run','try','much','let','put','end','why',
    'long','home','hand','place','case','week','fact','group','point','play',
    'call','off','need','same','tell','boy','help','live','hold','word','town',
    'find','next','keep','three','turn','four','five','six','seven','eight','nine',
    'ten','last','left','right','side','high','move','feel','state','set','put',
    'done','said','here','ago','far','own','few','life','open','seem','form',
    'door','cut','show','watch','stop','air','land','sea','fire','tree','name',
    'read','book','page','walk','road','car','bus','hot','cold','win','lost',
    'idea','game','line','step','face','small','food','room','real','sun','moon',
    'night','day','yes','no','ok','go','see','hear','feel','love','hate','fear',
    'kind','nice','bad','best','free','true','fast','slow','hard','soft','dark',
    'light','low','down','up','left','right','front','back','plan','yet','both',
    'once','area','half','hold','white','black','blue','red','green','top','base',
    'body','arm','leg','eye','ear','mouth','nose','hair','hand','foot','head',
    'dog','cat','bird','fish','cow','pig','hat','cup','box','bag','key','pen',
    'bed','sit','stand','jump','run','cry','eat','drink','sleep','wake','talk',
    'open','close','push','pull','give','take','bring','send','buy','sell','pay',
    'cost','save','lose','keep','fall','grow','cut','break','fix','build','use',
    'add','hold','change','help','know','think','want','need','get','make','put',
    'sit','come','go','see','hear','say','tell','ask','give','take','move','live',
    'love','like','hope','wish','wait','try','play','work','rest','stay','come',
    'age','air','art','bed','boy','car','cup','day','ear','end','eye','far',
    'fog','fun','gap','gas','god','gun','hat','ice','job','joy','key','kid','law',
    'leg','lot','map','mix','net','nor','oak','oil','own','pay','pit','pop','pot',
    'raw','ray','red','row','rub','run','sea','set','she','shy','sky','sow','spa',
    'spy','sum','tap','tax','tea','ten','tie','tip','toe','top','toy','tub','two',
    'war','win','wit','woe','zoo','ache','acre','acid','aide','aims','aide','ally',
    'arch','arms','atom','axle','baby','back','bail','bake','bald','ball','band',
    'bang','bank','bare','barn','base','bath','beam','bean','bear','beat','beef',
    'bell','belt','bend','bite','blow','blue','blur','bolt','bond','bone','boom',
    'boot','bore','born','boss','both','bowl','brow','bulk','bull','burn','busy',
    'cage','calm','camp','card','care','cash','cast','cave','cell','chin','chip',
    'chop','clay','clip','club','coal','coat','code','coil','coin','core','cork',
    'corn','cost','couch','coup','cozy','crab','crew','crop','curl','cute','deck',
    'deed','deem','deer','dent','desk','dice','dime','dish','disk','dock','doll',
    'dome','doom','door','dose','dram','draw','drew','drip','drop','drum','dual',
    'duel','dusk','dust','earl','earn','ease','echo','edit','else','envy','epic',
    'exam','fake','fame','farm','fate','felt','file','fill','film','firm','fish',
    'fist','flag','flat','flew','flit','flow','foam','folk','fond','fool','form',
    'fort','foul','fowl','fume','fund','fury','fuse','gale','gang','gate','gave',
    'gaze','gear','germ','gift','gist','glad','glow','glue','goal','gold','gone',
    'gore','gown','grab','grip','gust','hack','half','hall','halt','harm','haze',
    'heal','heap','heat','heel','heir','helm','help','herb','herd','hero','hint',
    'hire','holy','hook','hope','horn','host','hour','hull','hung','hunt','hurt',
    'hymn','icon','idle','iris','isle','item','jade','jail','jest','join','joke',
    'jolt','jump','jury','just','keen','kill','king','knee','knit','knob','lack',
    'laid','lame','lamp','land','lane','lead','leaf','lean','leap','lend','lens',
    'liar','lift','lime','link','list','load','loan','lock','loft','logo','lone',
    'lore','lump','lung','lure','lurk','lust','mail','main','male','mall','mane',
    'mare','mark','mars','mass','mast','melt','mesh','mild','mill','mint','miss',
    'mist','moat','mock','mole','moor','more','moth','muck','muse','myth','nail',
    'near','neat','neck','need','norm','note','nous','oath','obey','odds','omen',
    'once','oval','oven','pace','pack','pair','pale','palm','park','pass','past',
    'path','pave','pawn','peak','peel','peer','pick','pile','pine','pipe','pity',
    'plan','plot','ploy','plug','plum','plus','poem','poet','pole','poll','pond',
    'pore','pose','pour','prey','prim','prod','prop','prow','pull','pump','pure',
    'push','quit','race','rack','rage','raid','rail','rake','ramp','rank','rant',
    'rate','real','reap','reel','rely','rent','rest','rice','rich','ride','rift',
    'rime','riot','rise','risk','rite','robe','rock','role','roll','roof','root',
    'rope','rose','rout','rude','ruin','rule','rush','rust','safe','saga','sail',
    'sake','salt','same','sang','sank','sash','seal','seam','seek','self','sent',
    'shed','shin','shot','show','silk','sill','sink','slab','slag','slam','slap',
    'slim','slip','slot','slug','smug','snap','snow','soap','sock','soda','soil',
    'sold','sole','song','soot','sore','sort','soup','sour','span','spin','spit',
    'spot','spur','stab','stag','star','stem','step','stew','stir','stub','stun',
    'such','suit','sung','sunk','swap','swat','sway','swum','tail','tale','tall',
    'tame','taps','task','team','tear','teen','term','test','text','than','them',
    'thin','thorn','tide','till','told','toll','tomb','tone','took','torn','toss',
    'tour','town','trek','trim','trio','trip','troy','true','tuck','tuft','twig',
    'twin','type','urge','vale','vane','vary','vast','vein','vest','view','vine',
    'vise','void','volt','vote','wage','wake','wane','warp','wart','wasp','wave',
    'weak','weal','weld','went','were','west','whim','whip','wilt','wind','wine',
    'wing','wire','wise','wish','with','wits','wolf','womb','wood','wool','word',
    'wore','worm','wove','wrap','wren','writ','yell','yore','your','zinc','zone',
  ],
  medium: [
    'ability','absence','account','achieve','acquire','address','advance',
    'airline','ancient','another','anxiety','approve','archive','arrange',
    'article','attempt','average','balance','battery','between','billion',
    'brought','cabinet','capital','captain','careful','central','certain',
    'chapter','charity','climate','college','combine','command','comment',
    'complex','concern','conduct','confirm','connect','context','control',
    'correct','council','country','culture','current','decided','declare',
    'defined','deliver','develop','digital','display','diverse','driving',
    'dynamic','economy','element','embrace','emotion','endless','enhance',
    'explore','factory','feeling','finance','forward','freedom','further',
    'genuine','history','however','imagine','include','involve','justice',
    'kitchen','language','leading','library','limited','message','mistake',
    'morning','natural','nothing','obvious','opinion','outside','patient',
    'payment','perfect','picture','problem','process','product','protect',
    'purpose','quickly','realize','receive','related','replace','respect',
    'results','science','service','several','similar','society','student',
    'subject','suggest','support','teacher','thought','through','tonight',
    'trouble','usually','various','version','village','website','whether',
    'already','because','between','business','change','coming','company',
    'absence','abstract','academy','accident','accurate','achieve','acquire',
    'action','active','actual','adapt','address','adjust','admire','advance',
    'affect','afford','agency','agenda','agree','allocate','allow','alter',
    'analysis','announce','answer','appeal','apply','arrange','arrive','aspect',
    'assign','assist','assume','attempt','attract','balance','barrier','battle',
    'behave','belief','benefit','beyond','boundary','branch','bridge','budget',
    'capable','capture','career','catalog','category','challenge','channel',
    'choice','citizen','clarity','classic','collect','column','compete','compile',
    'component','concept','condition','conflict','consider','consume','contain',
    'contribute','convert','create','criteria','cycle','danger','debate','decade',
    'decide','decline','decrease','default','define','degree','demand','design',
    'despite','detect','device','differ','direct','discover','discuss','distance',
    'distinct','divide','domain','double','draft','effort','either','energy',
    'engage','entire','equal','establish','evaluate','evidence','example',
    'expand','expect','experience','explain','express','extend','extreme',
    'factor','failure','feature','focus','follow','format','foundation','future',
    'general','generate','global','growth','handle','happen','highest','hundred',
    'impact','improve','include','increase','indicate','industry','inform',
    'initial','inspire','install','instead','interest','invest','isolate',
    'iterate','journey','justify','knowledge','launch','layout','leader','lesson',
    'listen','logical','maintain','manage','matter','measure','method','mission',
    'modify','monitor','narrow','network','normal','notice','number','object',
    'observe','obtain','office','operate','option','organize','outcome','output',
    'overcome','overview','parent','partner','pattern','people','perform','period',
    'permit','place','planning','platform','policy','popular','position','power',
    'predict','prefer','prepare','present','prevent','primary','principle','prior',
    'profit','project','promote','provide','publish','quality','question','range',
    'rating','reason','reduce','reflect','regard','region','remain','remove',
    'repeat','require','research','resolve','resource','respond','restore','result',
    'return','review','reward','sample','secure','select','series','setting',
    'single','social','solve','source','specific','status','strategy','stream',
    'strong','structure','success','summary','system','target','technical','theory',
    'transfer','travel','trigger','typical','update','useful','utilize','value',
    'verify','visible','volume','warning','welcome','within','without','wonder',
    'ability','accessible','according','acknowledge','active','adapt','address',
    'advance','affect','agency','agree','allocate','analysis','appeal','aspect',
    'assign','attract','battle','benefit','beyond','branch','capable','capture',
    'catalog','challenge','choice','classic','column','compile','component',
    'concept','condition','conflict','consume','contain','convert','criteria',
    'danger','decade','decline','default','degree','demand','design','despite',
    'detect','device','differ','discover','distinct','domain','effort','energy',
    'engage','entire','equal','establish','evidence','expand','expect','factor',
    'feature','format','generate','global','growth','handle','highest','impact',
    'improve','indicate','industry','initial','inspire','install','interest',
    'invest','isolate','journey','justify','knowledge','launch','lesson','listen',
    'logical','maintain','manage','matter','measure','method','mission','modify',
    'monitor','narrow','network','normal','notice','observe','obtain','operate',
    'option','organize','outcome','overview','partner','pattern','perform','period',
    'permit','planning','platform','policy','popular','position','predict','prefer',
    'prepare','prevent','primary','principle','profit','promote','publish','quality',
    'range','rating','reason','reduce','reflect','region','remain','remove','repeat',
    'require','resolve','resource','respond','restore','review','reward','secure',
    'select','setting','single','social','solve','source','specific','status',
    'strategy','stream','strong','structure','summary','system','target','theory',
    'transfer','trigger','typical','update','utilize','value','verify','visible',
    'volume','warning','welcome','wonder','absorb','accent','accept','access',
    'accrue','ache','acorn','across','active','adhere','admit','adopt','adult',
    'ahead','alarm','alert','align','alike','allot','along','amend','ample',
    'angle','annex','apart','apply','arise','aside','asset','attic','audio',
    'audit','avid','award','avoid','basic','basis','batch','begin','blend',
    'block','bloom','bonus','boost','bound','brain','brand','brave','brick',
    'brief','bring','broad','brush','cabin','cache','check','child','civic',
    'civil','claim','class','clerk','click','close','coach','color','comic',
    'craft','crash','cross','crowd','daily','dance','datum','depth','diary',
    'dirty','draft','drain','dream','dress','drive','eagle','early','earth',
    'elect','elite','email','embed','empty','enter','entry','exact','exist',
    'extra','faith','false','fancy','field','final','first','fixed','flame',
    'floor','flora','fluid','flush','focal','force','forge','found','frame',
    'frank','front','front','gauge','given','grade','greet','group','guard',
    'guide','guild','habit','happy','haven','heavy','honor','house','human',
    'humid','ideal','image','imply','inner','input','inter','intro','issue',
    'joint','judge','junior','label','large','later','layer','learn','legal',
    'level','light','limit','liner','local','loose','lower','lucky','lunar',
    'magic','major','maker','match','media','micro','miles','minor','model',
    'moral','mount','movie','music','never','night','noble','north','novel',
    'nurse','offer','often','onset','order','other','outer','owner','pages',
    'panel','paper','peace','phase','phone','pilot','place','plain','plant',
    'plate','plaza','plead','plenty','point','polar','probe','proof','prose',
    'prove','proxy','pulse','radar','raise','rapid','ratio','reach','ready',
    'realm','relay','reply','reset','right','robot','rocky','rough','round',
    'royal','rural','scale','scene','scope','score','scout','sense','serve',
    'share','sharp','shift','short','sight','skill','smart','smile','solid',
    'speed','spend','stage','stand','state','steel','steep','stick','still',
    'stock','store','storm','story','study','style','sugar','suite','super',
    'sweet','sword','table','taste','teach','terms','thick','title','token',
    'topic','touch','tough','track','trade','train','trait','treat','trend',
    'trial','ultra','under','union','unity','urban','usage','users','valid',
    'venue','verse','video','viral','vista','vital','voice','voter','waste',
    'water','whole','wider','winter','world','worth','young','youth','angle',
  ],
  hard: [
    'aberration','abominable','accelerate','accommodate','acknowledge',
    'acquisition','ambiguous','anachronism','anticipate','apocalyptic',
    'apparatus','architecture','arithmetic','assassination','astonishment',
    'atmosphere','authoritative','bureaucracy','catastrophe','circumstances',
    'clarification','collaboration','complicated','comprehensive','concentration',
    'configuration','consciousness','contradiction','controversial','coordination',
    'cryptocurrency','deterioration','determination','disambiguation',
    'diversification','electromagnetic','establishment','exacerbation',
    'extrapolate','fluorescent','hallucination','heterogeneous','hierarchical',
    'hypothetical','identification','implementation','incompatible',
    'infrastructure','instantiation','juxtaposition','lexicographical',
    'manifestation','metamorphosis','miscommunication','multidimensional',
    'obfuscation','orchestration','overwhelming','perpendicular',
    'philanthropist','physiological','predetermined','prioritization',
    'quintessential','rationalization','reconnaissance','reverberation',
    'revolutionary','sophisticated','straightforward','subconscious',
    'transcontinental','unintelligible','unprecedented','vulnerabilities',
    'entrepreneurship','acknowledgement','categorization','contemporaneous',
    'disproportionate','extraordinarily','incomprehensible','indispensable',
    'abnormality','abstraction','accumulation','acquaintance','administration',
    'advantageous','affiliation','aggravation','ameliorate','amplification',
    'approximation','articulation','assassination','authentication',
    'automation','biological','capitalization','certification','characterized',
    'chronological','classification','communication','compensation','compilation',
    'composition','computational','concentration','contradiction','conventional',
    'crystallization','customization','decomposition','deliberation','demonstration',
    'denomination','deportation','depreciation','deterioration','differentiation',
    'dimensionality','disorientation','dissatisfaction','documentation',
    'dramatization','dysfunction','ecological','elaboration','elimination',
    'emancipation','encouragement','enlightenment','enumeration','environment',
    'equalization','estimation','evaluation','examination','expropriation',
    'extraordinary','falsification','familiarization','fascination','formalization',
    'fragmentation','fundamentalism','globalization','gravitational',
    'hallucination','harmonization','immunological','implementation','implication',
    'incarceration','inconsistency','independence','indeterminate','industrialization',
    'inflammation','initialization','instantiation','interpretation','intimidation',
    'investigation','liberalization','linearization','manipulation','marginalization',
    'maximization','memorization','miscalculation','modernization','multiplication',
    'normalization','objectification','optimization','orchestration','organizational',
    'parliamentary','participation','pathological','perfectionistic','personalization',
    'phenomenological','philosophical','pluralization','popularization',
    'precipitation','preoccupation','probabilistic','professionalism',
    'proportionality','psychological','qualification','quantification',
    'rationalization','reconfiguration','reconstruction','redistribution',
    'refactoring','regularization','rehabilitation','reincarnation','reiteration',
    'representation','reproduction','responsibility','restructuring',
    'reverberation','semiconductor','sensationalism','simplification',
    'socialization','spiritualization','standardization','stereotyping',
    'stratification','synchronization','systematization','technological',
    'telecommunication','transformation','transparency','triangulation',
    'unambiguous','underestimated','unimaginable','universalization',
    'vulnerability','abnormalities','acceleration','accessibility',
    'accountability','actualization','administration','algorithmic',
    'anachronistic','anthropological','approximation','asymptotic',
    'authentication','bureaucratic','capitalization','characterization',
    'chronological','circumstances','codification','collaboration',
    'commercialization','commodification','communication','complementary',
    'concentration','contradiction','controversial','crystallization',
    'decentralization','decomposition','democratization','demonstration',
    'differentiation','disorientation','documentation','dramatization',
    'elaboration','enlightenment','enumeration','equalization',
    'exaggeration','examination','expropriation','extraordinary',
    'familiarization','formalization','fragmentation','fundamentalism',
    'globalization','gravitational','harmonization','identification',
    'immunological','implementation','incompatibility','inconsistency',
    'industrialization','inflammation','initialization','interpretation',
    'liberalization','manipulation','marginalization','maximization',
    'memorization','miscalculation','modernization','multiplication',
    'normalization','objectification','optimization','organizational',
    'parliamentary','participation','pathological','personalization',
    'phenomenological','philosophical','pluralization','precipitation',
    'probabilistic','professionalism','proportionality','psychological',
    'qualification','quantification','reconfiguration','reconstruction',
    'redistribution','regularization','rehabilitation','representation',
    'responsibility','restructuring','semiconductor','simplification',
    'socialization','standardization','stratification','synchronization',
    'telecommunication','transformation','triangulation','universalization',
    'unambiguous','underestimated','vulnerability','accessibility',
    'accountability','actualization','algorithmic','anthropological',
    'asymptotic','bureaucratic','characterization','commercialization',
    'commodification','complementary','decentralization','democratization',
    'differentiation','documentation','enlightenment','exaggeration',
    'familiarization','fundamentalism','harmonization','incompatibility',
    'industrialization','initialization','liberalization','marginalization',
    'memorization','miscalculation','normalization','objectification',
    'parliamentary','pathological','personalization','phenomenological',
    'pluralization','probabilistic','professionalism','proportionality',
    'qualification','quantification','reconfiguration','reconstruction',
    'redistribution','regularization','rehabilitation','representation',
    'responsibility','restructuring','semiconductor','simplification',
    'stratification','synchronization','telecommunication','transformation',
    'triangulation','universalization','vulnerability',
  ],
};

const SENTENCES = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'A journey of a thousand miles begins with a single step.',
    'All that glitters is not gold in this world.',
    'The early bird catches the worm every morning.',
    'Actions speak louder than words ever could.',
    'Every cloud has a silver lining somewhere.',
    'Practice makes perfect if you keep at it daily.',
    'Two heads are better than one on hard problems.',
    'Where there is a will, there is always a way forward.',
    'You miss one hundred percent of the shots you never take.',
    'A penny saved is a penny earned over time.',
    'Better late than never, they always say.',
    'Birds of a feather flock together in the park.',
    'Do not bite off more than you can chew today.',
    'Every dog has its day, just wait and see.',
    'Good things come to those who wait patiently.',
    'He who laughs last laughs the loudest of all.',
    'If it ain\'t broke, do not try to fix it now.',
    'It takes two to tango on the dance floor.',
    'Laughter is the best medicine for any ailment.',
    'Look before you leap into any new situation.',
    'Many hands make light work for everyone involved.',
    'Never put off till tomorrow what you can do today.',
    'No news is good news in most cases here.',
    'Old habits die hard for most people out there.',
    'Once bitten, twice shy is a common saying.',
    'Out of sight, out of mind is often true.',
    'Slow and steady wins the race every time.',
    'The pen is mightier than the sword has always been said.',
    'There is no place like home when you are tired.',
    'Time flies when you are having fun with friends.',
    'Too many cooks spoil the broth in the kitchen.',
    'Waste not, want not is wise advice for everyone.',
    'When in Rome, do as the Romans have always done.',
    'You can lead a horse to water but not make it drink.',
    'A cat has nine lives, or so the story goes.',
    'A friend in need is a friend indeed always.',
    'All is fair in love and war they say.',
    'An apple a day keeps the doctor away from home.',
    'Ask me no questions and I will tell you no lies.',
    'Be careful what you wish for because it might come true.',
    'Cleanliness is next to godliness in every home.',
    'Curiosity killed the cat but satisfaction brought it back.',
    'Do unto others as you would have them do unto you.',
    'Every little bit helps when you are trying hard.',
    'Fortune favors the bold in every endeavor we take.',
    'Give a man a fish and you feed him for a day.',
    'Honesty is the best policy in all situations today.',
    'If you cannot beat them then join them instead.',
    'It is always darkest before the dawn arrives soon.',
    'Keep your friends close and your enemies even closer.',
    'Knowledge is power and learning never stops for anyone.',
    'Let sleeping dogs lie and avoid all unnecessary trouble.',
    'Life is short so make the most of every day.',
    'Make hay while the sun shines bright and warm today.',
  ],
  medium: [
    'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    'In the middle of every difficulty lies opportunity waiting to be discovered.',
    'It does not matter how slowly you go as long as you do not stop moving forward.',
    'The future belongs to those who believe in the beauty of their dreams every day.',
    'Success is not final, failure is not fatal; it is the courage to continue that counts.',
    'Life is what happens when you are busy making other plans for the distant future.',
    'The only way to do great work is to love what you do with genuine passion and care.',
    'Strive not to be a success, but rather to be of value to those around you daily.',
    'An unexamined life is not worth living, according to the ancient philosophers of Greece.',
    'Happiness is not something ready made; it comes from your own actions and choices.',
    'The secret of getting ahead is getting started with whatever small step you can take.',
    'Believe you can and you are halfway there to achieving your goals and dreams.',
    'Do not wait to strike till the iron is hot, but make it hot by striking constantly.',
    'Every accomplishment starts with the decision to try something new and challenging.',
    'Failure is simply the opportunity to begin again more intelligently than before.',
    'Great minds discuss ideas; average minds discuss events; small minds discuss people.',
    'Hard work beats talent when talent does not work hard enough to succeed.',
    'I have not failed but simply found ten thousand ways that did not work as expected.',
    'If you tell the truth, you do not have to remember anything about what you said.',
    'It always seems impossible until it is done and you look back at what you achieved.',
    'Knowledge speaks but wisdom listens to the world around it carefully and thoughtfully.',
    'Leadership is not about being in charge but about taking care of those in your charge.',
    'Life is ten percent what happens to you and ninety percent how you react to it.',
    'Logic will get you from point A to point B but imagination will take you everywhere.',
    'No act of kindness, no matter how small, is ever truly wasted in this world.',
    'Once you stop learning, you start dying, so keep your curiosity alive always.',
    'People who are crazy enough to think they can change the world are the ones who do.',
    'Quality is not an act but a habit you build over years of consistent effort and practice.',
    'Real generosity toward the future lies in giving all to what is present right now.',
    'Someone is sitting in the shade today because someone planted a tree long ago.',
    'The best time to plant a tree was twenty years ago and the second best time is now.',
    'The difference between ordinary and extraordinary is that little bit of extra effort.',
    'The journey of a thousand miles must begin with a single small but important step.',
    'There is only one way to avoid criticism: do nothing, say nothing, and be nothing.',
    'Things may come to those who wait, but only the things left by those who hustle.',
    'To improve is to change; to be perfect is to change often and learn from mistakes.',
    'We become what we think about most of the time, so choose your thoughts carefully.',
    'What you get by achieving your goals is not as important as what you become by reaching them.',
    'Whatever the mind of man can conceive and believe, it can achieve with hard work.',
    'Whether you think you can or you think you cannot, you are right in both cases.',
    'Without continual growth and progress, such words as improvement and achievement have no meaning.',
    'Yesterday is history, tomorrow is a mystery, and today is a gift we call the present.',
    'You are never too old to set another goal or to dream a brand new dream for yourself.',
    'Your time is limited so do not waste it living someone else\'s life and vision.',
    'Be the change you wish to see in the world and inspire others around you daily.',
    'Develop success from failures because discouragement and failure are two stepping stones.',
    'Education is the most powerful weapon you can use to change the world we live in.',
    'Every strike brings me closer to the next home run when I step up to the plate.',
    'Genius is one percent inspiration and ninety-nine percent perspiration every day.',
    'I cannot give you a formula for success but I can give you a formula for failure.',
    'If opportunity does not knock then build a door and open it yourself with confidence.',
    'Innovation distinguishes between a leader and a follower in any competitive field.',
    'In three words I can sum up everything I have learned about life: it goes on still.',
    'It is better to remain silent and be thought a fool than to speak out and remove all doubt.',
    'Life is not measured by the number of breaths we take but by the moments that take our breath.',
  ],
  hard: [
    'Technological advancement in artificial intelligence has precipitated unprecedented transformations across virtually every sector of contemporary civilization.',
    'Epistemological frameworks that undergird scientific methodology necessitate rigorous falsifiability criteria and systematic empirical verification procedures.',
    'Quantum entanglement demonstrates nonlocal correlations between particles that seemingly violate classical intuitions about separability and causal independence.',
    'Psycholinguistic research consistently demonstrates that bilingual individuals exhibit superior cognitive flexibility and executive function capabilities.',
    'Constitutional jurisprudence necessitates balancing competing fundamental rights through proportionality analysis and contextual interpretation of legislative intent.',
    'Neuroplasticity research has fundamentally transformed our understanding of the human brain\'s remarkable capacity for structural and functional reorganization.',
    'The philosophical implications of quantum mechanics challenge deterministic worldviews, suggesting that reality at its most fundamental level is probabilistic.',
    'Macroeconomic stabilization policies must carefully balance competing objectives including price stability, full employment, and sustainable growth.',
    'Anthropogenic climate change necessitates unprecedented coordinated international responses encompassing systemic transformations in energy infrastructure and consumption.',
    'Cryptographic protocols implementing asymmetric key algorithms provide computational security guarantees predicated on mathematical intractability assumptions.',
    'Postmodern philosophical discourse deconstructs totalizing metanarratives, emphasizing contingency, heterogeneity, and the socially constructed nature of knowledge.',
    'Mitochondrial dysfunction precipitates cascading metabolic disturbances manifesting clinically as multisystemic disorders with significant phenotypic variability.',
    'Phenomenological investigation of consciousness reveals irreducible subjective experiential dimensions that resist straightforward physicalist or functionalist explanations.',
    'Pharmacokinetic modeling enables quantitative characterization of drug absorption, distribution, metabolism, and elimination processes in biological systems.',
    'Geopolitical realignment driven by multipolar competition increasingly characterizes international relations in this transformative post-hegemonic configuration.',
    'Autonomous reinforcement learning architectures demonstrate emergent behavioral capabilities exceeding explicit programmatic specifications through environmental interaction.',
    'Interdisciplinary collaboration between computational neuroscience and machine learning accelerates progress in understanding biological intelligence mechanisms.',
    'Thermodynamic irreversibility fundamentally constrains the efficiency of energy conversion processes in accordance with the second law of thermodynamics.',
    'Sociological analysis of stratification reveals persistent structural inequalities perpetuated through institutional mechanisms and cultural reproduction processes.',
    'Spectroscopic analysis of exoplanetary atmospheres enables remote characterization of chemical compositions potentially indicating biosignature molecules.',
    'Immunological tolerance mechanisms prevent autoimmune pathology while maintaining vigilance against pathogenic microorganisms through discriminatory recognition.',
    'Stochastic differential equations model continuous-time random processes exhibiting Brownian motion characteristics with applications across quantitative disciplines.',
    'Archaeological evidence demonstrates sophisticated technological capabilities and complex social organization in prehistoric civilizations predating historical records.',
    'Epistemological skepticism regarding foundational knowledge claims necessitates rigorous methodological examination of perceptual and inferential reliability.',
    'Differential equations governing fluid dynamics exhibit nonlinear behaviors producing turbulent phenomena resistant to analytical closed-form solutions.',
    'Metacognitive awareness enables individuals to monitor and regulate their own cognitive processes, enhancing learning effectiveness and problem-solving capabilities.',
    'Pharmaceutical biotechnology leverages recombinant DNA technology to produce therapeutic proteins with unprecedented specificity and reduced immunogenicity.',
    'Computational complexity theory establishes fundamental limitations on algorithmic problem-solving efficiency through asymptotic analysis of time-space requirements.',
    'Evolutionary developmental biology investigates conserved genetic regulatory mechanisms controlling morphogenesis across phylogenetically diverse organisms.',
    'Macrostructural societal transformations driven by technological disruption necessitate adaptive institutional responses and proactive workforce development initiatives.',
    'Transgenerational epigenetic inheritance demonstrates heritable phenotypic variation independent of nucleotide sequence changes in genomic DNA.',
    'Astrophysical observations corroborate cosmological inflation theory predicting rapid exponential expansion during the primordial universe\'s earliest moments.',
    'Behavioral economics integrates psychological insights into rational choice models, revealing systematic cognitive biases influencing economic decision-making.',
    'Biogeochemical cycling of carbon, nitrogen, and phosphorus through terrestrial and aquatic ecosystems regulates atmospheric composition and global climate.',
    'Contemporary political philosophy debates distributive justice through competing frameworks emphasizing liberty, equality, utility, or communitarian values.',
    'Distributed ledger technologies implementing Byzantine fault-tolerant consensus mechanisms enable trustless decentralized transaction verification without intermediaries.',
    'Electromagnetic radiation propagating through spacetime curvature exhibits gravitational redshift and lensing phenomena confirming general relativistic predictions.',
    'Ethnographic research methodologies emphasizing participant observation and reflexivity generate contextually rich qualitative insights into cultural phenomena.',
    'Functional magnetic resonance imaging reveals spatiotemporal neural activation patterns correlated with cognitive processes through hemodynamic response measurements.',
    'Genomic sequencing technologies enabling comprehensive characterization of individual genetic variation facilitate personalized therapeutic interventions.',
    'Historiographical revisionism challenges established narratives by incorporating marginalized perspectives and previously inaccessible archival documentation.',
    'Intergenerational socioeconomic mobility is constrained by compounding advantages and disadvantages transmitted through familial capital accumulation.',
    'Juridical constructivism posits that legal norms derive validity from procedural legitimacy rather than substantive conformity with transcendent moral principles.',
    'Kinetic isotope effects provide mechanistic information about chemical reaction pathways through differential reactivity of isotopically substituted molecules.',
    'Lexicographical analysis reveals systematic patterns in semantic shift documenting how word meanings transform across historical periods and cultural contexts.',
    'Macromolecular crystallography enables atomic-resolution structural determination of proteins facilitating structure-based pharmaceutical drug design methodologies.',
    'Neurochemical dysregulation in dopaminergic and serotonergic systems contributes to affective disorders and motivational pathologies requiring pharmacological intervention.',
    'Optimization algorithms traversing high-dimensional parameter spaces encounter local minima challenges requiring sophisticated heuristic or stochastic approaches.',
    'Paleoanthropological evidence suggests anatomically modern humans exhibited symbolic cognitive capacities considerably preceding the behavioural modernity transition.',
    'Quantum chromodynamics describes strong nuclear interactions through mathematical formalism based on SU(3) gauge symmetry and colour charge properties.',
    'Regulatory frameworks governing biotechnology must balance innovation incentives against biosafety considerations and equitable access to technological benefits.',
    'Synaptic plasticity mechanisms including long-term potentiation underlie learning and memory formation through activity-dependent modification of neural circuits.',
    'Transdisciplinary research paradigms integrate methodological and conceptual frameworks across disciplinary boundaries to address complex real-world phenomena.',
    'Utilitarian calculations in bioethics require sophisticated quantification of welfare impacts across diverse stakeholder populations with incommensurable interests.',
    'Variational methods in quantum mechanics provide powerful approximation techniques for calculating ground state energies of complex many-body systems.',
  ],
};

const CODE_SNIPPETS = [
  `function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`,
  `const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};`,
  `async function fetchWithRetry(url, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url);\n      if (!res.ok) throw new Error(res.status);\n      return await res.json();\n    } catch (err) {\n      if (i === retries - 1) throw err;\n      await new Promise(r => setTimeout(r, 2 ** i * 1000));\n    }\n  }\n}`,
  `class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, fn) {\n    (this.events[event] = this.events[event] || []).push(fn);\n    return this;\n  }\n  emit(event, ...args) {\n    (this.events[event] || []).forEach(fn => fn(...args));\n    return this;\n  }\n  off(event, fn) {\n    this.events[event] = (this.events[event] || []).filter(f => f !== fn);\n    return this;\n  }\n}`,
  `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left  = arr.filter(x => x < pivot);\n  const mid   = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), ...mid, ...quickSort(right)];\n}`,
  `const createStore = (reducer, initial) => {\n  let state = initial;\n  const listeners = [];\n  return {\n    getState: () => state,\n    dispatch: (action) => {\n      state = reducer(state, action);\n      listeners.forEach(l => l());\n    },\n    subscribe: (fn) => {\n      listeners.push(fn);\n      return () => listeners.filter(l => l !== fn);\n    }\n  };\n};`,
  `function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}`,
  `class LinkedList {\n  constructor() { this.head = null; this.size = 0; }\n  push(val) {\n    const node = { val, next: null };\n    if (!this.head) { this.head = node; }\n    else {\n      let cur = this.head;\n      while (cur.next) cur = cur.next;\n      cur.next = node;\n    }\n    this.size++;\n  }\n}`,
  `const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\nconst identity = x => x;\nconst constant = x => () => x;`,
  `async function* paginate(fetchFn, limit = 20) {\n  let offset = 0;\n  while (true) {\n    const results = await fetchFn(offset, limit);\n    if (!results.length) break;\n    yield results;\n    if (results.length < limit) break;\n    offset += limit;\n  }\n}`,
  `function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])\n  );\n}`,
  `class LRUCache {\n  constructor(cap) { this.cap = cap; this.map = new Map(); }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key); this.map.set(key, val); return val;\n  }\n  put(key, val) {\n    this.map.delete(key); this.map.set(key, val);\n    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);\n  }\n}`,
  `function throttle(fn, ms) {\n  let last = 0;\n  return function (...args) {\n    const now = Date.now();\n    if (now - last >= ms) { last = now; return fn.apply(this, args); }\n  };\n}`,
  `const range = (start, end, step = 1) =>\n  Array.from({ length: Math.ceil((end - start) / step) },\n    (_, i) => start + i * step);\nconst zip = (...arrs) =>\n  range(0, Math.min(...arrs.map(a => a.length))).map(i => arrs.map(a => a[i]));`,
  `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const merged = []; let i = 0, j = 0;\n  while (i < left.length && j < right.length)\n    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);\n  return [...merged, ...left.slice(i), ...right.slice(j)];\n}`,
  `class Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n}`,
  `function flattenDeep(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);\n}`,
  `function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return function(...args2) { return curried.apply(this, args.concat(args2)); };\n  };\n}`,
  `async function withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error('Timeout')), ms));\n  return Promise.race([promise, timeout]);\n}`,
  `function groupBy(arr, keyFn) {\n  return arr.reduce((groups, item) => {\n    const key = keyFn(item);\n    (groups[key] = groups[key] || []).push(item);\n    return groups;\n  }, {});\n}`,
  `function* fibonacci() {\n  let a = 0, b = 1;\n  while (true) { yield a; [a, b] = [b, a + b]; }\n}\nconst fib10 = Array.from({ length: 10 }, (_, i) =>\n  [...fibonacci()].find((_, j) => j === i));`,
  `function dijkstra(graph, start) {\n  const dist = {}; const visited = new Set();\n  for (const n in graph) dist[n] = Infinity;\n  dist[start] = 0;\n  const pq = [[0, start]];\n  while (pq.length) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [d, u] = pq.shift();\n    if (visited.has(u)) continue;\n    visited.add(u);\n    for (const [v, w] of (graph[u] || [])) {\n      if (d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }\n    }\n  }\n  return dist;\n}`,
  `const retry = (fn, times = 3, delay = 500) =>\n  new Promise((resolve, reject) => {\n    const attempt = (n) =>\n      fn().then(resolve).catch((err) => {\n        if (n <= 1) return reject(err);\n        setTimeout(() => attempt(n - 1), delay);\n      });\n    attempt(times);\n  });`,
  `function trie() {\n  const root = {};\n  return {\n    insert(word) {\n      let node = root;\n      for (const ch of word) node = node[ch] ??= {};\n      node['$'] = true;\n    },\n    search(word) {\n      let node = root;\n      for (const ch of word) { if (!node[ch]) return false; node = node[ch]; }\n      return !!node['$'];\n    },\n  };\n}`,
  `const queue = () => {\n  let head = null, tail = null, len = 0;\n  const enqueue = (val) => {\n    const node = { val, next: null };\n    if (tail) tail.next = node; else head = node;\n    tail = node; len++;\n  };\n  const dequeue = () => {\n    if (!head) return undefined;\n    const val = head.val; head = head.next;\n    if (!head) tail = null; len--; return val;\n  };\n  return { enqueue, dequeue, get size() { return len; } };\n};`,
  `async function parallel(tasks, concurrency = 5) {\n  const results = []; const pool = [];\n  for (let i = 0; i < tasks.length; i++) {\n    const p = tasks[i]().then(r => { results[i] = r; pool.splice(pool.indexOf(p), 1); });\n    pool.push(p);\n    if (pool.length >= concurrency) await Promise.race(pool);\n  }\n  await Promise.all(pool); return results;\n}`,
  `function parseQueryString(qs = location.search) {\n  return Object.fromEntries(\n    qs.replace(/^\\?/, '').split('&').filter(Boolean)\n      .map(pair => {\n        const [k, v] = pair.split('=').map(decodeURIComponent);\n        return [k, v ?? true];\n      })\n  );\n}`,
  `class EventBus {\n  constructor() { this._bus = {}; }\n  $on(event, callback) { (this._bus[event] || (this._bus[event] = [])).push(callback); }\n  $off(event, callback) { this._bus[event] = (this._bus[event] || []).filter(cb => cb !== callback); }\n  $emit(event, ...args) { (this._bus[event] || []).forEach(cb => cb(...args)); }\n}`,
  `function chunkArray(arr, size) {\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));\n  return chunks;\n}`,
  `const once = (fn) => {\n  let called = false, result;\n  return (...args) => {\n    if (!called) { called = true; result = fn(...args); }\n    return result;\n  };\n};`,
];
const PUNCT_LINES = [
  'Wait, really? No — stop.', 'Hello, world! It works.',
  'Oh? Okay... let\'s go.', 'Yes! Finally, it\'s done.',
  'Hmm, let\'s see: ready?', 'Come on; don\'t rush it.',
  'Great — but be careful!', 'Sure, why not? Let\'s try.',
  'Indeed, it\'s working now.', 'Fine — quickly, though.',
  'Look: it\'s quite simple.', 'Try again, okay? Focus.',
  'Ready, set, go! Now type.', 'Wow! That\'s very fast.',
  'Right; let\'s start again.', 'Listen — it matters here.',
];

const PUNCTUATION = [',', '.', '!', '?', ';', ':'];
const NUMBERS     = '0123456789'.split('');

/* ═══════════════════════════════════════════════════════════
   §4  GLOBAL STATE
═══════════════════════════════════════════════════════════ */
const S = {
  // Config
  mode: 'words', diff: 'medium', duration: 30,
  // Session
  text: '', charIdx: 0, typed: '',
  started: false, finished: false, paused: false, timerActive: false,
  timeLeft: 30, startTime: null, pauseStart: null,
  // Metrics
  correctChars: 0, totalTyped: 0,
  errMap: {}, keyErr: {}, keyPresses: {},
  wpmSamples: [],
  charTimes: [],   // ms elapsed when each char was typed (for ghost)
  curStreak: 0, bestStreak: 0,
  arenaScroll: 0, // px of vertical scroll offset in the words-wrap
  lineH: 0,
  // Level (WPM-based)
  bestWpm: 0,
  // Settings
  fontSize: 20, smoothCaret: true, soundEnabled: false,
  showLiveWpm: true, usePunct: false, useNums: false,
  customCount: 750, customText: '',
  noBlink: false, showProgress: true, errSnd: false, hiCon: false, reducedMotion: false,
  // Ghost
  ghostEnabled: false,
  ghostRecord: null,  // { charTimes[], wpm, acc, mode, diff, duration, date }
  ghostCustomWpm: null, // if set, use constant-speed ghost instead of charTimes replay
  ghostRafId: null,
  // Adaptive
  adaptiveOverride: null,
  // Firebase
  fbApp: null, fbDB: null, fbAuth: null,
  currentUser: null, fbReady: false,
  // Misc
  lastResult: null, activeTab: 'global',
  isDailyActive: false, dailyChallenge: null,
  achievements: {}, history: [],
  isPro: false,
};

/* ═══════════════════════════════════════════════════════════
   §5  DOM CACHE
═══════════════════════════════════════════════════════════ */
const D = {};
function cacheDOM() {
  const ids = [
    'wordsTarget','wordsTyped','liveCursor','ghostCursor','ghostInput',
    'arena','arenaHint','arenaFill','wordsWrap','pausedOv','btnResume',
    'ghostBar','ghostRecordWpm','ghostVsLabel',
    'hcTimer','hcGhost','ghostWpmVal',
    'timerVal','wpmVal','accVal','streakVal',
    'btnReset','btnPause','pauseIco','pauseLbl','btnSaveGhost',
    'resultsPanel','confettiCv','resWpmBig','resBadges','lvlUpBadge',
    'resWpm','resRaw','resAcc','resErrors','resCons','resStreak','resWpmNote',
    'ghostResult','grVerdict','grDetail',
    'wpmChart','errChips','heatmapWrap',
    'btnAgain','btnSaveScore','btnShareRes','btnSetGhost',
    // BUG-13: hdrLevel was missing
    'hdrLevel','lvlOrb','lvlNum','lvlDisp','lvlWpmLabel','lvlFill','lvlSub',
    'adaptToast','adaptMsg','adaptClose',
    'dailyBanner','dbDesc','dbReward','btnStartDaily','closeDB','dailyBadge',
    'settingsPanel','closeSet','fsSlider','fsVal',
    'wordCount','customTxt','optSmooth','optSound','optLiveWpm',
    'optPunct','optNums','optProgress','optBlink','optErrSnd','optHiCon','optReducedMotion','btnResetAll',
    'authBtn','authBtnTxt','authOv','closeAuth','btnGoogle',
    'btnEmailIn','btnEmailUp','authEmail','authPw','authName','authErr',
    'lbOv','closeLB','lbBody','lbPb','lbPbWpm','lbPbRank','lbNote',
    'lbModeFilter','lbDiffFilter','lbTimeFilter','btnLBFilter',
    'ghostOv','closeGhost','ghostBody',
    'statsOv','closeStats','statCards','histChart',
    'achOv','closeAch','achGrid','achStats','achBadge',
    'dailyOv','closeDaily','dailyBody',
    'proOv','closePro','btnBuyPro','proKeyInput','btnVerifyPro',
    'proVerifyNote','proFeaturesList','btnPro',
    'saveOv','closeSave','saveNameLocal','btnConfSaveLocal','saveSectionGlobal','saveGlobalInner','saveSumEl','saveNote',
    'shareOv','closeShare','shareCard','btnTwitter','btnCopy',
    // BUG-08: feedback modal was missing from cacheDOM
    'feedbackOv','closeFeedback','feedbackTxt','btnSendFeedback',
    'achToast','atIcon','atName',
    'toast','backdrop','themeToggle','adTop','adBot',
    'ghostToggleWrap','ghostToggle',
    'hamburgerBtn','mobileMenu',
    'mmDaily','mmGhost','mmAch','mmLB','mmStats','mmFriends','mmSettings',
    'mmAuthBtn','mmAuthBtnTxt','mmBtnPro','mmThemeToggle',
    'mmDailyBadge','mmAchBadge',
    // BUG-12: removed dead 'volSlider','volVal' entries (elements don't exist in HTML)
    'friendsOv','closeFriends','friendsBody',
    'tabSignIn','tabSignUp','btnForgotPw',
    'ftStats','ftLB','ftPro','ftAch','ftDaily',
    // BUG-03: desktop nav buttons were missing — caused all nav clicks to silently fail
    'btnLB','btnStats','btnAch','btnFriends','btnDaily','btnGhost','btnSet',
  ];
  ids.forEach(id => { D[id] = document.getElementById(id); });
  D.modePills = document.querySelectorAll('[data-mode]');
  D.diffPills = document.querySelectorAll('[data-diff]');
  D.timePills = document.querySelectorAll('[data-time]');
  D.lbTabs    = document.querySelectorAll('[data-lbt]');
  D.ftModes   = document.querySelectorAll('.ft-mode');
}

/* ═══════════════════════════════════════════════════════════
   §6  WPM-BASED LEVEL SYSTEM
═══════════════════════════════════════════════════════════
   Level = floor(bestWPM / WPM_PER_LVL), capped at MAX_LEVEL.
   Level ONLY advances if user beats their personal best WPM.
═══════════════════════════════════════════════════════════ */
function calcLevel(wpm) {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(wpm / WPM_PER_LVL)));
}

function currentLevel() { return calcLevel(S.bestWpm); }

function refreshLevelUI() {
  const lvl       = currentLevel();
  const curWpm    = S.bestWpm;
  const lo        = lvl       * WPM_PER_LVL;
  const hi        = (lvl + 1) * WPM_PER_LVL;
  const pct       = lvl >= MAX_LEVEL ? 100
                  : Math.min(100, ((curWpm - lo) / (hi - lo)) * 100);
  const toNext    = Math.max(0, hi - curWpm);

  if (D.lvlNum)  D.lvlNum.textContent  = lvl;
  if (D.lvlDisp) D.lvlDisp.textContent = lvl;
  if (D.lvlFill) D.lvlFill.style.width = pct + '%';
  if (D.lvlWpmLabel) D.lvlWpmLabel.textContent = `${curWpm} WPM best`;
  if (D.lvlSub)  D.lvlSub.textContent =
    lvl >= MAX_LEVEL ? 'MAX LEVEL 🏆' : `${toNext} WPM to level ${lvl + 1}`;
}

/* ═══════════════════════════════════════════════════════════
   §7  TEXT GENERATION
═══════════════════════════════════════════════════════════ */
function generateText() {
  const { mode, customCount, customText, usePunct, useNums, adaptiveOverride, diff, duration } = S;
  const eff = adaptiveOverride || diff;
  // BUG-04: Ensure we always generate enough text for the full duration.
  // Assume up to 120 WPM with a 30% safety buffer so the test never ends early.
  const minWords = Math.ceil((120 / 60) * duration * 1.3);

  if (mode === 'custom' && customText.trim()) return customText.trim();

  if (mode === 'punctuation') {
    // BUG-04/20: Repeat PUNCT_LINES until we have enough words
    let result = '';
    while (result.split(' ').length < minWords) {
      result += (result ? ' ' : '') + shuffle([...PUNCT_LINES]).join(' ');
    }
    return result.trim();
  }

  if (mode === 'numbers') {
    const pool = WORDS.medium;
    const out  = [];
    const n    = Math.max(customCount, minWords);
    for (let i = 0; i < n; i++) {
      if (Math.random() < 0.35) {
        const t = Math.floor(Math.random() * 4);
        if (t === 0) out.push(String(rndInt(1, 9999)));
        else if (t === 1) out.push(`${rndInt(1,99)} + ${rndInt(1,99)}`);
        else if (t === 2) out.push(`${rndInt(10,99)} - ${rndInt(1,9)}`);
        else              out.push(`${rndInt(2,12)} * ${rndInt(2,12)}`);
      } else {
        out.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
    return out.join(' ');
  }

  if (mode === 'sentences') {
    // BUG-20: Repeat/cycle sentences until we have enough words
    const pool = SENTENCES[eff] || SENTENCES.medium;
    let result = '';
    let shuffled = shuffle([...pool]);
    let si = 0;
    while (result.split(' ').length < minWords) {
      if (si >= shuffled.length) { shuffled = shuffle([...pool]); si = 0; }
      result += (result ? ' ' : '') + shuffled[si++];
    }
    return result.trim();
  }

  if (mode === 'code') {
    // BUG-21: Concatenate snippets (avoiding back-to-back repeats) until long enough
    let result = '';
    let lastIdx = -1;
    while (result.split(/\s+/).filter(Boolean).length < minWords) {
      let idx;
      do { idx = Math.floor(Math.random() * CODE_SNIPPETS.length); } while (idx === lastIdx && CODE_SNIPPETS.length > 1);
      lastIdx = idx;
      result += (result ? '\n' : '') + CODE_SNIPPETS[idx];
    }
    return result;
  }

  // Words mode
  const pool = eff === 'easy' ? WORDS.easy
             : eff === 'hard' ? WORDS.hard
             :                  WORDS.medium;

  const n = Math.max(customCount, minWords);
  const words = [];
  for (let i = 0; i < n; i++) {
    let w = pool[Math.floor(Math.random() * pool.length)];
    if (useNums  && Math.random() < 0.08) w = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    // BUG-22: use the full PUNCTUATION array (was incorrectly capped at 4)
    if (usePunct && i > 0 && Math.random() < 0.18) {
      words[words.length - 1] += PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
    }
    words.push(w);
  }
  return words.join(' ');
}

function rndInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// Bug 7: Show active modifier flags in config bar
function updateModeFlags() {
  const c = document.getElementById('cfgFlags');
  if (!c) return;
  c.innerHTML = '';
  if (S.usePunct) {
    const b = document.createElement('span');
    b.className = 'mode-flag'; b.textContent = '• Punct ON';
    c.appendChild(b);
  }
  if (S.useNums) {
    const b = document.createElement('span');
    b.className = 'mode-flag'; b.textContent = '123 ON';
    c.appendChild(b);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ═══════════════════════════════════════════════════════════
   §8  ARENA RENDERING (dual-layer overlay)
═══════════════════════════════════════════════════════════ */
function renderArena() {
  D.wordsTarget.innerHTML = '';
  D.wordsTyped.innerHTML  = '';
  D.wordsWrap.style.fontSize = S.fontSize + 'px';

  // BUG-FIX-1 (improved): Pre-populate BOTH layers with identical characters.
  // Previously wordsTyped only got spans for typed chars, causing different text-flow
  // wrapping from wordsTarget — typed chars appeared in the leftover space of the
  // previous line. Now both layers have identical char spans; untyped spans in
  // wordsTyped are hidden (class lt-h / opacity:0), so layout is always in sync.
  S.text.split('').forEach((ch, i) => {
    const tg = document.createElement('span');
    tg.dataset.ti   = i;
    tg.className    = 'tg tg-u';
    tg.textContent  = ch;
    D.wordsTarget.appendChild(tg);

    const ty = document.createElement('span');
    ty.dataset.li  = i;
    ty.className   = 'lt lt-h';   // hidden until typed
    ty.textContent = ch;
    D.wordsTyped.appendChild(ty);
  });
  requestAnimationFrame(() => {
    if (D.wordsWrap) {
      S.lineH = parseFloat(getComputedStyle(D.wordsWrap).lineHeight) || S.fontSize * 1.85;
    }
  });
}

function renderChar(idx, state) {
  const tg = D.wordsTarget.querySelector(`[data-ti="${idx}"]`);
  if (tg) tg.className = `tg tg-${state === 'u' ? 'u' : 'a'}`;

  const ty = D.wordsTyped.querySelector(`[data-li="${idx}"]`);
  if (!ty) return;

  if (state === 'u') {
    ty.className = 'lt lt-h'; // hide again on backspace
  } else {
    const ch = S.text[idx] || '';
    ty.textContent = ch; // keep in sync (shouldn't differ, but safety)
    ty.className   = `lt lt-${state}`;
  }
}

function reorderTyped() { /* no-op: wordsTyped is pre-populated in order */ }

function updateProgress() {
  const pct = S.text.length ? Math.min(100, (S.charIdx / S.text.length) * 100) : 0;
  if (D.arenaFill) D.arenaFill.style.width = pct + '%';
}

/* ═══════════════════════════════════════════════════════════
   §9  CURSOR POSITIONING
═══════════════════════════════════════════════════════════ */
function positionLiveCursor() {
  if (S.finished) return;                         // Bug 4 guard
  const wrap = D.wordsWrap, cursor = D.liveCursor;
  if (!wrap || !cursor) return;

  const tgEl = D.wordsTarget.querySelector(`[data-ti="${S.charIdx}"]`)
            || D.wordsTarget.querySelector(`[data-ti="${S.charIdx - 1}"]`);
  if (!tgEl) { cursor.style.opacity = '0'; return; }

  cursor.style.opacity = '1';
  const wR = wrap.getBoundingClientRect();
  const eR = tgEl.getBoundingClientRect();

  // ── Arena text scrolling ────────────────────────────────
  const lineH = S.lineH || (parseFloat(getComputedStyle(wrap).lineHeight) || S.fontSize * 1.85);
  const visualTopEl = eR.top - wR.top;
  const naturalTop  = visualTopEl + S.arenaScroll;

  // Keep cursor on row 2 (lineH px from top); scroll triggers when moving to row 3+
  // BUG-05: Use Math.floor (not Math.round) to prevent oscillation at line boundaries
  const targetScroll = Math.max(0, Math.floor((naturalTop - lineH) / lineH) * lineH);

  if (targetScroll !== S.arenaScroll) {
    S.arenaScroll = targetScroll;
    const tx = `translateY(-${S.arenaScroll}px)`;
    if (D.wordsTarget) D.wordsTarget.style.transform = tx;
    if (D.wordsTyped)  D.wordsTyped.style.transform  = tx;
    cursor.style.transition = 'none';
    requestAnimationFrame(() => { cursor.style.transition = ''; });
    }

  // Cursor position uses natural coordinates relative to wrap
  let left = eR.left - wR.left;
  if (S.charIdx > 0 && !D.wordsTarget.querySelector(`[data-ti="${S.charIdx}"]`)) {
    const prev = D.wordsTarget.querySelector(`[data-ti="${S.charIdx - 1}"]`);
    if (prev) left = prev.getBoundingClientRect().right - wR.left;
  }

  cursor.style.left   = `${left}px`;
  cursor.style.top    = `${naturalTop - S.arenaScroll}px`;
  cursor.style.height = `${eR.height || S.fontSize * 1.4}px`;
}

function positionGhostCursor(charIdx) {
  const gc = D.ghostCursor;
  if (!gc) return;
  if (charIdx < 0 || charIdx >= S.text.length) { gc.hidden = true; return; }

  const tgEl = D.wordsTarget.querySelector(`[data-ti="${charIdx}"]`);
  if (!tgEl) { gc.hidden = true; return; }

  gc.hidden = false;
  const wR = D.wordsWrap.getBoundingClientRect();
  const eR = tgEl.getBoundingClientRect();

  // BUG-06: eR.top is already the visual (post-transform) position.
  // Do NOT add S.arenaScroll — that would push the ghost below the visible area.
  gc.style.left   = `${eR.left - wR.left}px`;
  gc.style.top    = `${eR.top  - wR.top}px`;
  gc.style.height = `${eR.height || S.fontSize * 1.4}px`;
}

/* ═══════════════════════════════════════════════════════════
   §10  GHOST RACE ENGINE
═══════════════════════════════════════════════════════════
   charTimes[i] = milliseconds after test start when char i was typed.
   During replay: ghost pos = max index where charTimes[i] <= elapsed.
   Ghost record is saved per mode+diff+duration key, only if new WPM > saved.
═══════════════════════════════════════════════════════════ */
function ghostKey() {
  return `tt_ghost_${S.mode}_${S.adaptiveOverride || S.diff}_${S.duration}`;
}

function loadGhostRecord() {
  try {
    const r = JSON.parse(localStorage.getItem(ghostKey()) || 'null');
    S.ghostRecord = r;
    return r;
  } catch { S.ghostRecord = null; return null; }
}

function saveGhostRecord(wpm, acc) {
  const existing = loadGhostRecord();
  if (existing && existing.wpm >= wpm) return false; // not better

  const rec = {
    charTimes: [...S.charTimes],
    wpm, acc,
    mode: S.mode,
    diff: S.adaptiveOverride || S.diff,
    duration: S.duration,
    date: new Date().toISOString(),
  };
  localStorage.setItem(ghostKey(), JSON.stringify(rec));
  S.ghostRecord = rec;
  return true;
}

function clearGhostRecord() {
  localStorage.removeItem(ghostKey());
  S.ghostRecord = null;
}

function startGhostAnimation() {
  if (!S.isPro) return;
  if (!S.ghostRecord && S.ghostCustomWpm == null) return;
  D.ghostCursor.hidden = false;
  D.hcGhost.hidden     = false;
  D.ghostBar.hidden    = false;
  const dispWpm = S.ghostCustomWpm != null ? S.ghostCustomWpm : S.ghostRecord?.wpm || '—';
  D.ghostRecordWpm.textContent = dispWpm + ' WPM';
  tickGhost();
}

function tickGhost() {
  if (!S.started || S.finished || !S.ghostEnabled) return;
  if (!S.isPro) return;

  if (!S.paused) {
    const elapsed = performance.now() - S.startTime;

    let pos;
    if (S.ghostCustomWpm != null) {
      // Constant-speed ghost: chars per ms = (wpm * 5) / 60000
      pos = Math.min(S.text.length, Math.floor((S.ghostCustomWpm * 5 / 60000) * elapsed));
    } else if (S.ghostRecord) {
      const times = S.ghostRecord.charTimes;
      pos = 0;
      while (pos < times.length && times[pos] <= elapsed) pos++;
    } else {
      return;
    }

    positionGhostCursor(pos);

    const ghostWpm = pos > 0
      ? Math.round((pos / 5) / (elapsed / 60000))
      : 0;
    if (D.ghostWpmVal) D.ghostWpmVal.textContent = ghostWpm || '—';
    if (D.ghostVsLabel) D.ghostVsLabel.innerHTML = `You: <b>${calcLiveWPM() || '—'}</b>`;

    if (pos >= S.text.length) { D.ghostCursor.hidden = true; return; }
  }

  S.ghostRafId = requestAnimationFrame(tickGhost);
}

function stopGhost() {
  cancelAnimationFrame(S.ghostRafId);
  if (D.ghostCursor) D.ghostCursor.hidden = true;
  if (D.hcGhost)     D.hcGhost.hidden     = true;
  if (D.ghostBar)    D.ghostBar.hidden    = true;
}

function showGhostResult(myWpm) {
  const ghostWpm = S.ghostCustomWpm != null ? S.ghostCustomWpm : (S.ghostRecord?.wpm || 0);
  if (!ghostWpm) return;
  const beat = myWpm > ghostWpm;
  const tie  = myWpm === ghostWpm;

  D.ghostResult.hidden    = false;
  D.grVerdict.textContent = beat ? '🏆 You beat the ghost!'
                          : tie  ? '🤝 Dead heat — it\'s a tie!'
                                 : '👻 Ghost wins this round.';
  D.grDetail.textContent  = `Ghost: ${ghostWpm} WPM  ·  You: ${myWpm} WPM`;
  D.grVerdict.style.color = beat ? 'var(--ok)' : tie ? 'var(--warn)' : 'var(--err)';

  if (beat) addResBadge('👻 Ghost Slayer', 'ghost-win');
}

function renderGhostModal() {
  if (!S.isPro) {
    D.ghostBody.innerHTML = `
      <div style="text-align:center;padding:1.5rem">
        <div style="font-size:3rem;margin-bottom:.75rem">👻</div>
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;margin-bottom:.5rem">Ghost Races</div>
        <div style="font-size:.87rem;color:var(--text-m);line-height:1.7;margin-bottom:1.25rem">
          Race against your personal best in real time.<br>Ghost races require <b>TalionType Pro</b>.
        </div>
        <button class="ctrl-btn accent" id="ghostProBtn" style="margin:0 auto">⚡ Upgrade to Pro — $5</button>
      </div>`;
    document.getElementById('ghostProBtn')
      ?.addEventListener('click', () => { closeModal(D.ghostOv); renderProModal(); openModal(D.proOv); });
    return;
  }

  const rec = loadGhostRecord();

  // ── Saved ghost section ──────────────────────────────
  let savedSection = '';
  if (rec) {
    savedSection = `
      <div class="ghost-record" style="margin-bottom:.75rem">
        <div class="gr-head">
          <div>
            <div class="gr-wpm">${rec.wpm} WPM</div>
            <div class="gr-meta">${rec.acc}% accuracy · ${rec.mode} / ${rec.diff} · ${rec.duration}s</div>
            <div style="font-size:.72rem;color:var(--text-f);margin-top:.3rem">Saved: ${new Date(rec.date).toLocaleDateString()}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:.35rem;align-items:flex-end">
            <button class="ctrl-btn small" id="btnUseRecordGhost">▶ Race This</button>
            <button class="ctrl-btn danger small" id="btnClearGhost">Clear</button>
          </div>
        </div>
      </div>`;
  } else {
    savedSection = `
      <div style="font-size:.84rem;color:var(--text-m);line-height:1.6;margin-bottom:.75rem;padding:.6rem .75rem;background:var(--bg);border:1px solid var(--border-s);border-radius:10px">
        No ghost record for <b>${S.mode}/${S.adaptiveOverride||S.diff}/${S.duration}s</b>.<br>
        Complete a test and click <b>Set as Ghost</b> in results to save one.
      </div>`;
  }

  // BUG-FIX-5: Custom WPM ghost and friend's best ghost
  D.ghostBody.innerHTML = `
    ${savedSection}
    <div style="border-top:1px solid var(--border-s);padding-top:.75rem;margin-top:.25rem">
      <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text-f);font-weight:700;margin-bottom:.55rem">⚡ Custom Ghost Speed</div>
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
        <input type="number" id="ghostCustomWpmInput" class="si" min="1" max="330"
          placeholder="WPM (1–330)"
          value="${S.ghostCustomWpm != null ? S.ghostCustomWpm : ''}"
          style="flex:1;min-width:0;padding:.4rem .7rem;font-size:.86rem" />
        <button class="ctrl-btn small" id="btnSetCustomGhost">Set Ghost</button>
        <button class="ctrl-btn small danger" id="btnClearCustomGhost">Clear</button>
      </div>
      <div style="font-size:.72rem;color:var(--text-f)">Set a custom WPM target (max 330). The ghost cursor will move at a constant pace.</div>
    </div>
    <div style="border-top:1px solid var(--border-s);padding-top:.75rem;margin-top:.6rem">
      <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text-f);font-weight:700;margin-bottom:.55rem">👥 Race a Friend's Best</div>
      <div id="friendGhostList" style="display:flex;flex-direction:column;gap:.35rem">
        <div style="font-size:.82rem;color:var(--text-m)">Add friends in the Friends panel to race their best WPM here.</div>
      </div>
    </div>
    <div style="margin-top:.75rem;font-size:.8rem;color:var(--text-m);line-height:1.6">
      Enable the <b>Ghost toggle</b> in the mode bar, then start a test to race.
      The ghost cursor appears in purple — stay ahead!
    </div>`;

  // Wire saved ghost buttons
  document.getElementById('btnUseRecordGhost')?.addEventListener('click', () => {
    S.ghostCustomWpm = null;
    showToast(`👻 Racing saved ghost (${rec.wpm} WPM)`);
    closeModal(D.ghostOv);
    if (!D.ghostToggle.checked) { D.ghostToggle.checked = true; S.ghostEnabled = true; }
  });
  document.getElementById('btnClearGhost')?.addEventListener('click', () => {
    clearGhostRecord(); showToast('Ghost cleared'); renderGhostModal();
  });

  // Wire custom WPM
  document.getElementById('btnSetCustomGhost')?.addEventListener('click', () => {
    const v = parseInt(document.getElementById('ghostCustomWpmInput')?.value || '0');
    if (!v || v < 1 || v > 330) { showToast('Enter a WPM between 1 and 330'); return; }
    S.ghostCustomWpm = v;
    showToast(`👻 Custom ghost set to ${v} WPM`);
    closeModal(D.ghostOv);
    if (!D.ghostToggle.checked) { D.ghostToggle.checked = true; S.ghostEnabled = true; }
  });
  document.getElementById('btnClearCustomGhost')?.addEventListener('click', () => {
    S.ghostCustomWpm = null;
    showToast('Custom ghost cleared');
    renderGhostModal();
  });

  // Populate friend ghost list from local friends store
  const friendsList = getFriends();
  const friendGhostListEl = document.getElementById('friendGhostList');
  if (friendGhostListEl && friendsList.length) {
    friendGhostListEl.innerHTML = friendsList.map(f => `
      <div class="friend-row" style="justify-content:space-between">
        <div>
          <span class="friend-name">${esc(f.name)}</span>
          <span class="friend-wpm" style="margin-left:.5rem">${f.bestWpm ? f.bestWpm+' WPM best' : 'No WPM recorded'}</span>
        </div>
        ${f.bestWpm ? `<button class="ctrl-btn small" data-fwpm="${f.bestWpm}">Race</button>` : ''}
      </div>`).join('');
    friendGhostListEl.querySelectorAll('[data-fwpm]').forEach(btn => {
      btn.addEventListener('click', () => {
        const wpm = parseInt(btn.dataset.fwpm);
        S.ghostCustomWpm = wpm;
        showToast(`👻 Racing ${btn.closest('.friend-row').querySelector('.friend-name').textContent}'s best (${wpm} WPM)`);
        closeModal(D.ghostOv);
        if (!D.ghostToggle.checked) { D.ghostToggle.checked = true; S.ghostEnabled = true; }
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   §11  ADAPTIVE DIFFICULTY
═══════════════════════════════════════════════════════════ */
function runAdaptiveCheck() {
  if (S.diff !== 'adaptive') { S.adaptiveOverride = null; return; }

  const recent = S.history.slice(-5).map(r => r.wpm);
  if (recent.length < 2) { S.adaptiveOverride = 'medium'; return; }

  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const suggested = avg < ADAPT_THRESHOLDS.easy   ? 'easy'
                  : avg < ADAPT_THRESHOLDS.medium  ? 'medium'
                  :                                  'hard';

  if (suggested === S.adaptiveOverride) return;
  S.adaptiveOverride = suggested;

  const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  if (D.adaptMsg) D.adaptMsg.textContent =
    `Adaptive → ${labels[suggested]} (avg ${Math.round(avg)} WPM over last ${recent.length} tests)`;
  if (D.adaptToast) { D.adaptToast.hidden = false; setTimeout(() => { D.adaptToast.hidden = true; }, 5500); }
}

/* ═══════════════════════════════════════════════════════════
   §12  TIMER ENGINE
═══════════════════════════════════════════════════════════ */
let _timerInt = null, _sampleInt = null, _hudInt = null;

function startTimer() {
  if (S.timerActive) return;
  S.timerActive = true;
  S.startTime   = performance.now();
  gaEvent('test_start', { mode: S.mode, diff: S.diff, duration: S.duration });

  if (S.ghostEnabled && (S.ghostRecord || S.ghostCustomWpm != null) && S.isPro) startGhostAnimation();

  // BUG-23: Compensate for setInterval drift by computing timeLeft from wall-clock
  const _timerStart = performance.now();
  const _totalDuration = S.duration;
  _timerInt = setInterval(() => {
    if (S.paused) return;
    const elapsed = (performance.now() - _timerStart - S._totalPausedMs) / 1000;
    S.timeLeft = Math.max(0, _totalDuration - Math.floor(elapsed));
    if (D.timerVal) D.timerVal.textContent = S.timeLeft;
    if (D.hcTimer)  D.hcTimer.classList.toggle('urgent', S.timeLeft <= 10);
    if (S.timeLeft <= 0) finishTest();
  }, 200); // poll at 200ms for accuracy

  _sampleInt = setInterval(() => {
    if (S.paused || !S.timerActive) return;
    S.wpmSamples.push({ t: S.duration - S.timeLeft, wpm: calcLiveWPM() });
  }, 2000);

  _hudInt = setInterval(() => { if (!S.paused) updateHUD(); }, 300);
}

function stopTimer() {
  clearInterval(_timerInt);
  clearInterval(_sampleInt);
  clearInterval(_hudInt);
  S.timerActive = false;
}

/* ═══════════════════════════════════════════════════════════
   §13  METRIC CALCULATIONS
═══════════════════════════════════════════════════════════ */
function elapsedMin()    { return Math.max(0.0001, (performance.now() - S.startTime) / 60000); }
function calcLiveWPM()   { return Math.round(S.correctChars / 5 / elapsedMin()); }
function calcRawWPM()    { return Math.round(S.totalTyped   / 5 / elapsedMin()); }
function calcAccuracy()  { return S.totalTyped ? Math.round((S.correctChars / S.totalTyped) * 100) : 100; }

function calcConsistency() {
  const w = S.wpmSamples.map(s => s.wpm).filter(x => x > 0);
  if (w.length < 3) return 100;
  const avg = w.reduce((a, b) => a + b) / w.length;
  if (avg === 0) return 0; // BUG-19: prevent NaN from division-by-zero
  const sd  = Math.sqrt(w.reduce((s, v) => s + (v - avg) ** 2, 0) / w.length);
  return Math.round(Math.max(0, Math.min(100, (1 - sd / avg) * 100)));
}

/* ═══════════════════════════════════════════════════════════
   §14  ANTI-CHEAT
═══════════════════════════════════════════════════════════ */
const AC = {
  ts: [],
  record(t) {
    this.ts.push(t);
    // Bug 19: sliding window — keep only last 2 seconds
    const cutoff = t - 2000;
    while (this.ts.length && this.ts[0] < cutoff) this.ts.shift();
  },
  reset()   { this.ts = []; },
  check(wpm, acc) {
    if (wpm > 350) return { ok: false, why: 'WPM exceeds physical limit (350)' };

    // Bug 6a: Tighter burst — >10 keypresses in 200ms is inhuman
    const burst = this.ts.filter(t => t > performance.now() - 200).length;
    if (burst > 10) return { ok: false, why: 'Input burst detected' };

    // BUG-10: Raised from 250 to 350 — world records exceed 250 WPM legitimately
    if (wpm > 350 && acc >= 99) return { ok: false, why: 'Suspicious score' };
    if (wpm > 180 && acc === 100 && S.duration <= 30) return { ok: false, why: 'Suspicious score' };

    // Bug 6c: Average chars-per-second via S.charTimes
    const times = S.charTimes.filter(t => t != null);
    if (times.length > 5) {
      const totalMs = times[times.length - 1] - times[0];
      const avgMs   = totalMs / (times.length - 1);
      if (avgMs < 60) return { ok: false, why: 'Typing interval too fast' };
    }

    return { ok: true };
  },
};

/* ═══════════════════════════════════════════════════════════
   §15  INPUT HANDLER
═══════════════════════════════════════════════════════════ */
function handleInput() {
  if (S.finished || S.paused) return;
  const val = D.ghostInput.value;

  if (!S.started) {
    S.started = true;
    if (D.btnPause)   D.btnPause.disabled = false;
    if (D.arenaHint)  D.arenaHint.style.opacity = '0';
    startTimer();
  }

  const now  = performance.now();
  AC.record(now);

  const nLen = val.length;
  const pLen = S.charIdx;

  if (nLen > pLen) {
    const typedCh    = val[nLen - 1];
    const expectedCh = S.text[S.charIdx];
    S.totalTyped++;

    // Record char timestamp for ghost
    S.charTimes[S.charIdx] = now - S.startTime;

    const correct = typedCh === expectedCh;
    if (correct) {
      renderChar(S.charIdx, 'c');
      S.correctChars++;
      S.curStreak++;
      if (S.curStreak > S.bestStreak) S.bestStreak = S.curStreak;
      playSound('c');
    } else {
      renderChar(S.charIdx, 'e');
      S.errMap[S.charIdx] = { ex: expectedCh, got: typedCh };
      S.curStreak = 0;
      playSound('e');
    }

    // Track key presses & errors
    const k = (typedCh || '').toLowerCase();
    S.keyPresses[k] = (S.keyPresses[k] || 0) + 1;
    if (!correct) S.keyErr[k] = (S.keyErr[k] || 0) + 1;

    S.charIdx++;

  } else if (nLen < pLen) {
    if (S.charIdx > 0) {
      S.charIdx--;
      const wasErr = !!S.errMap[S.charIdx];
      if (!wasErr) S.correctChars = Math.max(0, S.correctChars - 1);
      S.totalTyped = Math.max(0, S.totalTyped - 1); // Bug 17: un-count deleted char
      delete S.errMap[S.charIdx];
      renderChar(S.charIdx, 'u');
      D.ghostInput.value = D.ghostInput.value.substring(0, S.charIdx);
    }
  }

  S.typed = D.ghostInput.value;
  requestAnimationFrame(positionLiveCursor);
  updateProgress();

  if (S.charIdx >= S.text.length) finishTest();
}

function handleKeyDown(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    if (!S.started || S.finished) initTest();
  }
}

/* ═══════════════════════════════════════════════════════════
   §16  LIVE HUD
═══════════════════════════════════════════════════════════ */
function updateHUD() {
  if (D.wpmVal)    D.wpmVal.textContent    = (S.showLiveWpm && S.started) ? calcLiveWPM() : '—';
  if (D.accVal)    D.accVal.textContent    = S.started ? calcAccuracy() + '%' : '—';
  if (D.streakVal) D.streakVal.textContent = S.curStreak;
}

/* ═══════════════════════════════════════════════════════════
   §17  FINISH TEST & RESULTS
═══════════════════════════════════════════════════════════ */
function finishTest() {
  if (S.finished) return;
  S.finished = true;
  stopTimer();
  stopGhost();

  const wpm  = calcLiveWPM();
  const raw  = calcRawWPM();
  const acc  = calcAccuracy();
  const cons = calcConsistency();
  const errs = Object.keys(S.errMap).length;

  // Anti-cheat check
  const chk = AC.check(wpm, acc);
  if (!chk.ok) showToast(`⚠ ${chk.why} — score flagged.`);

  // Level update (WPM-based, only if new best)
  const prevBest  = S.bestWpm;
  const prevLevel = currentLevel();
  const isNewBest = wpm > prevBest && chk.ok;
  if (isNewBest) S.bestWpm = wpm;
  const newLevel = currentLevel();

  // Build result
  const result = {
    wpm, rawWpm: raw, raw, acc, consistency: cons, cons, errors: errs,
    mode: S.mode, diff: S.adaptiveOverride || S.diff,
    duration: S.duration, streak: S.bestStreak,
    correctChars: S.correctChars,
    date: new Date().toISOString(), flagged: !chk.ok, isNewBest,
    _new_pb: isNewBest,
    _adaptive: S.diff === 'adaptive',
  };
  S.lastResult = result;
  saveHistory(result);
  persistProfile();
  refreshLevelUI();

  // Ghost race result
  if (S.ghostEnabled && S.isPro && (S.ghostRecord || S.ghostCustomWpm != null)) showGhostResult(wpm);

  // Achievements
  checkAchievements(result);

  // Daily completion
  if (S.isDailyActive) checkDailyCompletion(result);

  // Auto-save ghost if new personal best
  if (isNewBest) {
    const saved = saveGhostRecord(wpm, acc);
    if (saved) D.btnSetGhost && (D.btnSetGhost.textContent = '✓ Ghost Saved');
  }

  // Fill results panel
  if (D.resWpmBig)  D.resWpmBig.textContent  = wpm;
  if (D.resWpm)     D.resWpm.textContent     = wpm;
  if (D.resRaw)     D.resRaw.textContent     = raw;
  if (D.resAcc)     D.resAcc.textContent     = acc + '%';
  if (D.resErrors)  D.resErrors.textContent  = errs;
  if (D.resCons)    D.resCons.textContent    = cons + '%';
  if (D.resStreak)  D.resStreak.textContent  = S.bestStreak;
  if (D.resWpmNote) D.resWpmNote.textContent = isNewBest ? '🏆 Personal Best!' : `Best: ${prevBest} WPM`;

  if (isNewBest)              addResBadge('🏆 New PB', '');
  if (newLevel > prevLevel)   { D.lvlUpBadge && (D.lvlUpBadge.hidden = false); addResBadge(`⬆ Level ${newLevel}`, 'new'); runConfetti(); }
  else if (D.lvlUpBadge)      D.lvlUpBadge.hidden = true;

  if (D.resultsPanel) D.resultsPanel.hidden = false;
  if (D.ghostInput)   D.ghostInput.disabled = true;
  if (D.liveCursor)   D.liveCursor.style.opacity = '0';   // Bug 4: hide cursor after test
  // Show results ad
  const adR = document.getElementById('adResults');
  if (adR) adR.hidden = false;

  requestAnimationFrame(() => {
    renderWPMChart(S.wpmSamples, 'wpmChart');
    renderErrors();
    renderHeatmap();
  });

  D.resultsPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  gaEvent('test_complete', { wpm, acc, mode: S.mode, diff: S.diff, isNewBest });
}

function addResBadge(text, cls) {
  if (!D.resBadges) return;
  const b = document.createElement('span');
  b.className  = `rbadge ${cls}`;
  b.textContent = text;
  D.resBadges.appendChild(b);
}

/* ═══════════════════════════════════════════════════════════
   §18  INIT / RESET
═══════════════════════════════════════════════════════════ */
function initTest(isDaily = false) {
  stopTimer();
  stopGhost();
  AC.reset();

  S.typed = ''; S.charIdx = 0; S.started = false; S.finished = false;
  S.paused = false; S.timerActive = false; S.timeLeft = S.duration;
  S.startTime = null; S.pauseStart = null;
  S.errMap = {}; S.keyErr = {}; S.keyPresses = {};
  S.wpmSamples = []; S.charTimes = [];
  S.correctChars = 0; S.totalTyped = 0;
  S.curStreak = 0; S.bestStreak = 0;
  S.arenaScroll = 0;
  S.lineH = 0;
  S._totalPausedMs = 0;
  // ghostCustomWpm persists across tests (user set it intentionally)
  // Reset text layer scroll
  if (D.wordsTarget) D.wordsTarget.style.transform = '';
  if (D.wordsTyped)  D.wordsTyped.style.transform  = '';
  S.isDailyActive = isDaily;

  runAdaptiveCheck();
  S.text = (isDaily && S.dailyChallenge?.text) ? S.dailyChallenge.text : generateText();

  // Reset UI
  if (D.timerVal)     D.timerVal.textContent    = S.duration;
  if (D.wpmVal)       D.wpmVal.textContent      = '—';
  if (D.accVal)       D.accVal.textContent      = '—';
  if (D.streakVal)    D.streakVal.textContent   = '0';
  if (D.btnPause)     D.btnPause.disabled       = true;
  if (D.pauseLbl)     D.pauseLbl.textContent    = 'Pause';
  if (D.resultsPanel) D.resultsPanel.hidden     = true;
  const adR = document.getElementById('adResults');
  if (adR) adR.hidden = true;
  if (D.resBadges)    D.resBadges.innerHTML     = '';
  if (D.ghostResult)  D.ghostResult.hidden      = true;
  if (D.ghostInput)   { D.ghostInput.disabled   = false; D.ghostInput.value = ''; }
  if (D.hcTimer)      D.hcTimer.classList.remove('urgent');
  if (D.pausedOv)     D.pausedOv.hidden         = true;
  if (D.arenaHint)    D.arenaHint.style.opacity = '1';
  if (D.arenaFill)    D.arenaFill.style.width   = '0%';
  if (D.ghostCursor)  D.ghostCursor.hidden      = true;
  if (D.hcGhost)      D.hcGhost.hidden          = true;
  if (D.ghostBar)     D.ghostBar.hidden         = true;
  if (D.btnSetGhost)  D.btnSetGhost.textContent = 'Set as Ghost';

  if (D.wordsWrap) D.wordsWrap.style.fontSize = S.fontSize + 'px';
  if (D.arena)     D.arena.classList.toggle('smooth-caret', S.smoothCaret);

  if (S.ghostEnabled) loadGhostRecord();

  renderArena();
  requestAnimationFrame(positionLiveCursor);
  updateModeFlags(); // Bug 7: update modifier indicators

  // BUG-09: Always focus ghostInput regardless of screen width
  D.ghostInput?.focus();
}

/* ═══════════════════════════════════════════════════════════
   §19  PAUSE / RESUME
═══════════════════════════════════════════════════════════ */
function togglePause() {
  if (!S.started || S.finished) return;
  S.paused = !S.paused;
  if (S.paused) {
    S.pauseStart = performance.now();
    if (D.ghostInput)  D.ghostInput.disabled  = true;
    if (D.pausedOv)    D.pausedOv.hidden      = false;
    if (D.pauseLbl)    D.pauseLbl.textContent = 'Resume';
  } else {
    const pausedMs = performance.now() - S.pauseStart;
    S._totalPausedMs = (S._totalPausedMs || 0) + pausedMs;
    S.startTime += pausedMs;
    if (D.ghostInput)  D.ghostInput.disabled  = false;
    if (D.pausedOv)    D.pausedOv.hidden      = true;
    if (D.pauseLbl)    D.pauseLbl.textContent = 'Pause';
    D.ghostInput?.focus();
  }
}

/* ═══════════════════════════════════════════════════════════
   §20  WPM CANVAS CHART
═══════════════════════════════════════════════════════════ */
function renderWPMChart(samples, canvasId) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  const cw  = cv.parentElement?.clientWidth || 700;
  const ch  = 200;
  cv.width  = cw * dpr; cv.height = ch * dpr;
  cv.style.width = cw + 'px'; cv.style.height = ch + 'px';

  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cw, ch);

  const C = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const acc  = C('--acc');
  const tf   = C('--text-f');
  const bd   = C('--border-s');

  if (!samples || samples.length < 2) {
    ctx.fillStyle = tf; ctx.font = '13px Outfit,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Complete a longer test to see the WPM graph', cw / 2, ch / 2);
    return;
  }

  const pad  = { t: 20, r: 20, b: 30, l: 50 };
  const gw   = cw - pad.l - pad.r;
  const gh   = ch - pad.t - pad.b;
  const maxW = Math.max(...samples.map(s => s.wpm), 10);
  const maxT = Math.max(...samples.map(s => s.t),   1);
  const px   = t => pad.l + (t / maxT) * gw;
  const py   = w => pad.t + gh - (w / maxW) * gh;

  // Grid
  [0.25, 0.5, 0.75, 1].forEach(p => {
    const y = pad.t + gh * (1 - p);
    ctx.strokeStyle = bd; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + gw, y); ctx.stroke();
    ctx.fillStyle = tf; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxW * p), pad.l - 6, y + 4);
  });

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + gh);
  grad.addColorStop(0, acc + '44'); grad.addColorStop(1, acc + '00');
  ctx.beginPath();
  ctx.moveTo(px(samples[0].t), pad.t + gh);
  samples.forEach(s => ctx.lineTo(px(s.t), py(s.wpm)));
  ctx.lineTo(px(samples[samples.length - 1].t), pad.t + gh);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle = acc; ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  samples.forEach((s, i) => i === 0 ? ctx.moveTo(px(s.t), py(s.wpm)) : ctx.lineTo(px(s.t), py(s.wpm)));
  ctx.stroke();

  // Dots
  samples.forEach(s => {
    ctx.beginPath(); ctx.arc(px(s.t), py(s.wpm), 4, 0, Math.PI * 2);
    ctx.fillStyle   = acc; ctx.fill();
    ctx.strokeStyle = C('--bg-card'); ctx.lineWidth = 1.5; ctx.stroke();
  });
}

/* ═══════════════════════════════════════════════════════════
   §21  ERROR BREAKDOWN
═══════════════════════════════════════════════════════════ */
function renderErrors() {
  if (!D.errChips) return;
  D.errChips.innerHTML = '';
  const errs = Object.entries(S.keyErr).sort((a, b) => b[1] - a[1]);
  if (!errs.length) { D.errChips.innerHTML = '<span class="enone">✓ Perfect — no errors!</span>'; return; }
  errs.forEach(([k, n]) => {
    const c = document.createElement('span');
    c.className   = 'echip';
    c.innerHTML   = `<span class="ek">${esc(k || '?')}</span><span class="ec">×${n}</span>`;
    D.errChips.appendChild(c);
  });
}

/* ═══════════════════════════════════════════════════════════
   §22  KEY HEATMAP
═══════════════════════════════════════════════════════════ */
const KB_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

function renderHeatmap() {
  if (!D.heatmapWrap) return;
  D.heatmapWrap.innerHTML = '';
  const maxP = Math.max(...Object.values(S.keyPresses), 1);

  KB_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kbd-row';
    row.forEach(k => {
      const el = document.createElement('div');
      el.className = 'kkey';
      el.textContent = k.toUpperCase();
      const p = S.keyPresses[k] || 0;
      const e = S.keyErr[k]     || 0;
      if (p > 0) {
        const errRate = e / p;
        if (errRate > 0.4)        el.classList.add('he');
        else if (p / maxP > 0.6) el.classList.add('h3');
        else if (p / maxP > 0.3) el.classList.add('h2');
        else                      el.classList.add('h1');
        el.title = `${k.toUpperCase()}: ${p} presses, ${e} errors`;
      }
      rowEl.appendChild(el);
    });
    D.heatmapWrap.appendChild(rowEl);
  });

  const spaceRow = document.createElement('div');
  spaceRow.className = 'kbd-row';
  const spaceKey = document.createElement('div');
  spaceKey.className = 'kkey space'; spaceKey.textContent = 'SPACE';
  if ((S.keyPresses[' '] || 0) > 0) spaceKey.classList.add('h1');
  spaceRow.appendChild(spaceKey);
  D.heatmapWrap.appendChild(spaceRow);
}

/* ═══════════════════════════════════════════════════════════
   §23  CONFETTI
═══════════════════════════════════════════════════════════ */
function runConfetti() {
  const cv = D.confettiCv;
  if (!cv) return;
  cv.width  = cv.offsetWidth  || 800;
  cv.height = cv.offsetHeight || 400;
  const ctx  = cv.getContext('2d');
  const cols = ['#00D9B0', '#FF6935', '#FFD700', '#FF4050', '#B57BFF', '#4DB8FF'];
  const pieces = Array.from({ length: 100 }, () => ({
    x: Math.random() * cv.width,  y: Math.random() * -cv.height,
    w: rndInt(4, 10),             h: rndInt(6, 16),
    vx: (Math.random() - 0.5) * 3, vy: Math.random() * 4 + 2,
    col: cols[Math.floor(Math.random() * cols.length)],
    rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.2,
  }));
  let frame = 0;
  function tick() {
    if (frame++ > 180) { ctx.clearRect(0, 0, cv.width, cv.height); return; }
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════════
   §24  LOCAL LEADERBOARD
═══════════════════════════════════════════════════════════ */
const LS_LB = 'tt_lb_local';

function getLocalLB() {
  try { return JSON.parse(localStorage.getItem(LS_LB) || '[]'); } catch { return []; }
}

function saveLocalScore(name, r) {
  const lb = getLocalLB();
  lb.push({ name, wpm: r.wpm, acc: r.acc, mode: r.mode, diff: r.diff,
            duration: r.duration, level: currentLevel(), date: new Date().toISOString() });
  // Sort by tie-break: wpm DESC → acc DESC → timestamp ASC (earlier = better)
  lb.sort((a, b) => b.wpm - a.wpm || b.acc - a.acc
    || new Date(a.date) - new Date(b.date));
  localStorage.setItem(LS_LB, JSON.stringify(lb.slice(0, 100)));
}

function renderLocalLB(filters = {}) {
  let lb = getLocalLB();
  if (filters.mode)     lb = lb.filter(r => r.mode === filters.mode);
  if (filters.diff)     lb = lb.filter(r => r.diff === filters.diff);
  if (filters.duration) lb = lb.filter(r => String(r.duration) === String(filters.duration));

  if (!lb.length) {
    D.lbBody.innerHTML = '<div class="lb-empty">No local scores match these filters.</div>';
    return;
  }
  D.lbBody.innerHTML = buildLBTable(lb.slice(0, 50).map((r, i) => ({
    rank: i + 1, name: r.name || 'Anonymous',
    wpm: r.wpm, acc: r.acc + '%',
    extra: `Lvl ${r.level || '—'}`,
    date: new Date(r.date).toLocaleDateString(), uid: null,
  })));
}

/* ═══════════════════════════════════════════════════════════
   §25  FIREBASE LEADERBOARD
═══════════════════════════════════════════════════════════
   Collections: tt_lb_global  tt_lb_weekly  tt_lb_monthly
   Tie-breaker: wpm DESC → acc DESC → timestamp ASC (earlier beats later)
   Top-50 cap per collection.
═══════════════════════════════════════════════════════════ */
const FB_COL = { global: 'tt_lb_global', weekly: 'tt_lb_weekly', monthly: 'tt_lb_monthly' };

function initFirebase(cfg) {
  try {
    if (typeof firebase === 'undefined') {
      setFBStatus('Firebase SDK not loaded. Uncomment the three script tags in index.html.', false);
      return false;
    }
    const ex = firebase.apps.find(a => a.name === 'tt');
    S.fbApp  = ex || firebase.initializeApp(cfg, 'tt');
    S.fbDB   = firebase.firestore(S.fbApp);
    S.fbAuth = firebase.auth(S.fbApp);
    S.fbAuth.onAuthStateChanged(u => { S.currentUser = u; updateAuthUI(); });
    S.fbReady = true;
    setFBStatus('Connected ✓', true);
    localStorage.setItem('tt_fb_cfg', JSON.stringify(cfg));
    return true;
  } catch (e) { setFBStatus('Error: ' + e.message, false); return false; }
}

function setFBStatus(msg, ok) {
  if (D.fbStatus) { D.fbStatus.textContent = msg; D.fbStatus.className = 'fb-status ' + (ok ? 'ok' : 'err'); }
  if (D.lbNote)   D.lbNote.textContent = ok && S.currentUser ? '' : ok ? 'Sign in to post globally.' : 'Sign in to post to the global leaderboard.';
}

function getWeekKey() {
  const n = new Date(), d = (n.getDay() + 6) % 7, m = new Date(n);
  m.setDate(n.getDate() - d);
  return `${m.getFullYear()}-${m.getMonth() + 1}-${m.getDate()}`;
}
function getMonthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${n.getMonth() + 1}`;
}

async function saveToFirestoreCol(colName, data) {
  if (!S.fbDB || !S.currentUser) return null;
  try {
    const col  = S.fbDB.collection(colName);
    // Ordered by tie-break: wpm DESC, acc DESC, timestamp ASC
    const snap = await col
      .orderBy('wpm',       'desc')
      .orderBy('acc',       'desc')
      .orderBy('timestamp', 'asc')
      .limit(LB_MAX).get();
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Check if current user already has an entry
    const myDoc = docs.find(d => d.uid === S.currentUser.uid);
    if (myDoc) {
      const better = data.wpm > myDoc.wpm
                  || (data.wpm === myDoc.wpm && data.acc > myDoc.acc);
      if (better) { await col.doc(myDoc.id).set(data); return myDoc.id; }
      return null; // not better
    }

    if (docs.length < LB_MAX) {
      const ref = await col.add(data); return ref.id;
    }

    // Replace lowest-ranked entry if new score beats it
    const lowest = docs[docs.length - 1];
    const beatsLowest = data.wpm > lowest.wpm
                     || (data.wpm === lowest.wpm && data.acc > lowest.acc);
    if (beatsLowest) {
      await col.doc(lowest.id).delete();
      const ref = await col.add(data); return ref.id;
    }
    return null;
  } catch (e) { console.error('Firestore write error:', e); return null; }
}

// BUG-FIX-7: Check if a display name is already taken by a DIFFERENT user on the global LB
async function isNameAvailable(name) {
  if (!S.fbDB || !S.currentUser) return true;
  try {
    const snap = await S.fbDB.collection(FB_COL.global)
      .where('name', '==', name).limit(5).get();
    if (snap.empty) return true;
    // OK if all docs with this name belong to this user (or none exist)
    for (const doc of snap.docs) {
      if (doc.data().uid !== S.currentUser.uid) return false; // name taken by someone else
    }
    return true;
  } catch { return true; }
}

async function saveGlobalScore(name, r) {
  if (!S.fbDB || !S.currentUser) return;
  const uid  = S.currentUser.uid;
  const base = {
    uid, name, wpm: r.wpm, acc: r.acc, level: currentLevel(),
    mode: r.mode, diff: r.diff, duration: r.duration,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const [g, w, m] = await Promise.all([
    saveToFirestoreCol(FB_COL.global,  base),
    saveToFirestoreCol(FB_COL.weekly,  { ...base, weekKey:  getWeekKey()  }),
    saveToFirestoreCol(FB_COL.monthly, { ...base, monthKey: getMonthKey() }),
  ]);
  showToast((g || w || m) ? '✓ Score saved to global leaderboard!' : 'Score didn\'t make top 50.');
}

async function loadFirestoreLB(colName, filters = {}) {
  if (!S.fbDB) return null;
  try {
    let q = S.fbDB.collection(colName)
      .orderBy('wpm',       'desc')
      .orderBy('acc',       'desc')
      .orderBy('timestamp', 'asc');

    // Apply filters
    if (filters.weekKey)  q = q.where('weekKey',  '==', filters.weekKey);
    if (filters.monthKey) q = q.where('monthKey', '==', filters.monthKey);
    if (filters.mode)     q = q.where('mode',     '==', filters.mode);
    if (filters.diff)     q = q.where('diff',     '==', filters.diff);
    if (filters.duration) q = q.where('duration', '==', parseInt(filters.duration));

    const snap = await q.limit(LB_MAX).get();
    return snap.docs.map((d, i) => ({
      rank:  i + 1,
      uid:   d.data().uid,
      name:  d.data().name   || 'Anonymous',
      wpm:   d.data().wpm    || 0,
      acc:  (d.data().acc    || 0) + '%',
      extra: `Lvl ${d.data().level || '—'}`,
      date:  d.data().timestamp?.toDate ? d.data().timestamp.toDate().toLocaleDateString() : '',
    }));
  } catch (e) { console.error('Firestore read error:', e); return null; }
}

/* ═══════════════════════════════════════════════════════════
   §26  LEADERBOARD RENDERING & FILTERS
═══════════════════════════════════════════════════════════ */
function getLBFilters() {
  return {
    mode:     D.lbModeFilter?.value  || '',
    diff:     D.lbDiffFilter?.value  || '',
    duration: D.lbTimeFilter?.value  || '',
  };
}

async function renderLB(tab) {
  S.activeTab = tab;
  if (!D.lbBody) return;
  D.lbBody.innerHTML = '<div class="lb-load">Loading scores…</div>';

  const f = getLBFilters();

  if (tab === 'local') {
    renderLocalLB(f);
    if (D.lbPb) D.lbPb.hidden = true;
    return;
  }

  if (!S.fbReady) {
    D.lbBody.innerHTML = '<div class="lb-empty">Global leaderboard requires Firebase. Local scores available on the Local tab.</div>';
    return;
  }

  let filters = { ...f };
  if (tab === 'weekly')  filters.weekKey  = getWeekKey();
  if (tab === 'monthly') filters.monthKey = getMonthKey();

  const colName = FB_COL[tab] || FB_COL.global;
  const rows    = await loadFirestoreLB(colName, filters);

  if (!rows)        { D.lbBody.innerHTML = '<div class="lb-empty">Could not load scores. Check your connection and try again.</div>'; return; }
  if (!rows.length) { D.lbBody.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>'; return; }

  D.lbBody.innerHTML = buildLBTable(rows);

  // Personal best footer — show exact rank even outside top 50
  const best = getBestWPM();
  if (best > 0 && D.lbPb) {
    D.lbPb.hidden         = false;
    D.lbPbWpm.textContent = `${best} WPM`;
    const myRow = rows.find(r => r.uid === S.currentUser?.uid);
    if (myRow) {
      D.lbPbRank.textContent = `Rank #${myRow.rank}`;
    } else if (S.fbDB && S.currentUser) {
      // Outside top 50: count how many users scored strictly higher
      D.lbPbRank.textContent = 'Calculating rank…';
      try {
        const colName2 = FB_COL[tab] || FB_COL.global;
        const countSnap = await S.fbDB.collection(colName2).where('wpm', '>', best).get();
        const rank = countSnap.size + 1;
        D.lbPbRank.textContent = `Rank #${rank}`;
      } catch {
        D.lbPbRank.textContent = 'Outside top 50';
      }
    } else {
      D.lbPbRank.textContent = 'Not in top 50';
    }
  }
  gaEvent('view_leaderboard', { tab });
}

function buildLBTable(rows) {
  const rankCls = r => r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : '';
  const medal   = r => r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank;
  const rowCls  = r => {
    const isMe = S.currentUser && r.uid === S.currentUser.uid ? 'lb-me' : '';
    const top  = r.rank === 1 ? 'lb-top1' : r.rank === 2 ? 'lb-top2' : r.rank === 3 ? 'lb-top3' : '';
    return [isMe, top].filter(Boolean).join(' ');
  };
  const badge = r => r.wpm >= 150 ? '<span class="lb-badge fire">🔥</span>'
                   : r.wpm >= 100 ? '<span class="lb-badge">⚡</span>' : '';

  let html = `<table class="lb-table"><thead><tr>
    <th>#</th><th>Name</th><th>WPM</th><th>Acc</th><th>Level</th><th>Date</th>
  </tr></thead><tbody>`;
  rows.forEach(r => {
    html += `<tr class="${rowCls(r)}">
      <td class="lb-rank ${rankCls(r)}">${medal(r)}</td>
      <td class="lb-name">${esc(r.name)}${badge(r)}</td>
      <td class="lb-wpm">${r.wpm}</td>
      <td style="font-family:'JetBrains Mono',monospace;color:var(--text-m)">${r.acc}</td>
      <td style="color:var(--text-f)">${esc(r.extra || '—')}</td>
      <td style="color:var(--text-f);font-size:.75rem">${r.date || ''}</td>
    </tr>`;
  });
  return html + '</tbody></table>';
}

/* ═══════════════════════════════════════════════════════════
   §27  AUTH (Google + Email)
═══════════════════════════════════════════════════════════ */
function updateAuthUI() {
  const u = S.currentUser;
  const label = u ? (u.displayName || u.email?.split('@')[0] || 'Me') : 'Sign In';
  if (D.authBtnTxt)   D.authBtnTxt.textContent   = label;
  if (D.mmAuthBtnTxt) D.mmAuthBtnTxt.textContent  = label;
  if (D.authBtn)    D.authBtn.classList.toggle('in', !!u);
  if (D.mmAuthBtn)  D.mmAuthBtn.classList.toggle('in', !!u);
  if (D.lbNote)     D.lbNote.textContent = S.fbReady && u ? '' : S.fbReady ? 'Sign in to post globally.' : 'Sign in to post to the global leaderboard.';
}

async function doGoogleSignIn() {
  if (!S.fbAuth) { showToast('Connect Firebase first'); return; }
  try {
    await S.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    closeModal(D.authOv); showToast('Signed in with Google ✓');
  } catch (e) { if (D.authErr) D.authErr.textContent = e.message; }
}

async function doEmailSignIn() {
  if (!S.fbAuth) { showToast('Connect Firebase first'); return; }
  try {
    await S.fbAuth.signInWithEmailAndPassword(D.authEmail.value.trim(), D.authPw.value);
    closeModal(D.authOv); showToast('Signed in ✓');
  } catch (e) { if (D.authErr) D.authErr.textContent = e.message; }
}

async function doEmailSignUp() {
  if (!S.fbAuth) { showToast('Connect Firebase first'); return; }
  try {
    const cred = await S.fbAuth.createUserWithEmailAndPassword(D.authEmail.value.trim(), D.authPw.value);
    const name = D.authName?.value.trim() || 'Typist';
    await cred.user.updateProfile({ displayName: name });
    closeModal(D.authOv); showToast('Account created ✓');
  } catch (e) { if (D.authErr) D.authErr.textContent = e.message; }
}

async function doSignOut() {
  if (!S.fbAuth || !S.currentUser) { openModal(D.authOv); return; }
  await S.fbAuth.signOut();
  showToast('Signed out');
}

// BUG-FIX-6: Profile dropdown for signed-in users
function openProfileDropdown() {
  const u = S.currentUser;
  if (!u) { openModal(D.authOv); return; }

  // Remove existing dropdown if any
  document.getElementById('profileDrop')?.remove();

  const drop = document.createElement('div');
  drop.id = 'profileDrop';
  drop.style.cssText = `
    position:fixed;z-index:400;
    background:var(--bg-card);border:1.5px solid var(--border);border-radius:12px;
    padding:.5rem;min-width:200px;box-shadow:var(--shadow-lg);
    font-size:.82rem;
  `;

  // Position near the auth button
  const btnRect = (D.authBtn || D.mmAuthBtn)?.getBoundingClientRect();
  if (btnRect) {
    drop.style.top  = (btnRect.bottom + 8) + 'px';
    drop.style.right = (window.innerWidth - btnRect.right) + 'px';
  } else {
    drop.style.top = '60px'; drop.style.right = '16px';
  }

  const avatar = (u.displayName || u.email || 'U')[0].toUpperCase();
  const name   = u.displayName || u.email?.split('@')[0] || 'User';
  drop.innerHTML = `
    <div style="display:flex;align-items:center;gap:.6rem;padding:.5rem .7rem .65rem;border-bottom:1px solid var(--border-s);margin-bottom:.3rem">
      <div style="width:32px;height:32px;border-radius:50%;background:var(--acc-dim);border:1.5px solid var(--acc);display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:700;color:var(--acc);flex-shrink:0">${avatar}</div>
      <div>
        <div style="font-weight:700;color:var(--text)">${esc(name)}</div>
        <div style="font-size:.7rem;color:var(--text-f)">${esc(u.email || '')}</div>
      </div>
    </div>
    <button id="pdStats"  style="display:flex;align-items:center;gap:.5rem;width:100%;padding:.45rem .7rem;border-radius:8px;font-size:.8rem;color:var(--text-m);cursor:pointer;border:none;background:none;font-family:inherit;transition:background .15s;text-align:left">📊 My Stats</button>
    <button id="pdLB"     style="display:flex;align-items:center;gap:.5rem;width:100%;padding:.45rem .7rem;border-radius:8px;font-size:.8rem;color:var(--text-m);cursor:pointer;border:none;background:none;font-family:inherit;transition:background .15s;text-align:left">🏆 Leaderboard</button>
    <button id="pdSignOut"style="display:flex;align-items:center;gap:.5rem;width:100%;padding:.45rem .7rem;border-radius:8px;font-size:.8rem;color:var(--err);cursor:pointer;border:none;background:none;font-family:inherit;transition:background .15s;text-align:left;margin-top:.3rem;border-top:1px solid var(--border-s)">↪ Sign Out</button>
  `;
  document.body.appendChild(drop);

  // Hover effect
  drop.querySelectorAll('button').forEach(b => {
    b.addEventListener('mouseenter', () => b.style.background = 'var(--bg)');
    b.addEventListener('mouseleave', () => b.style.background = 'none');
  });

  const close = () => drop.remove();
  document.getElementById('pdStats')  ?.addEventListener('click', () => { close(); openModal(D.statsOv); renderStats(); });
  document.getElementById('pdLB')     ?.addEventListener('click', () => { close(); openModal(D.lbOv); renderLB('global'); });
  document.getElementById('pdSignOut')?.addEventListener('click', () => { close(); doSignOut(); });

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function onOut(e) {
      if (!drop.contains(e.target)) { drop.remove(); document.removeEventListener('click', onOut); }
    });
  }, 50);
}

/* ═══════════════════════════════════════════════════════════
   §28  PERSONAL STATS & HISTORY
═══════════════════════════════════════════════════════════ */
const LS_HIST = 'tt_history';
const LS_PROF = 'tt_profile';

function saveHistory(r) {
  const h = getHistory(); h.push(r);
  localStorage.setItem(LS_HIST, JSON.stringify(h.slice(-200)));
  S.history = h;
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; }
}

function getBestWPM() {
  return S.history.length ? Math.max(...S.history.map(r => r.wpm)) : 0;
}

function persistProfile() {
  localStorage.setItem(LS_PROF, JSON.stringify({
    bestWpm: S.bestWpm, achievements: S.achievements,
  }));
}

function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(LS_PROF) || '{}');
    S.bestWpm      = p.bestWpm      || getBestWPM();
    S.achievements = p.achievements || {};
  } catch {}
}

function renderStats() {
  if (!D.statCards) return;
  const h = S.history, n = h.length;

  if (!n) {
    D.statCards.innerHTML = '<p style="color:var(--text-f);grid-column:1/-1;text-align:center;padding:1.5rem">No tests completed yet!</p>';
    return;
  }

  const wpms   = h.map(r => r.wpm);
  const accs   = h.map(r => r.acc);
  const best   = Math.max(...wpms);
  const avgW   = Math.round(wpms.reduce((a, b) => a + b, 0) / n);
  const avgA   = Math.round(accs.reduce((a, b) => a + b, 0) / n);
  const r5     = wpms.slice(-5);
  const trend  = r5.length > 1 ? (r5[r5.length - 1] > r5[0] ? '↑' : r5[r5.length - 1] < r5[0] ? '↓' : '→') : '—';
  const modeMap = h.reduce((acc, r) => { acc[r.mode] = (acc[r.mode] || 0) + 1; return acc; }, {});
  const favMode = Object.entries(modeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const totalSec = h.reduce((s, r) => s + (r.duration || 30), 0);
  const achCount = Object.keys(S.achievements).length;

  const cards = [
    { v: n,               l: 'Tests' },
    { v: best,            l: 'Best WPM' },
    { v: avgW,            l: 'Avg WPM' },
    { v: avgA + '%',      l: 'Avg Accuracy' },
    { v: currentLevel(),  l: 'Level' },
    { v: S.bestWpm,       l: 'Personal Best' },
    { v: trend,           l: 'WPM Trend' },
    { v: fmtSec(totalSec),l: 'Time Typed' },
    { v: favMode,         l: 'Fav Mode' },
    { v: achCount,        l: 'Achievements' },
  ];

  D.statCards.innerHTML = cards.map(c =>
    `<div class="stcard"><span class="stv">${c.v}</span><span class="stl">${c.l}</span></div>`
  ).join('');

  setTimeout(() => {
    const data = h.slice(-30).map((r, i) => ({ t: i, wpm: r.wpm }));
    renderWPMChart(data, 'histChart');
  }, 80);
}

function fmtSec(s) {
  return s < 60 ? s + 's' : s < 3600 ? Math.round(s / 60) + 'm' : (s / 3600).toFixed(1) + 'h';
}

/* ═══════════════════════════════════════════════════════════
   §29  100-ACHIEVEMENT SYSTEM (Common / Rare / Epic / Legendary)
═══════════════════════════════════════════════════════════ */
const ACH_DEFS = [
  // ── Speed milestones ──────────────────────────────────────
  { id:'wpm_20',    ico:'🐌', name:'Snail Pace',        desc:'Reach 20 WPM',           tier:'common',    check: r => r.wpm >= 20 },
  { id:'wpm_30',    ico:'🐢', name:'Turtle',            desc:'Reach 30 WPM',           tier:'common',    check: r => r.wpm >= 30 },
  { id:'wpm_40',    ico:'🚶', name:'Casual Typer',      desc:'Reach 40 WPM',           tier:'common',    check: r => r.wpm >= 40 },
  { id:'wpm_50',    ico:'⚡', name:'Speed Demon',       desc:'Reach 50 WPM',           tier:'common',    check: r => r.wpm >= 50 },
  { id:'wpm_60',    ico:'🏃', name:'Jogger',            desc:'Reach 60 WPM',           tier:'common',    check: r => r.wpm >= 60 },
  { id:'wpm_75',    ico:'🏃', name:'Fast Mover',        desc:'Reach 75 WPM',           tier:'common',    check: r => r.wpm >= 75 },
  { id:'wpm_90',    ico:'💨', name:'Sprinter',          desc:'Reach 90 WPM',           tier:'rare',      check: r => r.wpm >= 90 },
  { id:'wpm_100',   ico:'🔥', name:'Century',           desc:'Reach 100 WPM',          tier:'rare',      check: r => r.wpm >= 100 },
  { id:'wpm_110',   ico:'🌊', name:'Wave Rider',        desc:'Reach 110 WPM',          tier:'rare',      check: r => r.wpm >= 110 },
  { id:'wpm_125',   ico:'💨', name:'Gale Force',        desc:'Reach 125 WPM',          tier:'rare',      check: r => r.wpm >= 125 },
  { id:'wpm_140',   ico:'🦅', name:'Eagle Wings',       desc:'Reach 140 WPM',          tier:'rare',      check: r => r.wpm >= 140 },
  { id:'wpm_150',   ico:'🌪', name:'Lightning',         desc:'Reach 150 WPM',          tier:'rare',      check: r => r.wpm >= 150 },
  { id:'wpm_160',   ico:'🎯', name:'Sharpshooter',      desc:'Reach 160 WPM',          tier:'epic',      check: r => r.wpm >= 160 },
  { id:'wpm_175',   ico:'☄',  name:'Comet',             desc:'Reach 175 WPM',          tier:'epic',      check: r => r.wpm >= 175 },
  { id:'wpm_190',   ico:'🚀', name:'Rocket Fingers',    desc:'Reach 190 WPM',          tier:'epic',      check: r => r.wpm >= 190 },
  { id:'wpm_200',   ico:'🚀', name:'Supersonic',        desc:'Reach 200 WPM',          tier:'epic',      check: r => r.wpm >= 200 },
  { id:'wpm_220',   ico:'🛸', name:'Transcendent',      desc:'Reach 220 WPM',          tier:'epic',      check: r => r.wpm >= 220 },
  { id:'wpm_250',   ico:'⚛',  name:'Quantum Typist',    desc:'Reach 250 WPM',          tier:'legendary', check: r => r.wpm >= 250 },
  { id:'wpm_300',   ico:'👑', name:'Typing God',        desc:'Reach 300 WPM',          tier:'legendary', check: r => r.wpm >= 300 },
  // ── Accuracy ─────────────────────────────────────────────
  { id:'acc_90',    ico:'🎖', name:'Decent Aim',        desc:'90%+ accuracy',          tier:'common',    check: r => r.acc >= 90 },
  { id:'acc_95',    ico:'🎯', name:'Marksman',          desc:'95%+ accuracy',          tier:'common',    check: r => r.acc >= 95 },
  { id:'acc_99',    ico:'✨', name:'Nearly Perfect',    desc:'99%+ accuracy',          tier:'rare',      check: r => r.acc >= 99 },
  { id:'acc_100',   ico:'💎', name:'Perfectionist',     desc:'100% accuracy',          tier:'rare',      check: r => r.acc === 100 },
  { id:'acc_100h',  ico:'🏆', name:'Flawless Hard',     desc:'100% accuracy on Hard',  tier:'epic',      check: r => r.acc === 100 && (r.diff === 'hard') },
  { id:'acc_100c',  ico:'💻', name:'Code Perfection',   desc:'100% accuracy on Code',  tier:'epic',      check: r => r.acc === 100 && r.mode === 'code' },
  // ── Speed + Accuracy combos ───────────────────────────────
  { id:'combo_75_95', ico:'🔥', name:'Blazing Accurate',  desc:'75+ WPM with 95%+ accuracy',     tier:'rare',   check: r => r.wpm >= 75 && r.acc >= 95 },
  { id:'combo_100_99',ico:'💎', name:'Diamond Run',        desc:'100+ WPM with 99%+ accuracy',    tier:'epic',   check: r => r.wpm >= 100 && r.acc >= 99 },
  { id:'combo_150_98',ico:'👑', name:'Royal Flush',        desc:'150+ WPM with 98%+ accuracy',    tier:'legendary',check: r => r.wpm >= 150 && r.acc >= 98 },
  // ── Streaks ───────────────────────────────────────────────
  { id:'str_10',    ico:'✅', name:'On a Roll',          desc:'10+ char streak',        tier:'common',    check: r => r.streak >= 10 },
  { id:'str_25',    ico:'🔗', name:'Chain',              desc:'25+ char streak',        tier:'common',    check: r => r.streak >= 25 },
  { id:'str_50',    ico:'⛓',  name:'Unbreakable',        desc:'50+ char streak',        tier:'common',    check: r => r.streak >= 50 },
  { id:'str_100',   ico:'🧲', name:'Magnetic',           desc:'100+ char streak',       tier:'rare',      check: r => r.streak >= 100 },
  { id:'str_150',   ico:'🌟', name:'Star Power',         desc:'150+ char streak',       tier:'rare',      check: r => r.streak >= 150 },
  { id:'str_200',   ico:'∞',  name:'Infinite',           desc:'200+ char streak',       tier:'epic',      check: r => r.streak >= 200 },
  { id:'str_300',   ico:'🔮', name:'Untouchable',        desc:'300+ char streak',       tier:'legendary', check: r => r.streak >= 300 },
  // ── Test counts ───────────────────────────────────────────
  { id:'t1',        ico:'🎯', name:'First Blood',        desc:'Complete 1 test',        tier:'common',    check: (_, h) => h.length >= 1 },
  { id:'t5',        ico:'🖊',  name:'Warmed Up',          desc:'Complete 5 tests',       tier:'common',    check: (_, h) => h.length >= 5 },
  { id:'t10',       ico:'📝', name:'Regular',            desc:'Complete 10 tests',      tier:'common',    check: (_, h) => h.length >= 10 },
  { id:'t25',       ico:'📚', name:'Bookworm',           desc:'Complete 25 tests',      tier:'common',    check: (_, h) => h.length >= 25 },
  { id:'t50',       ico:'🏋', name:'Dedicated',          desc:'Complete 50 tests',      tier:'common',    check: (_, h) => h.length >= 50 },
  { id:'t100',      ico:'🎖', name:'Veteran',            desc:'Complete 100 tests',     tier:'rare',      check: (_, h) => h.length >= 100 },
  { id:'t250',      ico:'🏅', name:'Committed',          desc:'Complete 250 tests',     tier:'rare',      check: (_, h) => h.length >= 250 },
  { id:'t500',      ico:'🌟', name:'Legend',             desc:'Complete 500 tests',     tier:'epic',      check: (_, h) => h.length >= 500 },
  { id:'t1000',     ico:'👑', name:'Immortal',           desc:'Complete 1000 tests',    tier:'legendary', check: (_, h) => h.length >= 1000 },
  // ── Levels ────────────────────────────────────────────────
  { id:'lvl5',      ico:'🎮', name:'Getting Started',    desc:'Reach level 5',          tier:'common',    check: () => currentLevel() >= 5 },
  { id:'lvl10',     ico:'🥉', name:'Bronze Typist',      desc:'Reach level 10',         tier:'common',    check: () => currentLevel() >= 10 },
  { id:'lvl20',     ico:'🥈', name:'Silver Typist',      desc:'Reach level 20',         tier:'common',    check: () => currentLevel() >= 20 },
  { id:'lvl25',     ico:'🥇', name:'Gold Typist',        desc:'Reach level 25',         tier:'rare',      check: () => currentLevel() >= 25 },
  { id:'lvl40',     ico:'💠', name:'Diamond Typist',     desc:'Reach level 40',         tier:'rare',      check: () => currentLevel() >= 40 },
  { id:'lvl50',     ico:'🏆', name:'Half Century',       desc:'Reach level 50',         tier:'rare',      check: () => currentLevel() >= 50 },
  { id:'lvl75',     ico:'🌟', name:'Elite Typist',       desc:'Reach level 75',         tier:'epic',      check: () => currentLevel() >= 75 },
  { id:'lvl90',     ico:'🚀', name:'Grandmaster',        desc:'Reach level 90',         tier:'epic',      check: () => currentLevel() >= 90 },
  { id:'lvl100',    ico:'👑', name:'Grand Master',       desc:'Reach MAX level 100!',   tier:'legendary', check: () => currentLevel() >= 100 },
  // ── Modes ─────────────────────────────────────────────────
  { id:'code',      ico:'🐒', name:'Code Monkey',        desc:'Complete a Code test',   tier:'common',    check: r => r.mode === 'code' },
  { id:'punct',     ico:'❗', name:'Punctuator',         desc:'Complete Punctuation',   tier:'common',    check: r => r.mode === 'punctuation' },
  { id:'nums',      ico:'🔢', name:'Numerist',           desc:'Complete Numbers mode',  tier:'common',    check: r => r.mode === 'numbers' },
  { id:'sent',      ico:'📄', name:'Storyteller',        desc:'Complete Sentences mode',tier:'common',    check: r => r.mode === 'sentences' },
  { id:'custom',    ico:'✏',  name:'Custom Writer',      desc:'Complete Custom mode',   tier:'common',    check: r => r.mode === 'custom' },
  { id:'all_modes', ico:'🎭', name:'Mode Master',        desc:'Complete all 6 modes',   tier:'epic',      check: (r, h) => {
    const modes = new Set(h.map(x => x.mode));
    return ['words','sentences','code','punctuation','numbers','custom'].every(m => modes.has(m));
  }},
  // ── Difficulty ───────────────────────────────────────────
  { id:'easy_win',  ico:'😊', name:'Easy Rider',         desc:'Complete Easy test',     tier:'common',    check: r => r.diff === 'easy' },
  { id:'hard',      ico:'💀', name:'Hard Mode',          desc:'Complete Hard test',     tier:'common',    check: r => r.diff === 'hard' },
  { id:'adaptive',  ico:'🧠', name:'Self-Aware',         desc:'Complete Adaptive mode', tier:'common',    check: r => r._adaptive === true },
  { id:'hard10',    ico:'💀', name:'Glutton for Pain',   desc:'Complete 10 Hard tests', tier:'rare',      check: (_, h) => h.filter(x => x.diff==='hard').length >= 10 },
  // ── Duration ─────────────────────────────────────────────
  { id:'dur_15',    ico:'⏱',  name:'Quick Draw',         desc:'Complete a 15s test',    tier:'common',    check: r => r.duration <= 15 },
  { id:'dur_120',   ico:'🏃', name:'Marathon',           desc:'Complete a 120s test',   tier:'rare',      check: r => r.duration >= 120 },
  { id:'marathon10',ico:'🏅', name:'Ultra Marathon',     desc:'Complete 10 × 120s tests',tier:'epic',     check: (_, h) => h.filter(x => x.duration >= 120).length >= 10 },
  // ── Zero errors ───────────────────────────────────────────
  { id:'no_err',    ico:'🎯', name:'Zero Errors',        desc:'Finish with 0 errors',   tier:'rare',      check: r => r.errors === 0 },
  { id:'no_err5',   ico:'✨', name:'Clean Sweep',        desc:'5 tests with 0 errors',  tier:'epic',      check: (_, h) => h.filter(x => x.errors === 0).length >= 5 },
  // ── Ghost & Daily ─────────────────────────────────────────
  { id:'ghost_beat',ico:'👻', name:'Ghost Slayer',       desc:'Beat your ghost record', tier:'rare',      check: r => r._ghost_beat === true },
  { id:'ghost5',    ico:'👻', name:'Serial Ghost Killer',desc:'Beat ghost 5 times',     tier:'epic',      check: (_, h) => h.filter(x=>x._ghost_beat).length >= 5 },
  { id:'daily1',    ico:'📅', name:'Daily Player',       desc:'Complete a daily challenge',tier:'common', check: r => r._daily === true },
  { id:'daily7',    ico:'🗓', name:'Week Warrior',       desc:'7-day challenge streak', tier:'rare',      check: () => getDailyStreak() >= 7 },
  { id:'daily30',   ico:'📆', name:'Monthly Devotee',    desc:'30-day challenge streak',tier:'epic',      check: () => getDailyStreak() >= 30 },
  // ── Time / Consistency ───────────────────────────────────
  { id:'cons_90',   ico:'📊', name:'Steady Hands',       desc:'90%+ consistency score', tier:'common',    check: r => r.consistency >= 90 },
  { id:'cons_95',   ico:'📈', name:'Metronome',          desc:'95%+ consistency score', tier:'rare',      check: r => r.consistency >= 95 },
  { id:'hour',      ico:'⏰', name:'Time Sink',          desc:'Type for 1 hour total',  tier:'rare',      check: (_, h) => h.reduce((s,x)=>s+(x.duration||0),0) >= 3600 },
  { id:'hour5',     ico:'⌛', name:'Obsessed',           desc:'Type for 5 hours total', tier:'epic',      check: (_, h) => h.reduce((s,x)=>s+(x.duration||0),0) >= 18000 },
  // ── Improvement ──────────────────────────────────────────
  { id:'pb_improve',ico:'📈', name:'Personal Best',      desc:'Beat your own best WPM', tier:'common',    check: r => r._new_pb === true },
  { id:'pb10',      ico:'🚀', name:'Rising Star',        desc:'Beat PB 10 times',       tier:'rare',      check: (_, h) => h.filter(x=>x._new_pb).length >= 10 },
  { id:'pb50',      ico:'🌟', name:'Relentless',         desc:'Beat PB 50 times',       tier:'epic',      check: (_, h) => h.filter(x=>x._new_pb).length >= 50 },
  // ── Community ────────────────────────────────────────────
  { id:'social_share',ico:'📢',name:'Braggart',          desc:'Share a score',          tier:'common',    check: r => r._shared === true },
  { id:'global_lb', ico:'🌐', name:'World Stage',        desc:'Post to global leaderboard',tier:'rare',  check: r => r._global_saved === true },
  { id:'top10',     ico:'🏆', name:'Elite Club',         desc:'Reach global top 10',    tier:'legendary', check: r => r._global_rank != null && r._global_rank <= 10 },
  // ── Fun / Easter eggs ────────────────────────────────────
  { id:'night_owl', ico:'🦉', name:'Night Owl',          desc:'Type after midnight',    tier:'common',    check: () => new Date().getHours() >= 0 && new Date().getHours() < 5 },
  { id:'early_bird',ico:'🌅', name:'Early Bird',         desc:'Type before 6 AM',       tier:'common',    check: () => new Date().getHours() >= 5 && new Date().getHours() < 7 },
  { id:'speed_50_60',ico:'⚡',name:'Minute Man',         desc:'60 WPM on 60s test',     tier:'common',    check: r => r.wpm >= 60 && r.duration === 60 },
  { id:'raw_200',   ico:'💥', name:'Raw Power',          desc:'200+ Raw WPM',           tier:'epic',      check: r => r.rawWpm >= 200 },
  { id:'rage_quit', ico:'😤', name:'Never Give Up',      desc:'Complete 5 tests in a row',tier:'common',  check: (_, h) => h.length >= 5 },
  { id:'long_run',  ico:'🛤',  name:'Long Haul',          desc:'Typed 100,000+ total chars',tier:'epic',  check: (_, h) => h.reduce((s,x)=>s+(x.correctChars||0),0) >= 100000 },
  { id:'perfectionist5',ico:'💎',name:'Pixel Perfect',   desc:'5 tests with 100% accuracy',tier:'epic',  check: (_, h) => h.filter(x => x.acc === 100).length >= 5 },
  { id:'wpm_noseat',ico:'🪑', name:'Standing Ovation',   desc:'80 WPM without errors',  tier:'rare',      check: r => r.wpm >= 80 && r.errors === 0 },
  { id:'halloween', ico:'🎃', name:'Halloween Spirit',   desc:'Type in October',        tier:'common',    check: () => new Date().getMonth() === 9 },
  { id:'new_year',  ico:'🎆', name:'New Year Typist',    desc:'Type on January 1st',    tier:'rare',      check: () => { const d = new Date(); return d.getMonth()===0 && d.getDate()===1; } },
  { id:'friday',    ico:'🎉', name:'TGIF Typist',        desc:'Type on a Friday',       tier:'common',    check: () => new Date().getDay() === 5 },
  { id:'wpm_2x',    ico:'🔋', name:'Double Duty',        desc:'Two tests above 100 WPM back to back',tier:'rare', check: (r, h) => r.wpm >= 100 && h.length >= 2 && h[h.length-2]?.wpm >= 100 },
];

function getDailyStreak() {
  try { return parseInt(localStorage.getItem('tt_daily_streak') || '0'); } catch { return 0; }
}

function checkAchievements(result) {
  const history = S.history;
  const newUnlocks = [];

  ACH_DEFS.forEach(a => {
    if (S.achievements[a.id]) return;
    try {
      if (a.check(result, history)) {
        S.achievements[a.id] = new Date().toISOString();
        newUnlocks.push(a);
      }
    } catch { /* ignore */ }
  });

  if (newUnlocks.length) {
    if (D.achBadge) D.achBadge.hidden = false;
    if (D.mmAchBadge) D.mmAchBadge.hidden = false;
    persistProfile();
    newUnlocks.forEach((a, i) => setTimeout(() => showAchToast(a), i * 2200));
  }
}

function showAchToast(ach) {
  if (!D.achToast) return;
  if (D.atIcon) D.atIcon.textContent = ach.ico;
  if (D.atName) D.atName.textContent = ach.name;
  D.achToast.hidden = false;
  D.achToast.classList.add('show');
  setTimeout(() => {
    D.achToast.classList.remove('show');
    setTimeout(() => { D.achToast.hidden = true; }, 400);
  }, 3800);
}

function renderAchievements() {
  if (!D.achGrid) return;
  const total    = ACH_DEFS.length;
  const unlocked = ACH_DEFS.filter(a => S.achievements[a.id]).length;

  if (D.achStats) {
    D.achStats.innerHTML = `
      <span class="ach-count">${unlocked}/${total}</span>
      <div class="ach-prog-wrap">
        <div style="font-size:.76rem;color:var(--text-m);margin-bottom:.4rem">${Math.round((unlocked / total) * 100)}% unlocked</div>
        <div class="ach-prog-track"><div class="ach-prog-fill" style="width:${(unlocked / total) * 100}%"></div></div>
      </div>`;
  }

  D.achGrid.innerHTML = '';
  ACH_DEFS.forEach(a => {
    const un    = !!S.achievements[a.id];
    const isNew = un && Date.now() - new Date(S.achievements[a.id]).getTime() < 600000;
    const card  = document.createElement('div');
    card.className = `acard ${un ? 'unlocked' : 'locked'} ${a.tier}`;
    card.innerHTML = `
      <div class="a-tier ${a.tier}">${isNew ? 'NEW' : a.tier.toUpperCase()}</div>
      <div class="a-ico">${a.ico}</div>
      <div class="a-name">${a.name}</div>
      <div class="a-desc">${a.desc}</div>`;
    D.achGrid.appendChild(card);
  });

  if (D.achBadge) D.achBadge.hidden = true;
}

/* ═══════════════════════════════════════════════════════════
   §30a  FRIENDS SYSTEM
   Free: add friends, view friends leaderboard.
   Pro:  private chat, ghost races with friends.
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   §30a  FRIENDS SYSTEM
   Login required. Friends stored in Firestore under /friends/{uid}.
   Chat stored locally with UID keys. Cannot add yourself.
   Free: add/remove friends, friends leaderboard.
   Pro:  private chat, ghost race friends.
═══════════════════════════════════════════════════════════ */
const LS_FRIENDS   = 'tt_friends_v2'; // keyed by UID now
const LS_CHAT_V2   = 'tt_chat_v2_';

function myUID() { return S.currentUser?.uid || null; }

function getFriends() {
  const uid = myUID();
  if (!uid) return [];
  try { return JSON.parse(localStorage.getItem(LS_FRIENDS + '_' + uid) || '[]'); } catch { return []; }
}

function saveFriends(list) {
  const uid = myUID();
  if (!uid) return;
  localStorage.setItem(LS_FRIENDS + '_' + uid, JSON.stringify(list));
}

function addFriend(uid, name, bestWpm) {
  const list = getFriends();
  if (list.find(f => f.uid === uid)) return 'already';
  if (uid === myUID()) return 'self';
  list.push({ uid, name, bestWpm: bestWpm || null, addedAt: new Date().toISOString() });
  saveFriends(list);
  return 'ok';
}

function removeFriend(uid) {
  saveFriends(getFriends().filter(f => f.uid !== uid));
}

// Chat: keyed by (myUID, friendUID)
function chatKey(friendUID) { return LS_CHAT_V2 + myUID() + '_' + friendUID; }
function getChat(friendUID) {
  try { return JSON.parse(localStorage.getItem(chatKey(friendUID)) || '[]'); } catch { return []; }
}
function sendMessage(friendUID, text) {
  const msgs = getChat(friendUID);
  const myName = S.currentUser?.displayName || 'You';
  msgs.push({ from: 'me', senderName: myName, text, ts: new Date().toISOString() });
  if (msgs.length > 500) msgs.splice(0, msgs.length - 500);
  localStorage.setItem(chatKey(friendUID), JSON.stringify(msgs));
}

// Search users by username on global leaderboard
async function searchUsers(query) {
  if (!S.fbDB || !query) return [];
  try {
    const snap = await S.fbDB.collection(FB_COL.global)
      .where('name', '>=', query)
      .where('name', '<=', query + '\uf8ff')
      .orderBy('name')
      .limit(10)
      .get();
    const seen = new Set();
    const results = [];
    snap.docs.forEach(d => {
      const data = d.data();
      if (!seen.has(data.uid) && data.uid) {
        seen.add(data.uid);
        results.push({ uid: data.uid, name: data.name, bestWpm: data.wpm || null });
      }
    });
    return results;
  } catch { return []; }
}

function renderFriendsModal() {
  if (!D.friendsBody) return;

  // Login gate
  if (!S.currentUser) {
    D.friendsBody.innerHTML = `
      <div style="text-align:center;padding:2rem">
        <div style="font-size:2.5rem;margin-bottom:.6rem">👥</div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:.5rem">Sign in to use Friends</div>
        <div style="font-size:.84rem;color:var(--text-m);line-height:1.7;margin-bottom:1.25rem">
          Friends require an account so we can identify you by UID.
        </div>
        <button class="ctrl-btn accent" id="friendsSignInBtn">Sign In / Sign Up</button>
      </div>`;
    D.friendsBody.querySelector('#friendsSignInBtn')?.addEventListener('click', () => {
      closeModal(D.friendsOv); openModal(D.authOv);
    });
    return;
  }

  const friends = getFriends();
  const isPro   = S.isPro;

  D.friendsBody.innerHTML = `
    <!-- Search + Add friend -->
    <div class="friends-search">
      <input type="text" id="friendSearchInput" class="si" placeholder="Search by username…" maxlength="32" style="flex:1" />
      <button class="ctrl-btn accent small" id="btnSearchFriend">Search</button>
    </div>
    <div id="friendSearchResults" style="margin-bottom:.5rem"></div>
    <div id="friendAddNote" style="font-size:.74rem;min-height:.8rem;margin-bottom:.4rem"></div>

    <!-- Tabs -->
    <div class="modal-tabs" style="margin-bottom:.75rem">
      <button class="tab active" id="ftabFriends">👥 Friends (${friends.length})</button>
      <button class="tab" id="ftabLB">🏆 LB</button>
      <button class="tab" id="ftabChat">${isPro ? '💬 Chat' : '🔒 Chat (Pro)'}</button>
    </div>
    <div id="friendsTabContent"></div>`;

  const tabs      = ['ftabFriends','ftabLB','ftabChat'];
  const renderTab = (id) => {
    tabs.forEach(t => document.getElementById(t)?.classList.toggle('active', t===id));
    const tc = document.getElementById('friendsTabContent');
    if (id === 'ftabFriends') renderFriendsList(tc);
    if (id === 'ftabLB')      renderFriendsLB(tc);
    if (id === 'ftabChat')    renderFriendsChat(tc);
  };
  tabs.forEach(id => document.getElementById(id)?.addEventListener('click', () => renderTab(id)));
  renderTab('ftabFriends');

  // Search
  const searchBtn = document.getElementById('btnSearchFriend');
  const searchInput = document.getElementById('friendSearchInput');
  const searchResults = document.getElementById('friendSearchResults');
  const addNote = document.getElementById('friendAddNote');

  const doSearch = async () => {
    const q = searchInput?.value.trim();
    if (!q) return;
    searchResults.innerHTML = '<div style="font-size:.78rem;color:var(--text-f)">Searching…</div>';
    const results = await searchUsers(q);
    if (!results.length) {
      searchResults.innerHTML = '<div style="font-size:.78rem;color:var(--text-m)">No users found. Try a different name.</div>';
      return;
    }
    searchResults.innerHTML = results.map(u => `
      <div class="friend-row" style="margin-top:.3rem">
        <div class="friend-avatar">${u.name[0]?.toUpperCase()}</div>
        <div class="friend-info">
          <div class="friend-name">${esc(u.name)}</div>
          <div class="friend-wpm">${u.bestWpm ? u.bestWpm + ' WPM' : 'No score'}</div>
        </div>
        <button class="ctrl-btn small accent" data-add-uid="${esc(u.uid)}" data-add-name="${esc(u.name)}" data-add-wpm="${u.bestWpm||0}">Add</button>
      </div>`).join('');

    searchResults.querySelectorAll('[data-add-uid]').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = addFriend(btn.dataset.addUid, btn.dataset.addName, parseInt(btn.dataset.addWpm)||null);
        if (res === 'self') { addNote.style.color='var(--warn)'; addNote.textContent='You cannot add yourself.'; }
        else if (res === 'already') { addNote.style.color='var(--warn)'; addNote.textContent='Already in your friends list.'; }
        else { addNote.style.color='var(--ok)'; addNote.textContent=`✓ ${btn.dataset.addName} added!`; }
        searchResults.innerHTML = '';
        renderFriendsModal();
      });
    });
  };
  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', e => { if (e.key==='Enter') doSearch(); });
}

function renderFriendsList(container) {
  const friends = getFriends();
  if (!friends.length) {
    container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:var(--text-m);font-size:.86rem">No friends yet. Search by username above!</div>';
    return;
  }
  container.innerHTML = `<div class="friends-list">${friends.map(f => `
    <div class="friend-row">
      <div class="friend-avatar">${(f.name||'?')[0].toUpperCase()}</div>
      <div class="friend-info">
        <div class="friend-name">${esc(f.name)}</div>
        <div class="friend-wpm">${f.bestWpm ? f.bestWpm + ' WPM best' : 'No score'}</div>
      </div>
      <div style="display:flex;gap:.4rem;margin-left:auto;align-items:center">
        <button class="ctrl-btn small" data-action="ghost" data-uid="${esc(f.uid)}" data-name="${esc(f.name)}" data-wpm="${f.bestWpm||0}" title="Race ghost">👻</button>
        <button class="ctrl-btn small" data-action="chat" data-uid="${esc(f.uid)}" data-name="${esc(f.name)}" title="Chat">💬</button>
        <button class="ctrl-btn small danger" data-action="remove" data-uid="${esc(f.uid)}" title="Remove">✕</button>
      </div>
    </div>`).join('')}</div>`;

  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid  = btn.dataset.uid;
      const name = btn.dataset.name;
      const action = btn.dataset.action;
      if (action === 'remove') {
        if (confirm(`Remove ${name} from friends?`)) { removeFriend(uid); renderFriendsModal(); }
      } else if (action === 'ghost') {
        const wpm = parseInt(btn.dataset.wpm || '0');
        if (!S.isPro) { renderProModal(); openModal(D.proOv); return; }
        if (!wpm) { showToast(`${name} has no WPM recorded yet`); return; }
        S.ghostCustomWpm = wpm;
        showToast(`👻 Racing ${name}'s best (${wpm} WPM)`);
        closeModal(D.friendsOv);
        if (D.ghostToggle && !D.ghostToggle.checked) { D.ghostToggle.checked = true; S.ghostEnabled = true; }
      } else if (action === 'chat') {
        if (!S.isPro) { renderProModal(); openModal(D.proOv); return; }
        const tc = document.getElementById('friendsTabContent');
        // Switch to chat tab
        document.querySelectorAll('#ftabFriends,#ftabLB,#ftabChat').forEach(t => t.classList.remove('active'));
        document.getElementById('ftabChat')?.classList.add('active');
        renderFriendsChat(tc, uid);
      }
    });
  });
}

function renderFriendsLB(container) {
  const friends = getFriends();
  if (!friends.length) {
    container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:var(--text-m);font-size:.86rem">Add friends to see their scores here.</div>';
    return;
  }
  // Include myself in the leaderboard
  const myEntry = { uid: myUID(), name: S.currentUser?.displayName || 'You', bestWpm: getBestWPM(), isMe: true };
  const allEntries = [myEntry, ...friends.map(f => ({...f, isMe:false}))].filter(e => e.bestWpm > 0);
  allEntries.sort((a,b) => b.bestWpm - a.bestWpm);

  if (!allEntries.length) {
    container.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-m);font-size:.86rem">No WPM scores recorded yet.</div>';
    return;
  }
  const medals = ['🥇','🥈','🥉'];
  container.innerHTML = `<table class="lb-table"><thead><tr><th>#</th><th>Name</th><th>WPM</th></tr></thead><tbody>
    ${allEntries.map((f,i) => `
      <tr class="${f.isMe?'lb-me':''}">
        <td class="lb-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${medals[i]||i+1}</td>
        <td class="lb-name">${esc(f.name)}${f.isMe?' (you)':''}</td>
        <td class="lb-wpm">${f.bestWpm}</td>
      </tr>`).join('')}
  </tbody></table>`;
}

function renderFriendsChat(container, openFriendUID) {
  if (!S.isPro) {
    container.innerHTML = `
      <div style="text-align:center;padding:1.5rem">
        <div style="font-size:2.5rem;margin-bottom:.6rem">💬</div>
        <div style="font-weight:700;font-size:.95rem;margin-bottom:.4rem">Private Chat</div>
        <div style="font-size:.84rem;color:var(--text-m);line-height:1.7;margin-bottom:1rem">
          Chat privately with friends — requires <b>TalionType Pro</b>.
        </div>
        <button class="ctrl-btn accent" id="chatProBtn">⚡ Upgrade to Pro — $5</button>
      </div>`;
    document.getElementById('chatProBtn')?.addEventListener('click', () => {
      closeModal(D.friendsOv); renderProModal(); openModal(D.proOv);
    });
    return;
  }

  const friends = getFriends();
  if (!friends.length) {
    container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:var(--text-m);font-size:.86rem">Add friends first to chat with them!</div>';
    return;
  }

  let activeFriendUID = openFriendUID || friends[0].uid;
  const render = () => {
    const activeFriend = friends.find(f => f.uid === activeFriendUID) || friends[0];
    activeFriendUID = activeFriend.uid;
    const msgs = getChat(activeFriendUID);
    container.innerHTML = `
      <div style="display:flex;gap:.35rem;margin-bottom:.6rem;flex-wrap:wrap">
        ${friends.map(f=>`<button class="pill ${f.uid===activeFriendUID?'active':''}" data-chat-uid="${esc(f.uid)}">${esc(f.name)}</button>`).join('')}
      </div>
      <div id="chatMessages" style="height:180px;overflow-y:auto;background:var(--bg);border:1px solid var(--border-s);border-radius:10px;padding:.6rem .8rem;margin-bottom:.5rem;display:flex;flex-direction:column;gap:.4rem;font-size:.82rem">
        ${msgs.length ? msgs.map(m=>`
          <div style="display:flex;${m.from==='me'?'justify-content:flex-end':''};gap:.4rem;align-items:flex-end">
            <div style="max-width:78%;padding:.38rem .65rem;border-radius:12px;${m.from==='me'?'background:var(--acc-dim);color:var(--acc);border-bottom-right-radius:3px':'background:var(--bg-card);color:var(--text);border-bottom-left-radius:3px'}">
              <div style="font-size:.76rem;font-weight:600;margin-bottom:1px;opacity:.7">${m.from==='me'?'You':esc(activeFriend.name)}</div>
              ${esc(m.text)}
              <div style="font-size:.58rem;color:var(--text-f);margin-top:2px;text-align:right">${new Date(m.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
            </div>
          </div>`).join('') : '<div style="color:var(--text-f);text-align:center;padding:1rem">No messages yet. Say hello! 👋</div>'}
      </div>
      <div style="display:flex;gap:.4rem">
        <input type="text" id="chatMsgInput" class="si" placeholder="Message ${esc(activeFriend.name)}…" style="flex:1" maxlength="500" />
        <button class="ctrl-btn accent small" id="btnSendChat">Send</button>
      </div>`;

    const msgEl = container.querySelector('#chatMessages');
    if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;

    container.querySelectorAll('[data-chat-uid]').forEach(btn => {
      btn.addEventListener('click', () => { activeFriendUID = btn.dataset.chatUid; render(); });
    });
    const sendMsg = () => {
      const inp = container.querySelector('#chatMsgInput');
      const txt = inp?.value.trim();
      if (!txt) return;
      sendMessage(activeFriendUID, txt);
      if (inp) inp.value = '';
      render();
    };
    container.querySelector('#btnSendChat')?.addEventListener('click', sendMsg);
    container.querySelector('#chatMsgInput')?.addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
  };
  render();
}


/* ═══════════════════════════════════════════════════════════
   §30  DAILY CHALLENGE
═══════════════════════════════════════════════════════════ */
// Each entry: title, desc, mode, diff, duration, minLevel, maxLevel, check(result)
const DAILY_POOL = [
  // Beginner (lv 1-9)
  { title:'First Sprint',    desc:'Type 25+ WPM on a 15s Easy Words test',
    mode:'words',      diff:'easy',     duration:15,  minLevel:1,  maxLevel:9,
    check: r => r.wpm>=25  && r.mode==='words' && r.diff==='easy' && r.duration===15 },
  { title:'Easy Rider',      desc:'Finish a 30s Easy test with 80%+ accuracy',
    mode:'words',      diff:'easy',     duration:30,  minLevel:1,  maxLevel:14,
    check: r => r.acc>=80  && r.diff==='easy'  && r.duration===30 },
  { title:'Quick Warmup',    desc:'Type 30+ WPM on a 15s Easy Words test',
    mode:'words',      diff:'easy',     duration:15,  minLevel:3,  maxLevel:14,
    check: r => r.wpm>=30  && r.mode==='words' && r.diff==='easy' && r.duration===15 },
  // Intermediate (lv 10-34)
  { title:'Quick Draw',      desc:'Type 50+ WPM on a 15s Words test',
    mode:'words',      diff:'medium',   duration:15,  minLevel:10, maxLevel:34,
    check: r => r.wpm>=50  && r.mode==='words' && r.duration===15 },
  { title:'Error-Free Zone', desc:'Finish any 30s test with zero errors',
    mode:'words',      diff:'medium',   duration:30,  minLevel:10, maxLevel:39,
    check: r => r.errors===0 && r.duration>=30 },
  { title:'Sentence Master', desc:'Complete a 30s Sentences test with 90%+ accuracy',
    mode:'sentences',  diff:'medium',   duration:30,  minLevel:12, maxLevel:39,
    check: r => r.mode==='sentences' && r.acc>=90 && r.duration===30 },
  { title:'Number Cruncher', desc:'Complete a 30s Numbers mode with 80%+ accuracy',
    mode:'numbers',    diff:'medium',   duration:30,  minLevel:15, maxLevel:44,
    check: r => r.mode==='numbers' && r.acc>=80 && r.duration===30 },
  { title:'Punctuation Pro', desc:'Complete a 30s Punctuation mode with 85%+ accuracy',
    mode:'punctuation',diff:'medium',   duration:30,  minLevel:15, maxLevel:44,
    check: r => r.mode==='punctuation' && r.acc>=85 && r.duration===30 },
  { title:'Speed Sprint',    desc:'Hit 70+ WPM on a 30s Words/Medium test',
    mode:'words',      diff:'medium',   duration:30,  minLevel:18, maxLevel:44,
    check: r => r.wpm>=70  && r.mode==='words' && r.diff==='medium' && r.duration===30 },
  // Advanced (lv 30-64)
  { title:'Code Warrior',    desc:'Complete a 30s Code test with 85%+ accuracy',
    mode:'code',       diff:'medium',   duration:30,  minLevel:30, maxLevel:64,
    check: r => r.mode==='code' && r.acc>=85 && r.duration===30 },
  { title:'Hard Knocks',     desc:'Reach 60 WPM on a 30s Hard difficulty test',
    mode:'words',      diff:'hard',     duration:30,  minLevel:30, maxLevel:64,
    check: r => r.diff==='hard' && r.wpm>=60 && r.duration===30 },
  { title:'Streak Champion', desc:'Achieve a 75+ character streak in one test',
    mode:'words',      diff:'medium',   duration:30,  minLevel:30, maxLevel:64,
    check: r => r.streak>=75 },
  { title:'Speed Sprint Pro',desc:'Hit 80+ WPM on a 30s Words/Medium test',
    mode:'words',      diff:'medium',   duration:30,  minLevel:32, maxLevel:59,
    check: r => r.wpm>=80  && r.mode==='words' && r.diff==='medium' && r.duration===30 },
  { title:'Consistency King',desc:'Score 85%+ consistency on a 60s test',
    mode:'words',      diff:'medium',   duration:60,  minLevel:35, maxLevel:69,
    check: r => r.cons>=85 && r.duration>=60 },
  // Expert (lv 60-89)
  { title:'The Centurion',   desc:'Break 100 WPM on a 30s Hard test',
    mode:'words',      diff:'hard',     duration:30,  minLevel:60, maxLevel:89,
    check: r => r.wpm>=100 && r.diff==='hard' && r.duration===30 },
  { title:'Hard Sentences',  desc:'Complete a 60s Hard Sentences test with 90%+ accuracy',
    mode:'sentences',  diff:'hard',     duration:60,  minLevel:65, maxLevel:89,
    check: r => r.mode==='sentences' && r.acc>=90 && r.diff==='hard' && r.duration===60 },
  { title:'Zero Errors Hard',desc:'Finish a 30s Hard test with zero errors',
    mode:'words',      diff:'hard',     duration:30,  minLevel:65, maxLevel:89,
    check: r => r.errors===0 && r.diff==='hard' && r.duration===30 },
  // Master (lv 90+)
  { title:'Marathon Man',    desc:'Complete a 120s Hard test with 90%+ accuracy',
    mode:'words',      diff:'hard',     duration:120, minLevel:90, maxLevel:100,
    check: r => r.acc>=90 && r.duration>=120 && r.diff==='hard' },
  { title:'The Perfectionist',desc:'100% accuracy on a 60s Hard test',
    mode:'words',      diff:'hard',     duration:60,  minLevel:90, maxLevel:100,
    check: r => r.acc===100 && r.diff==='hard' && r.duration===60 },
  { title:'Speed God',       desc:'Break 150 WPM on any test',
    mode:'words',      diff:'hard',     duration:30,  minLevel:90, maxLevel:100,
    check: r => r.wpm>=150 },
  // Any level
  { title:'Adaptive Master', desc:'Complete any test in Adaptive difficulty mode',
    mode:'words',      diff:'adaptive', duration:30,  minLevel:20, maxLevel:100,
    check: r => r._adaptive===true },
];

function getDailyDef() {
  const now    = new Date();
  const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const done   = localStorage.getItem('tt_daily_' + dayKey) === 'done';
  const next   = new Date(now); next.setDate(next.getDate() + 1); next.setHours(0, 0, 0, 0);
  const hours  = Math.round((next - now) / 3_600_000);

  // Filter challenges appropriate for the user's level
  const lvl = currentLevel();
  const eligible = DAILY_POOL.filter(c => lvl >= c.minLevel && lvl <= c.maxLevel);
  const pool  = eligible.length ? eligible : DAILY_POOL;

  // Deterministic daily pick from the eligible pool using today's date seed
  const seed  = now.getDate() + now.getMonth() * 7 + now.getFullYear();
  const idx   = seed % pool.length;
  const def   = pool[idx];

  return { ...def, dayKey, done, hoursLeft: hours };
}

function initDailyChallenge() {
  const dc = getDailyDef();
  S.dailyChallenge = dc;
  if (!dc.done) {
    if (D.dailyBanner) D.dailyBanner.hidden = false;
    if (D.dbDesc)      D.dbDesc.textContent  = dc.desc;
    // BUG-FIX-2: Remove daily bonus reward — dbReward is hidden
    if (D.dbReward)    D.dbReward.hidden      = true;
    if (D.dailyBadge)   D.dailyBadge.hidden    = false;
    if (D.mmDailyBadge) D.mmDailyBadge.hidden  = false;
  }
}

function renderDailyModal() {
  if (!D.dailyBody) return;
  const dc  = getDailyDef();
  const lvl = currentLevel();
  D.dailyBody.innerHTML = `
    <div class="dc-card">
      <div class="dc-pre">Today's Challenge · Level ${lvl}</div>
      <div class="dc-title">${dc.title}</div>
      <div class="dc-desc">${dc.desc}</div>
      <div class="dc-meta" style="font-size:.72rem;color:var(--text-f);margin-top:.4rem">
        Mode: <b style="color:var(--text-m)">${dc.mode}</b> ·
        Diff: <b style="color:var(--text-m)">${dc.diff}</b> ·
        Duration: <b style="color:var(--text-m)">${dc.duration}s</b>
      </div>
      <div class="dc-expires">Resets in ~${dc.hoursLeft}h</div>
    </div>
    ${dc.done
      ? '<div class="dc-done">✓ Challenge completed today! Come back tomorrow.</div>'
      : '<button class="ctrl-btn accent" id="startDailyBtn" style="width:100%;justify-content:center">Start Challenge</button>'
    }`;
  document.getElementById('startDailyBtn')?.addEventListener('click', () => {
    closeModal(D.dailyOv);
    startDailyChallenge();
  });
}

function startDailyChallenge() {
  const dc = S.dailyChallenge;
  if (D.dailyBanner) D.dailyBanner.hidden = true;
  S.isDailyActive = true;
  // BUG-FIX-2: Use the challenge's specific mode/diff/duration instead of hardcoded values
  S.mode     = dc?.mode     || 'words';
  S.diff     = dc?.diff     || 'medium';
  S.duration = dc?.duration || 30;
  S.timeLeft = S.duration;
  syncPills();
  initTest(true);
  D.ghostInput?.focus();
}

function checkDailyCompletion(result) {
  const dc = S.dailyChallenge;
  if (!dc || dc.done) return;

  const passed = dc.check({ ...result, _adaptive: S.diff === 'adaptive' });
  if (!passed) { showToast('Daily not completed yet. Keep trying!'); return; }

  localStorage.setItem('tt_daily_' + dc.dayKey, 'done');

  // Update streak
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yk        = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
  const lastDay   = localStorage.getItem('tt_daily_last') || '';
  const streak    = lastDay === yk ? getDailyStreak() + 1 : 1;
  localStorage.setItem('tt_daily_streak', String(streak));
  localStorage.setItem('tt_daily_last',   dc.dayKey);

  showToast(`🎉 Daily complete! ${streak}-day streak!`);
  checkAchievements({ ...result, _daily: true });
}

/* ═══════════════════════════════════════════════════════════
   §31  SOCIAL SHARING
═══════════════════════════════════════════════════════════ */
function buildShareText(r) {
  r = r || S.lastResult;
  // BUG-11: guard against null result to prevent "undefined WPM" in share text
  if (!r || r.wpm == null) return 'Check out TalionType — free typing speed test!\n' + window.location.origin + window.location.pathname;
  return `I just typed ${r.wpm} WPM with ${r.acc}% accuracy on TalionType!\n`
       + `${r.errors === 0 ? '✨ Zero errors!\n' : ''}Mode: ${r.mode} / ${r.diff}\n\n`
       // BUG-18: use clean URL without fragments/query strings
       + `Challenge me → ${window.location.origin + window.location.pathname}`;
}

function openShareModal() {
  const r = S.lastResult; if (!r) return;
  if (D.shareCard) {
    D.shareCard.innerHTML = `
      <div style="font-size:2.5rem;font-weight:700;color:var(--acc)">${r.wpm} WPM</div>
      <div style="margin:.4rem 0;color:var(--text-m)">${r.acc}% accuracy · ${r.errors} errors</div>
      <div style="font-size:.75rem;color:var(--text-f)">${r.mode} / ${r.diff} · ${r.duration}s · TalionType by TalionLabs</div>`;
  }
  openModal(D.shareOv);
}

function doTwitterShare() {
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildShareText()), '_blank');
  gaEvent('share', { platform: 'twitter' });
}

function doCopyShare() {
  const text = buildShareText();
  // BUG-30: removed deprecated document.execCommand('copy') fallback
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied!')).catch(() => showToast('Could not copy'));
  } else {
    showToast('Clipboard not available in this browser');
  }
  gaEvent('share', { platform: 'copy' });
}

/* ═══════════════════════════════════════════════════════════
   §32  SOUND ENGINE
═══════════════════════════════════════════════════════════ */
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
function playSound(type) {
  if (!S.soundEnabled) return;
  if (type === 'e' && !S.errSnd) return; // Bug 15: separate error sound toggle
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'c') { osc.type = 'sine';   osc.frequency.value = 1047; gain.gain.value = 0.028; }
    else              { osc.type = 'square'; osc.frequency.value = 196;  gain.gain.value = 0.035; }
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
    osc.stop(ctx.currentTime + 0.07);
  } catch { /* ignore audio errors */ }
}

/* ═══════════════════════════════════════════════════════════
   §33  PRO / GUMROAD
═══════════════════════════════════════════════════════════ */
const PRO_FEATURES_DEF = [
  { ico:'👻', name:'Ghost Races',       sub:'Race your personal best in real time' },
  { ico:'📊', name:'Advanced Analytics',sub:'Full history, trends & session insights' },
  { ico:'🚫', name:'Ad-Free',           sub:'Clean distraction-free experience' },
  { ico:'📅', name:'Daily Bonuses',     sub:'Exclusive daily challenge rewards' },
  { ico:'🎨', name:'Custom Themes',     sub:'Color schemes & font options (coming soon)' },
  { ico:'⚡', name:'Priority Support',  sub:'Direct line to TalionLabs team' },
];

function loadPro() {
  S.isPro = localStorage.getItem('tt_pro') === 'true';
  if (S.isPro) {
    if (D.btnPro)   { D.btnPro.classList.add('active');   D.btnPro.title   = 'Pro unlocked ✓'; }
    if (D.mmBtnPro) { D.mmBtnPro.classList.add('active'); D.mmBtnPro.title = 'Pro unlocked ✓'; }
  }
  if (D.ghostToggleWrap) D.ghostToggleWrap.style.opacity = S.isPro ? '1' : '0.5';
}

function renderProModal() {
  if (!D.proFeaturesList) return;
  D.proFeaturesList.innerHTML = PRO_FEATURES_DEF.map(f => `
    <div class="pro-feat">
      <span class="pro-feat-ico">${f.ico}</span>
      <div class="pro-feat-txt">
        <span class="pro-feat-ttl">${f.name}</span>
        <span class="pro-feat-sub">${f.sub}</span>
      </div>
    </div>`).join('');

  // BUG-FIX-4: If already Pro, hide purchase section and show active badge
  const actionsEl = D.proOv?.querySelector('.pro-actions');
  const heroEl    = D.proOv?.querySelector('.pro-hero');
  if (S.isPro) {
    if (heroEl) heroEl.innerHTML = `
      <div style="font-size:2.5rem;margin-bottom:.5rem">⚡</div>
      <div style="font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--acc)">Pro Active</div>
      <div style="font-size:.86rem;color:var(--text-m);margin-top:.4rem">Thank you for supporting TalionType!</div>`;
    if (actionsEl) actionsEl.style.display = 'none';
  } else {
    if (heroEl) {
      heroEl.innerHTML = `
        <div class="pro-price">$5 <span class="pro-once">one-time · forever</span></div>
        <div class="pro-tagline">Unlock the full TalionType experience.</div>`;
    }
    if (actionsEl) actionsEl.style.display = '';
  }
}

function verifyProKey() {
  const key   = (D.proKeyInput?.value || '').trim().toUpperCase();
  // Pattern: TALION-XXXX-XXXX-XXXX  (replace with real Gumroad webhook validation)
  const valid = /^TALION-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)
             || key === 'TALION-DEMO-PRO-KEY'; // for testing

  if (valid) {
    localStorage.setItem('tt_pro', 'true');
    localStorage.setItem('tt_pro_key', key);
    S.isPro = true;
    if (D.btnPro)          D.btnPro.classList.add('active');
    if (D.ghostToggleWrap) D.ghostToggleWrap.style.opacity = '1';
    if (D.proVerifyNote)   { D.proVerifyNote.style.color = 'var(--ok)'; D.proVerifyNote.textContent = '✓ Pro unlocked! Thank you for supporting TalionType.'; }
    showToast('⚡ Pro unlocked!');
    // BUG-FIX-4: Re-render modal to hide buy/verify section now that Pro is active
    setTimeout(() => renderProModal(), 800);
  } else {
    if (D.proVerifyNote) { D.proVerifyNote.style.color = 'var(--err)'; D.proVerifyNote.textContent = 'Invalid key. Purchase at Gumroad to get yours.'; }
  }
}

/* ═══════════════════════════════════════════════════════════
   §34  SETTINGS
═══════════════════════════════════════════════════════════ */
const LS_SET = 'tt_settings';

function readSettings() {
  S.fontSize     = parseInt(D.fsSlider?.value) || 20;
  S.smoothCaret  = D.optSmooth?.checked  ?? true;
  S.soundEnabled = D.optSound?.checked   ?? false;
  S.showLiveWpm  = D.optLiveWpm?.checked ?? true;
  S.usePunct     = D.optPunct?.checked   ?? false;
  S.useNums      = D.optNums?.checked    ?? false;
  S.customText   = D.customTxt?.value    || '';

  // Word count: blank = 750 (default), must be 1-2000
  const wcRaw = D.wordCount?.value.trim();
  if (wcRaw === '' || wcRaw == null) {
    S.customCount = 750;
    if (D.wordCount) D.wordCount.style.borderColor = '';
  } else {
    const wcNum = parseInt(wcRaw);
    if (isNaN(wcNum) || wcNum < 1 || wcNum > 2000) {
      showToast('⚠ Enter a word count between 1 and 2000.');
      if (D.wordCount) D.wordCount.style.borderColor = 'var(--err)';
      return; // don't apply bad value
    }
    S.customCount = wcNum;
    if (D.wordCount) D.wordCount.style.borderColor = '';
  }
  applySettings();
}

function applySettings() {
  if (D.wordsWrap) D.wordsWrap.style.fontSize = S.fontSize + 'px';
  if (D.arena)     D.arena.classList.toggle('smooth-caret', S.smoothCaret);
  if (D.arena)     D.arena.classList.toggle('no-blink', !!S.noBlink);
  // Bug 15 - Progress bar
  const prog = document.getElementById('arenaProg');
  if (prog) prog.style.display = S.showProgress === false ? 'none' : '';
  // Bug 15 - High contrast
  document.documentElement.setAttribute('data-hicon', S.hiCon ? 'true' : 'false');
  // Bug 15 - Reduced motion
  document.documentElement.setAttribute('data-reduced', S.reducedMotion ? 'true' : 'false');
  if (D.ghostToggleWrap) D.ghostToggleWrap.style.opacity = S.isPro ? '1' : '0.5';
  // Bug 7: update mode flags
  updateModeFlags();
  localStorage.setItem(LS_SET, JSON.stringify({
    fontSize: S.fontSize, smoothCaret: S.smoothCaret, soundEnabled: S.soundEnabled,
    showLiveWpm: S.showLiveWpm, usePunct: S.usePunct, useNums: S.useNums,
    customCount: S.customCount, noBlink: S.noBlink, showProgress: S.showProgress,
    errSnd: S.errSnd, hiCon: S.hiCon, reducedMotion: S.reducedMotion,
  }));
}

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_SET) || '{}');
    const ap = (k, el, sk, isBool) => {
      if (s[k] !== undefined) {
        S[sk || k] = s[k];
        if (el) isBool ? (el.checked = s[k]) : (el.value = s[k]);
      }
    };
    ap('fontSize',     D.fsSlider,          'fontSize');
    ap('smoothCaret',  D.optSmooth,         'smoothCaret',   true);
    ap('soundEnabled', D.optSound,          'soundEnabled',  true);
    ap('showLiveWpm',  D.optLiveWpm,        'showLiveWpm',   true);
    ap('usePunct',     D.optPunct,          'usePunct',      true);
    ap('useNums',      D.optNums,           'useNums',       true);
    // Word count: only restore if not default (750)
    if (s['customCount'] !== undefined && s['customCount'] !== 750) {
      S.customCount = s['customCount'];
      if (D.wordCount) D.wordCount.value = s['customCount'];
    }
    ap('noBlink',      D.optBlink,          'noBlink',       true);
    ap('showProgress', D.optProgress,       'showProgress',  true);
    ap('errSnd',       D.optErrSnd,         'errSnd',        true);
    ap('hiCon',        D.optHiCon,          'hiCon',         true);
    ap('reducedMotion',D.optReducedMotion,  'reducedMotion', true);
    if (D.fsVal) D.fsVal.textContent = (S.fontSize || 20) + 'px';
  } catch {}

  // Restore Firebase config
  try {
    const fb = localStorage.getItem('tt_fb_cfg');
    if (fb) initFirebase(JSON.parse(fb));
  } catch {}
}

/* ═══════════════════════════════════════════════════════════
   §35  THEME
═══════════════════════════════════════════════════════════ */
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('tt_theme', next);
}

function loadTheme() {
  const t = localStorage.getItem('tt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
}

/* ═══════════════════════════════════════════════════════════
   §36  EVENT BINDINGS & BOOT
═══════════════════════════════════════════════════════════ */

// ── Modal helpers ──────────────────────────────────────────
function openModal(el)  { if (!el) return; el.hidden = false; D.backdrop?.classList.add('active'); }
function closeModal(el) {
  if (!el) return; el.hidden = true;
  const anyOpen = document.querySelector('.modal-ov:not([hidden])');
  if (!anyOpen && !D.settingsPanel?.classList.contains('open')) {
    D.backdrop?.classList.remove('active');
  }
}
function openSettings()  {
  const p = D.settingsPanel;
  if (!p) return;
  p.hidden = false;
  // rAF ensures the browser paints hidden=false before we add .open for the CSS transition
  requestAnimationFrame(() => p.classList.add('open'));
  D.backdrop?.classList.add('active');
}
function closeSettings() {
  const p = D.settingsPanel;
  if (!p) return;
  p.classList.remove('open');
  // BUG-16: defer hidden until after the CSS transition completes (~300ms)
  // so the slide-out animation is visible instead of the panel blinking away
  setTimeout(() => { p.hidden = true; }, 300);
  if (!document.querySelector('.modal-ov:not([hidden])')) D.backdrop?.classList.remove('active');
}

function showToast(msg, ms = 3000) {
  if (!D.toast) return;
  D.toast.textContent = msg;
  D.toast.classList.add('show');
  setTimeout(() => D.toast.classList.remove('show'), ms);
}

function esc(str = '') {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function gaEvent(name, params = {}) {
  if (typeof window.gtag === 'function' && window.GA_ENABLED) window.gtag('event', name, params);
}

// ── Sync pill active states ────────────────────────────────
function syncPills() {
  D.modePills.forEach(p => p.classList.toggle('active', p.dataset.mode === S.mode));
  D.diffPills.forEach(p => p.classList.toggle('active', p.dataset.diff === S.diff));
  D.timePills.forEach(p => p.classList.toggle('active', +p.dataset.time === S.duration));
}

// ── Save score flow ────────────────────────────────────────
const LS_GLOBAL_NAME = 'tt_global_name'; // locked username for global LB

function getGlobalName() {
  try { return localStorage.getItem(LS_GLOBAL_NAME) || null; } catch { return null; }
}
function setGlobalName(name) {
  localStorage.setItem(LS_GLOBAL_NAME, name);
}

function openSaveModal() {
  const r = S.lastResult; if (!r) return;
  const chk = AC.check(r.wpm, r.acc);
  if (!chk.ok) { showToast('⚠ Score flagged: ' + chk.why); return; }

  if (D.saveSumEl) D.saveSumEl.innerHTML = `
    <div style="color:var(--acc);font-size:1.8rem;font-weight:700">${r.wpm} <span style="font-size:1rem">WPM</span></div>
    <div>${r.acc}% accuracy · ${r.errors} errors · ${r.mode}/${r.diff}</div>`;

  // Pre-fill local name
  if (D.saveNameLocal) D.saveNameLocal.value = S.currentUser?.displayName || '';

  // Render global section
  renderSaveGlobalSection();

  if (D.saveNote) D.saveNote.textContent = '';
  openModal(D.saveOv);
}

function renderSaveGlobalSection() {
  if (!D.saveGlobalInner) return;
  if (!S.fbReady) {
    D.saveGlobalInner.innerHTML = '<p style="font-size:.78rem;color:var(--text-m)">Connect Firebase to post globally.</p>';
    return;
  }
  if (!S.currentUser) {
    D.saveGlobalInner.innerHTML = '<p style="font-size:.78rem;color:var(--text-m)">Sign in to post to the global leaderboard.</p>';
    return;
  }

  const lockedName = getGlobalName();
  if (lockedName) {
    D.saveGlobalInner.innerHTML = `
      <p style="font-size:.78rem;color:var(--text-m)">Posting as <b style="color:var(--acc)">${esc(lockedName)}</b> (username locked)</p>
      <button class="ctrl-btn accent small" id="btnConfSaveGlobal">Post to Global LB</button>`;
    D.saveGlobalInner.querySelector('#btnConfSaveGlobal')?.addEventListener('click', () => confirmSaveGlobal(lockedName));
  } else {
    D.saveGlobalInner.innerHTML = `
      <p style="font-size:.78rem;color:var(--text-m)">Choose a <b>unique username</b> — this cannot be changed later.</p>
      <input type="text" id="saveNameGlobal" class="si" placeholder="Unique username…" maxlength="24" value="${esc(S.currentUser.displayName || '')}" />
      <button class="ctrl-btn accent small" id="btnConfSaveGlobal">Set Username & Post</button>
      <p id="saveGlobalNote" style="font-size:.72rem;min-height:.8rem"></p>`;
    D.saveGlobalInner.querySelector('#btnConfSaveGlobal')?.addEventListener('click', async () => {
      const nameEl = D.saveGlobalInner.querySelector('#saveNameGlobal');
      const noteEl = D.saveGlobalInner.querySelector('#saveGlobalNote');
      const name   = nameEl?.value.trim();
      if (!name) { if (noteEl) { noteEl.style.color='var(--err)'; noteEl.textContent='Enter a username.'; } return; }
      if (noteEl) { noteEl.style.color='var(--text-f)'; noteEl.textContent='Checking availability…'; }
      const available = await isNameAvailable(name);
      if (!available) { if (noteEl) { noteEl.style.color='var(--err)'; noteEl.textContent='⚠ That username is taken. Choose another.'; } return; }
      setGlobalName(name);
      await confirmSaveGlobal(name);
    });
  }
}

async function confirmSaveLocal() {
  const name = D.saveNameLocal?.value.trim() || 'Anonymous';
  const r = S.lastResult; if (!r) return;
  saveLocalScore(name, r);
  showToast('✓ Score saved locally!');
  closeModal(D.saveOv);
}

async function confirmSaveGlobal(name) {
  const r = S.lastResult; if (!r) return;
  if (D.saveNote) { D.saveNote.style.color='var(--text-f)'; D.saveNote.textContent='Posting…'; }
  await saveGlobalScore(name, r);
  closeModal(D.saveOv);
}

// legacy compat — keep for any old references
async function confirmSave() { confirmSaveLocal(); }

// ── Debounce utility ───────────────────────────────────────
function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Main event binding ─────────────────────────────────────
function bindEvents() {
  // Typing
  D.ghostInput?.addEventListener('input',   handleInput);
  D.ghostInput?.addEventListener('keydown', handleKeyDown);
  D.arena?.addEventListener('click', () => { if (!S.finished) D.ghostInput?.focus(); });

  // Controls
  D.btnReset?.addEventListener('click',  () => initTest());
  D.btnPause?.addEventListener('click',  togglePause);
  D.btnResume?.addEventListener('click', togglePause);

  // Results
  D.btnAgain?.addEventListener('click',    () => initTest());
  D.btnSaveScore?.addEventListener('click', openSaveModal);
  D.btnShareRes?.addEventListener('click',  openShareModal);
  D.btnSetGhost?.addEventListener('click',  () => {
    if (!S.lastResult) { showToast('Complete a test first.'); return; }
    if (!S.isPro)      { openModal(D.proOv); return; }
    const r = S.lastResult;
    saveGhostRecord(r.wpm, r.acc);
    if (D.btnSetGhost) D.btnSetGhost.textContent = '✓ Ghost Saved!';
  });

  // Mode pills
  D.modePills.forEach(p => p.addEventListener('click', () => {
    S.mode = p.dataset.mode; syncPills();
    gaEvent('mode_change', { mode: S.mode });
    initTest();
  }));

  // Difficulty pills
  D.diffPills.forEach(p => p.addEventListener('click', () => {
    S.diff = p.dataset.diff; syncPills();
    initTest();
  }));

  // Duration pills
  D.timePills.forEach(p => p.addEventListener('click', () => {
    S.duration = parseInt(p.dataset.time); S.timeLeft = S.duration; syncPills();
    initTest();
  }));

  // Ghost toggle
  D.ghostToggle?.addEventListener('change', () => {
    if (!S.isPro) { D.ghostToggle.checked = false; openModal(D.proOv); return; }
    S.ghostEnabled = D.ghostToggle.checked;
    if (S.ghostEnabled) loadGhostRecord();
  });


  // ── Mobile hamburger menu ──────────────────────────────────
  function closeMobileMenu() {
    if (!D.mobileMenu || !D.hamburgerBtn) return;
    D.mobileMenu.classList.remove('open');
    D.hamburgerBtn.classList.remove('open');
    D.hamburgerBtn.setAttribute('aria-expanded', 'false');
    D.mobileMenu.setAttribute('aria-hidden', 'true');
  }
  function openMobileMenu() {
    if (!D.mobileMenu || !D.hamburgerBtn) return;
    D.mobileMenu.classList.add('open');
    D.hamburgerBtn.classList.add('open');
    D.hamburgerBtn.setAttribute('aria-expanded', 'true');
    D.mobileMenu.setAttribute('aria-hidden', 'false');
  }
  D.hamburgerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    D.mobileMenu?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (D.mobileMenu?.classList.contains('open') &&
        !D.mobileMenu.contains(e.target) &&
        e.target !== D.hamburgerBtn) closeMobileMenu();
  });

  // Wire all mobile menu buttons (mirror desktop equivalents)
  D.mmDaily?.addEventListener('click', () => { closeMobileMenu(); openModal(D.dailyOv); renderDailyModal(); });
  D.mmGhost?.addEventListener('click', () => { closeMobileMenu(); openModal(D.ghostOv); renderGhostModal(); });
  D.mmAch?.addEventListener('click',   () => { closeMobileMenu(); openModal(D.achOv);   renderAchievements(); });
  D.mmLB?.addEventListener('click',    () => { closeMobileMenu(); openModal(D.lbOv);    renderLB(S.activeTab); });
  D.mmStats?.addEventListener('click', () => { closeMobileMenu(); openModal(D.statsOv); renderStats(); });
  D.mmFriends?.addEventListener('click',() => { closeMobileMenu(); openModal(D.friendsOv); renderFriendsModal(); });
  D.mmSettings?.addEventListener('click',()=> { closeMobileMenu(); openSettings(); });
  D.mmAuthBtn?.addEventListener('click', ()=> { closeMobileMenu(); if (S.currentUser) openProfileDropdown(); else openModal(D.authOv); });
  D.mmBtnPro?.addEventListener('click',  ()=> { closeMobileMenu(); renderProModal(); openModal(D.proOv); });
  D.mmThemeToggle?.addEventListener('click', ()=> toggleTheme());

  // Sync badges to mobile menu
  const syncMobileBadges = () => {
    if (D.mmDailyBadge) D.mmDailyBadge.hidden = D.dailyBadge?.hidden ?? true;
    if (D.mmAchBadge)   D.mmAchBadge.hidden   = D.achBadge?.hidden   ?? true;
    if (D.mmAuthBtnTxt && D.authBtnTxt) D.mmAuthBtnTxt.textContent = D.authBtnTxt.textContent;
  };
  // Run immediately and after any modal close
  syncMobileBadges();
  document.addEventListener('modalclose', syncMobileBadges);

  // Header nav
  D.btnSet?.addEventListener('click',  openSettings);
  D.closeSet?.addEventListener('click', closeSettings);
  D.themeToggle?.addEventListener('click', toggleTheme);

  D.btnLB?.addEventListener('click', () => {
    openModal(D.lbOv); renderLB(S.activeTab);
  });
  D.closeLB?.addEventListener('click', () => closeModal(D.lbOv));

  D.btnStats?.addEventListener('click', () => { openModal(D.statsOv); renderStats(); });
  D.closeStats?.addEventListener('click', () => closeModal(D.statsOv));

  D.btnAch?.addEventListener('click', () => { openModal(D.achOv); renderAchievements(); });
  D.closeAch?.addEventListener('click', () => closeModal(D.achOv));

  // Bug 16: friendsOv properly wired
  D.btnFriends?.addEventListener('click', () => { openModal(D.friendsOv); renderFriendsModal(); });
  D.closeFriends?.addEventListener('click', () => closeModal(D.friendsOv));

  D.btnDaily?.addEventListener('click', () => { openModal(D.dailyOv); renderDailyModal(); });
  D.closeDaily?.addEventListener('click', () => closeModal(D.dailyOv));
  D.btnStartDaily?.addEventListener('click', () => { D.dailyBanner.hidden = true; startDailyChallenge(); });
  D.closeDB?.addEventListener('click', () => { if (D.dailyBanner) D.dailyBanner.hidden = true; });

  D.btnGhost?.addEventListener('click', () => { openModal(D.ghostOv); renderGhostModal(); });
  D.closeGhost?.addEventListener('click', () => closeModal(D.ghostOv));

  D.btnPro?.addEventListener('click', () => { renderProModal(); openModal(D.proOv); });
  D.closePro?.addEventListener('click', () => closeModal(D.proOv));
  D.btnVerifyPro?.addEventListener('click', verifyProKey);

  // BUG-08: Feedback modal was entirely unwired — wire it now
  D.closeFeedback?.addEventListener('click', () => closeModal(D.feedbackOv));
  D.btnSendFeedback?.addEventListener('click', () => {
    const txt = D.feedbackTxt?.value?.trim() || '';
    const body = txt ? encodeURIComponent(txt) : '';
    window.open(`mailto:support@talionlabs.com${body ? '?body=' + body : ''}`, '_blank');
  });

  // Auth
  D.authBtn?.addEventListener('click', () => { if (S.currentUser) openProfileDropdown(); else openModal(D.authOv); });
  D.closeAuth?.addEventListener('click', () => closeModal(D.authOv));
  D.btnGoogle?.addEventListener('click',  doGoogleSignIn);
  D.btnEmailIn?.addEventListener('click', doEmailSignIn);
  D.btnEmailUp?.addEventListener('click', doEmailSignUp);

  // Bug 13: Wire auth tabs
  D.tabSignIn?.addEventListener('click', () => {
    D.tabSignIn?.classList.add('active'); D.tabSignUp?.classList.remove('active');
    if (D.authName)  D.authName.style.display  = 'none';
    if (D.btnEmailIn) D.btnEmailIn.style.display = '';
    if (D.btnEmailUp) D.btnEmailUp.style.display = 'none';
    if (D.btnForgotPw) D.btnForgotPw.style.display = '';
    if (D.authErr) D.authErr.textContent = '';
  });
  D.tabSignUp?.addEventListener('click', () => {
    D.tabSignUp?.classList.add('active'); D.tabSignIn?.classList.remove('active');
    if (D.authName)  D.authName.style.display  = '';
    if (D.btnEmailIn) D.btnEmailIn.style.display = 'none';
    if (D.btnEmailUp) D.btnEmailUp.style.display = '';
    if (D.btnForgotPw) D.btnForgotPw.style.display = 'none';
    if (D.authErr) D.authErr.textContent = '';
  });

  // Bug 14: Wire forgot password
  D.btnForgotPw?.addEventListener('click', async () => {
    const email = D.authEmail?.value.trim();
    if (!email) { if (D.authErr) D.authErr.textContent = 'Enter your email first.'; return; }
    if (!S.fbAuth) { if (D.authErr) D.authErr.textContent = 'Sign-in not available.'; return; }
    try {
      await S.fbAuth.sendPasswordResetEmail(email);
      if (D.authErr) { D.authErr.style.color = 'var(--ok)'; D.authErr.textContent = 'Reset email sent! Check your inbox.'; }
    } catch (e) { if (D.authErr) { D.authErr.style.color = 'var(--err)'; D.authErr.textContent = e.message; } }
  });

  // Leaderboard tabs
  D.lbTabs.forEach(tab => tab.addEventListener('click', () => {
    D.lbTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderLB(tab.dataset.lbt);
  }));
  D.btnLBFilter?.addEventListener('click', () => renderLB(S.activeTab));

  // Save score
  D.closeSave?.addEventListener('click',    () => closeModal(D.saveOv));
  D.btnConfSaveLocal?.addEventListener('click', confirmSaveLocal);

  // Share
  D.closeShare?.addEventListener('click',   () => closeModal(D.shareOv));
  D.btnTwitter?.addEventListener('click',   doTwitterShare);
  D.btnCopy?.addEventListener('click',      doCopyShare);

  // Settings controls
  D.fsSlider?.addEventListener('input', () => {
    S.fontSize = parseInt(D.fsSlider.value);
    if (D.fsVal)     D.fsVal.textContent    = S.fontSize + 'px';
    if (D.wordsWrap) D.wordsWrap.style.fontSize = S.fontSize + 'px';
  });
  [D.optSmooth, D.optSound, D.optLiveWpm, D.optPunct, D.optNums,
   D.optProgress, D.optBlink, D.optErrSnd, D.optHiCon, D.optReducedMotion]
    .forEach(el => el?.addEventListener('change', readSettings));  D.wordCount?.addEventListener('change', readSettings);
  D.customTxt?.addEventListener('input', debounce(readSettings, 600));

  D.btnResetAll?.addEventListener('click', () => {
    if (!confirm('Reset ALL local data? This cannot be undone.')) return;
    ['tt_history','tt_profile','tt_lb_local','tt_settings','tt_fb_cfg','tt_theme','tt_pro','tt_pro_key','tt_daily_streak','tt_daily_last']
      .concat(Object.keys(localStorage).filter(k => k.startsWith('tt_ghost_') || k.startsWith('tt_daily_')))
      .forEach(k => localStorage.removeItem(k));
    location.reload();
  });

  // Backdrop / Escape
  D.backdrop?.addEventListener('click', () => {
    closeSettings();
    document.querySelectorAll('.modal-ov:not([hidden])').forEach(closeModal);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSettings();
      document.querySelectorAll('.modal-ov:not([hidden])').forEach(closeModal);
    }
  });

  // Adaptive toast close
  D.adaptClose?.addEventListener('click', () => { if (D.adaptToast) D.adaptToast.hidden = true; });

  // Footer links
  D.ftStats?.addEventListener('click',   e => { e.preventDefault(); openModal(D.statsOv); renderStats(); });
  D.ftLB?.addEventListener('click',      e => { e.preventDefault(); openModal(D.lbOv);   renderLB('global'); });
  D.ftPro?.addEventListener('click',     e => { e.preventDefault(); renderProModal(); openModal(D.proOv); });
  D.ftAch?.addEventListener('click',     e => { e.preventDefault(); openModal(D.achOv);  renderAchievements(); });
  D.ftDaily?.addEventListener('click',   e => { e.preventDefault(); openModal(D.dailyOv); renderDailyModal(); });
  D.ftModes.forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); S.mode = a.dataset.m; syncPills(); initTest();
  }));

  // Resize: re-render chart
  window.addEventListener('resize', debounce(() => {
    if (!D.resultsPanel?.hidden) renderWPMChart(S.wpmSamples, 'wpmChart');
    if (!S.finished) requestAnimationFrame(positionLiveCursor);
  }, 250));
}

// ── Boot ──────────────────────────────────────────────────
initFirebase({
  apiKey: "AIzaSyCOuHtbHLnsBCEymB531mdejppQlhx1Iec",
  authDomain: "taliontype.firebaseapp.com",
  projectId: "taliontype",
  storageBucket: "taliontype.firebasestorage.app",
  messagingSenderId: "272114711228",
  appId: "1:272114711228:web:ee83a1312052ee0ce26eb9",
  measurementId: "G-YJ365M26CK"
});
function boot() {
  cacheDOM();
  loadTheme();
  loadProfile();
  loadSettings();
  loadPro();
  S.history = getHistory();
  S.bestWpm = getBestWPM();
  bindEvents();
  refreshLevelUI();
  initDailyChallenge();
  syncPills();
  initTest();

  // Bug 18: populate copyright year
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Console branding
  console.log(
    '%c⌨ TalionType%c v' + VER,
    'background:#00D9B0;color:#07090D;padding:4px 12px;border-radius:4px 0 0 4px;font-weight:800;font-family:Syne,sans-serif',
    'background:#0C1018;color:#00D9B0;padding:4px 12px;border-radius:0 4px 4px 0;font-family:JetBrains Mono,monospace'
  );
  console.log('%cA TalionLabs product · ' + HOME_URL, 'color:#4E5F75;font-family:Outfit,sans-serif');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})(); // end IIFE
