// Memory Match Game Data - 200 Question-Answer Pairs

export const DIFFICULTY_LEVELS = {
    BEGINNER: {
        name: 'Beginner',
        description: 'Easy',
        gridSize: { rows: 2, cols: 2 },
        pairs: 2,
        timeBonus: 15,
        idealMoves: 4
    },
    NOVICE: {
        name: 'Novice',
        description: 'Easy-Medium',
        gridSize: { rows: 2, cols: 4 },
        pairs: 4,
        timeBonus: 30,
        idealMoves: 8
    },
    INTERMEDIATE: {
        name: 'Intermediate',
        description: 'Medium',
        gridSize: { rows: 4, cols: 4 },
        pairs: 8,
        timeBonus: 60,
        idealMoves: 16
    },
    ADVANCED: {
        name: 'Advanced',
        description: 'Hard',
        gridSize: { rows: 6, cols: 6 },
        pairs: 18,
        timeBonus: 120,
        idealMoves: 36
    },
    EXPERT: {
        name: 'Expert',
        description: 'Very Hard',
        gridSize: { rows: 8, cols: 8 },
        pairs: 32,
        timeBonus: 240,
        idealMoves: 64
    }
};

export const GAME_MODES = {
    RELAXED: 'relaxed',
    TIMED: 'timed',
    CHALLENGE: 'challenge'
};

// Master bank of 200 question-answer pairs
export const QUESTION_ANSWER_PAIRS = [
    // Geography & Capitals (1-50)
    { id: 1, question: "What is the capital of France?", answer: "Paris", category: "Geography" },
    { id: 2, question: "What is the capital of Japan?", answer: "Tokyo", category: "Geography" },
    { id: 3, question: "What is the capital of Canada?", answer: "Ottawa", category: "Geography" },
    { id: 4, question: "What is the capital of Australia?", answer: "Canberra", category: "Geography" },
    { id: 5, question: "What is the capital of Brazil?", answer: "Brasília", category: "Geography" },
    { id: 6, question: "What is the capital of Germany?", answer: "Berlin", category: "Geography" },
    { id: 7, question: "What is the capital of India?", answer: "New Delhi", category: "Geography" },
    { id: 8, question: "What is the capital of Mexico?", answer: "Mexico City", category: "Geography" },
    { id: 9, question: "What is the capital of Italy?", answer: "Rome", category: "Geography" },
    { id: 10, question: "What is the capital of Spain?", answer: "Madrid", category: "Geography" },
    { id: 11, question: "What is the capital of Egypt?", answer: "Cairo", category: "Geography" },
    { id: 12, question: "What is the capital of Russia?", answer: "Moscow", category: "Geography" },
    { id: 13, question: "What is the capital of South Korea?", answer: "Seoul", category: "Geography" },
    { id: 14, question: "What is the capital of Argentina?", answer: "Buenos Aires", category: "Geography" },
    { id: 15, question: "What is the capital of Sweden?", answer: "Stockholm", category: "Geography" },
    { id: 16, question: "What is the capital of Norway?", answer: "Oslo", category: "Geography" },
    { id: 17, question: "What is the capital of Netherlands?", answer: "Amsterdam", category: "Geography" },
    { id: 18, question: "What is the capital of Greece?", answer: "Athens", category: "Geography" },
    { id: 19, question: "What is the capital of Turkey?", answer: "Ankara", category: "Geography" },
    { id: 20, question: "What is the capital of South Africa?", answer: "Pretoria", category: "Geography" },
    { id: 21, question: "What is the legislative capital of South Africa?", answer: "Cape Town", category: "Geography" },
    { id: 22, question: "What is the judicial capital of South Africa?", answer: "Bloemfontein", category: "Geography" },
    { id: 23, question: "What is the capital of Kenya?", answer: "Nairobi", category: "Geography" },
    { id: 24, question: "What is the capital of Thailand?", answer: "Bangkok", category: "Geography" },
    { id: 25, question: "What is the capital of Malaysia?", answer: "Kuala Lumpur", category: "Geography" },
    { id: 26, question: "What is the capital of Vietnam?", answer: "Hanoi", category: "Geography" },
    { id: 27, question: "What is the capital of Indonesia?", answer: "Jakarta", category: "Geography" },
    { id: 28, question: "What is the capital of Philippines?", answer: "Manila", category: "Geography" },
    { id: 29, question: "What is the capital of Colombia?", answer: "Bogotá", category: "Geography" },
    { id: 30, question: "What is the capital of Chile?", answer: "Santiago", category: "Geography" },
    { id: 31, question: "What is the capital of Peru?", answer: "Lima", category: "Geography" },
    { id: 32, question: "What is the capital of Saudi Arabia?", answer: "Riyadh", category: "Geography" },
    { id: 33, question: "What is the capital of United Kingdom?", answer: "London", category: "Geography" },
    { id: 34, question: "What is the capital of United States?", answer: "Washington, D.C.", category: "Geography" },
    { id: 35, question: "What is the capital of Nigeria?", answer: "Abuja", category: "Geography" },
    { id: 36, question: "What is the capital of Morocco?", answer: "Rabat", category: "Geography" },
    { id: 37, question: "What is the capital of Portugal?", answer: "Lisbon", category: "Geography" },
    { id: 38, question: "What is the capital of Ireland?", answer: "Dublin", category: "Geography" },
    { id: 39, question: "What is the capital of Poland?", answer: "Warsaw", category: "Geography" },
    { id: 40, question: "What is the capital of Ukraine?", answer: "Kyiv", category: "Geography" },
    { id: 41, question: "What is the capital of Belgium?", answer: "Brussels", category: "Geography" },
    { id: 42, question: "What is the capital of Austria?", answer: "Vienna", category: "Geography" },
    { id: 43, question: "What is the capital of Switzerland?", answer: "Bern", category: "Geography" },
    { id: 44, question: "What is the capital of Finland?", answer: "Helsinki", category: "Geography" },
    { id: 45, question: "What is the capital of Denmark?", answer: "Copenhagen", category: "Geography" },
    { id: 46, question: "What is the capital of Czech Republic?", answer: "Prague", category: "Geography" },
    { id: 47, question: "What is the capital of Hungary?", answer: "Budapest", category: "Geography" },
    { id: 48, question: "What is the capital of Iraq?", answer: "Baghdad", category: "Geography" },
    { id: 49, question: "What is the capital of Iran?", answer: "Tehran", category: "Geography" },
    { id: 50, question: "What is the capital of Pakistan?", answer: "Islamabad", category: "Geography" },

    // Simple Math & Number Facts (51-100)
    { id: 51, question: "What is 2 + 2?", answer: "4", category: "Math" },
    { id: 52, question: "What is 5 - 3?", answer: "2", category: "Math" },
    { id: 53, question: "What is 3 × 3?", answer: "9", category: "Math" },
    { id: 54, question: "What is 10 ÷ 2?", answer: "5", category: "Math" },
    { id: 55, question: "What is 7 + 8?", answer: "15", category: "Math" },
    { id: 56, question: "What is 12 - 4?", answer: "8", category: "Math" },
    { id: 57, question: "What is 6 × 7?", answer: "42", category: "Math" },
    { id: 58, question: "What is 20 ÷ 5?", answer: "4", category: "Math" },
    { id: 59, question: "What is 9 + 6?", answer: "15", category: "Math" },
    { id: 60, question: "What is 14 - 9?", answer: "5", category: "Math" },
    { id: 61, question: "What is 4 × 4?", answer: "16", category: "Math" },
    { id: 62, question: "What is 18 ÷ 3?", answer: "6", category: "Math" },
    { id: 63, question: "What is 8 + 7?", answer: "15", category: "Math" },
    { id: 64, question: "What is 16 - 7?", answer: "9", category: "Math" },
    { id: 65, question: "What is 5 × 5?", answer: "25", category: "Math" },
    { id: 66, question: "What is 24 ÷ 6?", answer: "4", category: "Math" },
    { id: 67, question: "What is 11 + 11?", answer: "22", category: "Math" },
    { id: 68, question: "What is 15 - 8?", answer: "7", category: "Math" },
    { id: 69, question: "What is 2³ (2 cubed)?", answer: "8", category: "Math" },
    { id: 70, question: "What is 3² (3 squared)?", answer: "9", category: "Math" },
    { id: 71, question: "What is 100 - 50?", answer: "50", category: "Math" },
    { id: 72, question: "What is 6 × 8?", answer: "48", category: "Math" },
    { id: 73, question: "What is 30 ÷ 5?", answer: "6", category: "Math" },
    { id: 74, question: "What is 9 + 9?", answer: "18", category: "Math" },
    { id: 75, question: "What is 25 - 10?", answer: "15", category: "Math" },
    { id: 76, question: "What is 7 × 6?", answer: "42", category: "Math" },
    { id: 77, question: "What is 27 ÷ 3?", answer: "9", category: "Math" },
    { id: 78, question: "What is 13 + 7?", answer: "20", category: "Math" },
    { id: 79, question: "What is 20 - 4?", answer: "16", category: "Math" },
    { id: 80, question: "What is 8 × 9?", answer: "72", category: "Math" },
    { id: 81, question: "What is 36 ÷ 6?", answer: "6", category: "Math" },
    { id: 82, question: "What is 14 + 5?", answer: "19", category: "Math" },
    { id: 83, question: "What is 18 - 3?", answer: "15", category: "Math" },
    { id: 84, question: "What is 4³ (4 cubed)?", answer: "64", category: "Math" },
    { id: 85, question: "What is 5² (5 squared)?", answer: "25", category: "Math" },
    { id: 86, question: "What is 80 - 30?", answer: "50", category: "Math" },
    { id: 87, question: "What is 9 × 9?", answer: "81", category: "Math" },
    { id: 88, question: "What is 45 ÷ 5?", answer: "9", category: "Math" },
    { id: 89, question: "What is 17 + 3?", answer: "20", category: "Math" },
    { id: 90, question: "What is 22 - 7?", answer: "15", category: "Math" },
    { id: 91, question: "What is 2⁴ (2 to the fourth)?", answer: "16", category: "Math" },
    { id: 92, question: "What is 3³ (3 cubed)?", answer: "27", category: "Math" },
    { id: 93, question: "What is 90 - 40?", answer: "50", category: "Math" },
    { id: 94, question: "What is 7 × 7?", answer: "49", category: "Math" },
    { id: 95, question: "What is 49 ÷ 7?", answer: "7", category: "Math" },
    { id: 96, question: "What is 12 + 8?", answer: "20", category: "Math" },
    { id: 97, question: "What is 28 - 9?", answer: "19", category: "Math" },
    { id: 98, question: "What is 6³ (6 cubed)?", answer: "216", category: "Math" },
    { id: 99, question: "What is 10² (10 squared)?", answer: "100", category: "Math" },
    { id: 100, question: "What is 100 - 75?", answer: "25", category: "Math" },

    // General Knowledge & Everyday Facts (101-150)
    { id: 101, question: "What color is the sky on a clear day?", answer: "Blue", category: "General Knowledge" },
    { id: 102, question: "Which animal says 'meow'?", answer: "Cat", category: "General Knowledge" },
    { id: 103, question: "How many wheels does a standard bicycle have?", answer: "Two", category: "General Knowledge" },
    { id: 104, question: "What do bees produce?", answer: "Honey", category: "General Knowledge" },
    { id: 105, question: "Which season comes after spring?", answer: "Summer", category: "General Knowledge" },
    { id: 106, question: "How many days are in a leap year?", answer: "366", category: "General Knowledge" },
    { id: 107, question: "What shape is a stop sign?", answer: "Octagon", category: "General Knowledge" },
    { id: 108, question: "Which sense do you use to taste food?", answer: "Taste", category: "General Knowledge" },
    { id: 109, question: "Which planet is known as the 'Red Planet'?", answer: "Mars", category: "General Knowledge" },
    { id: 110, question: "How many letters are in the English alphabet?", answer: "26", category: "General Knowledge" },
    { id: 111, question: "What do you call water when it freezes?", answer: "Ice", category: "General Knowledge" },
    { id: 112, question: "What is 12 AM in the morning called?", answer: "Midnight", category: "General Knowledge" },
    { id: 113, question: "What natural disaster involves shaking of the ground?", answer: "Earthquake", category: "General Knowledge" },
    { id: 114, question: "Which object is used to tell time on your wrist?", answer: "Watch", category: "General Knowledge" },
    { id: 115, question: "How many continents are there on Earth?", answer: "Seven", category: "General Knowledge" },
    { id: 116, question: "Which bird is known for mimicking human speech?", answer: "Parrot", category: "General Knowledge" },
    { id: 117, question: "What do you call a baby dog?", answer: "Puppy", category: "General Knowledge" },
    { id: 118, question: "Which metal is liquid at room temperature?", answer: "Mercury", category: "General Knowledge" },
    { id: 119, question: "How many legs does a spider have?", answer: "Eight", category: "General Knowledge" },
    { id: 120, question: "Which holiday is celebrated on December 25th?", answer: "Christmas", category: "General Knowledge" },
    { id: 121, question: "Which fruit is traditionally associated with doctors?", answer: "Apple", category: "General Knowledge" },
    { id: 122, question: "What do you call the red fruit often used in pies?", answer: "Strawberry", category: "General Knowledge" },
    { id: 123, question: "Which instrument has black and white keys?", answer: "Piano", category: "General Knowledge" },
    { id: 124, question: "What is H₂O more commonly known as?", answer: "Water", category: "General Knowledge" },
    { id: 125, question: "Which gas do humans breathe in to survive?", answer: "Oxygen", category: "General Knowledge" },
    { id: 126, question: "What keeps things cold for ice cream?", answer: "Freezer", category: "General Knowledge" },
    { id: 127, question: "What color are bananas when ripe?", answer: "Yellow", category: "General Knowledge" },
    { id: 128, question: "Which ocean is the largest on Earth?", answer: "Pacific Ocean", category: "General Knowledge" },
    { id: 129, question: "Which animal is known as the 'King of the Jungle'?", answer: "Lion", category: "General Knowledge" },
    { id: 130, question: "Which vegetable is orange and associated with rabbits?", answer: "Carrot", category: "General Knowledge" },
    { id: 131, question: "What is the freezing point of water in Celsius?", answer: "0 °C", category: "General Knowledge" },
    { id: 132, question: "What do you call a large body of saltwater?", answer: "Ocean", category: "General Knowledge" },
    { id: 133, question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", category: "General Knowledge" },
    { id: 134, question: "In which direction does the sun rise?", answer: "East", category: "General Knowledge" },
    { id: 135, question: "How many days are in a week?", answer: "Seven", category: "General Knowledge" },
    { id: 136, question: "Which planet is closest to the Sun?", answer: "Mercury", category: "General Knowledge" },
    { id: 137, question: "What is the fastest land animal?", answer: "Cheetah", category: "General Knowledge" },
    { id: 138, question: "What is the powerhouse of the cell?", answer: "Mitochondria", category: "General Knowledge" },
    { id: 139, question: "Which instrument do you blow into with valves?", answer: "Trumpet", category: "General Knowledge" },
    { id: 140, question: "Which organ pumps blood throughout the body?", answer: "Heart", category: "General Knowledge" },
    { id: 141, question: "What do you call a baby cat?", answer: "Kitten", category: "General Knowledge" },
    { id: 142, question: "Which body of water separates Europe and Africa?", answer: "Mediterranean Sea", category: "General Knowledge" },
    { id: 143, question: "How many sides does a triangle have?", answer: "Three", category: "General Knowledge" },
    { id: 144, question: "Which bird lays the largest eggs?", answer: "Ostrich", category: "General Knowledge" },
    { id: 145, question: "What is the process plants use to make food with sunlight?", answer: "Photosynthesis", category: "General Knowledge" },
    { id: 146, question: "What do you call a doctor who treats teeth?", answer: "Dentist", category: "General Knowledge" },
    { id: 147, question: "Which tool is used to hammer nails into wood?", answer: "Hammer", category: "General Knowledge" },
    { id: 148, question: "How many hours are there in a day?", answer: "24", category: "General Knowledge" },
    { id: 149, question: "Which sense do you use to hear?", answer: "Hearing", category: "General Knowledge" },
    { id: 150, question: "What do you call frozen rain?", answer: "Hail", category: "General Knowledge" },

    // Vocabulary (Synonyms & Antonyms) (151-200)
    { id: 151, question: "Synonym of 'Happy'?", answer: "Joyful", category: "Vocabulary" },
    { id: 152, question: "Antonym of 'Hot'?", answer: "Cold", category: "Vocabulary" },
    { id: 153, question: "Synonym of 'Big'?", answer: "Large", category: "Vocabulary" },
    { id: 154, question: "Antonym of 'Fast'?", answer: "Slow", category: "Vocabulary" },
    { id: 155, question: "Synonym of 'Smart'?", answer: "Intelligent", category: "Vocabulary" },
    { id: 156, question: "Antonym of 'Light' (not heavy)?", answer: "Heavy", category: "Vocabulary" },
    { id: 157, question: "Synonym of 'Quick'?", answer: "Rapid", category: "Vocabulary" },
    { id: 158, question: "Antonym of 'Kind'?", answer: "Cruel", category: "Vocabulary" },
    { id: 159, question: "Synonym of 'Brave'?", answer: "Courageous", category: "Vocabulary" },
    { id: 160, question: "Antonym of 'Early'?", answer: "Late", category: "Vocabulary" },
    { id: 161, question: "Synonym of 'Calm'?", answer: "Peaceful", category: "Vocabulary" },
    { id: 162, question: "Antonym of 'Friend'?", answer: "Enemy", category: "Vocabulary" },
    { id: 163, question: "Synonym of 'Begin'?", answer: "Start", category: "Vocabulary" },
    { id: 164, question: "Antonym of 'Shallow'?", answer: "Deep", category: "Vocabulary" },
    { id: 165, question: "Synonym of 'Ancient'?", answer: "Old", category: "Vocabulary" },
    { id: 166, question: "Antonym of 'Soft'?", answer: "Hard", category: "Vocabulary" },
    { id: 167, question: "Synonym of 'Amazing'?", answer: "Incredible", category: "Vocabulary" },
    { id: 168, question: "Antonym of 'Full'?", answer: "Empty", category: "Vocabulary" },
    { id: 169, question: "Synonym of 'Difficult'?", answer: "Hard", category: "Vocabulary" },
    { id: 170, question: "Antonym of 'Weak'?", answer: "Strong", category: "Vocabulary" },
    { id: 171, question: "Synonym of 'Ordinary'?", answer: "Common", category: "Vocabulary" },
    { id: 172, question: "Antonym of 'Near'?", answer: "Far", category: "Vocabulary" },
    { id: 173, question: "Synonym of 'Quiet'?", answer: "Silent", category: "Vocabulary" },
    { id: 174, question: "Antonym of 'Wet'?", answer: "Dry", category: "Vocabulary" },
    { id: 175, question: "Synonym of 'Bright'?", answer: "Luminous", category: "Vocabulary" },
    { id: 176, question: "Antonym of 'Thick'?", answer: "Thin", category: "Vocabulary" },
    { id: 177, question: "Synonym of 'Generous'?", answer: "Giving", category: "Vocabulary" },
    { id: 178, question: "Antonym of 'Young'?", answer: "Old", category: "Vocabulary" },
    { id: 179, question: "Synonym of 'Content'?", answer: "Happy", category: "Vocabulary" },
    { id: 180, question: "Antonym of 'Dirty'?", answer: "Clean", category: "Vocabulary" },
    { id: 181, question: "Synonym of 'Angry'?", answer: "Furious", category: "Vocabulary" },
    { id: 182, question: "Antonym of 'Up'?", answer: "Down", category: "Vocabulary" },
    { id: 183, question: "Synonym of 'Begin'?", answer: "Initiate", category: "Vocabulary" },
    { id: 184, question: "Antonym of 'Open'?", answer: "Closed", category: "Vocabulary" },
    { id: 185, question: "Synonym of 'Easy'?", answer: "Simple", category: "Vocabulary" },
    { id: 186, question: "Antonym of 'Rich'?", answer: "Poor", category: "Vocabulary" },
    { id: 187, question: "Synonym of 'Lucky'?", answer: "Fortunate", category: "Vocabulary" },
    { id: 188, question: "Antonym of 'Noisy'?", answer: "Quiet", category: "Vocabulary" },
    { id: 189, question: "Synonym of 'Tiny'?", answer: "Minute", category: "Vocabulary" },
    { id: 190, question: "Antonym of 'Wide'?", answer: "Narrow", category: "Vocabulary" },
    { id: 191, question: "Synonym of 'Sick'?", answer: "Ill", category: "Vocabulary" },
    { id: 192, question: "Antonym of 'Hard'?", answer: "Soft", category: "Vocabulary" },
    { id: 193, question: "Synonym of 'Brave'?", answer: "Valiant", category: "Vocabulary" },
    { id: 194, question: "Antonym of 'High'?", answer: "Low", category: "Vocabulary" },
    { id: 195, question: "Synonym of 'Agree'?", answer: "Concur", category: "Vocabulary" },
    { id: 196, question: "Antonym of 'Busy'?", answer: "Idle", category: "Vocabulary" },
    { id: 197, question: "Synonym of 'Funny'?", answer: "Humorous", category: "Vocabulary" },
    { id: 198, question: "Antonym of 'Shiny'?", answer: "Dull", category: "Vocabulary" },
    { id: 199, question: "Synonym of 'Rapid'?", answer: "Swift", category: "Vocabulary" },
    { id: 200, question: "Antonym of 'Young'?", answer: "Elder", category: "Vocabulary" }
];

// Scoring configuration
export const SCORING_CONFIG = {
    MAX_BASE_SCORE: 10000,
    TIME_PENALTY_MULTIPLIER: 5,
    MOVE_PENALTY_MULTIPLIER: 50,
    SPEED_BONUS: 500,
    MOVE_BONUS: 1000
};

// Utility functions
export function getRandomPairs(count) {
    const shuffled = [...QUESTION_ANSWER_PAIRS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function createGameCards(pairs) {
    const cards = [];

    pairs.forEach(pair => {
        // Question card
        cards.push({
            id: `Q${pair.id}`,
            pairId: pair.id,
            type: 'question',
            content: pair.question,
            category: pair.category,
            isFlipped: false,
            isMatched: false
        });

        // Answer card
        cards.push({
            id: `A${pair.id}`,
            pairId: pair.id,
            type: 'answer',
            content: pair.answer,
            category: pair.category,
            isFlipped: false,
            isMatched: false
        });
    });

    // Shuffle the cards
    return cards.sort(() => 0.5 - Math.random());
}

export function calculateScore(totalPairs, movesUsed, timeElapsedInSec, difficulty) {
    const idealMoves = DIFFICULTY_LEVELS[difficulty].idealMoves;
    const timeBonusThreshold = DIFFICULTY_LEVELS[difficulty].timeBonus;

    const timePenalty = timeElapsedInSec * SCORING_CONFIG.TIME_PENALTY_MULTIPLIER;
    const movePenalty = Math.max(0, (movesUsed - idealMoves)) * SCORING_CONFIG.MOVE_PENALTY_MULTIPLIER;

    let score = SCORING_CONFIG.MAX_BASE_SCORE - (timePenalty + movePenalty);

    // Apply bonuses
    if (timeElapsedInSec <= timeBonusThreshold) {
        score += SCORING_CONFIG.SPEED_BONUS;
    }

    if (movesUsed <= idealMoves) {
        score += SCORING_CONFIG.MOVE_BONUS;
    }

    return Math.max(score, 0);
}

export function getFeedbackMessage(accuracy, movesUsed, timeElapsed, idealMoves, timeBonusThreshold) {
    const isExcellent = accuracy === 100 && movesUsed <= idealMoves && timeElapsed <= timeBonusThreshold;
    const isGood = accuracy >= 90 && movesUsed <= idealMoves + 4;
    const isFair = accuracy >= 75 && movesUsed <= idealMoves + 8;

    if (isExcellent) {
        return {
            type: 'excellent',
            message: "🎉 Outstanding! You found all matches flawlessly and swiftly. Keep up the great work!",
            emoji: "🎉"
        };
    } else if (isGood) {
        return {
            type: 'good',
            message: "👍 Great memory! You matched most pairs with only a few extra moves.",
            emoji: "👍"
        };
    } else if (isFair) {
        return {
            type: 'fair',
            message: "Nice effort! A little more focus, and you'll get even better.",
            emoji: "👌"
        };
    } else {
        return {
            type: 'improvement',
            message: "Keep practicing! Try again to improve your recall and speed.",
            emoji: "💪"
        };
    }
} 