
import { MathProblem, GameId } from '../types';

// --- CONFIGURATION & UTILS ---

const NAMES = ["Captain Nova", "Ranger Leo", "Dr. Sarah", "Pilot Orion", "Engineer Sam", "Luna", "Astro", "Starla", "Major Tom", "Sky", "Zara", "Ben", "Omar", "Maya", "Kaito"];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --- WORD PROBLEM TEMPLATES ---

// Space (Add/Sub) - Year 3: 2-Digit No Regrouping
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

// Helper: Generates 2 numbers for strict No-Regrouping Add/Sub
function getNoRegroupPair(isAdd: boolean): [number, number] {
    if (isAdd) {
        const t1 = getRandomInt(1, 8); 
        const t2 = getRandomInt(1, 9 - t1); 
        const o1 = getRandomInt(0, 9);
        const o2 = getRandomInt(0, 9 - o1);
        const n1 = t1 * 10 + o1;
        const n2 = t2 * 10 + o2;
        return [n1, n2];
    } else {
        const t1 = getRandomInt(2, 9);
        const t2 = getRandomInt(1, t1 - 1);
        const o1 = getRandomInt(0, 9);
        const o2 = getRandomInt(0, o1);
        const n1 = t1 * 10 + o1;
        const n2 = t2 * 10 + o2;
        return [n1, n2];
    }
}

function generateSpaceBatch(): MathProblem[] {
  const directBatch: MathProblem[] = [];
  const wordBatch: MathProblem[] = [];
  
  for (let i = 0; i < 5; i++) {
    const isAdd = Math.random() > 0.5;
    const [n1, n2] = getNoRegroupPair(isAdd);
    directBatch.push({
      num1: n1, num2: n2, operation: isAdd ? 'add' : 'sub', answer: isAdd ? n1 + n2 : n1 - n2, isWordProblem: false
    });
  }

  for (let i = 0; i < 5; i++) {
    const isAdd = Math.random() > 0.5;
    const [n1, n2] = getNoRegroupPair(isAdd);
    const name = getRandomItem(NAMES);
    let text = "";
    if (isAdd) {
        text = getRandomItem(ADDITION_TEMPLATES).replace('{name}', name).replace('{n1}', n1.toString()).replace('{n2}', n2.toString());
    } else {
        text = getRandomItem(SUBTRACTION_TEMPLATES).replace('{name}', name).replace('{n1}', n1.toString()).replace('{n2}', n2.toString());
    }
    wordBatch.push({
      num1: n1, num2: n2, operation: isAdd ? 'add' : 'sub', answer: isAdd ? n1 + n2 : n1 - n2, isWordProblem: true, questionText: text
    });
  }
  
  const extraBatch: MathProblem[] = [];
  for(let i=0; i<5; i++) {
     const isAdd = Math.random() > 0.5;
     const [n1, n2] = getNoRegroupPair(isAdd);
     extraBatch.push({
        num1: n1, num2: n2, operation: isAdd ? 'add' : 'sub', answer: isAdd ? n1+n2 : n1-n2, isWordProblem: Math.random() > 0.5 
     });
  }
  return [...directBatch, ...wordBatch, ...extraBatch];
}

function generateDinoBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const tables = [3, 4, 8]; 
    const reviewTables = [2, 5, 10]; 
    const count = 15;

    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 3);
        const isMul = Math.random() > 0.4;
        const name = getRandomItem(NAMES);
        const table = getRandomItem(Math.random() > 0.3 ? tables : reviewTables); 
        const factor = getRandomInt(2, 12);

        if (type === 1) {
            if (isMul) {
                batch.push({ num1: table, num2: factor, operation: 'mul', answer: table * factor, isWordProblem: false });
            } else {
                const product = table * factor;
                batch.push({ num1: product, num2: table, operation: 'div', answer: factor, isWordProblem: false });
            }
        } else if (type === 2) {
            if (isMul) {
                const text = getRandomItem(MULTIPLICATION_TEMPLATES).replace('{name}', name).replace('{n1}', table.toString()).replace('{n2}', factor.toString());
                batch.push({ num1: table, num2: factor, operation: 'mul', answer: table * factor, isWordProblem: true, questionText: text });
            } else {
                 const product = table * factor;
                 const text = getRandomItem(DIVISION_TEMPLATES).replace('{name}', name).replace('{n1}', product.toString()).replace('{n2}', table.toString());
                 batch.push({ num1: product, num2: table, operation: 'div', answer: factor, isWordProblem: true, questionText: text });
            }
        } else {
            const product = table * factor;
            batch.push({ num1: 0, num2: table, operation: 'mul', answer: factor, isWordProblem: true, questionText: `Puzzle: ? x ${table} = ${product}. What is the missing number?` });
        }
    }
    return shuffleArray(batch);
}

function generateCaveBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const count = 15;
    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 5);
        const name = getRandomItem(NAMES);
        if (type === 1) {
            const n = getRandomInt(11, 899);
            const isTen = Math.random() > 0.5;
            const safeN = n % 10 === 5 ? n + 1 : n;
            if (isTen) {
                const rounded = Math.round(safeN / 10) * 10;
                batch.push({ num1: safeN, num2: 10, operation: 'round', answer: rounded, isWordProblem: true, questionText: `Round the crystal weight ${safeN} to the nearest 10.` });
            } else {
                const rounded = Math.round(safeN / 100) * 100;
                batch.push({ num1: safeN, num2: 100, operation: 'round', answer: rounded, isWordProblem: true, questionText: `Round the depth ${safeN}m to the nearest 100.` });
            }
        } else if (type === 2) {
             const n = getRandomInt(100, 800);
             const isMore = Math.random() > 0.5;
             const val = Math.random() > 0.5 ? 10 : 100;
             const text = `The cave depth is ${n}m. Go ${val} meters ${isMore ? 'deeper (add)' : 'up (subtract)'}.`;
             batch.push({ num1: n, num2: val, operation: 'val', answer: isMore ? n + val : n - val, isWordProblem: true, questionText: text });
        } else if (type === 3) {
            const h = getRandomInt(1, 9); const t = getRandomInt(1, 9); const o = getRandomInt(1, 9);
            const number = h * 100 + t * 10 + o;
            const targetPos = getRandomInt(1, 3);
            let answer = 0; let qText = "";
            if (targetPos === 1) { qText = `What is the value of the hundreds digit in ${number}?`; answer = h * 100; }
            if (targetPos === 2) { qText = `What is the value of the tens digit in ${number}?`; answer = t * 10; }
            if (targetPos === 3) { qText = `What is the value of the ones digit in ${number}?`; answer = o; }
            batch.push({ num1: number, num2: 0, operation: 'val', answer: answer, isWordProblem: true, questionText: qText });
        } else if (type === 4) {
            const h = getRandomInt(1, 9) * 100; const t = getRandomInt(1, 9) * 10; const o = getRandomInt(1, 9);
            const total = h + t + o;
            batch.push({ num1: total, num2: 0, operation: 'val', answer: o, isWordProblem: true, questionText: `${h} + ${t} + ? = ${total}. What is the missing number?` });
        } else {
             const n = getRandomInt(200, 500);
             batch.push({ num1: n, num2: 100, operation: 'add', answer: n + 100, isWordProblem: true, questionText: `What number is 100 more than ${n}?` });
        }
    }
    return shuffleArray(batch);
}

function generateOceanBatch(): MathProblem[] {
  const batch: MathProblem[] = [];
  const count = 15;
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(1, 3);
    const name = getRandomItem(NAMES);
    if (type === 1) {
      const denominator = getRandomItem([2, 3, 4, 5, 8, 10]);
      const answer = getRandomInt(2, 12);
      const total = answer * denominator; 
      const text = getRandomItem(FRACTION_TEMPLATES).replace('{name}', name).replace('{n1}', total.toString()).replace('{n2}', denominator.toString());
      batch.push({ num1: total, num2: denominator, operation: 'frac', answer: answer, isWordProblem: true, questionText: text });
    } else if (type === 2) {
      const denominator = getRandomItem([5, 6, 7, 8, 9, 10]);
      const n1 = getRandomInt(1, denominator - 2);
      const n2 = getRandomInt(1, denominator - n1);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
          batch.push({ num1: n1, num2: n2, operation: 'add', answer: n1 + n2, isWordProblem: true, questionText: `Add the fractions: ${n1}/${denominator} + ${n2}/${denominator} = ?/${denominator}. Enter the top number.` });
      } else {
          const start = getRandomInt(2, denominator);
          const sub = getRandomInt(1, start - 1);
          batch.push({ num1: start, num2: sub, operation: 'sub', answer: start - sub, isWordProblem: true, questionText: `Subtract: ${start}/${denominator} - ${sub}/${denominator} = ?/${denominator}. Enter the top number.` });
      }
    } else {
      const num = getRandomInt(1, 5); const den = getRandomInt(6, 10);
      batch.push({ num1: num, num2: den, operation: 'frac', answer: den, isWordProblem: true, questionText: `In the fraction ${num}/${den}, what number represents the WHOLE (denominator)?` });
    }
  }
  return shuffleArray(batch);
}

function generateCityBatch(): MathProblem[] {
  const batch: MathProblem[] = [];
  const count = 15;
  const shapes3D = [
    { name: 'Cube', faces: 6, edges: 12, vertices: 8 },
    { name: 'Cuboid', faces: 6, edges: 12, vertices: 8 },
    { name: 'Sphere', faces: 1, edges: 0, vertices: 0 },
    { name: 'Cylinder', faces: 3, edges: 2, vertices: 0 },
    { name: 'Cone', faces: 2, edges: 1, vertices: 1 },
    { name: 'Square Pyramid', faces: 5, edges: 8, vertices: 5 }
  ];
  const shapes2D = [
    { name: 'Triangle', sides: 3, corners: 3, rightAngles: 0 },
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
       const text = getRandomItem(GEOMETRY_TEMPLATES_3D).replace('{name}', name).replace(/{shape}/g, shape.name).replace(/{prop}/g, propName);
       batch.push({ num1: 0, num2: 0, operation: 'geo', answer: ans, isWordProblem: true, questionText: text, visualType: shape.name.toLowerCase().replace(' ', '-') });
    } else {
       const shape = getRandomItem(shapes2D);
       const type = getRandomInt(1, 2);
       if (type === 1) {
           const prop = getRandomItem(['sides', 'corners']);
           const ans = shape[prop as keyof typeof shape] as number;
           const text = getRandomItem(GEOMETRY_TEMPLATES_2D).replace('{name}', name).replace(/{shape}/g, shape.name).replace(/{prop}/g, prop);
           batch.push({ num1: 0, num2: 0, operation: 'geo', answer: ans, isWordProblem: true, questionText: text, visualType: shape.name.toLowerCase() });
       } else {
           if (shape.name === 'Square' || shape.name === 'Rectangle') {
               batch.push({ num1: 0, num2: 0, operation: 'geo', answer: 4, isWordProblem: true, questionText: `The ${shape.name} has how many right angles?`, visualType: shape.name.toLowerCase() });
           } else {
               batch.push({ num1: 0, num2: 0, operation: 'geo', answer: 0, isWordProblem: true, questionText: `How many right angles does a regular ${shape.name} have?`, visualType: shape.name.toLowerCase() });
           }
       }
    }
  }
  return shuffleArray(batch);
}

function generateTimeBatch(): MathProblem[] {
  const batch: MathProblem[] = [];
  const count = 15;
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(1, 4);
    if (type === 1) {
        const hour = getRandomInt(1, 12);
        const minute = getRandomItem([0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55]);
        const minStr = minute < 10 ? `0${minute}` : `${minute}`;
        const answer = `${hour}:${minStr}`;
        batch.push({ num1: 0, num2: 0, operation: 'time', answer: answer, isWordProblem: false, questionText: "What time is shown on the clock? (Format: 3:00)", visualType: `clock:${answer}` });
    } else if (type === 2) {
        const startHour = getRandomInt(1, 11);
        const addMin = getRandomItem([30, 15, 60, 45]);
        let endHour = startHour;
        let endMin = 0 + addMin;
        if (endMin >= 60) { endHour += Math.floor(endMin / 60); endMin = endMin % 60; }
        const endMinStr = endMin < 10 ? `0${endMin}` : `${endMin}`;
        const answer = `${endHour}:${endMinStr}`;
        batch.push({ num1: 0, num2: 0, operation: 'time', answer: answer, isWordProblem: true, questionText: `It is ${startHour}:00. What time will it be in ${addMin} minutes?` });
    } else if (type === 3) {
        const subType = getRandomInt(1, 2);
        if (subType === 1) {
            const idx = getRandomInt(0, 5); const day = DAYS[idx]; const answer = DAYS[idx + 1];
            batch.push({ num1: 0, num2: 0, operation: 'time', answer: answer, isWordProblem: true, questionText: `What day comes after ${day}?` });
        } else {
            const idx = getRandomInt(0, 6); const day = DAYS[idx]; const nextIdx = (idx + 1) % 7; const answer = DAYS[nextIdx];
             batch.push({ num1: 0, num2: 0, operation: 'time', answer: answer, isWordProblem: true, questionText: `If today is ${day}, what day is tomorrow?` });
        }
    } else {
        const factType = getRandomInt(1, 3);
        if (factType === 1) { batch.push({ num1: 0, num2: 0, operation: 'time', answer: 7, isWordProblem: true, questionText: "How many days are in a week?" }); }
        else if (factType === 2) { batch.push({ num1: 0, num2: 0, operation: 'time', answer: 60, isWordProblem: true, questionText: "How many minutes are in one hour?" }); }
        else { batch.push({ num1: 0, num2: 0, operation: 'time', answer: 30, isWordProblem: true, questionText: "How many minutes is half an hour?" }); }
    }
  }
  return shuffleArray(batch);
}

function generateMarketBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const count = 15;
    
    // Money: Adding coins, Giving change
    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 3);
        const name = getRandomItem(NAMES);

        if (type === 1) {
            // Add two items
            const item1 = getRandomItem([20, 50, 10, 5, 100, 25]);
            const item2 = getRandomItem([20, 50, 10, 5, 5, 2]);
            const total = item1 + item2;
            batch.push({
                num1: item1, num2: item2, operation: 'money', answer: total, isWordProblem: true,
                questionText: `${name} buys a potion for ${item1} gold and an apple for ${item2} gold. Total cost?`
            });
        } else if (type === 2) {
            // Change: Pay with 100 or 50
            const cost = getRandomInt(15, 85);
            // Ensure cost ends in 5 or 0 for year 3 ease
            const safeCost = Math.round(cost / 5) * 5; 
            const pay = 100;
            const change = pay - safeCost;
            batch.push({
                num1: pay, num2: safeCost, operation: 'money', answer: change, isWordProblem: true,
                questionText: `A shield costs ${safeCost} gold. ${name} pays with ${pay} gold. How much change?`
            });
        } else {
            // How many 10s in X?
            const tens = getRandomInt(2, 9);
            const total = tens * 10;
            batch.push({
                num1: total, num2: 10, operation: 'money', answer: tens, isWordProblem: true,
                questionText: `You have ${total} gold coins. How many 10-gold items can you buy?`
            });
        }
    }
    return shuffleArray(batch);
}

function generateLabBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const count = 15;

    // Measurement: Mass (g/kg), Capacity (ml/l), Length (cm/m)
    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 3);
        
        if (type === 1) {
            // Conversions (Simple)
            const kg = getRandomInt(1, 5);
            const g = kg * 1000;
            const isKgToG = Math.random() > 0.5;
            if (isKgToG) {
                batch.push({
                    num1: kg, num2: 0, operation: 'measure', answer: g, isWordProblem: true,
                    questionText: `The heavy rock weighs ${kg} kg. How many grams is that? (1kg = 1000g)`
                });
            } else {
                batch.push({
                    num1: g, num2: 0, operation: 'measure', answer: kg, isWordProblem: true,
                    questionText: `The pile of sand is ${g} grams. How many kilograms is that?`
                });
            }
        } else if (type === 2) {
            // Compare/Add
            const v1 = getRandomInt(100, 400);
            const v2 = getRandomInt(100, 400);
            const total = v1 + v2;
            batch.push({
                num1: v1, num2: v2, operation: 'measure', answer: total, isWordProblem: true,
                questionText: `Beaker A has ${v1}ml. Beaker B has ${v2}ml. How much liquid in total?`
            });
        } else {
            // Difference
            const len1 = getRandomInt(50, 90);
            const len2 = getRandomInt(10, 40);
            const diff = len1 - len2;
            batch.push({
                num1: len1, num2: len2, operation: 'measure', answer: diff, isWordProblem: true,
                questionText: `The red wand is ${len1}cm. The blue wand is ${len2}cm. How much longer is the red wand?`
            });
        }
    }
    return shuffleArray(batch);
}

function generateSafariBatch(): MathProblem[] {
    const batch: MathProblem[] = [];
    const count = 15;

    // Data (Interpreting simple text data) & Position (Compass)
    for (let i = 0; i < count; i++) {
        const type = getRandomInt(1, 2);
        
        if (type === 1) {
            // Data
            const lions = getRandomInt(2, 8);
            const zebras = getRandomInt(2, 8);
            const total = lions + zebras;
            const subType = Math.random();
            
            if (subType < 0.33) {
                 batch.push({
                    num1: lions, num2: zebras, operation: 'data', answer: total, isWordProblem: true,
                    questionText: `Safari Report: ${lions} Lions, ${zebras} Zebras. How many animals in total?`
                });
            } else if (subType < 0.66) {
                const diff = Math.abs(lions - zebras);
                const more = lions > zebras ? 'Lions' : 'Zebras';
                batch.push({
                    num1: lions, num2: zebras, operation: 'data', answer: diff, isWordProblem: true,
                    questionText: `Safari Report: ${lions} Lions, ${zebras} Zebras. How many more ${more} are there?`
                });
            } else {
                const elephants = getRandomInt(2, 5);
                const grandTotal = total + elephants;
                batch.push({
                    num1: 0, num2: 0, operation: 'data', answer: grandTotal, isWordProblem: true,
                    questionText: `Chart: ${lions} Lions, ${zebras} Zebras, ${elephants} Elephants. Total animals?`
                });
            }
        } else {
            // Direction
            const directions = ['North', 'East', 'South', 'West'];
            const startIdx = getRandomInt(0, 3);
            const turn = Math.random() > 0.5 ? 1 : -1; // 1 Right, -1 Left
            
            let endIdx = startIdx + turn;
            if (endIdx > 3) endIdx = 0;
            if (endIdx < 0) endIdx = 3;
            
            const startDir = directions[startIdx];
            const endDir = directions[endIdx];
            const turnName = turn === 1 ? 'clockwise (right)' : 'anti-clockwise (left)';
            
            batch.push({
                num1: 0, num2: 0, operation: 'geo', answer: endDir, isWordProblem: true,
                questionText: `You are facing ${startDir}. Turn 90 degrees ${turnName}. Which way are you facing now? (North, South, East, West)`
            });
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
    case 'time': return generateTimeBatch();
    case 'market': return generateMarketBatch();
    case 'lab': return generateLabBatch();
    case 'safari': return generateSafariBatch();
    case 'space': default: return generateSpaceBatch();
  }
};
