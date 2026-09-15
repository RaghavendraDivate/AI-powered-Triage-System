// src/pages/Chat.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.jsx";
import { useBookingStore } from "@/store/bookingStore.js";
import { useToast } from "@/hooks/use-toast.js";
import {
  hospitalAPI,
  mapDepartment,
  mapDoctorLevel,
} from "@/services/api.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { DoctorLevelBadge } from "@/components/ui/doctor-level-badge.jsx";
import { Label } from "@/components/ui/label.jsx"; // <-- Correct import added
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import "./Chat.css";

const generateUniqueId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString() + Math.random().toString(36).slice(2);

// Helper function to parse symptoms from AI response
const parseSymptomsFromResponse = (text) => {
  const symptomRegex = /SYMPTOMS:\s*(\[.*?\])/;
  const match = text.match(symptomRegex);
  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      } else {
        console.error("Parsed symptoms data is not an array of strings:", parsed);
        return null;
      }
    } catch (parseError) {
      console.error("Failed to parse symptoms JSON:", parseError, "Raw match:", match[1]);
      return null;
    }
  }
  return null;
};

// Helper function to clean the SYMPTOMS tag from the display text
const cleanResponseText = (text) => {
  const symptomRegex = /SYMPTOMS:\s*(\[.*?\])/;
  return text.replace(symptomRegex, "").trim();
};

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAIResults, setAppointmentData } = useBookingStore();

  const [chatMessages, setChatMessages] = useState([
    { role: "system", content: "Initial context." },
  ]);
  const [displayMessages, setDisplayMessages] = useState([
    { id: generateUniqueId(), type: "ai", content: "Hello! Describe your symptoms.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiResults, setLocalAIResults] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const addDisplayMessage = (msg) => setDisplayMessages((prev) => [...prev, msg]);
  const addChatMessage = (msg) => setChatMessages((prev) => [...prev, msg]);

  const getPrediction = async (symptomList) => {
    if (!symptomList || symptomList.length === 0) {
      toast({ title: "Analysis Incomplete", description: "AI couldn't identify symptoms.", variant: "destructive" });
      setIsLoading(false); return;
    }
    try {
      const predictionResult = await hospitalAPI.predict(symptomList);
      if (predictionResult.error) {
        toast({ title: "Prediction Error", description: predictionResult.error, variant: "destructive" });
        setIsLoading(false); return;
      }
      const deptId = mapDepartment(predictionResult.department);
      const docLevel = mapDoctorLevel(predictionResult.doctor_level);
      const resultData = {
        disease: predictionResult.disease, confidence: predictionResult.confidence,
        department: deptId, doctorLevel: docLevel,
        symptoms: predictionResult.matched_symptoms.join(", "),
        rawSymptomsList: predictionResult.matched_symptoms
      };
      const predMsg = {
        id: generateUniqueId(), type: "ai",
        content: `Based on symptoms (${resultData.symptoms}), I recommend the ${predictionResult.department} department. A ${docLevel} doctor is suggested. Confidence: ${(predictionResult.confidence * 100).toFixed(1)}%.`,
        timestamp: new Date(),
      };
      addDisplayMessage(predMsg);
      setLocalAIResults(resultData);
      setAIResults(resultData);
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Prediction API call failed:", error);
      
      // Provide user-friendly error messages
      let errorTitle = "Prediction Failed";
      let errorDescription = error.message;
      let displayMessage = `Unable to analyze symptoms: ${error.message}`;
      
      if (error.message.includes("Database") || error.message.includes("unavailable")) {
        errorTitle = "Service Unavailable";
        errorDescription = "The prediction service is temporarily unavailable. Please try again in a moment.";
        displayMessage = "The prediction service is temporarily unavailable. Please try again shortly.";
      } else if (error.message.includes("timeout")) {
        errorTitle = "Request Timeout";
        errorDescription = "The prediction took too long. Please try again.";
        displayMessage = "The analysis took too long. Please try again.";
      } else if (error.message.includes("connect") || error.message.includes("network")) {
        errorTitle = "Connection Error";
        errorDescription = "Cannot connect to the prediction service. Please check your connection.";
        displayMessage = "Cannot connect to the prediction service. Please check your internet connection.";
      }
      
      toast({ title: errorTitle, description: errorDescription, variant: "destructive" });
      addDisplayMessage({ id: generateUniqueId(), type: "ai", content: displayMessage, timestamp: new Date(), isError: true });
    }
  };

  const sendMessageToGemini = async (userText) => {
    if (!userText.trim() || isLoading) return;
    setIsLoading(true); setAnalysisComplete(false); setLocalAIResults(null);
    const userMsg = { id: generateUniqueId(), type: "user", content: userText, timestamp: new Date() };
    addDisplayMessage(userMsg);
    const newChatHistory = [...chatMessages.slice(-9), { role: "user", content: userText }];
    addChatMessage({ role: "user", content: userText });
    setInput("");
    try {
      const responseText = await hospitalAPI.chat(newChatHistory);
      addChatMessage({ role: "assistant", content: responseText });
      const symptomList = parseSymptomsFromResponse(responseText);
      const cleanText = cleanResponseText(responseText);
      const aiMsg = { id: generateUniqueId(), type: "ai", content: cleanText, timestamp: new Date() };
      addDisplayMessage(aiMsg);
      if (symptomList && symptomList.length > 0) {
         await getPrediction(symptomList);
      }
    } catch (error) {
      console.error("Chat API call failed:", error);
      
      // Provide user-friendly error messages based on error type
      let errorTitle = "Chat Error";
      let errorDescription = error.message || "AI assistant error.";
      let displayMessage = `Error: ${error.message}`;
      
      if (error.message.includes("rate limit") || error.message.includes("quota exceeded")) {
        errorTitle = "Service Busy";
        errorDescription = "AI service is currently busy. Please wait a moment and try again.";
        displayMessage = "I'm experiencing high demand right now. Please try again in a few moments.";
      } else if (error.message.includes("timeout") || error.message.includes("too long")) {
        errorTitle = "Request Timeout";
        errorDescription = "The request took too long. Please try again with a shorter message.";
        displayMessage = "Sorry, that took too long. Please try again.";
      } else if (error.message.includes("connect") || error.message.includes("network")) {
        errorTitle = "Connection Error";
        errorDescription = "Cannot connect to the server. Please check your internet connection.";
        displayMessage = "I'm having trouble connecting. Please check your internet connection and try again.";
      } else if (error.message.includes("Database") || error.message.includes("unavailable")) {
        errorTitle = "Service Unavailable";
        errorDescription = "The service is temporarily unavailable. Please try again in a moment.";
        displayMessage = "The service is temporarily unavailable. Please try again shortly.";
      }
      
      addDisplayMessage({ id: generateUniqueId(), type: "ai", content: displayMessage, timestamp: new Date(), isError: true });
      toast({ title: errorTitle, description: errorDescription, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessageToGemini(input);
  const handleKeyPress = (e) => { if (e.key === "Enter" && !e.shiftKey && !isLoading) { e.preventDefault(); handleSend(); } };

  const handleBookNow = () => {
    if (aiResults) {
      const appointmentDataForStore = {
        department: aiResults.department, doctorLevel: aiResults.doctorLevel,
        symptoms: aiResults.symptoms, mode: "ai",
      };
      setAppointmentData(appointmentDataForStore);
      navigate("/book?mode=ai");
    } else {
      console.error("handleBookNow called but aiResults is null or undefined!");
      toast({ title: "Error", description: "Analysis results not available.", variant: "destructive" });
    }
  };

  return (
    <div className="chat-container">
      <Navbar />
      <div className="chat-content">
        {/* Header */}
        <div className="chat-header">
          <h1 className="chat-title">AI Health Assistant</h1>
          <p className="chat-description">Describe your symptoms. I'll ask follow-ups if needed.</p>
        </div>
        <div className="chat-grid">
          {/* Chat Interface Column */}
          <div>
            <Card className="chat-interface">
              <CardHeader>
                <CardTitle><MessageCircle className="inline-block mr-2 h-5 w-5"/> Symptom Analysis Chat</CardTitle>
                <CardDescription>Describe your symptoms or answer follow-ups.</CardDescription>
              </CardHeader>
              <CardContent className="chat-content-container">
                {/* Messages Area */}
                <div className="chat-messages-container">
                  <div className="chat-messages">
                    {displayMessages.map((msg) => (
                      <div key={msg.id} className={`message-container ${msg.type === "user" ? "message-container-user" : "message-container-ai"}`}>
                        <div className="message-avatar">
                          {msg.type === "user" ? <div className="avatar user-avatar"><User size={16} /></div>
                            : <div className="avatar ai-avatar"><Bot size={16} /></div>}
                        </div>
                        <div className="message-content">
                          <div className={`message-bubble ${msg.type === "user" ? "message-bubble-user" : "message-bubble-ai"} ${msg.isError ? "message-error" : ""}`}>
                            <p className="message-text">{msg.content}</p>
                            <span className="message-time">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && ( /* Loading Indicator */
                      <div className="message-container message-container-ai">
                        <div className="message-avatar"><div className="avatar ai-avatar"><Bot size={16} /></div></div>
                        <div className="message-content">
                          <div className="message-bubble message-bubble-ai">
                            <div className="typing-indicator"><span>Thinking...</span></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Scroll Anchor */}
                  </div>
                </div>
                {/* Input Area */}
                <div className="chat-input-container">
                  <div className="input-wrapper">
                    <Input placeholder="Describe your symptoms..." value={input}
                      onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress}
                      disabled={isLoading} className="chat-input" />
                    <div className="input-actions">
                      <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Results Column */}
          <div>
            {analysisComplete && aiResults ? ( /* Show Results Card */
              <Card className="results-card">
                <CardHeader>
                  <CardTitle><CheckCircle className="inline-block mr-2 h-5 w-5 text-green-500"/> Analysis Results</CardTitle>
                  <CardDescription>Based on your symptom analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="results-content space-y-3">
                    <div className="result-group">
                      {/* Label component imported and used here */}
                      <Label>Recommended Department</Label>
                      <Badge variant="secondary" className="capitalize">{aiResults.department.replace('-', ' ')}</Badge>
                    </div>
                    <div className="result-group">
                      <Label>Recommended Doctor Level</Label>
                      <DoctorLevelBadge level={aiResults.doctorLevel} />
                    </div>
                    <div className="result-group">
                      <Label>Symptoms Identified</Label>
                      <p className="symptoms-list-display text-sm text-muted-foreground">{aiResults.symptoms}</p>
                    </div>
                    <Button onClick={handleBookNow} size="lg" className="w-full mt-4">
                      <Calendar className="mr-2 h-4 w-4"/> Book Appointment Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : ( /* Show Placeholder Card */
              <Card className="empty-results-card">
                <CardContent className="pt-6">
                  <div className="empty-results flex flex-col items-center justify-center text-center text-muted-foreground">
                    <Bot className="empty-results-icon h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold mb-1">Waiting for Analysis</h3>
                    <p className="text-sm">Describe your symptoms to get recommendations.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;