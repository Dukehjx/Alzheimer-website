// Sequence Ordering Game Data

export const DIFFICULTY_LEVELS = {
    EASY: {
        name: 'Easy',
        description: 'Simple daily routines (4-7 steps)',
        stepCount: [4, 5, 6, 7], // Variable step count
        timeLimit: 120, // seconds - increased for longer sequences
        basePoints: 10,
        perfectBonus: 50,
        timedBonusMultiplier: 1
    },
    MEDIUM: {
        name: 'Medium',
        description: 'Process sequences (4-6 steps)',
        stepCount: [4, 5, 6], // Variable step count
        timeLimit: 150, // seconds
        basePoints: 15,
        perfectBonus: 75,
        timedBonusMultiplier: 1.5
    },
    HARD: {
        name: 'Hard',
        description: 'Complex processes (5-6 steps)',
        stepCount: [5, 6], // Variable step count
        timeLimit: 180, // seconds
        basePoints: 20,
        perfectBonus: 100,
        timedBonusMultiplier: 2
    }
};

export const GAME_MODES = {
    UNTIMED: 'untimed',
    TIMED: 'timed'
};

// Challenge categories with their sequences
export const SEQUENCE_CHALLENGES = [
    // Easy Difficulty - Daily Morning Routines
    {
        id: "dmr_01",
        category: "Daily Morning Routine",
        difficulty: "EASY",
        icon: "☀️",
        steps: [
            { stepId: "1", text: "Wake up", correctIndex: 0 },
            { stepId: "2", text: "Turn off alarm", correctIndex: 1 },
            { stepId: "3", text: "Brush teeth", correctIndex: 2 },
            { stepId: "4", text: "Take a shower", correctIndex: 3 },
            { stepId: "5", text: "Get dressed", correctIndex: 4 },
            { stepId: "6", text: "Eat breakfast", correctIndex: 5 },
            { stepId: "7", text: "Leave for work/school", correctIndex: 6 }
        ]
    },
    {
        id: "dmr_02",
        category: "Daily Morning Routine",
        difficulty: "EASY",
        icon: "☀️",
        steps: [
            { stepId: "1", text: "Wake up", correctIndex: 0 },
            { stepId: "2", text: "Make the bed", correctIndex: 1 },
            { stepId: "3", text: "Wash face", correctIndex: 2 },
            { stepId: "4", text: "Brush teeth", correctIndex: 3 },
            { stepId: "5", text: "Eat breakfast", correctIndex: 4 },
            { stepId: "6", text: "Pack bag", correctIndex: 5 },
            { stepId: "7", text: "Head out", correctIndex: 6 }
        ]
    },
    {
        id: "dmr_03",
        category: "Daily Morning Routine",
        difficulty: "EASY",
        icon: "☀️",
        steps: [
            { stepId: "1", text: "Wake up", correctIndex: 0 },
            { stepId: "2", text: "Stretch for 2 minutes", correctIndex: 1 },
            { stepId: "3", text: "Brush teeth", correctIndex: 2 },
            { stepId: "4", text: "Get dressed", correctIndex: 3 },
            { stepId: "5", text: "Prepare coffee", correctIndex: 4 },
            { stepId: "6", text: "Eat breakfast", correctIndex: 5 },
            { stepId: "7", text: "Leave for work/school", correctIndex: 6 }
        ]
    },
    {
        id: "dmr_04",
        category: "Daily Morning Routine",
        difficulty: "EASY",
        icon: "☀️",
        steps: [
            { stepId: "1", text: "Wake up", correctIndex: 0 },
            { stepId: "2", text: "Drink a glass of water", correctIndex: 1 },
            { stepId: "3", text: "Brush teeth", correctIndex: 2 },
            { stepId: "4", text: "Shower", correctIndex: 3 },
            { stepId: "5", text: "Get dressed", correctIndex: 4 },
            { stepId: "6", text: "Eat breakfast", correctIndex: 5 },
            { stepId: "7", text: "Walk out the door", correctIndex: 6 }
        ]
    },
    {
        id: "dmr_05",
        category: "Daily Morning Routine",
        difficulty: "EASY",
        icon: "☀️",
        steps: [
            { stepId: "1", text: "Alarm rings", correctIndex: 0 },
            { stepId: "2", text: "Turn off alarm", correctIndex: 1 },
            { stepId: "3", text: "Wash face", correctIndex: 2 },
            { stepId: "4", text: "Brush teeth", correctIndex: 3 },
            { stepId: "5", text: "Make a quick breakfast", correctIndex: 4 },
            { stepId: "6", text: "Get dressed", correctIndex: 5 },
            { stepId: "7", text: "Leave for the day", correctIndex: 6 }
        ]
    },

    // Easy Difficulty - Evening Wind-Down Routines
    {
        id: "ewr_01",
        category: "Evening Wind-Down Routine",
        difficulty: "EASY",
        icon: "🌙",
        steps: [
            { stepId: "1", text: "Finish dinner", correctIndex: 0 },
            { stepId: "2", text: "Wash dishes", correctIndex: 1 },
            { stepId: "3", text: "Brush teeth", correctIndex: 2 },
            { stepId: "4", text: "Read a book", correctIndex: 3 },
            { stepId: "5", text: "Turn off lights and go to bed", correctIndex: 4 }
        ]
    },
    {
        id: "ewr_02",
        category: "Evening Wind-Down Routine",
        difficulty: "EASY",
        icon: "🌙",
        steps: [
            { stepId: "1", text: "Eat dinner", correctIndex: 0 },
            { stepId: "2", text: "Wash face", correctIndex: 1 },
            { stepId: "3", text: "Brush teeth", correctIndex: 2 },
            { stepId: "4", text: "Put on pajamas", correctIndex: 3 },
            { stepId: "5", text: "Read for 10 minutes", correctIndex: 4 },
            { stepId: "6", text: "Go to bed", correctIndex: 5 }
        ]
    },
    {
        id: "ewr_03",
        category: "Evening Wind-Down Routine",
        difficulty: "EASY",
        icon: "🌙",
        steps: [
            { stepId: "1", text: "Finish dinner", correctIndex: 0 },
            { stepId: "2", text: "Wash dishes", correctIndex: 1 },
            { stepId: "3", text: "Change into pajamas", correctIndex: 2 },
            { stepId: "4", text: "Brush teeth", correctIndex: 3 },
            { stepId: "5", text: "Set alarm", correctIndex: 4 },
            { stepId: "6", text: "Go to bed", correctIndex: 5 }
        ]
    },

    // Easy Difficulty - Logical Processes
    {
        id: "lp_01_make_tea",
        category: "Making a Cup of Tea",
        difficulty: "EASY",
        icon: "🫖",
        steps: [
            { stepId: "1", text: "Boil water", correctIndex: 0 },
            { stepId: "2", text: "Place tea bag in cup", correctIndex: 1 },
            { stepId: "3", text: "Pour hot water into cup", correctIndex: 2 },
            { stepId: "4", text: "Steep for 3 minutes", correctIndex: 3 },
            { stepId: "5", text: "Remove tea bag and enjoy", correctIndex: 4 }
        ]
    },
    {
        id: "lp_02_make_coffee",
        category: "Making Coffee",
        difficulty: "EASY",
        icon: "☕",
        steps: [
            { stepId: "1", text: "Add coffee grounds to filter", correctIndex: 0 },
            { stepId: "2", text: "Boil water", correctIndex: 1 },
            { stepId: "3", text: "Pour hot water over grounds", correctIndex: 2 },
            { stepId: "4", text: "Let brew for 4 minutes", correctIndex: 3 },
            { stepId: "5", text: "Pour coffee into mug", correctIndex: 4 }
        ]
    },

    // Medium Difficulty - Short Story Events
    {
        id: "sse_01",
        category: "Short Story Events",
        difficulty: "MEDIUM",
        icon: "📖",
        steps: [
            { stepId: "1", text: "Anna went to the park to feed ducks", correctIndex: 0 },
            { stepId: "2", text: "She realized she lost her jacket", correctIndex: 1 },
            { stepId: "3", text: "She retraced her steps to the bench", correctIndex: 2 },
            { stepId: "4", text: "She found her jacket and returned home", correctIndex: 3 }
        ]
    },
    {
        id: "sse_02",
        category: "Short Story Events",
        difficulty: "MEDIUM",
        icon: "📖",
        steps: [
            { stepId: "1", text: "Tom spilled coffee on his shirt", correctIndex: 0 },
            { stepId: "2", text: "He went home to change", correctIndex: 1 },
            { stepId: "3", text: "He returned to work late", correctIndex: 2 },
            { stepId: "4", text: "His boss gave him extra tasks", correctIndex: 3 }
        ]
    },
    {
        id: "sse_03",
        category: "Short Story Events",
        difficulty: "MEDIUM",
        icon: "📖",
        steps: [
            { stepId: "1", text: "Lucy baked cookies for a bake sale", correctIndex: 0 },
            { stepId: "2", text: "She dropped the tray and cookies fell", correctIndex: 1 },
            { stepId: "3", text: "She cleaned up the mess and baked again", correctIndex: 2 },
            { stepId: "4", text: "She sold all the cookies at the sale", correctIndex: 3 }
        ]
    },

    // Medium Difficulty - Plant Growth Cycles
    {
        id: "pgc_01_tomato",
        category: "Plant Growth Cycle",
        difficulty: "MEDIUM",
        icon: "🌱",
        steps: [
            { stepId: "1", text: "Plant tomato seed in soil", correctIndex: 0 },
            { stepId: "2", text: "Water seed daily", correctIndex: 1 },
            { stepId: "3", text: "Seed germinates into seedling", correctIndex: 2 },
            { stepId: "4", text: "Seedling grows leaves", correctIndex: 3 },
            { stepId: "5", text: "Plant produces flowers", correctIndex: 4 },
            { stepId: "6", text: "Flowers turn into tomatoes", correctIndex: 5 }
        ]
    },
    {
        id: "pgc_02_sunflower",
        category: "Plant Growth Cycle",
        difficulty: "MEDIUM",
        icon: "🌻",
        steps: [
            { stepId: "1", text: "Plant sunflower seed in soil", correctIndex: 0 },
            { stepId: "2", text: "Water seed", correctIndex: 1 },
            { stepId: "3", text: "Seed germinates", correctIndex: 2 },
            { stepId: "4", text: "Sprout emerges above ground", correctIndex: 3 },
            { stepId: "5", text: "Sprout grows tall stalk", correctIndex: 4 },
            { stepId: "6", text: "Plant blossoms into large sunflower", correctIndex: 5 }
        ]
    },

    // Medium Difficulty - Butterfly Life Cycles
    {
        id: "blc_01_monarch",
        category: "Butterfly Life Cycle",
        difficulty: "MEDIUM",
        icon: "🦋",
        steps: [
            { stepId: "1", text: "Egg is laid on a milkweed leaf", correctIndex: 0 },
            { stepId: "2", text: "Caterpillar (larva) hatches and eats leaves", correctIndex: 1 },
            { stepId: "3", text: "Caterpillar forms chrysalis (pupa)", correctIndex: 2 },
            { stepId: "4", text: "Chrysalis hardens and changes color", correctIndex: 3 },
            { stepId: "5", text: "Adult monarch butterfly emerges", correctIndex: 4 }
        ]
    },
    {
        id: "blc_02_swallowtail",
        category: "Butterfly Life Cycle",
        difficulty: "MEDIUM",
        icon: "🦋",
        steps: [
            { stepId: "1", text: "Female lays eggs on host plant", correctIndex: 0 },
            { stepId: "2", text: "Larva hatches and feeds on leaves", correctIndex: 1 },
            { stepId: "3", text: "Larva matures and spins a chrysalis", correctIndex: 2 },
            { stepId: "4", text: "Pupa stage lasts about two weeks", correctIndex: 3 },
            { stepId: "5", text: "Adult swallowtail exits chrysalis", correctIndex: 4 }
        ]
    },

    // Medium Difficulty - Sending Email Processes
    {
        id: "sep_01_basic_email",
        category: "Sending an Email",
        difficulty: "MEDIUM",
        icon: "📧",
        steps: [
            { stepId: "1", text: "Open email client or webmail", correctIndex: 0 },
            { stepId: "2", text: "Click 'Compose' or 'New Message'", correctIndex: 1 },
            { stepId: "3", text: "Enter recipient's address", correctIndex: 2 },
            { stepId: "4", text: "Add subject line", correctIndex: 3 },
            { stepId: "5", text: "Type message body", correctIndex: 4 },
            { stepId: "6", text: "Click 'Send'", correctIndex: 5 }
        ]
    },
    {
        id: "sep_02_with_attachment",
        category: "Sending Email with Attachment",
        difficulty: "MEDIUM",
        icon: "📧",
        steps: [
            { stepId: "1", text: "Open email application", correctIndex: 0 },
            { stepId: "2", text: "Click 'Compose'", correctIndex: 1 },
            { stepId: "3", text: "Enter recipient and subject", correctIndex: 2 },
            { stepId: "4", text: "Click attachment icon", correctIndex: 3 },
            { stepId: "5", text: "Select file to attach", correctIndex: 4 },
            { stepId: "6", text: "Type message and click 'Send'", correctIndex: 5 }
        ]
    },

    // Medium Difficulty - Math Problem Solving
    {
        id: "mps_01_solve_linear",
        category: "Solving Linear Equation",
        difficulty: "MEDIUM",
        icon: "🧮",
        steps: [
            { stepId: "1", text: "Read the equation 2x + 3 = 11", correctIndex: 0 },
            { stepId: "2", text: "Subtract 3 from both sides (2x = 8)", correctIndex: 1 },
            { stepId: "3", text: "Divide both sides by 2 (x = 4)", correctIndex: 2 },
            { stepId: "4", text: "Check by substituting x back into original equation", correctIndex: 3 },
            { stepId: "5", text: "State final answer x = 4", correctIndex: 4 }
        ]
    },
    {
        id: "mps_04_find_area_triangle",
        category: "Finding Triangle Area",
        difficulty: "MEDIUM",
        icon: "🧮",
        steps: [
            { stepId: "1", text: "Read problem: Base = 5, Height = 4", correctIndex: 0 },
            { stepId: "2", text: "Recall formula area = (1/2) × base × height", correctIndex: 1 },
            { stepId: "3", text: "Plug in values: (1/2) × 5 × 4", correctIndex: 2 },
            { stepId: "4", text: "Calculate area = 10", correctIndex: 3 },
            { stepId: "5", text: "State final answer area = 10", correctIndex: 4 }
        ]
    },

    // Hard Difficulty - Historical Timelines
    {
        id: "htl_01_communication_inventions",
        category: "Communication Inventions Timeline",
        difficulty: "HARD",
        icon: "📻",
        steps: [
            { stepId: "1", text: "Invention of the Printing Press (1440)", correctIndex: 0 },
            { stepId: "2", text: "Telegraph Developed (1837)", correctIndex: 1 },
            { stepId: "3", text: "Telephone Patented (1876)", correctIndex: 2 },
            { stepId: "4", text: "Radio Broadcast Begins (1906)", correctIndex: 3 },
            { stepId: "5", text: "Television Introduced (1927)", correctIndex: 4 },
            { stepId: "6", text: "Internet Publicly Available (1990s)", correctIndex: 5 }
        ]
    },
    {
        id: "htl_03_space_exploration",
        category: "Space Exploration Timeline",
        difficulty: "HARD",
        icon: "🚀",
        steps: [
            { stepId: "1", text: "Sputnik 1 Launched (1957)", correctIndex: 0 },
            { stepId: "2", text: "First Human in Space: Yuri Gagarin (1961)", correctIndex: 1 },
            { stepId: "3", text: "Apollo 11 Moon Landing (1969)", correctIndex: 2 },
            { stepId: "4", text: "Voyager Probes Launched (1977)", correctIndex: 3 },
            { stepId: "5", text: "International Space Station Assembly Begins (1998)", correctIndex: 4 },
            { stepId: "6", text: "First Private Spaceflight: SpaceX (2008)", correctIndex: 5 }
        ]
    },
    {
        id: "htl_04_computing_milestones",
        category: "Computing Milestones Timeline",
        difficulty: "HARD",
        icon: "💻",
        steps: [
            { stepId: "1", text: "ENIAC Completed (1945)", correctIndex: 0 },
            { stepId: "2", text: "First Commercial Computer (UNIVAC, 1951)", correctIndex: 1 },
            { stepId: "3", text: "IBM PC Released (1981)", correctIndex: 2 },
            { stepId: "4", text: "World Wide Web Invented (1989)", correctIndex: 3 },
            { stepId: "5", text: "Smartphone Introduced (2007)", correctIndex: 4 },
            { stepId: "6", text: "Cloud Computing Becomes Mainstream (2010s)", correctIndex: 5 }
        ]
    },

    // Hard Difficulty - Water Cycle Processes
    {
        id: "wcp_01_standard",
        category: "Water Cycle Stages",
        difficulty: "HARD",
        icon: "💧",
        steps: [
            { stepId: "1", text: "Evaporation from oceans and lakes", correctIndex: 0 },
            { stepId: "2", text: "Water vapor rises", correctIndex: 1 },
            { stepId: "3", text: "Condensation into clouds", correctIndex: 2 },
            { stepId: "4", text: "Precipitation (rain or snow)", correctIndex: 3 },
            { stepId: "5", text: "Runoff into rivers and streams", correctIndex: 4 },
            { stepId: "6", text: "Collection in bodies of water", correctIndex: 5 }
        ]
    },
    {
        id: "wcp_03_rainforest_illustration",
        category: "Rainforest Water Cycle",
        difficulty: "HARD",
        icon: "🌧️",
        steps: [
            { stepId: "1", text: "Sun heats forest floor moisture", correctIndex: 0 },
            { stepId: "2", text: "Evaporation and transpiration occur", correctIndex: 1 },
            { stepId: "3", text: "Moist air rises and cools", correctIndex: 2 },
            { stepId: "4", text: "Condensation forms dense clouds", correctIndex: 3 },
            { stepId: "5", text: "Heavy rain falls on forest", correctIndex: 4 },
            { stepId: "6", text: "Water collects in streams and rivers", correctIndex: 5 }
        ]
    },

    // Hard Difficulty - Complex Math Problems
    {
        id: "mps_02_solve_quadratic",
        category: "Solving Quadratic Equation",
        difficulty: "HARD",
        icon: "🧮",
        steps: [
            { stepId: "1", text: "Read the equation x^2 - 5x + 6 = 0", correctIndex: 0 },
            { stepId: "2", text: "Factor into (x - 2)(x - 3) = 0", correctIndex: 1 },
            { stepId: "3", text: "Set each factor equal to zero (x - 2 = 0, x - 3 = 0)", correctIndex: 2 },
            { stepId: "4", text: "Solve: x = 2 or x = 3", correctIndex: 3 },
            { stepId: "5", text: "Check each solution in original equation", correctIndex: 4 }
        ]
    },
    {
        id: "mps_03_solve_system",
        category: "Solving System of Equations",
        difficulty: "HARD",
        icon: "🧮",
        steps: [
            { stepId: "1", text: "Read the system: 2x + y = 5 and x - y = 1", correctIndex: 0 },
            { stepId: "2", text: "Solve second equation for y (y = x - 1)", correctIndex: 1 },
            { stepId: "3", text: "Substitute y into first: 2x + (x - 1) = 5", correctIndex: 2 },
            { stepId: "4", text: "Simplify: 3x - 1 = 5, so 3x = 6, x = 2", correctIndex: 3 },
            { stepId: "5", text: "Find y: 2 - 1 = 1; solution is (2, 1)", correctIndex: 4 }
        ]
    }
];

// Utility functions
export function getRandomChallenge(difficulty = null) {
    let availableChallenges = SEQUENCE_CHALLENGES;

    if (difficulty) {
        availableChallenges = SEQUENCE_CHALLENGES.filter(challenge =>
            challenge.difficulty === difficulty
        );
    }

    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    return availableChallenges[randomIndex];
}

export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function createShuffledChallenge(challengeId) {
    const challenge = SEQUENCE_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return null;

    const stepIds = challenge.steps.map(step => step.stepId);
    const shuffledOrder = shuffleArray(stepIds);

    return {
        ...challenge,
        shuffledOrder: shuffledOrder
    };
}

export function calculateScore(challenge, userOrder, timeElapsed, gameMode) {
    const difficultyLevel = DIFFICULTY_LEVELS[challenge.difficulty];
    let correctCount = 0;

    // Count correct positions
    challenge.steps.forEach(step => {
        const currentIndex = userOrder.indexOf(step.stepId);
        if (currentIndex === step.correctIndex) {
            correctCount++;
        }
    });

    // Calculate scores
    const basePoints = correctCount * difficultyLevel.basePoints;
    const accuracy = (correctCount / challenge.steps.length) * 100;
    const perfectBonus = (correctCount === challenge.steps.length) ? difficultyLevel.perfectBonus : 0;

    let timedBonus = 0;
    if (gameMode === GAME_MODES.TIMED && timeElapsed < difficultyLevel.timeLimit) {
        const remainingTime = difficultyLevel.timeLimit - timeElapsed;
        timedBonus = Math.floor(remainingTime * difficultyLevel.timedBonusMultiplier);
    }

    const finalScore = basePoints + perfectBonus + timedBonus;

    return {
        correctCount,
        totalSteps: challenge.steps.length,
        accuracy,
        basePoints,
        perfectBonus,
        timedBonus,
        finalScore
    };
}

export function getFeedbackMessage(correctCount, totalSteps, accuracy) {
    if (correctCount === totalSteps) {
        return "🎉 Fantastic! You arranged every step correctly!";
    } else if (accuracy >= 80) {
        return `Great job! You got ${correctCount} out of ${totalSteps} correct.`;
    } else if (accuracy >= 60) {
        return `Good effort! You got ${correctCount} out of ${totalSteps} correct. Try again to perfect your sequence!`;
    } else if (accuracy >= 40) {
        return `Keep practicing! You got ${correctCount} out of ${totalSteps} correct. Focus on the logical flow.`;
    } else {
        return `Don't give up! You got ${correctCount} out of ${totalSteps} correct. Consider the step-by-step process carefully.`;
    }
}

export function getAllChallengesByDifficulty() {
    return {
        EASY: SEQUENCE_CHALLENGES.filter(c => c.difficulty === "EASY"),
        MEDIUM: SEQUENCE_CHALLENGES.filter(c => c.difficulty === "MEDIUM"),
        HARD: SEQUENCE_CHALLENGES.filter(c => c.difficulty === "HARD")
    };
} 