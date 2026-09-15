import { Bot, Loader2 } from "lucide-react";

const TypingIndicator = ({ 
  isAnalyzing = false, 
  isTyping = false, 
  analysisStage = "Thinking..." 
}) => {
  if (!isAnalyzing && !isTyping) return null;

  return (
    <div className="message-container message-container-ai">
      <div className="message-avatar">
        <div className="avatar ai-avatar processing">
          <Loader2 size={16} className="animate-spin" />
        </div>
      </div>
      <div className="message-content">
        <div className="message-bubble message-bubble-ai">
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">
              {isAnalyzing ? `Analyzing symptoms... ${analysisStage}` : "AI is typing..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;