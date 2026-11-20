/*
  GUESS THE JOB — dati del gioco
  ============================================================
  Qui ci sono i lavori, i luoghi e le azioni (verbi) del gioco.
  Si possono modificare senza toccare game.js.

  LAVORI (jobs)
  - id:     nome tecnico, senza spazi
  - name:   il nome del lavoro in inglese
  - group:  lavori dello stesso gruppo sono "simili" (es. doctor, nurse, vet):
            se lo studente prova un lavoro dello stesso gruppo,
            il gioco risponde "So close!" e dà un indizio
  - places: id dei luoghi dove lavora (vedi PLACES)
  - verbs:  id delle azioni che fa (vedi VERBS)
  - does:   cosa dice di sé il lavoro (senza il luogo)
  - clue:   (facoltativo) indizio per distinguerlo dai lavori simili
  - words:  altri nomi accettati per lo stesso lavoro
  - emoji:  il disegnino mostrato alla fine

  LUOGHI (places) e AZIONI (verbs)
  - label:   la parola mostrata nel Word bank (se manca, non viene mostrata)
  - words:   tutte le forme che il gioco riconosce nelle domande
  - say:     (luoghi) come si dice nella frase: "I work in a hospital"
  - neg:     (azioni) cosa dice quando risponde di no: "I don't cook"
  - general: (azioni) per le azioni che fanno quasi tutti (help, think...):
             il gioco non risponde "no" ma usa questa frase
*/

var GUESS_THE_JOB = {
  places: {
    buildingsite: { label: 'building site', say: 'on a building site', words: ['building site', 'building sites', 'construction site', 'construction sites'] },
    restaurant: { label: 'restaurant', say: 'in a restaurant', words: ['restaurant', 'restaurants'] },
    bakery: { label: 'bakery', say: 'in a bakery', words: ['bakery', 'bakeries'] },
    field: { label: 'field', say: 'in a field', words: ['field', 'fields', 'pitch'] },
    gym: { label: 'gym', say: 'in a gym', words: ['gym', 'gyms'] },
    bus: { label: 'bus', say: 'on a bus', words: ['bus', 'buses', 'busses'] },
    taxi: { label: 'taxi', say: 'in a taxi', words: ['taxi', 'taxis', 'cab', 'cabs'] },
    road: { label: 'road', say: 'on the road', words: ['road', 'roads'] },
    street: { label: 'street', say: 'in the street', words: ['street', 'streets'] },
    bar: { label: 'bar', say: 'in a bar', words: ['bar', 'bars', 'cafe', 'cafes'] },
    pub: { label: 'pub', say: 'in a pub', words: ['pub', 'pubs'] },
    hospital: { label: 'hospital', say: 'in a hospital', words: ['hospital', 'hospitals', 'clinic', 'clinics'] },
    space: { label: 'space', say: 'in space', words: ['space', 'outer space', 'space station', 'rocket', 'rockets', 'spaceship', 'spaceships'] },
    school: { label: 'school', say: 'in a school', words: ['school', 'schools', 'primary school'] },
    class: { label: 'class', say: 'in a classroom', words: ['class', 'classes', 'classroom', 'classrooms'] },
    university: { label: 'university', say: 'at a university', words: ['university', 'universities', 'uni', 'college'] },
    atelier: { label: 'atelier', say: 'in an atelier', words: ['atelier', 'ateliers', 'studio', 'studios', 'art studio'] },
    theatre: { label: 'theatre', say: 'in a theatre', words: ['theatre', 'theatres', 'theater', 'theaters', 'stage'] },
    tv: { label: 'TV', say: 'on TV', words: ['tv', 'television', 'tv studio'] },
    set: { label: 'set', say: 'on a film set', words: ['set', 'film set', 'movie set'] },
    shop: { label: 'shop', say: 'in a shop', words: ['shop', 'shops', 'store', 'stores'] },
    market: { label: 'market', say: 'in a market', words: ['market', 'markets', 'supermarket', 'supermarkets'] },
    house: { label: 'house', say: "in people's houses", words: ['house', 'houses'] },
    home: { label: 'home', say: "in people's homes", words: ['home', 'homes'] },
    farm: { label: 'farm', say: 'on a farm', words: ['farm', 'farms'] },
    lab: { label: 'lab', say: 'in a lab', words: ['lab', 'labs', 'laboratory', 'laboratories'] },

    /* luoghi in più (non compaiono nel Word bank) */
    salon: { say: 'in a salon', words: ['salon', 'salons', 'hair salon', 'beauty salon', 'beauty centre', 'beauty center', 'spa'] },
    barbershop: { say: 'in a barber shop', words: ['barber shop', 'barbershop', 'barber shops'] },
    garage: { say: 'in a garage', words: ['garage', 'garages'] },
    policestation: { say: 'in a police station', words: ['police station', 'police stations'] },
    firestation: { say: 'in a fire station', words: ['fire station', 'fire stations'] },
    office: { say: 'in an office', words: ['office', 'offices'] },
    train: { say: 'on a train', words: ['a train', 'the train', 'on train'] },
    plane: { say: 'on a plane', words: ['plane', 'planes', 'airplane', 'aeroplane', 'airport'] }
  },

  verbs: {
    build: { label: 'build', words: ['build', 'builds', 'building', 'built'] },
    cook: { label: 'cook', words: ['cook', 'cooks', 'cooking', 'cooked'] },
    bake: { label: 'bake', words: ['bake', 'bakes', 'baking', 'baked'] },
    play: { label: 'play', words: ['play', 'plays', 'playing', 'played'] },
    train: { label: 'train', words: ['train', 'trains', 'training', 'trained'] },
    drive: { label: 'drive', words: ['drive', 'drives', 'driving', 'drove', 'driven'] },
    serve: { label: 'serve', words: ['serve', 'serves', 'serving', 'served'] },
    waiton: { label: 'wait on', neg: 'wait on tables', words: ['wait on', 'waits on', 'waiting on', 'waited on', 'wait tables'] },
    help: { label: 'help', general: 'Everybody helps sometimes!', words: ['help', 'helps', 'helping', 'helped'] },
    cure: { label: 'cure', words: ['cure', 'cures', 'curing', 'cured', 'heal', 'heals'] },
    float: { label: 'float', words: ['float', 'floats', 'floating', 'floated'] },
    teach: { label: 'teach', words: ['teach', 'teaches', 'teaching', 'taught'] },
    explain: { label: 'explain', words: ['explain', 'explains', 'explaining', 'explained'] },
    save: { label: 'save', words: ['save', 'saves', 'saving', 'saved'] },
    rescue: { label: 'rescue', words: ['rescue', 'rescues', 'rescuing', 'rescued'] },
    create: { label: 'create', words: ['create', 'creates', 'creating', 'created'] },
    paint: { label: 'paint', words: ['paint', 'paints', 'painting', 'painted'] },
    draw: { label: 'draw', words: ['draw', 'draws', 'drawing', 'drew'] },
    sing: { label: 'sing', words: ['sing', 'sings', 'singing', 'sang'] },
    act: { label: 'act', words: ['act', 'acts', 'acting', 'acted'] },
    present: { label: 'present', words: ['present', 'presents', 'presenting', 'presented'] },
    cut: { label: 'cut', words: ['cut', 'cuts', 'cutting'] },
    dye: { label: 'dye', words: ['dye', 'dyes', 'dyeing', 'dyed'] },
    fix: { label: 'fix', words: ['fix', 'fixes', 'fixing', 'fixed', 'repair', 'repairs', 'repairing', 'repaired'] },
    takecare: { label: 'take care', neg: 'take care of people', general: 'Lots of people take care of others!', words: ['take care', 'takes care', 'taking care', 'took care', 'look after', 'looks after', 'looking after'] },
    clean: { label: 'clean', words: ['clean', 'cleans', 'cleaning', 'cleaned'] },
    farm: { label: 'farm', neg: 'grow plants', words: ['farming', 'farmed', 'grow', 'grows', 'growing', 'grew'] },
    think: { label: 'think', general: 'Everybody thinks!', words: ['think', 'thinks', 'thinking', 'thought'] },
    study: { label: 'study', general: 'Lots of people study!', words: ['study', 'studies', 'studying', 'studied'] },
    sell: { label: 'sell', words: ['sell', 'sells', 'selling', 'sold'] },

    /* azioni in più (non compaiono nel Word bank) */
    fly: { neg: 'fly', words: ['fly', 'flies', 'flying', 'flew'] },
    run: { neg: 'run', words: ['run', 'runs', 'running', 'ran'] },
    joke: { neg: 'tell jokes', words: ['tell jokes', 'tell a joke', 'tells jokes', 'telling jokes', 'joke', 'jokes', 'joking', 'make people laugh', 'makes people laugh', 'funny'] },
    experiment: { neg: 'do experiments', words: ['experiment', 'experiments', 'do experiments', 'doing experiments'] }
  },

  /* argomenti: "Do you work with animals?" — true = usa la frase "does" del lavoro */
  topics: {
    animals: { no: "I don't work with animals.", yes: { vet: true, farmer: true }, words: ['animal', 'animals', 'pet', 'pets', 'dog', 'dogs', 'cat', 'cats', 'cow', 'cows', 'horse', 'horses', 'sheep'] },
    fire: { no: "I don't put out fires.", yes: { firefighter: true }, words: ['fire', 'fires'] },
    hair: { no: "I don't work with hair.", yes: { hairdresser: true, barber: true }, words: ['hair', 'haircut', 'haircuts', 'beard', 'beards'] },
    cars: { no: "I don't work with cars.", yes: { mechanic: true, 'taxi-driver': 'I drive a taxi. A taxi is a car!' }, words: ['car', 'cars'] },
    drinks: { no: "I don't serve drinks.", yes: { bartender: true, waiter: 'I serve food and drinks.' }, words: ['drinks', 'cocktail', 'cocktails'] },
    music: { no: "I don't sing songs.", yes: { singer: true }, words: ['music', 'song', 'songs'] },
    sick: { no: "I don't work with sick people.", yes: { doctor: true, nurse: true, vet: 'I help sick animals!' }, words: ['sick', 'patient', 'patients', 'sick people'] },
    thieves: { no: "I don't catch thieves.", yes: { 'police-officer': true }, words: ['thief', 'thieves', 'robber', 'robbers', 'criminal', 'criminals', 'bad guys'] },
    plants: { no: "I don't grow plants.", yes: { farmer: true }, words: ['plant', 'plants', 'vegetables', 'fruit'] }
  },

  jobs: [
    { id: 'builder', name: 'builder', group: 1, emoji: '👷', places: ['buildingsite'], verbs: ['build'], does: 'I build houses.', words: ['builders', 'construction worker'] },

    { id: 'chef', name: 'chef', group: 2, emoji: '🍳', places: ['restaurant'], verbs: ['cook'], does: 'I cook food.', words: ['chefs', 'a cook', 'the cook'] },
    { id: 'baker', name: 'baker', group: 2, emoji: '🥐', places: ['bakery'], verbs: ['bake'], does: 'I bake bread and cakes.', words: ['bakers'] },

    { id: 'athlete', name: 'athlete', group: 3, emoji: '🏃', places: ['field', 'gym'], verbs: ['play', 'train', 'run'], does: 'I play sports and I train every day.', words: ['athletes', 'sportsman', 'sportswoman', 'player', 'footballer', 'runner'] },
    { id: 'coach', name: 'coach', group: 3, emoji: '📣', places: ['field', 'gym'], verbs: ['train'], does: 'I train athletes.', words: ['coaches', 'trainer'] },

    { id: 'bus-driver', name: 'bus driver', group: 4, emoji: '🚌', places: ['bus', 'road', 'street'], verbs: ['drive'], does: 'I drive a bus.', words: ['bus drivers'] },
    { id: 'taxi-driver', name: 'taxi driver', group: 4, emoji: '🚕', places: ['taxi', 'road', 'street'], verbs: ['drive'], does: 'I drive a taxi.', words: ['taxi drivers', 'cab driver', 'cabbie'] },

    { id: 'bartender', name: 'bartender', group: 5, emoji: '🍹', places: ['bar', 'pub'], verbs: ['serve'], does: 'I serve drinks.', words: ['bartenders', 'barman', 'barmaid', 'barista'] },
    { id: 'waiter', name: 'waiter', group: 5, emoji: '🍽️', places: ['restaurant'], verbs: ['serve', 'waiton'], does: 'I serve food and I wait on tables.', words: ['waiters', 'waitress', 'waitresses'] },

    { id: 'doctor', name: 'doctor', group: 6, emoji: '🩺', places: ['hospital'], verbs: ['help', 'cure'], does: 'I help and cure sick people.', clue: 'Nurses help me!', words: ['doctors', 'doc'] },
    { id: 'nurse', name: 'nurse', group: 6, emoji: '💉', places: ['hospital'], verbs: ['help', 'cure', 'takecare'], does: 'I help sick people and I take care of them.', clue: 'I help the doctor.', words: ['nurses'] },
    { id: 'vet', name: 'vet', group: 6, emoji: '🐶', places: ['hospital'], verbs: ['help', 'cure', 'takecare'], does: 'I help and cure animals.', clue: 'I help animals, not people!', words: ['vets', 'veterinarian', 'animal doctor'] },

    { id: 'astronaut', name: 'astronaut', group: 7, emoji: '🚀', places: ['space'], verbs: ['float', 'fly'], does: 'I fly in a rocket and I float!', words: ['astronauts', 'spaceman', 'spacewoman', 'cosmonaut'] },

    { id: 'teacher', name: 'teacher', group: 8, emoji: '📚', places: ['school', 'class'], verbs: ['teach', 'explain'], does: 'I teach children and I explain things.', words: ['teachers', 'schoolteacher'] },
    { id: 'professor', name: 'professor', group: 8, emoji: '🎓', places: ['university', 'class'], verbs: ['teach', 'explain'], does: 'I teach big students and I explain things.', words: ['professors', 'lecturer'] },

    { id: 'police-officer', name: 'police officer', group: 9, emoji: '👮', places: ['street', 'road', 'policestation'], verbs: ['save', 'rescue', 'help'], does: 'I help people and I catch thieves.', words: ['police officers', 'policeman', 'policewoman', 'policemen', 'police', 'cop', 'cops', 'officer'] },
    { id: 'firefighter', name: 'firefighter', group: 9, emoji: '🚒', places: ['street', 'road', 'firestation'], verbs: ['save', 'rescue', 'help'], does: 'I save people and I put out fires.', words: ['firefighters', 'fire fighter', 'fireman', 'firewoman', 'firemen'] },

    { id: 'artist', name: 'artist', group: 10, emoji: '🎨', places: ['atelier'], verbs: ['create', 'paint', 'draw'], does: 'I create pictures: I paint and I draw.', words: ['artists', 'painter', 'painters'] },

    { id: 'singer', name: 'singer', group: 11, emoji: '🎤', places: ['theatre', 'tv', 'set'], verbs: ['sing'], does: 'I sing songs.', words: ['singers', 'pop star', 'popstar'] },
    { id: 'actor', name: 'actor', group: 11, emoji: '🎭', places: ['theatre', 'tv', 'set'], verbs: ['act'], does: 'I act in films and plays.', words: ['actors', 'actress', 'actresses'] },
    { id: 'comedian', name: 'comedian', group: 11, emoji: '😂', places: ['theatre', 'tv', 'set'], verbs: ['act', 'joke'], does: 'I tell jokes and I make people laugh.', words: ['comedians', 'comic'] },
    { id: 'presenter', name: 'presenter', group: 11, emoji: '📺', places: ['tv', 'theatre', 'set'], verbs: ['present'], does: 'I present shows.', words: ['presenters', 'tv presenter', 'host', 'tv host'] },

    { id: 'hairdresser', name: 'hairdresser', group: 12, emoji: '💇', places: ['shop', 'salon'], verbs: ['cut', 'dye'], does: 'I cut and dye hair.', words: ['hairdressers', 'hair stylist', 'hairstylist'] },
    { id: 'barber', name: 'barber', group: 12, emoji: '💈', places: ['shop', 'barbershop'], verbs: ['cut', 'dye'], does: 'I cut hair and beards.', words: ['barbers'] },

    { id: 'mechanic', name: 'mechanic', group: 13, emoji: '🔧', places: ['shop', 'garage'], verbs: ['fix'], does: 'I fix cars.', words: ['mechanics'] },
    { id: 'plumber', name: 'plumber', group: 13, emoji: '🚿', places: ['house', 'home'], verbs: ['fix'], does: 'I fix pipes, taps and toilets.', words: ['plumbers'] },

    { id: 'esthetician', name: 'esthetician', group: 14, emoji: '💅', places: ['shop', 'salon'], verbs: ['takecare'], does: 'I take care of skin and nails.', words: ['estheticians', 'aesthetician', 'beautician', 'beauty therapist'] },

    { id: 'cleaner', name: 'cleaner', group: 15, emoji: '🧹', places: ['house', 'home'], verbs: ['clean'], does: 'I clean houses.', words: ['cleaners', 'janitor', 'housekeeper'] },

    { id: 'farmer', name: 'farmer', group: 16, emoji: '🚜', places: ['farm', 'field'], verbs: ['farm', 'takecare'], does: 'I grow plants and I look after animals.', words: ['farmers'] },

    { id: 'scientist', name: 'scientist', group: 17, emoji: '🔬', places: ['lab'], verbs: ['think', 'study', 'experiment'], does: 'I think, I study and I do experiments.', words: ['scientists'] },

    { id: 'cashier', name: 'cashier', group: 18, emoji: '💶', places: ['shop', 'market'], verbs: ['sell'], does: 'I sell things and I take the money.', words: ['cashiers'] },
    { id: 'shop-assistant', name: 'shop assistant', group: 18, emoji: '🛍️', places: ['shop', 'market'], verbs: ['sell', 'help'], does: 'I sell things and I help customers.', words: ['shop assistants', 'sales assistant'] }
  ],

  /* nomi "generici" che valgono per più lavori */
  generic: [
    { name: 'driver', jobs: ['bus-driver', 'taxi-driver'], follow: 'But what do I drive? 🤔', words: ['driver', 'drivers'] }
  ],

  /* se lo studente scrive in italiano, il gioco suggerisce la parola inglese */
  italian: {
    'ospedale': 'hospital', 'ospedali': 'hospital', 'clinica': 'hospital',
    'scuola': 'school', 'scuole': 'school', 'classe': 'class', 'aula': 'classroom',
    'universita': 'university', 'ristorante': 'restaurant', 'ristoranti': 'restaurant',
    'panetteria': 'bakery', 'panificio': 'bakery', 'forno': 'bakery',
    'campo': 'field', 'campi': 'field', 'palestra': 'gym', 'cantiere': 'building site',
    'autobus': 'bus', 'pullman': 'bus', 'strada': 'road', 'strade': 'road', 'via': 'street',
    'spazio': 'space', 'razzo': 'rocket', 'teatro': 'theatre', 'televisione': 'TV',
    'negozio': 'shop', 'negozi': 'shop', 'casa': 'house', 'case': 'house',
    'fattoria': 'farm', 'laboratorio': 'lab', 'mercato': 'market', 'supermercato': 'supermarket',
    'officina': 'garage', 'salone': 'salon', 'ufficio': 'office', 'treno': 'a train', 'aereo': 'plane',
    'questura': 'police station', 'commissariato': 'police station',

    'costruire': 'build', 'costruisci': 'build', 'cucinare': 'cook', 'cucini': 'cook', 'cuoci': 'cook',
    'infornare': 'bake', 'inforni': 'bake', 'giocare': 'play', 'giochi': 'play',
    'allenare': 'train', 'alleni': 'train', 'ti alleni': 'train', 'guidare': 'drive', 'guidi': 'drive',
    'servire': 'serve', 'servi': 'serve', 'aiutare': 'help', 'aiuti': 'help',
    'curare': 'cure', 'curi': 'cure', 'volare': 'fly', 'voli': 'fly',
    'galleggiare': 'float', 'galleggi': 'float', 'fluttui': 'float',
    'insegnare': 'teach', 'insegni': 'teach', 'spiegare': 'explain', 'spieghi': 'explain',
    'salvare': 'save', 'salvi': 'save', 'soccorrere': 'rescue', 'soccorri': 'rescue',
    'creare': 'create', 'crei': 'create', 'dipingere': 'paint', 'dipingi': 'paint',
    'disegnare': 'draw', 'disegni': 'draw', 'cantare': 'sing', 'canti': 'sing',
    'recitare': 'act', 'reciti': 'act', 'presentare': 'present', 'presenti': 'present',
    'tagliare': 'cut', 'tagli': 'cut', 'tingere': 'dye', 'tingi': 'dye',
    'aggiustare': 'fix', 'aggiusti': 'fix', 'riparare': 'fix', 'ripari': 'fix',
    'ti prendi cura': 'take care', 'prenderti cura': 'take care', 'prendi cura': 'take care',
    'pulire': 'clean', 'pulisci': 'clean', 'coltivare': 'grow', 'coltivi': 'grow',
    'pensare': 'think', 'pensi': 'think', 'studiare': 'study', 'studi': 'study',
    'vendere': 'sell', 'vendi': 'sell', 'correre': 'run', 'corri': 'run',

    'muratore': 'builder', 'cuoco': 'chef', 'cuoca': 'chef',
    'panettiere': 'baker', 'panettiera': 'baker', 'fornaio': 'baker', 'fornaia': 'baker',
    'atleta': 'athlete', 'allenatore': 'coach', 'allenatrice': 'coach',
    'autista': 'driver', 'tassista': 'taxi driver', 'barista': 'bartender',
    'cameriere': 'waiter', 'cameriera': 'waiter',
    'dottore': 'doctor', 'dottoressa': 'doctor', 'medico': 'doctor',
    'infermiere': 'nurse', 'infermiera': 'nurse', 'veterinario': 'vet', 'veterinaria': 'vet',
    'maestro': 'teacher', 'maestra': 'teacher', 'insegnante': 'teacher',
    'professore': 'professor', 'professoressa': 'professor',
    'poliziotto': 'police officer', 'poliziotta': 'police officer', 'polizia': 'police officer', 'vigile': 'police officer',
    'pompiere': 'firefighter', 'pompieri': 'firefighter', 'vigile del fuoco': 'firefighter', 'vigili del fuoco': 'firefighter',
    'pittore': 'artist', 'pittrice': 'artist', 'cantante': 'singer',
    'attore': 'actor', 'attrice': 'actor', 'comico': 'comedian', 'comica': 'comedian',
    'presentatore': 'presenter', 'presentatrice': 'presenter',
    'parrucchiere': 'hairdresser', 'parrucchiera': 'hairdresser', 'barbiere': 'barber',
    'meccanico': 'mechanic', 'idraulico': 'plumber', 'estetista': 'esthetician',
    'addetto alle pulizie': 'cleaner', 'addetta alle pulizie': 'cleaner', 'bidello': 'cleaner', 'bidella': 'cleaner',
    'contadino': 'farmer', 'contadina': 'farmer', 'agricoltore': 'farmer', 'agricoltrice': 'farmer',
    'scienziato': 'scientist', 'scienziata': 'scientist',
    'cassiere': 'cashier', 'cassiera': 'cashier', 'commesso': 'shop assistant', 'commessa': 'shop assistant',

    'animali': 'animals', 'animale': 'animals', 'cani': 'dogs', 'gatti': 'cats',
    'fuoco': 'fire', 'incendi': 'fires', 'capelli': 'hair', 'macchine': 'cars', 'macchina': 'car',
    'bevande': 'drinks', 'musica': 'music', 'canzoni': 'songs', 'malati': 'sick', 'ladri': 'thieves',
    'piante': 'plants', 'verdure': 'vegetables'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GUESS_THE_JOB;
}
