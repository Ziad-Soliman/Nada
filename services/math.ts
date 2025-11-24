import { MathProblem, GameId } from '../types';

// --- CONFIGURATION & UTILS ---

const NAMES = ["Captain Nova", "Ranger Leo", "Dr. Sarah", "Pilot Orion", "Engineer Sam", "Luna", "Astro", "Starla", "Major Tom", "Sky"];

// Word Problem Templates
const ADDITION_TEMPLATES = [
  "{name} fixed {n1} solar panels and {n2} antennas. How many repairs did they do in total?",
  "{name} counted {n1} red stars and {n2} blue stars. How many stars did they see?",
  "The rover collected {n1} moon rocks in the morning and {n2} in the afternoon. How many rocks total?",
  "There are {n1} aliens in the cafeteria and {n2} aliens in the gym. How many aliens in total?",
  "{name} has {n1} space stickers and buys {n2} more. How many stickers now?",
];

const SUBTRACTION_TEMPLATES = [
  "The ship had {n1} percent power but lost {n2} percent. What is the power level now?",
  "{name} had {n1} oxygen tanks and used {n2} on the spacewalk. How many are left?",
  "There were {n1} cookies in the jar. The aliens ate {n2}. How many cookies remain?",
  "The rocket needs {n1} screws. {name} has only found {n2}. How many more are needed?",
  "{name} collected {n1} samples but dropped {n2}. How many samples are left?",
];

const MULTIPLICATION_TEMPLATES = [
  "There are {n1} dinosaur nests. Each nest has {n2} eggs. How many eggs in total?",
  "{name} found {n1} fossils. Each fossil is {n2} cm long. What is the total length if lined up (calculate {n1} x {n2})?",
  "The jeep has {n1} wheels. There are {n2} jeeps. How many wheels total?",
  "{name} saw {n1} packs of raptors. Each pack had {n2} raptors. How many raptors?",
  "There are {n1} trees. Each tree has {n2} giant leaves. How many leaves?",
];

const PLACE_VALUE_TEMPLATES = [
  "The crystal glows with a power of {n1}. What is 100 more than this?",
  "We are at depth {n1} meters. If we go 10 meters deeper, what depth are we at?",
  "{name} found a gem worth {n1}. Round this to the nearest 10.",
  "The cave code is {n1}. What is the value of the digit '{digit}'?",
  "There are {n1} bats. Round this number to the nearest 10.",
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// --- GENERATORS ---

function generateSpaceBatch(): MathProblem[] {
  const batch: MathProblem[] = [];
  
  // 5 Simple Addition/Subtraction
  for (let i = 0; i < 5; i++) {
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
        const n1 = getRandomInt(10, 80);
        const n2 = getRandomInt(1, 9);
        batch.push({ num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: false });
    } else {
        const n1 = getRandomInt(20, 99);
        const n2 = getRandomInt(1, 10);
        batch.push({ num1: n1, num2: n2, operation: 'sub', answer: n1 - n2, isWordProblem: false });
    }
  }

  // 5 Word Problems
  for (let i = 0; i < 5; i++) {
    const isAdd = Math.random() > 0.5;
    const name = getRandomItem(NAMES);
    
    if (isAdd) {
        const n1 = getRandomInt(10, 50);
        const n2 = getRandomInt(5, 40);
        const text = getRandomItem(ADDITION_TEMPLATES).replace('{name}', name).replace('{n1}', n1.toString()).replace('{n2}', n2.toString());
        batch.push({ num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: true, questionText: text });
    } else {
        const n1 = getRandomInt(30, 90);
        const n2 = getRandomInt(5, 20);
        const text = getRandomItem(SUBTRACTION_TEMPLATES).replace('{name}', name).replace('{n1}', n1.toString()).replace('{n2}', n2.toString());
        batch.push({ num1: n1, num2: n2, operation: 'sub', answer: n1 - n2, isWordProblem: true, questionText: text });
    }
  }
  
  return shuffleArray(batch);
}

function generateDinoBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const tables = [2, 3, 4, 5, 8, 10]; // Cambridge Y3 focus

    // 5 Simple Multiplication/Division
    for (let i = 0; i < 5; i++) {
        const isMul = Math.random() > 0.3; // Mostly multiplication
        const table = getRandomItem(tables);
        const factor = getRandomInt(2, 12);
        
        if (isMul) {
            batch.push({ num1: table, num2: factor, operation: 'mul', answer: table * factor, isWordProblem: false });
        } else {
            // Create clean division
            const product = table * factor;
            batch.push({ num1: product, num2: table, operation: 'div', answer: factor, isWordProblem: false });
        }
    }

    // 5 Word Problems
    for (let i = 0; i < 5; i++) {
        const name = getRandomItem(NAMES);
        const table = getRandomItem(tables);
        const factor = getRandomInt(2, 10);
        const text = getRandomItem(MULTIPLICATION_TEMPLATES)
            .replace('{name}', name)
            .replace('{n1}', table.toString())
            .replace('{n2}', factor.toString());

        batch.push({ num1: table, num2: factor, operation: 'mul', answer: table * factor, isWordProblem: true, questionText: text });
    }

    return shuffleArray(batch);
}

function generateCaveBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    
    // 10 Mixed Place Value Problems
    for (let i = 0; i < 10; i++) {
        const type = getRandomInt(1, 3); // 1: Rounding, 2: Place Value ID, 3: More/Less
        const name = getRandomItem(NAMES);

        if (type === 1) {
            // Rounding to nearest 10
            const n = getRandomInt(11, 99);
            // Skip numbers ending in 5 to avoid confusion if not standard
            const safeN = n % 10 === 5 ? n + 1 : n; 
            const rounded = Math.round(safeN / 10) * 10;
            const text = `Round the crystal value ${safeN} to the nearest 10.`;
            batch.push({ num1: safeN, num2: 10, operation: 'round', answer: rounded, isWordProblem: true, questionText: text });
        } else if (type === 2) {
             // 10 or 100 more/less
             const n = getRandomInt(100, 800);
             const isMore = Math.random() > 0.5;
             const val = Math.random() > 0.5 ? 10 : 100;
             const text = `The cave depth is ${n}. Go ${val} meters ${isMore ? 'deeper (add)' : 'up (subtract)'}.`;
             batch.push({ num1: n, num2: val, operation: 'val', answer: isMore ? n + val : n - val, isWordProblem: true, questionText: text });
        } else {
            // Value of a digit
            // Simplified for text input: "What is 10 more than..." is safer than "Value of digit" which might need context
            const n = getRandomInt(200, 900);
            const text = `${name} found ${n} gold coins. If they find 10 more, how many?`;
            batch.push({ num1: n, num2: 10, operation: 'add', answer: n + 10, isWordProblem: true, questionText: text });
        }
    }
    return shuffleArray(batch);
}

// --- PUBLIC API ---

export const getGameBatch = (gameId: GameId): MathProblem[] => {
  switch (gameId) {
    case 'dino': return generateDinoBatch();
    case 'cave': return generateCaveBatch();
    case 'space': default: return generateSpaceBatch();
  }
};
