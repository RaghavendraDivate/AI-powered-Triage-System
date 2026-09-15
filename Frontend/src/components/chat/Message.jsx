import { Button } from "@/components/ui/button.jsx";
import { Bot, User, CheckCircle, Clock, AlertTriangle, RefreshCw, Calendar, Loader2 } from "lucide-react";

const Message = ({ 
  message, 
  onRetry, 
  onManualBooking, 
  isAnalyzing = false 
}) => {
  const isUser = message.type === "user";
  const timestamp = typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp;

  const renderFormattedContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Handle markdown-like formatting
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className={index === 0 ? "message-first-line" : ""}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      // Handle bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={index} className="message-list-item">{line.substring(2)}</li>;
      }
      if (line.trim()) {
        return <p key={index} className={index === 0 ? "message-first-line" : ""}>{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <div
      className={`message-container ${isUser ? "message-container-user" : "message-container-ai"}`}
    >
      <div className="message-avatar">
        {isUser ? (
          <div className="avatar user-avatar">
            <User size={16} />
          </div>
        ) : (
          <div className={`avatar ai-avatar ${
            message.isProcessing ? "processing" : ""
          } ${
            message.isRetrying ? "retrying" : ""
          }`}>
            {message.isProcessing || message.isRetrying ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Bot size={16} />
            )}
          </div>
        )}
      </div>
      
      <div className="message-content">
        <div
          className={`message-bubble ${isUser ? "message-bubble-user" : "message-bubble-ai"} ${
            message.isError ? "message-error" : ""
          } ${message.isProcessing ? "message-processing" : ""} ${
            message.isRetrying ? "message-retrying" : ""
          } ${message.isResult ? "message-result" : ""}`}
        >
          {message.confidence && (
            <div className="confidence-indicator">
              {message.confidence >= 0.8 ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : message.confidence >= 0.6 ? (
                <Clock size={14} className="text-yellow-500" />
              ) : (
                <AlertTriangle size={14} className="text-orange-500" />
              )}
              <span className="text-xs ml-1">
                {message.confidence >= 0.8 ? "High confidence" : 
                 message.confidence >= 0.6 ? "Moderate confidence" : "Low confidence"}
              </span>
            </div>
          )}
          
          <div className="message-text">
            {renderFormattedContent(message.content)}
          </div>
          
          {/* Message actions */}
          <div className="message-actions">
            {message.isError && message.canRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="retry-btn"
                disabled={isAnalyzing}
              >
                <RefreshCw size={14} className={isAnalyzing ? "animate-spin" : ""} />
                Retry
              </Button>
            )}
            
            {message.isError && message.showManualBooking && (
              <Button
                size="sm"
                variant="default"
                onClick={onManualBooking}
                className="manual-booking-btn"
              >
                <Calendar size={14} />
                Book Appointment
              </Button>
            )}
          </div>
          
          <span className="message-time">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;