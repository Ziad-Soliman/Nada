import { MathProblem } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateProblem = (isWordProblem: boolean): MathProblem => {
  const operation = Math.random() > 0.5 ? 'add' : 'sub';
  let num1 = 0;
  let num2 = 0;

  if (operation === 'add') {
    // No regrouping addition
    // Ones: sum <= 9
    const ones1 = getRandomInt(0, 9);
    const ones2 = getRandomInt(0, 9 - ones1);
    
    // Tens: sum <= 9 (to keep it 2-digit result, or at least easy 3 digit if 90+something, but usually year 3 stays under 100 for these drills)
    // Let's ensure result < 100 for simplicity as per typical Year 3 curriculum
    const tens1 = getRandomInt(1, 8); // 10-89
    const tens2 = getRandomInt(1, 9 - tens1);

    num1 = tens1 * 10 + ones1;
    num2 = tens2 * 10 + ones2;
  } else {
    // No regrouping subtraction
    // Ones: ones1 >= ones2
    const ones1 = getRandomInt(0, 9);
    const ones2 = getRandomInt(0, ones1);

    // Tens: tens1 >= tens2 (result positive)
    const tens1 = getRandomInt(2, 9); // Ensure first number is at least 20 to allow decent subtraction
    const tens2 = getRandomInt(1, tens1 - 1); // Ensure result is not 0 and positive

    num1 = tens1 * 10 + ones1;
    num2 = tens2 * 10 + ones2;
  }

  return {
    num1,
    num2,
    operation,
    answer: operation === 'add' ? num1 + num2 : num1 - num2,
    isWordProblem
  };
};
