import { Button } from "@/components/ui/button.jsx";
import { Bot } from "lucide-react";

const FollowUpQuestions = ({ 
  questions, 
  onAnswer, 
  onSkip, 
  showSkipOption = false 
}) => {
  if (questions.length === 0) return null;

  return (
    <div className="quick-replies-container">
      <div className="quick-replies-label">
        <Bot size={14} />
        <span>Please answer these questions for better accuracy:</span>
      </div>
      <div className="follow-up-questions">
        {questions.map((question, index) => (
          <div key={index} className="question-item">
            <p className="question-text">{question}</p>
            <div className="question-actions">
              <Button
                variant="default"
                size="sm"
                className="question-btn yes-btn"
                onClick={() => onAnswer(question, 'yes')}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="question-btn no-btn"
                onClick={() => onAnswer(question, 'no')}
              >
                No
              </Button>
            </div>
          </div>
        ))}
        
        {showSkipOption && (
          <div className="skip-questions">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="skip-btn"
            >
              Skip remaining questions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpQuestions;