// Early Detection Quiz Data for Alzheimer's Disease & MCI

export const QUIZ_TYPES = {
    QUICK: 'quick',
    COMPREHENSIVE: 'comprehensive'
};

export const DOMAINS = {
    MEMORY: 'Memory',
    ORIENTATION: 'Orientation',
    LANGUAGE: 'Language',
    EXECUTIVE: 'Executive Function',
    ATTENTION: 'Attention'
};

export const DOMAIN_WEIGHTS = {
    [DOMAINS.MEMORY]: 2,
    [DOMAINS.ORIENTATION]: 2,
    [DOMAINS.LANGUAGE]: 1,
    [DOMAINS.EXECUTIVE]: 1,
    [DOMAINS.ATTENTION]: 1
};

// Quick Test Questions (6 questions)
export const quickTestQuestions = [
    {
        id: 'Q1',
        domain: DOMAINS.MEMORY,
        text: 'Do you often forget where you placed everyday items (e.g., keys, glasses)?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'Q2',
        domain: DOMAINS.ORIENTATION,
        text: 'Do you sometimes lose track of what day, date, or month it currently is?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'Q3',
        domain: DOMAINS.LANGUAGE,
        text: 'Do you find it hard to follow a conversation or repeat what was just said?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'Q4',
        domain: DOMAINS.EXECUTIVE,
        text: 'Have you struggled recently to plan or complete a familiar task (e.g., cooking a simple meal)?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'Q5',
        domain: DOMAINS.ATTENTION,
        text: 'Do you feel easily distracted or have difficulty concentrating on simple tasks (e.g., reading a short paragraph)?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'Q6',
        domain: DOMAINS.LANGUAGE,
        text: 'Do you sometimes have trouble finding the correct words when speaking?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    }
];

// Comprehensive Test Questions (20 questions)
export const comprehensiveTestQuestions = [
    // Memory Questions (C1-C4)
    {
        id: 'C1',
        domain: DOMAINS.MEMORY,
        text: 'How often do you forget recent events (e.g., what you had for breakfast yesterday)?',
        type: 'multiple_choice',
        options: [
            { label: 'A) Never', value: 'never', score: 0 },
            { label: 'B) Occasionally (once a week)', value: 'occasionally', score: 0 },
            { label: 'C) Frequently (several times a week)', value: 'frequently', score: 1 }
        ]
    },
    {
        id: 'C2',
        domain: DOMAINS.MEMORY,
        text: 'In the last month, have you had difficulty remembering a short list of items (e.g., three groceries)?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'C3',
        domain: DOMAINS.MEMORY,
        text: 'Can you recall a recent appointment or event without checking a reminder?',
        type: 'multiple_choice',
        options: [
            { label: 'A) Yes, easily', value: 'easily', score: 0 },
            { label: 'B) With some effort', value: 'effort', score: 0 },
            { label: 'C) No, I need reminders', value: 'need_reminders', score: 1 }
        ]
    },
    {
        id: 'C4',
        domain: DOMAINS.MEMORY,
        text: 'Do you repeat the same question or story because you forgot you already asked or told it?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },

    // Orientation Questions (C5-C8)
    {
        id: 'C5',
        domain: DOMAINS.ORIENTATION,
        text: 'What day of the week is it today?',
        type: 'multiple_choice',
        options: [
            { label: 'A) Correct day', value: 'correct', score: 0 },
            { label: 'B) One day off or unsure', value: 'one_off', score: 1 },
            { label: 'C) More than one day off', value: 'multiple_off', score: 1 }
        ]
    },
    {
        id: 'C6',
        domain: DOMAINS.ORIENTATION,
        text: 'Which year is it right now?',
        type: 'multiple_choice',
        options: [
            { label: 'A) Correct', value: 'correct', score: 0 },
            { label: 'B) Off by 1 year', value: 'one_year_off', score: 1 },
            { label: 'C) Off by more than 1 year', value: 'multiple_years_off', score: 1 }
        ]
    },
    {
        id: 'C7',
        domain: DOMAINS.ORIENTATION,
        text: 'Where are you right now? (e.g., home, work, clinic)',
        type: 'multiple_choice',
        options: [
            { label: 'A) Correct place', value: 'correct', score: 0 },
            { label: 'B) Unsure or wrong', value: 'wrong', score: 1 }
        ]
    },
    {
        id: 'C8',
        domain: DOMAINS.ORIENTATION,
        text: 'Can you state the current month?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 0 },
            { label: 'No', value: 'no', score: 1 }
        ]
    },

    // Language Questions (C9-C12)
    {
        id: 'C9',
        domain: DOMAINS.LANGUAGE,
        text: 'Which of these objects is used for writing?',
        type: 'multiple_choice',
        options: [
            { label: 'A) Spoon', value: 'spoon', score: 1 },
            { label: 'B) Telephone', value: 'telephone', score: 1 },
            { label: 'C) Pen', value: 'pen', score: 0 },
            { label: 'D) Plate', value: 'plate', score: 1 }
        ]
    },
    {
        id: 'C10',
        domain: DOMAINS.LANGUAGE,
        text: 'Finish this sentence: "A bird can ______."',
        type: 'multiple_choice',
        options: [
            { label: 'A) Swim', value: 'swim', score: 1 },
            { label: 'B) Fly', value: 'fly', score: 0 },
            { label: 'C) Read', value: 'read', score: 1 }
        ]
    },
    {
        id: 'C11',
        domain: DOMAINS.LANGUAGE,
        text: 'Do you have trouble finding the right words when speaking?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'C12',
        domain: DOMAINS.LANGUAGE,
        text: 'Can you name as many animals as possible in one minute? (Self-score: ≥ 10 animals = 0; < 10 = 1)',
        type: 'number_input',
        placeholder: 'Enter number of animals',
        validation: (value) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= 0;
        },
        getScore: (value) => {
            const num = parseInt(value);
            return num >= 10 ? 0 : 1;
        }
    },

    // Executive Function Questions (C13-C16)
    {
        id: 'C13',
        domain: DOMAINS.EXECUTIVE,
        text: 'If you need to cook pasta: which of these steps comes last?',
        type: 'multiple_choice',
        options: [
            { label: 'A) Boil water', value: 'boil_water', score: 1 },
            { label: 'B) Drain pasta', value: 'drain_pasta', score: 0 },
            { label: 'C) Add salt to water', value: 'add_salt', score: 1 }
        ]
    },
    {
        id: 'C14',
        domain: DOMAINS.EXECUTIVE,
        text: 'You have $2.75. You buy a snack costing $1.20. How much change should you get?',
        type: 'multiple_choice',
        options: [
            { label: 'A) $1.55', value: '1.55', score: 0 },
            { label: 'B) $2.00', value: '2.00', score: 1 },
            { label: 'C) $1.75', value: '1.75', score: 1 }
        ]
    },
    {
        id: 'C15',
        domain: DOMAINS.EXECUTIVE,
        text: 'When planning an outing: do you find it hard to set a simple schedule (e.g., decide when to leave and what to bring)?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'C16',
        domain: DOMAINS.EXECUTIVE,
        text: 'Can you follow a simple recipe (e.g., mixing two ingredients) without getting confused?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 0 },
            { label: 'No', value: 'no', score: 1 }
        ]
    },

    // Attention Questions (C17-C20)
    {
        id: 'C17',
        domain: DOMAINS.ATTENTION,
        text: 'When reading a short paragraph, do you lose your place or need to reread often?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'C18',
        domain: DOMAINS.ATTENTION,
        text: 'Can you count backward from 20 by 3s (20, 17, 14, …) without mistakes?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 0 },
            { label: 'No', value: 'no', score: 1 }
        ]
    },
    {
        id: 'C19',
        domain: DOMAINS.ATTENTION,
        text: 'Do you feel easily distracted when doing a simple task (e.g., watching a short video)?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 1 },
            { label: 'No', value: 'no', score: 0 }
        ]
    },
    {
        id: 'C20',
        domain: DOMAINS.ATTENTION,
        text: 'When someone talks to you, can you repeat back three simple words they just said (e.g., "dog," "car," "tree")?',
        type: 'yes_no',
        options: [
            { label: 'Yes', value: 'yes', score: 0 },
            { label: 'No', value: 'no', score: 1 }
        ]
    }
];

// Scoring thresholds
export const QUICK_TEST_THRESHOLDS = {
    NORMAL: { min: 0, max: 1, label: 'Likely normal cognition', color: 'green' },
    MCI: { min: 2, max: 3, label: 'Possible MCI (recommend further evaluation)', color: 'yellow' },
    ALZHEIMERS: { min: 4, max: 6, label: 'Possible early Alzheimer\'s (recommend prompt medical assessment)', color: 'red' }
};

export const COMPREHENSIVE_TEST_THRESHOLDS = {
    NORMAL: { min: 0, max: 3, label: 'Likely normal cognition', color: 'green' },
    MCI: { min: 4, max: 7, label: 'Possible MCI (consider professional evaluation)', color: 'yellow' },
    ALZHEIMERS: { min: 8, max: 20, label: 'Possible early Alzheimer\'s (recommend medical assessment)', color: 'red' }
};

// Disclaimer text
export const DISCLAIMER_TEXT = `This quiz is for informational purposes only and is NOT a diagnostic tool. 
If you have concerns about your cognitive health, please consult a qualified healthcare professional.`; 