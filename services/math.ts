import { MathProblem } from '../types';

// --- CONFIGURATION & UTILS ---

const NAMES = ["Captain Nova", "Ranger Leo", "Dr. Sarah", "Pilot Orion", "Engineer Sam", "Luna", "Astro", "Starla", "Major Tom", "Sky"];
const LOCATIONS = ["on Mars", "in the Nebula", "at the Moon Base", "on the Rocket", "in Sector 7", "in the Lab"];

// Word Problem Templates
// {name} - random name
// {n1} - number 1
// {n2} - number 2
// {sum} - result (for subtraction context if needed, though we usually use n1/n2)

const ADDITION_TEMPLATES = [
  "{name} fixed {n1} solar panels and {n2} antennas. How many repairs did they do in total?",
  "{name} counted {n1} red stars and {n2} blue stars. How many stars did they see?",
  "The rover collected {n1} moon rocks in the morning and {n2} in the afternoon. How many rocks total?",
  "There are {n1} aliens in the cafeteria and {n2} aliens in the gym. How many aliens in total?",
  "{name} has {n1} space stickers and buys {n2} more. How many stickers now?",
  "The spaceship used {n1} liters of fuel for liftoff and {n2} liters for landing. Total fuel used?",
  "We loaded {n1} boxes of food and {n2} boxes of water. How many boxes in the cargo bay?",
  "{name} spotted {n1} comets and {n2} asteroids. How many space objects is that?",
  "Sector A has {n1} robots. Sector B has {n2} robots. How many robots altogether?",
  "{name} flew {n1} miles on Monday and {n2} miles on Tuesday. What is the total distance?",
];

const SUBTRACTION_TEMPLATES = [
  "The ship had {n1} percent power but lost {n2} percent. What is the power level now?",
  "{name} had {n1} oxygen tanks and used {n2} on the spacewalk. How many are left?",
  "There were {n1} cookies in the jar. The aliens ate {n2}. How many cookies remain?",
  "The rocket needs {n1} screws. {name} has only found {n2}. How many more are needed?",
  "{name} collected {n1} samples but dropped {n2}. How many samples are left?",
  "The temperature was {n1} degrees. It dropped by {n2} degrees. What is the temperature now?",
  "There were {n1} asteroids blocking the path. The laser destroyed {n2}. How many are left?",
  "{name} has {n1} minutes of air left. The trip takes {n2} minutes. How much extra air is there?",
  "The inventory showed {n1} batteries. We used {n2}. How many batteries do we have?",
  "A swarm of {n1} space flies attacked. {name} caught {n2}. How many flew away?",
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

// --- DATABASE GENERATION ---

// We will generate a database of 120 questions:
// 60 Simple Math (30 Add, 30 Sub)
// 60 Word Problems (30 Add, 30 Sub)

const QUESTION_DATABASE: MathProblem[] = [];

function generateQuestionDatabase() {
  // 1. Generate Simple Addition (30)
  for (let i = 0; i < 30; i++) {
    const ones1 = getRandomInt(0, 9);
    const ones2 = getRandomInt(0, 9 - ones1);
    const tens1 = getRandomInt(1, 8);
    const tens2 = getRandomInt(1, 9 - tens1);
    const num1 = tens1 * 10 + ones1;
    const num2 = tens2 * 10 + ones2;
    
    QUESTION_DATABASE.push({
      num1, num2, operation: 'add', answer: num1 + num2, isWordProblem: false
    });
  }

  // 2. Generate Simple Subtraction (30)
  for (let i = 0; i < 30; i++) {
    const ones1 = getRandomInt(0, 9);
    const ones2 = getRandomInt(0, ones1);
    const tens1 = getRandomInt(2, 9);
    const tens2 = getRandomInt(1, tens1 - 1);
    const num1 = tens1 * 10 + ones1;
    const num2 = tens2 * 10 + ones2;

    QUESTION_DATABASE.push({
      num1, num2, operation: 'sub', answer: num1 - num2, isWordProblem: false
    });
  }

  // 3. Generate Word Addition (30)
  for (let i = 0; i < 30; i++) {
    const ones1 = getRandomInt(0, 9);
    const ones2 = getRandomInt(0, 9 - ones1);
    const tens1 = getRandomInt(1, 5); // Keep numbers slightly smaller for word problems to be readable
    const tens2 = getRandomInt(1, 6 - tens1);
    const num1 = tens1 * 10 + ones1;
    const num2 = tens2 * 10 + ones2;
    
    const template = getRandomItem(ADDITION_TEMPLATES);
    const name = getRandomItem(NAMES);
    const text = template
      .replace('{name}', name)
      .replace('{n1}', num1.toString())
      .replace('{n2}', num2.toString());

    QUESTION_DATABASE.push({
      num1, num2, operation: 'add', answer: num1 + num2, isWordProblem: true, questionText: text
    });
  }

  // 4. Generate Word Subtraction (30)
  for (let i = 0; i < 30; i++) {
    const ones1 = getRandomInt(0, 9);
    const ones2 = getRandomInt(0, ones1);
    const tens1 = getRandomInt(2, 6);
    const tens2 = getRandomInt(1, tens1 - 1);
    const num1 = tens1 * 10 + ones1;
    const num2 = tens2 * 10 + ones2;

    const template = getRandomItem(SUBTRACTION_TEMPLATES);
    const name = getRandomItem(NAMES);
    const text = template
      .replace('{name}', name)
      .replace('{n1}', num1.toString())
      .replace('{n2}', num2.toString());

    QUESTION_DATABASE.push({
      num1, num2, operation: 'sub', answer: num1 - num2, isWordProblem: true, questionText: text
    });
  }
}

// Initialize the database immediately
generateQuestionDatabase();

// --- PUBLIC API ---

export const getGameBatch = (): MathProblem[] => {
  // Returns 10 questions: 5 Simple, 5 Word, shuffled order within their segments
  // Actually, typical flow is 5 simple THEN 5 word.
  
  // 1. Get all simple problems and shuffle
  const simplePool = shuffleArray(QUESTION_DATABASE.filter(q => !q.isWordProblem));
  const selectedSimple = simplePool.slice(0, 5);

  // 2. Get all word problems and shuffle
  const wordPool = shuffleArray(QUESTION_DATABASE.filter(q => q.isWordProblem));
  const selectedWord = wordPool.slice(0, 5);

  // Return combined list (Simple first, then Word, as per original game flow)
  return [...selectedSimple, ...selectedWord];
};
