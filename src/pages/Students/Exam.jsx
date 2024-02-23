import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Select from 'react-select';
import ExamResult from './ExamResult'

function Exam() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(null)); // Adjust the number of questions
  const questionsPerPage = 10; 
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [competencyScores, setCompetencyScores] = useState({});
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [userExamId, setUserExamId] = useState(null);
  const [loading, setLoading] = useState(false);

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function shuffleArrayWithCorrectChoice(questions) {
    const shuffledQuestions = [...questions];
  
    for (let i = 0; i < shuffledQuestions.length; i++) {
      if (shuffledQuestions[i].choices) {
        const correctChoices = shuffledQuestions[i].choices.filter((choice) => choice.isCorrect);
        const incorrectChoices = shuffledQuestions[i].choices.filter((choice) => !choice.isCorrect);
  
        if (correctChoices.length > 0 && incorrectChoices.length > 2) {
          // Shuffle the choices, ensuring one correct and three incorrect choices
          const shuffledCorrectChoice = shuffleArray(correctChoices);
          const shuffledIncorrectChoices = shuffleArray(incorrectChoices.slice(0, 3));
          shuffledQuestions[i].choices = [...shuffledCorrectChoice, ...shuffledIncorrectChoices];
        }
      }
    }
  
    return shuffledQuestions;
  }  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedProgram) {
          let response;
          const maxQuestionsPerCategory = 100; // Set the maximum questions per category
          let maxQuestions = 0; // Initialize maxQuestions to zero

          if (selectedCompetency?.value === 'All Competency') {
            // Check if competency data is already saved in local storage
            const competencyDataAll = localStorage.getItem('competencyData_All');
            if (competencyDataAll) {
              const parsedData = JSON.parse(competencyDataAll);
              response = { data: parsedData };
              // Set maxQuestions to the number of questions available for all competencies
              maxQuestions = parsedData.length;
            } else {
              // Fetch questions for all available competencies
              const competencies = ['SWPPS', 'Casework', 'HBSE', 'CO', 'Groupwork']; // Replace with your predefined competencies
              const allQuestions = [];
  
              // Fetch questions for each competency and merge the results
              for (const competency of competencies) {
                const competencyResponse = await axios.get(
                  `https://smartexam.cyclic.app/questions/fetch?program=${selectedProgram.label || ''}&competency=${competency}`
                );
  
                // Limit to maxQuestionsPerCategory questions per category
                const limitedQuestions = shuffleArray(competencyResponse.data).slice(0, maxQuestionsPerCategory);
                maxQuestions += limitedQuestions.length; // Increment the total questions count
  
                // Check if maxQuestions exceeds 500, and if so, truncate the questions.
                if (maxQuestions > 500) {
                  const overflow = maxQuestions - 500;
                  limitedQuestions.splice(-overflow);
                  maxQuestions = 500;
                }
  
                allQuestions.push(...limitedQuestions);
  
                // If maxQuestions is already 500, break the loop.
                if (maxQuestions >= 500) {
                  break;
                }
              }
  
              response = { data: allQuestions };
              localStorage.setItem('selectedCompetencyId', 'All');
              localStorage.setItem('competencyData_All', JSON.stringify(allQuestions));
            }
          } else if (selectedCompetency) {
            // Check if competency data is already saved in local storage
            const competencyData = localStorage.getItem(`competencyData_${selectedCompetency.value}`);
            if (competencyData) {
              const parsedData = JSON.parse(competencyData);
              response = { data: parsedData };
              // Set maxQuestions to the number of questions available for the selected competency
              maxQuestions = parsedData.length;
            } else {
              // Fetch questions for the selected competency
              response = await axios.get(
                `https://smartexam.cyclic.app/questions/fetch?program=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}`
              );
  
              // Limit to maxQuestionsPerCategory questions for the selected category
              response.data = shuffleArray(response.data).slice(0, maxQuestionsPerCategory);
              maxQuestions = response.data.length; // Set the total questions count
  
              // Truncate if maxQuestions exceeds 500
              if (maxQuestions > 500) {
                response.data.splice(-maxQuestions + 500);
                maxQuestions = 500;
              }
  
              // Save the competency data to local storage
              localStorage.setItem(`competencyData_${selectedCompetency.value}`, JSON.stringify(response.data));
            }
            localStorage.setItem('selectedCompetencyId', selectedCompetency.value);
          } else {
            // If no competency is selected, use all questions
            return; // Exit early to avoid setting state again
          }

          // Load selectedChoices from local storage
        const storedSelectedChoices = localStorage.getItem('selectedChoices');
        if (storedSelectedChoices) {
          setSelectedChoices(JSON.parse(storedSelectedChoices));
        } else {
          // If selectedChoices aren't in local storage, initialize it
          setSelectedChoices(Array(maxQuestions).fill(-1));
        }

        // Retrieve currentQuestion from localStorage or set it to 0 if not available
const storedCurrentQuestion = localStorage.getItem('currentQuestion');
const initialCurrentQuestion = storedCurrentQuestion ? parseInt(storedCurrentQuestion, 10) : 0;
setCurrentQuestion(initialCurrentQuestion);

          if (!countdownStarted) {
            // Shuffle data only if countdown has not started
            const randomizedQuestions = shuffleArray(response.data).slice(0, 500);
            // Process choices
            const processedQuestions = shuffleArrayWithCorrectChoice(randomizedQuestions);

            setFilteredQuestions(processedQuestions);
            setMaxQuestions(maxQuestions); // Set the total questions count
            console.log('filteredQuestions:', response.data);
            console.log('selectedCompetencyId', selectedCompetency.value);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [selectedProgram, selectedCompetency]);

// Function to update scores for each competency
const updateCompetencyScore = (competencyId, score) => {
  setCompetencyScores((prevScores) => ({
    ...prevScores,
    [competencyId]: score,
  }));
};
// Save exam state to localStorage
const saveExamStateToLocalStorage = () => {
  const examState = {
    currentQuestion: currentQuestion,
    score,
    userExamId,
    selectedProgram,
    selectedCompetency,
    maxQuestions: maxQuestions,
    filteredQuestions: filteredQuestions.map(question => ({ ...question })), // Convert to plain objects
    selectedChoices: [...selectedChoices],
  };
  localStorage.setItem('examState', JSON.stringify(examState));
};

// Load exam state from localStorage
useEffect(() => {
  const savedExamState = localStorage.getItem('examState');
  if (savedExamState) {
    const parsedState = JSON.parse(savedExamState);
    setCurrentQuestion(parsedState.currentQuestion); // Set the current question using the index
    setScore(parsedState.score);
    setSelectedCompetency(parsedState.selectedCompetency);
    setUserExamId(parsedState.userExamId);
    setSelectedProgram(parsedState.selectedProgram);
    setMaxQuestions(parsedState.maxQuestions);
    setFilteredQuestions(parsedState.filteredQuestions); // Convert plain objects back to the original 
    setSelectedChoices(parsedState.selectedChoices);
  }
}, []);

const handleChoiceClick = (choiceIndex, choice, competencyId) => {
  const updatedSelectedChoices = [...selectedChoices];
  updatedSelectedChoices[choiceIndex] = choice;
  console.log('selectedChoices before update:', selectedChoices);
  console.log('updatedSelectedChoices:', updatedSelectedChoices); // Add this line
  setSelectedChoices(updatedSelectedChoices);

  // Calculate the score for the current competency
  const competencyScore = calculateScore(updatedSelectedChoices, competencyId);
  updateCompetencyScore(competencyId, competencyScore);

  localStorage.setItem('selectedChoices', JSON.stringify(updatedSelectedChoices));
  saveExamStateToLocalStorage();
}

  // Function to calculate the total score for selected questions
  const calculateScore = () => {
    const scoresByCompetency = {}; // Create an object to store scores by competency ID
  
    filteredQuestions.forEach((question, index) => {
      const selectedChoice = selectedChoices[index];
  
      if (selectedChoice && selectedChoice.isCorrect) {
        // Check if the competency ID exists in the question
        if (question.competency_id) {
          const competencyId = question.competency_id;
  
          if (!scoresByCompetency[competencyId]) {
            scoresByCompetency[competencyId] = 0;
          }
  
          scoresByCompetency[competencyId]++;
        }
      }
    });
  
    // Log the scores for each competency
    console.log('Scores by Competency ID:', scoresByCompetency);
  
    return JSON.stringify(scoresByCompetency); // Convert the object to a JSON string
  };
  

  const resetExam = () => {
    setSelectedChoices(Array(maxQuestions).fill(-1)); // Reset selected answers
    setScore(0); // Reset the score
    setCurrentQuestion(0);
    setShowResults(false);
  };
// Define your Select options
const programOptions = [
  { value: 'Social Work', label: 'Social Work' }
];

const competencyOptions = [
  { value: 'All Competency', label: 'All Competency' },
  { value: 'SWPPS', label: 'SWPPS' },
  { value: 'Casework', label: 'Casework' },
  { value: 'HBSE', label: 'HBSE' },
  { value: 'CO', label: 'CO' },
  { value: 'Groupwork', label: 'Groupwork' },
];
const countdownOptions = [
  { value: 0.5, label: '30 minutes' },
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
  { value: 4, label: '4 hours' },
  { value: 5, label: '5 hours' },
];

// Add your state variables for selected options
const [num, setNum] = useState(0);
const [selectedTime, setSelectedTime] = useState(0);
const [countdownStarted, setCountdownStarted] = useState(false);
const [examStartTime, setExamStartTime] = useState(null);

let intervalRef = useRef();

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(remainingSeconds).padStart(2, '0')}s`;
};

const decreaseNum = () => setNum((prev) => prev - 1);

useEffect(() => {
  setLoading(false);
  if (countdownStarted && selectedTime > 0 && num > 0) {
    intervalRef.current = setInterval(decreaseNum, 1000);
    saveTimerStateToLocalStorage();
  } else {
    clearInterval(intervalRef.current);
    if (countdownStarted && num === 0) {
      handleFinishExam(); // Trigger handleFinishExam when the timer reaches 0 and the exam has started
    }
  }
  return () => clearInterval(intervalRef.current);
}, [countdownStarted, selectedTime, num]);

const [initialSelectedTime, setInitialSelectedTime] = useState(0);
const handleTimeChange = (selectedOption) => {
  setSelectedTime(selectedOption.value);
  setInitialSelectedTime(selectedOption.value); // Store the initially selected time
  setNum(selectedOption.value * 3600);
  setCountdownStarted(false);
};

const saveTimerStateToLocalStorage = () => {
  const timerState = {
    num,
    selectedTime,
    countdownStarted,
    elapsedTime: selectedTime * 3600 - num
  };
  localStorage.setItem('timerState', JSON.stringify(timerState));
};

// Load timer state from localStorage when the component mounts
useEffect(() => {
  const savedTimerState = localStorage.getItem('timerState');
  if (savedTimerState) {
    const parsedTimerState = JSON.parse(savedTimerState);
    setNum(parsedTimerState.num);
    setSelectedTime(parsedTimerState.selectedTime);
    setCountdownStarted(parsedTimerState.countdownStarted);

    // Calculate remaining time based on elapsed time
    const remainingTime = parsedTimerState.selectedTime * 3600 - parsedTimerState.elapsedTime;
    setNum(remainingTime);
  }
}, []);
const startExam = async () => {
  try {
    setLoading(true); // Set loading state to true before making the request

    // Validate selectedProgram and selectedCompetency
    const programValue = selectedProgram ? selectedProgram.value : null;
    const competencyValue = selectedCompetency ? selectedCompetency.value : null;

    if (programValue === null || competencyValue === null) {
      // Handle the case where program or competency is not selected
      console.error('Program or competency is not selected.');
      // You can display an error message to the user or handle it as needed.
      setLoading(false); // Reset the loading state
      return;
    }

    // Get the user_id from localStorage
    const user_id = localStorage.getItem('user_id');

    // Create a user_exam entry in the database
    const response = await axios.post('https://smartexam.cyclic.app/exams/user-exams', {
      user_id,
      program: programValue,
      competency: competencyValue,
      duration_minutes: selectedTime * 60, // Convert selectedTime to minutes
      start_time: new Date(), // Use the current time as the start time
    });

    // Store the user_exam_id and other relevant data in your frontend state
    setUserExamId(response.data.user_exam_id);
    setCountdownStarted(true);
    saveTimerStateToLocalStorage();
    setNum(selectedTime * 3600); // Set the countdown time in seconds
    setExamStartTime(new Date()); // Update exam start time to current time
    localStorage.removeItem('examState');

    // Reset the loading state after 2 seconds (simulate loading)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  } catch (error) {
    console.error('Error starting exam:', error);
    setLoading(false); // Reset the loading state in case of error
  }
};

const endExam = async () => {
  try {
    const user_exam_id = userExamId;
    const endTime = new Date();
    const startTime = examStartTime;

    // Calculate the duration in milliseconds
    let durationMilliseconds = endTime - startTime;

    // Handle cases where the duration might be greater due to system delays (e.g., laptop sleep)
    if (durationMilliseconds < 0) {
      // If the end time is before the start time, set duration to 0
      durationMilliseconds = 0;
    }

    // Calculate the total duration in minutes
    let total_duration_minutes = durationMilliseconds / (1000 * 60); // Convert milliseconds to minutes

    // Ensure that the duration does not exceed the initially selected time
    total_duration_minutes = Math.min(total_duration_minutes, initialSelectedTime * 60);

    // Format the total duration as "00h:00m:00s"
    const formattedTotalDuration = `${String(Math.floor(total_duration_minutes / 60)).padStart(2, '0')}h:${String(
      Math.floor(total_duration_minutes % 60)
    ).padStart(2, '0')}m:${String(Math.floor((total_duration_minutes % 1) * 60)).padStart(2, '0')}s`;

    const response = await axios.post('https://smartexam.cyclic.app/exams/end-exam', {
      exam_id: user_exam_id,
      score: calculateScore(),
      total_duration_minutes: formattedTotalDuration,
      endTime: endTime.toISOString(), // Use ISO string format for the end time
    });

    localStorage.removeItem('examState');
    localStorage.removeItem('timerState');
    localStorage.removeItem('selectedChoices');
    
    if (response.status === 200) {
      console.log('Exam ended successfully');
    }
  } catch (error) {
    console.error('Error ending exam:', error);
  }
};

const handleFinishExam = () => {
  setShowResults(true);
  setCountdownStarted(false);
  endExam(); // Call the endExam function when the Finish button is clicked
  saveTimerStateToLocalStorage();
  setTimeout(() => {
    // Reset the loading state to false after 2 seconds
    setLoading(false);
  }, 2000);
};

const nextPage = () => {
  // Get the questions on the current page
  const currentQuestions = filteredQuestions.slice(
    currentQuestion,
    currentQuestion + questionsPerPage
  );

  // Check if all questions on the current page have valid answers
  const allQuestionsAnswered = currentQuestions.every(
    (question, index) => selectedChoices[currentQuestion + index] !== undefined
  );

  if (allQuestionsAnswered) {
    const nextPage = Math.min(currentPage + 1, totalPages);
    const nextQuestion = (nextPage - 1) * questionsPerPage;
    setCurrentQuestion(nextQuestion);
    saveExamStateToLocalStorage();
    window.scrollTo(0, 0);
  } else {
    // Display a message or take appropriate action indicating that all questions need to be answered
    alert('Please answer all questions on the current page before proceeding.');
    // You can also customize the behavior as per your requirements.
  }
};

const prevPage = () => {
  const prevPage = Math.max(currentPage - 1, 1); // Ensure we don't go before the first page
  const prevQuestion = (prevPage - 1) * questionsPerPage;
  setCurrentQuestion(prevQuestion);
  window.scrollTo(0, 0);
};

const handlePageClick = (page) => {
  // Get the questions on the current page
  const currentQuestions = filteredQuestions.slice(
    currentQuestion,
    currentQuestion + questionsPerPage
  );

  // Check if all questions on the current page have valid answers
  const allQuestionsAnswered = currentQuestions.every(
    (question, index) => selectedChoices[currentQuestion + index] !== undefined
  );

  if (allQuestionsAnswered) {
    const newPage = Math.max(1, Math.min(page, totalPages)); // Ensure the selected page is within valid bounds
    const newQuestion = (newPage - 1) * questionsPerPage;
    setCurrentQuestion(newQuestion);
    window.scrollTo(0, 0);
  } else {
    // Display a message or take appropriate action indicating that all questions need to be answered
    alert('Please answer all questions on the current page before proceeding.');
    // You can also customize the behavior as per your requirements.
  }
};

const isCurrentPageFullyAnswered = () => {
  const currentQuestions = filteredQuestions.slice(currentQuestion, currentQuestion + questionsPerPage);
  return currentQuestions.every((_, choiceIndex) => selectedChoices[currentQuestion + choiceIndex] !== undefined);
};

const totalPages = Math.ceil(maxQuestions / questionsPerPage);
  const currentPage = Math.floor(currentQuestion / questionsPerPage) + 1;
  const displayPages = 4;
  const pages = [];
  for (let i = Math.max(1, currentPage - Math.floor(displayPages / 2)); i <= Math.min(totalPages, currentPage + Math.floor(displayPages / 2)); i++) {
    pages.push(i);
  }
  return (
    <div className="container min-h-screen h-auto items scroll-smooth flex flex-col">
      <div className="text-center border-2 dark:border-gray-700 border-indigo-700 rounded-lg dark:rounded-lg dark:bg-slate-900 py-4 header-bg shadow-md text-lg font-semibold dark:text-white">
        <div className="flex flex-row gap-5 justify-center mx-3 items-center dark:text-white">
          <div className="mb-4 lg:w-72 dark:bg-slate-600">
        {!showResults && ( 
            <Select
              placeholder="Program"
              id="program"
              name="program"
              value={selectedProgram}
              onChange={(selectedOption) => setSelectedProgram(selectedOption)}
              options={programOptions}
              isDisabled={countdownStarted}
            />
        )}
          </div>

          <div className="mb-4 lg:w-72">
        {!showResults && ( 
            <Select
              placeholder="Choose a Category"
              id="competency"
              name="competency"
              value={selectedCompetency}
              onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
              options={competencyOptions}
              isDisabled={countdownStarted}
            />
        )}
          </div>

          <div className="mb-4 lg:w-72">
        {!showResults && ( 
            <Select
              options={countdownOptions}
              value={countdownOptions.find(option => option.value === selectedTime)}
              onChange={handleTimeChange}
              placeholder="Select Time"
              isDisabled={countdownStarted}
            />
        )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full sticky top-0 left-0 bg-white dark:bg-transparent text-center">
      {selectedTime > 0 && (
  <div className='flex items-center dark:text-white dark:bg-slate-900 p-2 border-x-2 border-b-2 rounded-b-lg dark:border-gray-700 border-indigo-700'>
    <div className='text-blue-600 text-lg'>{formatTime(num)}</div>
    {!countdownStarted ? (
      !showResults && (
        <button
          className={`ml-3 text-lg h-8 transition flex justify-center items-center ease-in-out rounded-lg px-5 delay-150 ${loading ? 'bg-indigo-700 cursor-not-allowed' : 'bg-indigo-700 hover:-translate-y-2'} duration-300 ...`}
          onClick={startExam}
          disabled={loading || !selectedProgram || !selectedCompetency || !selectedTime}
        >
          {loading ? (
            <span className='text-white font-normal'>
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            </span>
          ) : null}
          {loading ? '' : 'Start'}
        </button>
      )
    ) : (
      <button className="text-red-700 text-base ml-2" disabled>
        Counting Down
      </button>
    )}
  </div>
)}

      </div>
        {countdownStarted && !showResults && (
          <div>
            {filteredQuestions.slice(currentQuestion, currentQuestion + questionsPerPage).map((question, index) => (
              <div key={index} className="border-2 dark:border-gray-700 border-indigo-700 rounded-lg dark:rounded-lg dark:bg-slate-900 shadow-lg items-center justify-center my-2 mb-4">
                <h2 className="text-xl text-center dark:text-white btn-primary">Question {currentQuestion + index + 1}/{maxQuestions}</h2>
                <p className="p-3 dark:text-white text-2xl text-center">{question.questionText}</p>
                <ul className="p-3">
                {question.choices && question.choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      onClick={() => {
                        if (countdownStarted) {
                        console.log('selectedChoices before update:', selectedChoices);
                        handleChoiceClick(currentQuestion + index, choice);
                        console.log('selectedChoices after update:', selectedChoices);
                        }
                      }}
                      className={
                        `container dark:text-white text-gray-700 btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer 
                         ${selectedChoices[currentQuestion + index] === choice ? 'bg-indigo-500 text-white' : ''}`
                      }
                    >
                      <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className=" py-2 px-4 font-semibold">
                  {choice.choiceText}
                </div>
                    </div>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex justify-center p-4">
            <div className="container w-full flex justify-end items-end">
  {countdownStarted && (
    <button
    className="relative rounded justify-center items-center h-10 mr-2 bg-indigo-700 px-3 py-1.5 text-md font-medium text-white flex ease-in-out transition delay-150 hover:-translate-y-2 duration-300 ..."
    onClick={() => {
      const confirmSubmit = window.confirm("Are you sure you want to continue?");
      if (confirmSubmit) {
        // The user confirmed, you can proceed with the action
        handleFinishExam();
      }
    }}
    disabled={!countdownStarted}
  >
    Submit
  </button>
  )}
</div>
          <div className="container flex justify-end header-bg dark:text-white">
          <ul className="list-style-none flex">
          <li>
        {currentPage > 1 && (
          <button
          className="relative rounded h-10 mr-2 bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 flex items-center"
          onClick={prevPage}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 mr-2" />
          Previous
        </button>
        
        )}
      </li>
      {pages.map((page) => (
        <li key={page}>
          <button
            className={`${
              currentPage === page
                ? "bg-indigo-700 text-white "
                : "hover:bg-indigo-600 hover:text-white dark:text-white text-black"
            } py-2 px-4 rounded gap-1`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        </li>
      ))}
      <li>
        {currentPage < totalPages && (
          <button
            className="relative rounded bg-indigo-700 hover:bg-indigo-600 text-white ml-2 py-2 px-4 flex items-center"
            onClick={nextPage}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4 ml-2" />
          </button>
        )}
      </li>
            </ul>
          </div>
          </div>
        </div>
        )}
        {showResults && <ExamResult 
        filteredQuestions={filteredQuestions} 
        selectedChoices={selectedChoices} 
        resetExam={resetExam} 
        selectedCompetency={selectedCompetency} />}
    </div>
  );
} 

export default Exam;
