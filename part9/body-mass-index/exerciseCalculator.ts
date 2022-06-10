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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))