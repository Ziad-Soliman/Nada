
import { MathProblem, GameId } from '../types';

// --- CONFIGURATION & UTILS ---

const NAMES = ["Captain Nova", "Ranger Leo", "Dr. Sarah", "Pilot Orion", "Engineer Sam", "Luna", "Astro", "Starla", "Major Tom", "Sky", "Zara", "Ben", "Omar", "Maya", "Kaito"];

// --- WORD PROBLEM TEMPLATES (Expanded) ---

// Space (Add/Sub) - Year 3: Numbers to 1000, 3-digit mental add/sub
const ADDITION_TEMPLATES = [
  "{name} fixed {n1} solar panels and {n2} antennas. How many items did they fix in total?",
  "{name} counted {n1} red stars and {n2} blue stars. How many stars did they see altogether?",
  "The rover collected {n1} moon rocks on Monday and {n2} on Tuesday. How many rocks total?",
  "There are {n1} aliens in the cafeteria and {n2} aliens in the gym. How many aliens in total?",
  "{name} has {n1} space stickers and buys {n2} more. How many stickers do they have now?",
  "A rocket travelled {n1} km and then another {n2} km. How far did it travel in total?",
  "The space station has {n1} oxygen tanks in storage and {n2} in the ship. Total tanks?",
  "Mission control received {n1} signals in the morning and {n2} in the afternoon. What is the sum?",
  "{name} spotted {n1} comets and {n2} asteroids. How many space objects is that?",
  "Sector A has {n1} droids. Sector B has {n2} droids. How many droids combined?",
];

const SUBTRACTION_TEMPLATES = [
  "The ship had {n1}% power but lost {n2}%. What is the power level now?",
  "{name} had {n1} oxygen tanks and used {n2} on the spacewalk. How many are left?",
  "There were {n1} cookies in the jar. The aliens ate {n2}. How many cookies remain?",
  "The rocket needs {n1} screws. {name} has only found {n2}. How many more are needed?",
  "{name} collected {n1} samples but dropped {n2}. How many samples are left?",
  "A meteor swarm had {n1} meteors. {name} blasted {n2} of them. How many are still coming?",
  "The distance is {n1} km. The ship has travelled {n2} km. How far left to go?",
  "There are {n1} stars in the constellation. {n2} faded away. How many are visible?",
  "{name} needs {n1} credits. They have {n2}. How many more credits do they need?",
  "The tank holds {n1} liters of fuel. It used {n2} liters. How much fuel is left?",
];

// Dino (Mul/Div) - Year 3: 3, 4, 8 tables focus + 2, 5, 10 revision
const MULTIPLICATION_TEMPLATES = [
  "There are {n1} dinosaur nests. Each nest has {n2} eggs. How many eggs in total?",
  "{name} found {n1} fossils. Each fossil is {n2} cm long. What is the total length if lined up ({n1} x {n2})?",
  "The jeep has {n1} wheels. There are {n2} jeeps. How many wheels total?",
  "{name} saw {n1} packs of raptors. Each pack had {n2} raptors. How many raptors?",
  "There are {n1} trees. Each tree has {n2} giant leaves. How many leaves?",
  "A T-Rex eats {n1} steaks a day. How many steaks does it eat in {n2} days?",
  "Each dino team has {n1} players. There are {n2} teams. How many players?",
  "{name} takes {n1} photos of each dino. They see {n2} dinos. Total photos?",
  "A dragonfly has {n1} wings. How many wings on {n2} dragonflies?",
  "The fence has {n1} posts. Each post costs {n2} gold coins. Total cost?",
];

const DIVISION_TEMPLATES = [
  "{name} has {n1} bones to share between {n2} dogs. How many bones does each dog get?",
  "There are {n1} eggs in {n2} nests. How many eggs per nest?",
  "{name} made {n1} sandwiches for {n2} explorers. How many sandwiches each?",
  "A rope is {n1} meters long. It is cut into {n2} equal pieces. How long is each piece?",
  "There are {n1} campers in {n2} tents. How many campers per tent?",
  "{name} has {n1} coins. They stack them in piles of {n2}. How many piles?",
  "The jeep travels {n1} km in {n2} hours. How many km per hour?",
  "Divide {n1} fossils into {n2} boxes. How many in each box?",
];

// Ocean (Fractions) - Year 3: 1/2, 1/4, 1/3 of amounts
const FRACTION_TEMPLATES = [
  "The submarine has {n1} windows. 1/{n2} of them are broken. How many are broken?",
  "{name} saw {n1} jellyfish. 1/{n2} of them were glowing. How many were glowing?",
  "There are {n1} gold coins in the chest. {name} takes 1/{n2} of them. How many did they take?",
  "The octopus has {n1} legs. It waves 1/{n2} of them. How many legs is it waving?",
  "A shark lost {n1} teeth. 1/{n2} grew back instantly. How many grew back?",
  "{name} collected {n1} shells. 1/{n2} were pink. How many pink shells?",
  "There are {n1} fish in the school. 1/{n2} are clownfish. How many clownfish?",
  "The coral reef has {n1} colors. 1/{n2} are shades of blue. How many blue shades?",
];

// City (Geometry) - Year 3: 3D/2D properties, Right angles
const GEOMETRY_TEMPLATES_3D = [
  "The skyscraper is a {shape}. How many {prop} does it have?",
  "{name} is building a {shape}. How many {prop} should they build?",
  "Look at the blueprint for the {shape}. Count the {prop}.",
  "The storage tank is a {shape}. How many {prop} does a {shape} have?",
];

const GEOMETRY_TEMPLATES_2D = [
  "The park is shaped like a {shape}. How many {prop} does it have?",
  "The window is a {shape}. How many {prop} can you count?",
  "The road sign is a {shape}. Count the {prop}.",
  "The floor tile is a {shape}. How many {prop} does it have?",
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
  
  // Year 3 Goal: Add/Sub numbers with up to 3 digits.
  // 15 Questions per batch to ensure coverage
  const count = 15; 

  for (let i = 0; i < count; i++) {
    const type = getRandomInt(1, 4); // 1: Simple 3-digit, 2: Word Problem, 3: Missing Number, 4: Crossing 10/100
    const isAdd = Math.random() > 0.5;
    const name = getRandomItem(NAMES);

    if (type === 1) {
        // Direct Calculation (Mental strategies)
        if (isAdd) {
            // e.g., 345 + 30 or 120 + 400
            const n1 = getRandomInt(100, 800);
            const n2 = Math.random() > 0.5 ? getRandomInt(1, 9) * 10 : getRandomInt(1, 9); 
            batch.push({ num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: false });
        } else {
            const n1 = getRandomInt(100, 900);
            const n2 = Math.random() > 0.5 ? getRandomInt(1, 9) * 10 : getRandomInt(1, 9);
            batch.push({ num1: n1, num2: n2, operation: 'sub', answer: n1 - n2, isWordProblem: false });
        }
    } else if (type === 2) {
        // Word Problems
        if (isAdd) {
            const n1 = getRandomInt(20, 400);
            const n2 = getRandomInt(10, 300);
            const text = getRandomItem(ADDITION_TEMPLATES).replace('{name}', name).replace('{n1}', n1.toString()).replace('{n2}', n2.toString());
            batch.push({ num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: true, questionText: text });
        } else {
            const n1 = getRandomInt(50, 500);
            const n2 = getRandomInt(10, n1 - 10);
            const text = getRandomItem(SUBTRACTION_TEMPLATES).replace('{name}', name).replace('{n1}', n1.toString()).replace('{n2}', n2.toString());
            batch.push({ num1: n1, num2: n2, operation: 'sub', answer: n1 - n2, isWordProblem: true, questionText: text });
        }
    } else if (type === 3) {
        // Missing Number: 100 - ? = 40 or 45 + ? = 100
        if (isAdd) {
            const target = 100;
            const known = getRandomInt(10, 90);
            batch.push({ 
                num1: known, num2: 0, operation: 'add', answer: target - known, isWordProblem: true, 
                questionText: `System Check: ${known} + ? = ${target}. What is the missing number?` 
            });
        } else {
            const n1 = getRandomInt(50, 100);
            const diff = getRandomInt(10, 40);
            batch.push({ 
                num1: n1, num2: 0, operation: 'sub', answer: n1 - diff, isWordProblem: true, 
                questionText: `Fuel Leak: ${n1} - ? = ${diff}. How much was lost?` 
            });
        }
    } else {
        // Crossing 100 boundary
        const n1 = getRandomInt(85, 150);
        const n2 = getRandomInt(5, 15);
        if (isAdd) {
             batch.push({ num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: false });
        } else {
             batch.push({ num1: n1, num2: n2, operation: 'sub', answer: n1 - n2, isWordProblem: false });
        }
    }
  }
  
  return shuffleArray(batch);
}

function generateDinoBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const tables = [3, 4, 8]; // Key Year 3
    const reviewTables = [2, 5, 10]; // Review
    const allTables = [...tables, ...reviewTables];
    const count = 15;

    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 3);
        const isMul = Math.random() > 0.4; // 60% Mul, 40% Div
        const name = getRandomItem(NAMES);
        const table = getRandomItem(Math.random() > 0.3 ? tables : reviewTables); // Bias towards new tables
        const factor = getRandomInt(2, 12);

        if (type === 1) {
            // Direct Calc
            if (isMul) {
                batch.push({ num1: table, num2: factor, operation: 'mul', answer: table * factor, isWordProblem: false });
            } else {
                const product = table * factor;
                batch.push({ num1: product, num2: table, operation: 'div', answer: factor, isWordProblem: false });
            }
        } else if (type === 2) {
            // Word Problems
            if (isMul) {
                const text = getRandomItem(MULTIPLICATION_TEMPLATES)
                    .replace('{name}', name).replace('{n1}', table.toString()).replace('{n2}', factor.toString());
                batch.push({ num1: table, num2: factor, operation: 'mul', answer: table * factor, isWordProblem: true, questionText: text });
            } else {
                 const product = table * factor;
                 const text = getRandomItem(DIVISION_TEMPLATES)
                    .replace('{name}', name).replace('{n1}', product.toString()).replace('{n2}', table.toString());
                 batch.push({ num1: product, num2: table, operation: 'div', answer: factor, isWordProblem: true, questionText: text });
            }
        } else {
            // Missing number: ? x 4 = 32
            const product = table * factor;
            batch.push({ 
                num1: 0, num2: table, operation: 'mul', answer: factor, isWordProblem: true, 
                questionText: `Puzzle: ? x ${table} = ${product}. What is the missing number?` 
            });
        }
    }

    return shuffleArray(batch);
}

function generateCaveBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const count = 15;
    
    // Year 3: Place Value to 1000.
    
    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 5); // 1: Rounding, 2: More/Less, 3: Value of Digit, 4: Partitioning, 5: Halfway
        const name = getRandomItem(NAMES);

        if (type === 1) {
            // Rounding
            const n = getRandomInt(11, 899);
            const isTen = Math.random() > 0.5;
            // Ensure not ending in 5 for ambiguity unless we teach "round up" rule strictly. Safe to avoid 5.
            const safeN = n % 10 === 5 ? n + 1 : n;
            
            if (isTen) {
                const rounded = Math.round(safeN / 10) * 10;
                batch.push({ 
                    num1: safeN, num2: 10, operation: 'round', answer: rounded, isWordProblem: true, 
                    questionText: `Round the crystal weight ${safeN} to the nearest 10.` 
                });
            } else {
                const rounded = Math.round(safeN / 100) * 100;
                batch.push({ 
                    num1: safeN, num2: 100, operation: 'round', answer: rounded, isWordProblem: true, 
                    questionText: `Round the depth ${safeN}m to the nearest 100.` 
                });
            }
        } else if (type === 2) {
             // 10 or 100 more/less
             const n = getRandomInt(100, 800);
             const isMore = Math.random() > 0.5;
             const val = Math.random() > 0.5 ? 10 : 100;
             const text = `The cave depth is ${n}m. Go ${val} meters ${isMore ? 'deeper (add)' : 'up (subtract)'}.`;
             batch.push({ num1: n, num2: val, operation: 'val', answer: isMore ? n + val : n - val, isWordProblem: true, questionText: text });
        } else if (type === 3) {
            // Value of a digit
            const h = getRandomInt(1, 9);
            const t = getRandomInt(1, 9);
            const o = getRandomInt(1, 9);
            const number = h * 100 + t * 10 + o;
            
            const targetPos = getRandomInt(1, 3); // 1=H, 2=T, 3=O
            let answer = 0;
            let qText = "";
            
            if (targetPos === 1) { answer = h * 100; qText = `In the number ${number}, what is the value of the digit ${h}?`; }
            else if (targetPos === 2) { answer = t * 10; qText = `In the number ${number}, what is the value of the digit ${t}?`; }
            else { answer = o; qText = `In the number ${number}, what is the value of the digit ${o}?`; }

            // To avoid ambiguity if digits repeat (e.g. 333), check uniqueness or phrase carefully.
            // Simplified: "What is the value of the hundreds digit in X?"
            if (targetPos === 1) { qText = `What is the value of the hundreds digit in ${number}?`; answer = h * 100; }
            if (targetPos === 2) { qText = `What is the value of the tens digit in ${number}?`; answer = t * 10; }
            if (targetPos === 3) { qText = `What is the value of the ones digit in ${number}?`; answer = o; }
            
            batch.push({ num1: number, num2: 0, operation: 'val', answer: answer, isWordProblem: true, questionText: qText });
        } else if (type === 4) {
            // Partitioning: 400 + 50 + ? = 456
            const h = getRandomInt(1, 9) * 100;
            const t = getRandomInt(1, 9) * 10;
            const o = getRandomInt(1, 9);
            const total = h + t + o;
            
            batch.push({ 
                num1: total, num2: 0, operation: 'val', answer: o, isWordProblem: true, 
                questionText: `${h} + ${t} + ? = ${total}. What is the missing number?` 
            });
        } else {
             // 100 more than
             const n = getRandomInt(200, 500);
             batch.push({
                 num1: n, num2: 100, operation: 'add', answer: n + 100, isWordProblem: true,
                 questionText: `What number is 100 more than ${n}?`
             });
        }
    }
    return shuffleArray(batch);
}

function generateOceanBatch(): MathProblem[] {
  const batch: MathProblem[] = [];
  const count = 15;
  
  // Year 3: Fractions 1/2, 1/3, 1/4 of discrete sets. Add/sub fractions with same denominator.
  
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(1, 3); // 1: Fraction of Amount, 2: Add/Sub Fractions, 3: Identify parts
    const name = getRandomItem(NAMES);

    if (type === 1) {
      // Fraction of an amount: Find 1/d of n
      const denominator = getRandomItem([2, 3, 4, 5, 8, 10]);
      const answer = getRandomInt(2, 12);
      const total = answer * denominator; 
      
      const text = getRandomItem(FRACTION_TEMPLATES)
        .replace('{name}', name)
        .replace('{n1}', total.toString())
        .replace('{n2}', denominator.toString());
      
      batch.push({ 
        num1: total, num2: denominator, operation: 'frac', answer: answer, isWordProblem: true, questionText: text 
      });
    } else if (type === 2) {
      // Add/Sub Fractions: 1/5 + 2/5 = ?/5
      const denominator = getRandomItem([5, 6, 7, 8, 9, 10]);
      const n1 = getRandomInt(1, denominator - 2);
      const n2 = getRandomInt(1, denominator - n1); // Ensure sum <= denominator
      const isAdd = Math.random() > 0.5;

      if (isAdd) {
          batch.push({
              num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: true,
              questionText: `Add the fractions: ${n1}/${denominator} + ${n2}/${denominator} = ?/${denominator}. Enter the top number.`
          });
      } else {
          // Sub: Ensure n1 > n2
          const start = getRandomInt(2, denominator);
          const sub = getRandomInt(1, start - 1);
          batch.push({
              num1: start, num2: sub, operation: 'sub', answer: start - sub, isWordProblem: true,
              questionText: `Subtract: ${start}/${denominator} - ${sub}/${denominator} = ?/${denominator}. Enter the top number.`
          });
      }
    } else {
      // Logic
      const num = getRandomInt(1, 5);
      const den = getRandomInt(6, 10);
      batch.push({
          num1: num, num2: den, operation: 'frac', answer: den, isWordProblem: true,
          questionText: `In the fraction ${num}/${den}, what number represents the WHOLE (denominator)?`
      });
    }
  }
  return shuffleArray(batch);
}

function generateCityBatch(): MathProblem[] {
  const batch: MathProblem[] = [];
  const count = 15;
  
  // Year 3: 3D shapes (prism, cylinder, etc), 2D shapes, Right Angles.
  
  const shapes3D = [
    { name: 'Cube', faces: 6, edges: 12, vertices: 8 },
    { name: 'Cuboid', faces: 6, edges: 12, vertices: 8 }, // Rectangular prism
    { name: 'Sphere', faces: 1, edges: 0, vertices: 0 },
    { name: 'Cylinder', faces: 3, edges: 2, vertices: 0 },
    { name: 'Cone', faces: 2, edges: 1, vertices: 1 },
    { name: 'Square Pyramid', faces: 5, edges: 8, vertices: 5 }
  ];

  const shapes2D = [
    { name: 'Triangle', sides: 3, corners: 3, rightAngles: 0 }, // General triangle assumption
    { name: 'Square', sides: 4, corners: 4, rightAngles: 4 },
    { name: 'Rectangle', sides: 4, corners: 4, rightAngles: 4 },
    { name: 'Pentagon', sides: 5, corners: 5, rightAngles: 0 },
    { name: 'Hexagon', sides: 6, corners: 6, rightAngles: 0 },
    { name: 'Octagon', sides: 8, corners: 8, rightAngles: 0 },
    { name: 'Circle', sides: 1, corners: 0, rightAngles: 0 }
  ];

  for (let i = 0; i < count; i++) {
    const is3D = Math.random() > 0.5;
    const name = getRandomItem(NAMES);
    
    if (is3D) {
       const shape = getRandomItem(shapes3D);
       const prop = getRandomItem(['faces', 'edges', 'vertices']);
       const ans = shape[prop as keyof typeof shape] as number;
       const propName = prop === 'vertices' ? 'vertices (corners)' : prop;
       
       const text = getRandomItem(GEOMETRY_TEMPLATES_3D)
         .replace('{name}', name)
         .replace(/{shape}/g, shape.name)
         .replace(/{prop}/g, propName);

       batch.push({
         num1: 0, num2: 0, operation: 'geo', answer: ans, isWordProblem: true,
         questionText: text,
         visualType: shape.name.toLowerCase().replace(' ', '-')
       });
    } else {
       const shape = getRandomItem(shapes2D);
       const type = getRandomInt(1, 2); // 1: Sides/Corners, 2: Right Angles check
       
       if (type === 1) {
           const prop = getRandomItem(['sides', 'corners']);
           const ans = shape[prop as keyof typeof shape] as number;
           const text = getRandomItem(GEOMETRY_TEMPLATES_2D)
             .replace('{name}', name)
             .replace(/{shape}/g, shape.name)
             .replace(/{prop}/g, prop);
           
           batch.push({
             num1: 0, num2: 0, operation: 'geo', answer: ans, isWordProblem: true,
             questionText: text,
             visualType: shape.name.toLowerCase()
           });
       } else {
           // Right angles check
           if (shape.name === 'Square' || shape.name === 'Rectangle') {
               batch.push({
                   num1: 0, num2: 0, operation: 'geo', answer: 4, isWordProblem: true,
                   questionText: `The ${shape.name} has how many right angles?`,
                   visualType: shape.name.toLowerCase()
               });
           } else {
               // Shapes with 0 usually
               batch.push({
                   num1: 0, num2: 0, operation: 'geo', answer: 0, isWordProblem: true,
                   questionText: `How many right angles does a regular ${shape.name} have?`,
                   visualType: shape.name.toLowerCase()
               });
           }
       }
    }
  }
  return shuffleArray(batch);
}

// --- PUBLIC API ---

export const getGameBatch = (gameId: GameId): MathProblem[] => {
  switch (gameId) {
    case 'dino': return generateDinoBatch();
    case 'cave': return generateCaveBatch();
    case 'ocean': return generateOceanBatch();
    case 'city': return generateCityBatch();
    case 'space': default: return generateSpaceBatch();
  }
};
