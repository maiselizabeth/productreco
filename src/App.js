import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch questions from a public Google Sheet published as CSV
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQD8mxUlSHZj-O96BT01vcaugxOdmVIsXr7hW1H-o7BquZ47jqp1EfyIPohdsqB-g7o7SWOToJW8d9m/pub?gid=965635019&single=true&output=csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedQuestions = parseCSV(data);
        setQuestions(parsedQuestions);
      });
  }, []);

  const parseCSV = (data) => {
    const lines = data.split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    });
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].id]: value });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSubmitted(true);
      submitQuiz(answers);
    }
  };

  const submitQuiz = (answers) => {
    fetch("/api/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
  };

  if (!questions.length) return <p>Loading quiz...</p>;

  if (submitted) return <p>Thank you! Your personalised product recommendations are on the way.</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="max-w-xl mx-auto p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        {currentQuestion.type === "single choice" && (
          <RadioGroup onValueChange={handleAnswer}>
            {currentQuestion.options.split(";").map((option) => (
              <RadioGroupItem key={option} value={option} label={option} />
            ))}
          </RadioGroup>
        )}

        {currentQuestion.type === "multiple choice" && (
          <div>
            {currentQuestion.options.split(";").map((option) => (
              <label key={option} className="block">
                <Input
                  type="checkbox"
                  onChange={(e) => handleAnswer(e.target.checked ? option : "")}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "likert scale" && (
          <Slider
            min={1}
            max={5}
            step={1}
            onValueChange={handleAnswer}
            className="mt-4"
          />
        )}

        {currentQuestion.type === "open text" && (
          <Textarea
            placeholder="Type your answer..."
            onBlur={(e) => handleAnswer(e.target.value)}
          />
        )}

        <Button className="mt-4" onClick={() => handleAnswer(null)}>
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

export default Quiz;
