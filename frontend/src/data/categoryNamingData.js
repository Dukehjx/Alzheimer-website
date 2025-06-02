// Category Naming Game Data - 20 Categories × 30 Words Each

export const TIME_LIMITS = {
    EASY: 30,
    MEDIUM: 60,
    HARD: 90
};

export const DIFFICULTY_LEVELS = {
    EASY: {
        name: 'Easy',
        description: 'Beginner',
        timeLimit: TIME_LIMITS.EASY,
        idealCount: 10
    },
    MEDIUM: {
        name: 'Medium',
        description: 'Intermediate',
        timeLimit: TIME_LIMITS.MEDIUM,
        idealCount: 15
    },
    HARD: {
        name: 'Hard',
        description: 'Advanced',
        timeLimit: TIME_LIMITS.HARD,
        idealCount: 20
    }
};

// Define rarity threshold: words with index >= this value are considered "rare"
const RARITY_THRESHOLD = 20;

// Main category data
export const CATEGORIES = [
    {
        id: 'animals',
        name: 'Animals',
        words: [
            "dog", "cat", "elephant", "lion", "tiger",
            "giraffe", "zebra", "bear", "wolf", "kangaroo",
            "panda", "monkey", "horse", "cow", "sheep",
            "goat", "rabbit", "fox", "deer", "hippopotamus",
            "rhinoceros", "crocodile", "snake", "frog", "penguin",
            "dolphin", "whale", "shark", "octopus", "eagle"
        ]
    },
    {
        id: 'fruits',
        name: 'Fruits',
        words: [
            "apple", "banana", "orange", "grape", "strawberry",
            "blueberry", "pear", "peach", "mango", "pineapple",
            "watermelon", "kiwi", "cherry", "plum", "papaya",
            "apricot", "grapefruit", "lemon", "lime", "cantaloupe",
            "pomegranate", "blackberry", "raspberry", "fig", "date",
            "guava", "nectarine", "tangerine", "lychee", "jackfruit"
        ]
    },
    {
        id: 'vegetables',
        name: 'Vegetables',
        words: [
            "carrot", "broccoli", "spinach", "lettuce", "cucumber",
            "tomato", "pepper", "cauliflower", "cabbage", "onion",
            "garlic", "potato", "sweet potato", "zucchini", "eggplant",
            "pea", "corn", "pumpkin", "radish", "beet",
            "asparagus", "celery", "kale", "brussels sprouts", "leek",
            "okra", "squash", "mushroom", "turnip", "artichoke"
        ]
    },
    {
        id: 'countries',
        name: 'Countries',
        words: [
            "united states", "canada", "mexico", "brazil", "argentina",
            "united kingdom", "france", "germany", "italy", "spain",
            "portugal", "australia", "china", "japan", "india",
            "russia", "south africa", "egypt", "kenya", "nigeria",
            "morocco", "turkey", "saudi arabia", "thailand", "vietnam",
            "indonesia", "philippines", "south korea", "new zealand", "netherlands"
        ]
    },
    {
        id: 'cities',
        name: 'Cities',
        words: [
            "new york", "los angeles", "chicago", "houston", "philadelphia",
            "london", "paris", "berlin", "madrid", "rome",
            "tokyo", "sydney", "melbourne", "mumbai", "delhi",
            "beijing", "shanghai", "moscow", "dubai", "cairo",
            "nairobi", "capetown", "rio de janeiro", "buenos aires", "toronto",
            "vancouver", "singapore", "bangkok", "seoul", "amsterdam"
        ]
    },
    {
        id: 'sports',
        name: 'Sports',
        words: [
            "soccer", "basketball", "baseball", "tennis", "golf",
            "swimming", "running", "cycling", "volleyball", "cricket",
            "rugby", "hockey", "skiing", "snowboarding", "boxing",
            "wrestling", "martial arts", "badminton", "table tennis", "skateboarding",
            "surfing", "gymnastics", "fencing", "archery", "equestrian",
            "rowing", "canoeing", "taekwondo", "judo", "karate"
        ]
    },
    {
        id: 'musical_instruments',
        name: 'Musical Instruments',
        words: [
            "piano", "guitar", "violin", "drums", "flute",
            "saxophone", "trumpet", "cello", "clarinet", "trombone",
            "harp", "accordion", "banjo", "mandolin", "ukulele",
            "harmonica", "bass", "oboe", "bassoon", "sitar",
            "tabla", "xylophone", "timpani", "keyboard", "theremin",
            "marimba", "bagpipes", "didgeridoo", "lute", "recorder"
        ]
    },
    {
        id: 'colors',
        name: 'Colors',
        words: [
            "red", "blue", "green", "yellow", "orange",
            "purple", "pink", "brown", "black", "white",
            "gray", "maroon", "navy", "teal", "turquoise",
            "magenta", "lime", "olive", "lavender", "peach",
            "gold", "silver", "bronze", "beige", "coral",
            "indigo", "violet", "charcoal", "tan", "aquamarine"
        ]
    },
    {
        id: 'tools',
        name: 'Tools',
        words: [
            "hammer", "screwdriver", "wrench", "pliers", "drill",
            "saw", "chisel", "file", "tape measure", "level",
            "crowbar", "utility knife", "socket", "plier", "vice",
            "soldering iron", "paintbrush", "wheelbarrow", "shovel", "rake",
            "axe", "ladder", "clamp", "sandpaper", "wrench set",
            "pry bar", "trowel", "caliper", "vice grips", "awl"
        ]
    },
    {
        id: 'clothing_items',
        name: 'Clothing Items',
        words: [
            "shirt", "pants", "dress", "skirt", "jacket",
            "coat", "sweater", "t-shirt", "jeans", "shorts",
            "hat", "scarf", "gloves", "socks", "shoes",
            "boots", "sandals", "tie", "belt", "blouse",
            "hoodie", "sweatpants", "leggings", "pajamas", "underwear",
            "vest", "cardigan", "trousers", "suit", "collar"
        ]
    },
    {
        id: 'body_parts',
        name: 'Body Parts',
        words: [
            "head", "hair", "eye", "ear", "nose",
            "mouth", "teeth", "tongue", "neck", "shoulder",
            "arm", "elbow", "hand", "finger", "chest",
            "back", "stomach", "leg", "knee", "foot",
            "toe", "hip", "waist", "thigh", "ankle",
            "wrist", "calf", "eyebrow", "eyelash", "beard"
        ]
    },
    {
        id: 'vehicles',
        name: 'Vehicles',
        words: [
            "car", "truck", "bus", "motorcycle", "bicycle",
            "train", "airplane", "helicopter", "boat", "ship",
            "submarine", "tram", "trolley", "van", "taxi",
            "scooter", "jeep", "yacht", "ferry", "skateboard",
            "rollerblade", "segway", "hoverboard", "rickshaw", "hot air balloon",
            "spaceship", "rocket", "hovercraft", "tanker", "bulldozer"
        ]
    },
    {
        id: 'flowers',
        name: 'Flowers',
        words: [
            "rose", "tulip", "daisy", "sunflower", "lily",
            "orchid", "daffodil", "marigold", "lavender", "peony",
            "chrysanthemum", "jasmine", "gardenia", "iris", "hibiscus",
            "lilac", "poppy", "anemone", "azalea", "camellia",
            "dahlia", "freesia", "geranium", "gladiolus", "magnolia",
            "morning glory", "petunia", "ranunculus", "snapdragon", "zinnia"
        ]
    },
    {
        id: 'professions',
        name: 'Professions',
        words: [
            "teacher", "doctor", "nurse", "engineer", "lawyer",
            "accountant", "chef", "architect", "dentist", "pharmacist",
            "pilot", "mechanic", "electrician", "plumber", "barber",
            "hairdresser", "journalist", "scientist", "artist", "musician",
            "firefighter", "policeman", "paramedic", "veterinarian", "librarian",
            "psychologist", "social worker", "photographer", "designer", "therapist"
        ]
    },
    {
        id: 'famous_landmarks',
        name: 'Famous Landmarks',
        words: [
            "eiffel tower", "statue of liberty", "great wall of china", "pyramids of giza", "taj mahal",
            "colosseum", "big ben", "sydney opera house", "christ the redeemer", "mount rushmore",
            "machu picchu", "petra", "angkor wat", "stonehenge", "chichen itza",
            "leaning tower of pisa", "burj khalifa", "golden gate bridge", "niagara falls", "mount fuji",
            "uluru", "times square", "vatican city", "acropolis", "buckingham palace",
            "mount everest", "sagrada familia", "grand canyon", "guggenheim museum", "empire state building"
        ]
    },
    {
        id: 'periodic_table_elements',
        name: 'Periodic Table Elements',
        words: [
            "hydrogen", "helium", "lithium", "beryllium", "boron",
            "carbon", "nitrogen", "oxygen", "fluorine", "neon",
            "sodium", "magnesium", "aluminum", "silicon", "phosphorus",
            "sulfur", "chlorine", "argon", "potassium", "calcium",
            "iron", "copper", "zinc", "silver", "gold",
            "mercury", "lead", "uranium", "titanium", "nickel"
        ]
    },
    {
        id: 'programming_languages',
        name: 'Programming Languages',
        words: [
            "python", "java", "c++", "javascript", "ruby",
            "php", "c#", "go", "swift", "kotlin",
            "rust", "perl", "typescript", "scala", "haskell",
            "matlab", "objective-c", "dart", "lua", "r",
            "groovy", "visual basic", "fortran", "cobol", "elixir",
            "erlang", "lisp", "prolog", "assembly", "sql"
        ]
    },
    {
        id: 'cuisines_dishes',
        name: 'Cuisines / Dishes',
        words: [
            "pizza", "sushi", "tacos", "pasta", "ramen",
            "curry", "paella", "dim sum", "falafel", "pho",
            "burrito", "chow mein", "risotto", "gnocchi", "ceviche",
            "bibimbap", "pad thai", "lasagna", "pierogi", "empanada",
            "quesadilla", "shawarma", "moussaka", "gyros", "bruschetta",
            "tortilla", "samosa", "dumplings", "baklava", "croissant"
        ]
    },
    {
        id: 'movie_genres',
        name: 'Movie Genres',
        words: [
            "action", "comedy", "drama", "horror", "thriller",
            "romance", "sci-fi", "fantasy", "animation", "documentary",
            "mystery", "western", "musical", "biography", "crime",
            "adventure", "historical", "war", "noir", "family",
            "sports", "superhero", "satire", "parody", "experimental",
            "short film", "silent", "anime", "mockumentary", "reality"
        ]
    },
    {
        id: 'board_games',
        name: 'Board Games',
        words: [
            "chess", "checkers", "monopoly", "scrabble", "clue",
            "risk", "settlers of catan", "ticket to ride", "poker", "backgammon",
            "candyland", "battleship", "dominoes", "mahjong", "go",
            "connect four", "uno", "pictionary", "trivial pursuit", "life",
            "operation", "chutes and ladders", "jenga", "guess who", "ouija",
            "yahtzee", "cribbage", "snakes and ladders", "parcheesi", "stratego"
        ]
    }
];

/**
 * Get a random category from the CATEGORIES array
 * @returns {Object} A random category
 */
export function getRandomCategory() {
    const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
    return CATEGORIES[randomIndex];
}

/**
 * Check if a word is a valid category entry
 * @param {string} word - The word to check
 * @param {Array<string>} categoryWords - The list of valid words for the category
 * @returns {Object} Object with isValid and exact properties
 */
export function isValidCategoryEntry(word, categoryWords) {
    const normalized = word.trim().toLowerCase();

    // Check for exact match first
    if (categoryWords.includes(normalized)) {
        return {
            isValid: true,
            exact: true,
            word: normalized,
            isRare: categoryWords.indexOf(normalized) >= RARITY_THRESHOLD
        };
    }

    // Check for fuzzy match (Levenshtein distance <= 1)
    for (const validWord of categoryWords) {
        if (levenshteinDistance(normalized, validWord) <= 1) {
            return {
                isValid: true,
                exact: false,
                word: validWord,
                isRare: categoryWords.indexOf(validWord) >= RARITY_THRESHOLD
            };
        }
    }

    return { isValid: false };
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Distance (number of edits required)
 */
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculate score based on game performance
 * @param {number} totalCorrect - Number of correct entries
 * @param {number} rareCount - Number of rare entries
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Score breakdown
 */
export function calculateScore(totalCorrect, rareCount, difficulty) {
    const baseScore = totalCorrect * 1;
    const rareBonus = rareCount * 2;

    // Milestone bonus based on difficulty
    let milestoneBonus = 0;
    const requiredCount = difficulty === 'EASY' ? 10 :
        difficulty === 'MEDIUM' ? 15 : 20;

    if (totalCorrect >= requiredCount) {
        milestoneBonus = 10;
    }

    const finalScore = baseScore + rareBonus + milestoneBonus;

    return {
        baseScore,
        rareBonus,
        milestoneBonus,
        finalScore
    };
}

/**
 * Get performance feedback based on total correct answers
 * @param {number} totalCorrect - Number of correct entries
 * @returns {Object} Feedback object with message and type
 */
export function getPerformanceFeedback(totalCorrect) {
    if (totalCorrect >= 25) {
        return {
            message: `Outstanding! You listed ${totalCorrect} items. Your semantic fluency is impressive!`,
            type: 'excellent'
        };
    } else if (totalCorrect >= 15) {
        return {
            message: `Great job! You named ${totalCorrect} items. Keep sharpening that mind.`,
            type: 'good'
        };
    } else if (totalCorrect >= 8) {
        return {
            message: `Nice effort—${totalCorrect} items. Practice more to boost your recall speed.`,
            type: 'fair'
        };
    } else {
        return {
            message: `Good start! You named ${totalCorrect} items. Try again to improve your word flow.`,
            type: 'beginner'
        };
    }
}

/**
 * Get example hints for a category
 * @param {string} categoryId - The category ID
 * @returns {Array<string>} Array of example hints (2-3 items)
 */
export function getCategoryHints(categoryId) {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return [];

    // Get 2-3 examples from the common words (first 10)
    const commonWords = category.words.slice(0, 10);
    const hintCount = Math.min(3, commonWords.length);
    const shuffled = [...commonWords].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, hintCount);
} 