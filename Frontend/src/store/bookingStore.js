import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
  aiResults: null,
  appointmentData: {},
  isLoading: false,
  confidence: 0,
  conversationId: null,
  symptomsHistory: [],
  questionHistory: {},
  conversationStage: "initial",
  followUpQuestions: [],
  currentInput: "",
  isAnalyzing: false,
  isTyping: false,
  showSkipOption: false,
  retryCount: 0,
  lastError: null,
  setAIResults: (results) => set({
    aiResults: results,
    confidence: results?.confidence || 0,
  }),
  setAppointmentData: (data) => set(state => ({
    appointmentData: { ...state.appointmentData, ...data }
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setConversationId: (id) => set({ conversationId: id }),
  addSymptoms: (newSymptoms) => set(state => ({
    symptomsHistory: [...new Set([...state.symptomsHistory, ...newSymptoms])]
  })),
  setQuestionHistory: (questions) => set({ questionHistory: questions }),
  updateQuestionResponse: (question, response) => set(state => ({
    questionHistory: { ...state.questionHistory, [question]: response },
    ...(response ? { symptomsHistory: [...new Set([...state.symptomsHistory, question])] } : {})
  })),
  setConversationStage: (stage) => set({
    conversationStage: stage,
    showSkipOption: stage === 'follow-up',
  }),
  setFollowUpQuestions: (questions) => set({
    followUpQuestions: questions,
    showSkipOption: questions.length > 0,
  }),
  removeFollowUpQuestion: (question) => set(state => ({
    followUpQuestions: state.followUpQuestions.filter(q => q !== question)
  })),
  setCurrentInput: (input) => set({ currentInput: input }),
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  setIsTyping: (status) => set({ isTyping: status }),
  setRetryCount: (count) => set({ retryCount: count }),
  setLastError: (error) => set({ lastError: error }),
  getAllSymptoms: () => {
    const state = get();
    const positives = Object.entries(state.questionHistory).filter(([k,v]) => v).map(([k]) => k);
    return [...new Set([...state.symptomsHistory, ...positives])];
  },
  getAggregatedSymptoms: () => get().getAllSymptoms().join('. '),
  reset: () => set({
    aiResults: null,
    appointmentData: {},
    isLoading: false,
    confidence: 0,
    conversationId: null,
    symptomsHistory: [],
    questionHistory: {},
    conversationStage: "initial",
    followUpQuestions: [],
    currentInput: "",
    isAnalyzing: false,
    isTyping: false,
    showSkipOption: false,
    retryCount: 0,
    lastError: null,
  }),
}));
