interface InputValues {
  target: number;
  exerciseHours: number[];
}

const parseArguments = (args: Array<string>): InputValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  for (let arg of args.slice(2)) {
    if (isNaN(Number(arg))) {
      throw new Error('Provided values were not numbers!');
    }
  }
  const [targetStr, ...rest] = args.slice(2)
  return {
    target: Number(targetStr),
    exerciseHours: rest.map(Number)
  }
}

interface ExerciseHourResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  exerciseHours: number[],
  target: number
): ExerciseHourResult => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(exerciseHour => exerciseHour > 0).length;
  const average = exerciseHours.reduce((a, b) => a + b, 0) / exerciseHours.length;
  const success = average >= target;

  let rating;
  let ratingDescription;
  if (average < target) {
    rating = 1;
    ratingDescription = `not too bad but could be better`;
  } else if (target === average) {
    rating = 2;
    ratingDescription = `you accomplished your exercise goals for this week!`;
  } else {
    rating = 3;
    ratingDescription = `wooh, you did exercise more than you planned!`;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, exerciseHours } = parseArguments(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;