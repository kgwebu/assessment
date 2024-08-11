import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Cog, BarChart, Layers, ArrowRight } from "lucide-react";

// Initial questions array
const initialQuestions = [
  {
    question: "What level of automation do you have in your manufacturing processes?",
    options: [
      { text: "Mostly manual processes", score: 2 },
      { text: "Some automated machines, but not interconnected", score: 3 },
      { text: "Highly automated and interconnected systems", score: 4 }
    ]
  },
  // ... (other initial questions)
];

// Detailed questions object
const detailedQuestions = {
  industry2: [
    {
      question: "How do you currently manage your production scheduling?",
      options: [
        { text: "Manually on paper or whiteboards", score: 0 },
        { text: "Using basic spreadsheets", score: 1 },
        { text: "With specialized scheduling software", score: 2 }
      ]
    },
    // ... (other industry2 questions)
  ],
  industry3: [
    {
      question: "How integrated is your supply chain management?",
      options: [
        { text: "Minimal integration with suppliers and customers", score: 0 },
        { text: "Some digital communication with key partners", score: 1 },
        { text: "Fully integrated digital supply chain management", score: 2 }
      ]
    },
    // ... (other industry3 questions)
  ],
  industry4: [
    {
      question: "How extensively do you use digital twins in your operations?",
      options: [
        { text: "We don't use digital twins", score: 0 },
        { text: "We use digital twins for some key processes or products", score: 1 },
        { text: "We have comprehensive digital twins across our entire operation", score: 2 }
      ]
    },
    // ... (other industry4 questions)
  ]
};

// Recommendations object
const recommendations = {
  2: [
    "Implement basic automation in key processes",
    "Start digitizing your data collection and management",
    // ... (other recommendations for industry 2.0)
  ],
  3: [
    "Integrate your IT and OT systems",
    "Implement advanced analytics for predictive maintenance",
    // ... (other recommendations for industry 3.0)
  ],
  4: [
    "Implement AI/ML across all suitable processes",
    "Develop a comprehensive IoT strategy",
    // ... (other recommendations for industry 4.0)
  ]
};

const IndustryAssessmentTool = () => {
  const [stage, setStage] = useState('initial');
  const [answers, setAnswers] = useState({});
  const [industryLevel, setIndustryLevel] = useState(null);
  const [progress, setProgress] = useState(0);
  const [detailedScores, setDetailedScores] = useState({});

  const handleAnswer = (questionIndex, score) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: score }));
  };

  const calculateIndustryLevel = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / Object.keys(answers).length;
    if (averageScore <= 2.5) return 2;
    if (averageScore <= 3.5) return 3;
    return 4;
  };

  const handleSubmit = () => {
    if (stage === 'initial') {
      const level = calculateIndustryLevel();
      setIndustryLevel(level);
      setStage(`industry${level}`);
      setAnswers({});
    } else if (stage.startsWith('industry')) {
      const scores = Object.values(answers);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      const maxScore = detailedQuestions[stage].length * 2;
      setProgress((totalScore / maxScore) * 100);
      setDetailedScores(answers);
      setStage('result');
    }
  };

  const renderQuestions = () => {
    const currentQuestions = stage === 'initial' ? initialQuestions : detailedQuestions[stage];
    return currentQuestions.map((q, index) => (
      <Card key={index} className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-4">
          <CardTitle className="text-xl text-gray-800">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <RadioGroup onValueChange={(value) => handleAnswer(index, parseInt(value))}>
            {q.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-3 mb-4 last:mb-0 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <RadioGroupItem 
                  value={option.score.toString()} 
                  id={`q${index}-option${optionIndex}`}
                  className="text-blue-500 border-blue-500"
                />
                <Label htmlFor={`q${index}-option${optionIndex}`} className="text-gray-700 text-lg cursor-pointer flex-grow">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    ));
  };

  const renderIndustryIndicator = () => {
    const getIndicatorStyle = (level) => {
      const baseStyle = "w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg";
      if (level === 2) return `${baseStyle} bg-gradient-to-br from-red-400 to-red-600`;
      if (level === 3) return `${baseStyle} bg-gradient-to-br from-yellow-400 to-yellow-600`;
      return `${baseStyle} bg-gradient-to-br from-green-400 to-green-600`;
    };

    const getIcon = (level) => {
      if (level === 2) return <Cog size={48} />;
      if (level === 3) return <BarChart size={48} />;
      return <Layers size={48} />;
    };

    return (
      <div className="flex flex-col items-center mb-12">
        <div className={getIndicatorStyle(industryLevel)}>
          {getIcon(industryLevel)}
        </div>
        <span className="mt-4 text-3xl font-bold text-gray-800">Industry {industryLevel}.0</span>
        <span className="text-xl text-gray-600">Your Current Level</span>
      </div>
    );
  };

  const renderDetailedResults = () => {
    const questions = detailedQuestions[`industry${industryLevel}`];
    return (
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-2xl text-gray-800">Detailed Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {questions.map((q, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="font-semibold text-gray-800 mb-3">{q.question}</h3>
              <div className="flex items-center">
                <Progress value={(detailedScores[index] / 2) * 100} className="flex-grow mr-4 h-3" />
                <span className="text-lg font-medium text-gray-600">{detailedScores[index]}/2</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderRecommendations = () => {
    return (
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-2xl text-gray-800">Recommendations to reach Industry {industryLevel + 1}.0</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            {recommendations[industryLevel].map((rec, index) => (
              <li key={index} className="flex items-start">
                <ArrowRight className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700 text-lg">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderResult = () => {
    return (
      <div className="space-y-12">
        {renderIndustryIndicator()}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-2xl text-gray-800">Your Industry {industryLevel}.0 Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Progress value={progress} className="mb-4 h-4" />
            <p className="text-xl text-gray-700">You've completed <span className="font-bold text-blue-600">{progress.toFixed(0)}%</span> of the journey to Industry {industryLevel + 1}.0</p>
          </CardContent>
        </Card>
        {renderDetailedResults()}
        {renderRecommendations()}
        <Button
          onClick={() => {
            setStage('initial');
            setAnswers({});
            setIndustryLevel(null);
            setProgress(0);
            setDetailedScores({});
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xl font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Start New Assessment
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Industry 4.0 Assessment Tool</h1>
        <p className="text-xl text-gray-600">Evaluate your digital transformation progress</p>
      </div>
      {stage !== 'result' ? (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {stage === 'initial' ? 'Initial Assessment' : `Detailed Industry ${industryLevel}.0 Assessment`}
            </h2>
            <p className="text-gray-600 mb-4">
              {stage === 'initial' 
                ? 'Answer the following questions to determine your current industry level.' 
                : `Let's dive deeper into your Industry ${industryLevel}.0 practices.`}
            </p>
          </div>
          {renderQuestions()}
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {stage === 'initial' ? 'Determine Industry Level' : 'Submit Detailed Assessment'}
          </Button>
        </div>
      ) : renderResult()}
    </div>
  );
};

export default IndustryAssessmentTool;
