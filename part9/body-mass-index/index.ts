import express from 'express';
import calculateBmi from "./bmiCalculator";
// import calculateExercises from "./exerciseCalculator";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  const validParameters: boolean = !isNaN(Number(height)) && !isNaN(Number(weight));
  const bmi = calculateBmi(Number(height), Number(weight));

  if (!validParameters || !height || !weight) {
    res.send({
      error: "malformatted parameters",
    });
  }

  res.send({ weight, height, bmi });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running of port ${PORT}`);
});