import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom'
import ConfettiExplosion from 'react-confetti-explosion';

const ExamResult = ({ filteredQuestions, selectedChoices, resetExam, selectedCompetency }) => {
  // State for selectedCompetency
  const [localSelectedCompetency, setLocalSelectedCompetency] = useState('All Competency');
  const [isExploding, setIsExploding] = useState(false);

  // Function to filter questions based on selected competency
  const filteredQuestionsByCompetency = localSelectedCompetency === 'All Competency'
    ? filteredQuestions
    : filteredQuestions.filter(question => question.competency_id === localSelectedCompetency);

  // Function to calculate the total score for selected questions
  const calculateTotalScore = () => {
    return filteredQuestionsByCompetency.reduce((totalScore, question, index) => {
      const selectedChoice = selectedChoices[index];
      if (selectedChoice && selectedChoice.isCorrect) {
        return totalScore + 1;
      }
      return totalScore;
    }, 0);
  };
  
  const competencyOptions = [
    { value: 'All Competency', label: 'All Competency' },
    { value: 1, label: 'SWPPS' },
    { value: 2, label: 'Casework' },
    { value: 3, label: 'HBSE' },
    { value: 4, label: 'CO' },
    { value: 5, label: 'Groupwork' },
  ];

  const getCompetencyLabel = (selectedCompetency) => {
  const selectedOption = competencyOptions.find(option => option.value === selectedCompetency);
  return selectedOption ? selectedOption.label : 'Unknown Competency';
  }
  useEffect(() => {
    window.scrollTo(0, 1);
    setIsExploding(true);
    if (isExploding) {
      const timeoutId = setTimeout(() => {
        setIsExploding(false);
      }, 4000);
      // Clean up the timeout when the component is unmounted
      return () => clearTimeout(timeoutId);
    }
  }, []);
  
  return (
    <div>
        <div className='flex justify-center'>{isExploding && <ConfettiExplosion />}</div>
      <div className='p-3 my-3 border-2 dark:border-gray-700 dark:rounded-lg dark:bg-slate-900' >
      <div className="competency-buttons">
      {/* Buttons for selecting competencies */}
      {competencyOptions.map(option => (
        <button
          key={option.value}
          className={classNames("bg-transparent mt-3 hover:bg-indigo-700 hover:text-white dark:text-white border-2 border-indigo-700 py-2 px-4 mr-2 rounded", {
            'bg-indigo-700 text-white': localSelectedCompetency === option.value,
          })}
          onClick={() => setLocalSelectedCompetency(option.value)}
        >
          {option.label}
        </button>
      ))}
      
    </div>
      <h1 className="text-2xl font-bold mb-4 justify-center dark:text-white">
        {localSelectedCompetency === 'All Competency' ? 'Competency Results' : getCompetencyLabel(localSelectedCompetency)}
      </h1>

      <h2 className="flex mb-4 mx-auto justify-center text-xl font-medium dark:text-white lg:text-3xl md:text-xl sm:text-md">
  Total Score: 
  <span className="text-green-500 mx-2">
    {calculateTotalScore()}
  </span>{' '}
  correct out of 
  <span className="text-orange-500 mx-2">
    {filteredQuestionsByCompetency.length}
  </span> question - 
  <span className="text-blue-500 ml-1">
    {filteredQuestionsByCompetency.length > 0
      ? `(${((calculateTotalScore() / filteredQuestionsByCompetency.length) * 100).toFixed(2)}%)`
      : '(0%)'}
  </span>
</h2>


      <div className='flex justify-between'> 
      {/* Add the button for resetting the exam */}
      <button
        className="bg-indigo-700 hover:bg-indigo-600 hover:text-white dark:text-white text-white py-2 px-4 mr-2 mb-3 rounded"
        onClick={resetExam}
      >
        Back
      </button>
      <Link to="/exam/analytics"
        className="bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-4 mb-3 rounded"
      >
        View Analytics
      </Link>
      </div>
      </div>
      <div className="overflow-y-auto max-h-screen">
  {filteredQuestionsByCompetency.map((question, index) => (
    <div key={index} className="mb-4 dark:text-white dark:bg-slate-900 p-3 border-2 dark:border-gray-700 dark:rounded-lg">
      <h2 className="text-xl text-center dark:text-white btn-primary">
        Question {index + 1}/{filteredQuestionsByCompetency.length}
      </h2>
      <p className="mb-2 text-lg border-b border-black dark:border-white">{question.questionText}</p>
      <ul>
        {question.choices && question.choices.map((choice, choiceIndex) => (
          <li
            key={choiceIndex}
            className={classNames("container btn-container items-center dark:text-white flex border border-gray-700 mb-2 rounded-3xl cursor-pointer", {
              "bg-green-400": selectedChoices[index] && selectedChoices[index].isCorrect && selectedChoices[index] === choice,
              "bg-red-600": selectedChoices[index] && !selectedChoices[index].isCorrect && selectedChoices[index] === choice,
            })}
          >
            <div className="dark-text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
              {String.fromCharCode(65 + choiceIndex)}
            </div>
            <div className="dark-text-white py-2 dark:text-white px-4 text-gray-700 font-semibold">
              {choice.choiceText}
            </div>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

    </div>
  );
};

export default ExamResult;
