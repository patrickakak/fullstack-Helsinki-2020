import express from 'express';
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  const validParameters: boolean = !isNaN(Number(height)) && !isNaN(Number(weight));
  const bmi = calculateBmi(Number(height), Number(weight));

  if (!validParameters) {
    res.send({
      error: "malformatted parameters",
    });
  }
  res.send({ weight, height, bmi });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { exerciseHours, target } = req.body;
  if (!exerciseHours || !target) {
    return res.json({
      error: "parameters missing"
    });
  }

  const notValidDailyExerciseParams: boolean = Array.isArray(exerciseHours)
    ? (exerciseHours as []).some((exercise: number) => isNaN(Number(exercise)))
    : true;

  if (notValidDailyExerciseParams || isNaN(Number(target))) {
    return res.json({
      error: "malformatted parameters"
    });
  }

  const reply = calculateExercises((exerciseHours as []).map(Number), Number(target));
  return res.json(reply);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running of port ${PORT}`);
});