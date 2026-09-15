// src/pages/BookingNew.jsx

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { DoctorLevelBadge } from "@/components/ui/doctor-level-badge.jsx";
import { departments } from "@/data/hospitalData.js";
import Navbar from "@/components/Navbar.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { useBookingStore } from "@/store/bookingStore.js";
import {
  ArrowRight,
  Brain,
  Calendar,
  Clock,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils.js";
import { hospitalAPI } from "@/services/api.js";
import "./BookingNew.css";

// --- Utility Helpers ---

/**
 * Helper to robustly resolve a department identifier (ID) from various inputs
 */
const resolveDepartmentId = (value) => {
  if (!value) return "";
  const val = String(value).trim();
  const byId = departments.find((d) => d.id === val);
  if (byId) return byId.id;
  const lower = val.toLowerCase();
  const byName = departments.find((d) => d.name.toLowerCase() === lower);
  if (byName) return byName.id;
  // Fallback to a general department if no match
  return "general-medicine";
};

/**
 * Gets tomorrow's date in YYYY-MM-DD format
 */
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

// --- Main Component ---

const BookingNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { appointmentData, reset } = useBookingStore();

  const mode = searchParams.get("mode") || "manual";
  const isAIMode = mode === "ai";

  // Initialize state from Zustand store or route state
  const initialData = appointmentData || location.state?.appointmentData || {};
  const aiSource = isAIMode ? initialData : {}; // Use initialData only if AI mode

  // --- State Management ---

  const [formData, setFormData] = useState({
    selectedDepartment: aiSource?.department
      ? resolveDepartmentId(aiSource.department)
      : "",
    selectedDoctorId: "",
    selectedDate: "",
    selectedSlot: "",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    symptoms: aiSource?.symptoms || "",
  });

  const [termsChecked, setTermsChecked] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- Field Change Handlers ---

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (deptId) => {
    setFormData((prev) => ({
      ...prev,
      selectedDepartment: deptId,
      selectedDoctorId: "", // Reset doctor
      selectedDate: "",      // Reset date
      selectedSlot: "",      // Reset slot
    }));
    setBookedSlots([]);
  };

  const handleDoctorChange = (doctorId) => {
    setFormData((prev) => ({
      ...prev,
      selectedDoctorId: doctorId,
      selectedDate: "", // Reset date
      selectedSlot: "", // Reset slot
    }));
    setBookedSlots([]);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      selectedDate: date,
      selectedSlot: "", // Reset slot
    }));
    setBookedSlots([]);
  };

  const handleSlotClick = (slot) => {
    if (bookedSlots.includes(slot)) return;
    setFormData((prev) => ({ ...prev, selectedSlot: slot }));
  };

  // --- Data Fetching & Effects ---

  // Get current doctor info helper
  const getSelectedDoctorInfo = useCallback(() => {
    const { selectedDoctorId, selectedDepartment } = formData;
    if (!selectedDoctorId || !selectedDepartment) return null;
    const dept = departments.find((d) => d.id === selectedDepartment);
    return dept?.doctors.find((d) => d.id === selectedDoctorId) || null;
  }, [formData.selectedDoctorId, formData.selectedDepartment]);

  // Derive available doctors based on selected department and AI recommendation
  useEffect(() => {
    const { selectedDepartment, selectedDoctorId } = formData;
    if (!selectedDepartment) {
      setAvailableDoctors([]);
      handleDoctorChange("");
      return;
    }

    const dept = departments.find((d) => d.id === selectedDepartment);
    let doctors = dept ? dept.doctors : [];

    if (isAIMode && aiSource?.doctorLevel) {
      const aiLevel = aiSource.doctorLevel.toLowerCase();
      doctors = doctors.filter((doctor) => {
        const docLevel = doctor.level.toLowerCase();
        const effectiveDocLevel = docLevel === "general" ? "junior" : docLevel;
        return effectiveDocLevel === aiLevel;
      });
    }
    setAvailableDoctors(doctors);

    if (selectedDoctorId && !doctors.some((doc) => doc.id === selectedDoctorId)) {
      handleDoctorChange(""); // Reset if selected doctor is no longer valid
    } else if (!selectedDoctorId && doctors.length > 0) {
      handleDoctorChange(doctors[0].id); // Auto-select first available
    }
  }, [formData.selectedDepartment, isAIMode, aiSource?.doctorLevel]);

  // Load booked slots from backend database
  const loadBookedSlots = useCallback(async (date, doctorInfo) => {
    const doctorName = doctorInfo?.name;
    if (!doctorName || !date) {
      setBookedSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const response = await hospitalAPI.getBookedSlots(doctorName, date);
      setBookedSlots(response?.booked_slots || []);
    } catch (error) {
      console.error("Error loading booked slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Effect to load booked slots when doctor or date changes
  useEffect(() => {
    const { selectedDoctorId, selectedDate } = formData;
    const doctorInfo = getSelectedDoctorInfo();
    if (selectedDoctorId && selectedDate && doctorInfo) {
      loadBookedSlots(selectedDate, doctorInfo);
    } else {
      setBookedSlots([]);
    }
  }, [formData.selectedDoctorId, formData.selectedDate, getSelectedDoctorInfo, loadBookedSlots]);

  // Auto-refresh slots on window focus
  useEffect(() => {
    const handleFocus = () => {
      const { selectedDoctorId, selectedDate } = formData;
      const doctorInfo = getSelectedDoctorInfo();
      if (selectedDoctorId && selectedDate && doctorInfo) {
        loadBookedSlots(selectedDate, doctorInfo);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [formData.selectedDoctorId, formData.selectedDate, getSelectedDoctorInfo, loadBookedSlots]);

  // --- Form Logic ---

  /**
   * Validates the form data and returns an error object or null
   * @returns {object|null} Toast-compatible error object or null
   */
  const validateForm = (doctorInfo) => {
    const {
      selectedDepartment,
      selectedDoctorId,
      selectedDate,
      selectedSlot,
      patientName,
      patientPhone,
      patientEmail,
      symptoms,
    } = formData;

    if (
      !selectedDepartment || !selectedDoctorId || !selectedDate || !selectedSlot ||
      !patientName || !patientPhone || !patientEmail || !symptoms
    ) {
      return { title: "Missing Information", description: "Please fill all required fields.", variant: "destructive" };
    }
    if (!termsChecked) {
      return { title: "Terms Required", description: "Please accept the Terms & Conditions to proceed.", variant: "destructive" };
    }
    if (bookedSlots.includes(selectedSlot)) {
      return { title: "Slot Unavailable", description: "This time slot has been booked. Please select a different slot.", variant: "destructive" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail)) {
      return { title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" };
    }
    if (patientPhone.length < 10) {
      return { title: "Invalid Phone", description: "Please enter a valid phone number (at least 10 digits).", variant: "destructive" };
    }
    if (!doctorInfo) {
      return { title: "Doctor Error", description: "Selected doctor details not found.", variant: "destructive" };
    }
    return null;
  };

  /**
   * Constructs the final API payload
   * @returns {object} The appointment payload
   */
  const buildPayload = (doctorInfo) => {
    const department = departments.find(d => d.id === formData.selectedDepartment);
    return {
      patient_name: formData.patientName,
      patient_phone: formData.patientPhone,
      patient_email: formData.patientEmail,
      doctor_name: doctorInfo.name,
      department: department?.name || formData.selectedDepartment,
      doctor_level: aiSource?.doctorLevel || doctorInfo.level,
      appointment_date: formData.selectedDate,
      appointment_time: formData.selectedSlot,
      symptoms: formData.symptoms,
      mode: mode,
    };
  };

  /**
   * Handles the form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorInfo = getSelectedDoctorInfo();

    // 1. Validation
    const validationError = validateForm(doctorInfo);
    if (validationError) {
      toast(validationError);
      // If slot was unavailable, refresh the slots
      if (validationError.title === "Slot Unavailable") {
        loadBookedSlots(formData.selectedDate, doctorInfo);
      }
      return;
    }

    // 2. Build Payload
    const appointmentPayload = buildPayload(doctorInfo);

    // 3. Call API
    setIsLoading(true);
    try {
      const bookingResult = await hospitalAPI.book(appointmentPayload);
      const bookingId = bookingResult?.appointment?.booking_id || "N/A";

      toast({
        title: "Booking Confirmed!",
        description: `Appointment with Dr. ${bookingResult?.appointment?.doctor_name} booked. ID: ${bookingId}`,
        variant: "success",
        duration: 7000,
      });

      reset(); // Clear Zustand store
      navigate(`/confirmation/${bookingId}`);

    } catch (error) {
      // 4. Handle Error
      console.error("Booking API call failed:", error);
      let errorTitle = "Booking Failed";
      let errorDescription = error.message || "Could not book the appointment.";

      if (error.message?.includes("already booked") || error.message?.includes("409")) {
        errorTitle = "Slot Unavailable";
        loadBookedSlots(formData.selectedDate, doctorInfo); // Refresh slots
      } else if (error.message?.includes("Duplicate")) {
        errorTitle = "Duplicate Booking";
      } else if (error.message?.includes("Database") || error.message?.includes("unavailable")) {
        errorTitle = "Service Unavailable";
      } else if (error.message?.includes("timeout")) {
        errorTitle = "Request Timeout";
      } else if (error.message?.includes("network")) {
        errorTitle = "Connection Error";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const doctorInfo = getSelectedDoctorInfo();

  // --- Render ---

  return (
    <div className="booking-container">
      <Navbar />
      <div className="booking-content">
        <div className="booking-header">
          <h1 className="booking-title">Book Your Appointment</h1>
          <p className="booking-description">
            {isAIMode
              ? "Confirm your AI-recommended details or adjust as needed."
              : "Choose your specialist and time."}
          </p>
          {isAIMode && (
            <Badge variant="outline">
              <Brain className="mr-1 h-3 w-3" /> AI Assisted
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit} className="booking-form" noValidate>
          <div className="booking-grid">
            <DoctorTimeSelector
              formData={formData}
              isAIMode={isAIMode}
              aiSource={aiSource}
              availableDoctors={availableDoctors}
              doctorInfo={doctorInfo}
              bookedSlots={bookedSlots}
              loadingSlots={loadingSlots}
              onDepartmentChange={handleDepartmentChange}
              onDoctorChange={handleDoctorChange}
              onDateChange={handleDateChange}
              onSlotClick={handleSlotClick}
            />

            <PatientInfoForm
              formData={formData}
              isAIMode={isAIMode}
              aiSource={aiSource}
              onFieldChange={handleFieldChange}
            />
          </div>

          <BookingSubmit
            isLoading={isLoading}
            isAIMode={isAIMode}
            termsChecked={termsChecked}
            onTermsChange={setTermsChecked}
          />
        </form>
      </div>
    </div>
  );
};

// --- Sub-Components ---

/**
 * Renders the Doctor, Date, and Time selection card
 */
const DoctorTimeSelector = ({
  formData, isAIMode, aiSource, availableDoctors, doctorInfo,
  bookedSlots, loadingSlots,
  onDepartmentChange, onDoctorChange, onDateChange, onSlotClick
}) => {
  const { selectedDepartment, selectedDoctorId, selectedDate, selectedSlot } = formData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Select Doctor & Time
        </CardTitle>
        <CardDescription>
          Choose department, doctor, date, and time slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAIMode && (
          <div className="ai-help-section">
            <div className="ai-help-container flex items-center justify-between gap-4 p-3 rounded border bg-gray-50">
              <div className="ai-help-text text-sm">
                <h4 className="ai-help-title font-medium">
                  Not sure which doctor to choose?
                </h4>
                <p className="ai-help-description text-gray-600">
                  Get AI-powered recommendations based on your symptoms.
                </p>
              </div>
              <Button type="button" variant="outline" asChild>
                <Link to="/chat">
                  <Brain className="ai-help-button-icon mr-2 h-4 w-4" />
                  Get AI Help
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Department */}
        <div className="form-group">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={selectedDepartment}
            onValueChange={onDepartmentChange}
            disabled={isAIMode && !!aiSource?.department}
          >
            <SelectTrigger className={isAIMode && !!aiSource?.department ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            {/* =================== CHANGE IS HERE =================== */}
            <SelectContent className="department-dropdown">
            {/* ==================================================== */}
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id} className="department-item">
                  {dept.icon} {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAIMode && !!aiSource?.department && (
            <p className="form-note text-xs text-blue-600">AI Recommended</p>
          )}
        </div>

        {/* Doctor */}
        <div className="form-group">
          <Label htmlFor="doctor">Doctor *</Label>
          <Select
            value={selectedDoctorId}
            onValueChange={onDoctorChange}
            disabled={!selectedDepartment || availableDoctors.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  availableDoctors.length > 0
                    ? "Select a doctor"
                    : "No doctors available"
                }
              />
            </SelectTrigger>
            {/* =================== CHANGE IS HERE =================== */}
            <SelectContent className="doctor-dropdown">
            {/* ==================================================== */}
              {availableDoctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id} className="doctor-item">
                  {doctor.name}{" "}
                  <DoctorLevelBadge level={doctor.level} className="ml-2" />
                  {isAIMode &&
                    aiSource?.doctorLevel?.toLowerCase() ===
                      doctor.level.toLowerCase() && (
                      <Badge variant="outline" className="ml-2 text-blue-600 border-blue-300">
                        Recommended
                      </Badge>
                    )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAIMode && aiSource?.doctorLevel && (
            <p className="form-note text-xs">
              Showing doctors matching AI recommendation: {aiSource.doctorLevel}
            </p>
          )}
        </div>

        {/* Doctor Info */}
        {doctorInfo && (
          <Card className="doctor-info-card bg-gray-50 border border-gray-200">
            <CardContent className="doctor-info-content text-sm p-3 space-y-1">
              <p><strong>Qualification:</strong> {doctorInfo.qualification}</p>
              <p><strong>Experience:</strong> {doctorInfo.experience} years</p>
              <p><strong>Availability:</strong> {doctorInfo.availability?.hours || "N/A"}</p>
              {doctorInfo.specialization && (
                <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Date */}
        <div className="form-group">
          <Label htmlFor="date">Appointment Date *</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={getTomorrowDate()}
            disabled={!selectedDoctorId}
          />
        </div>

        {/* Time Slots */}
        <div className="form-group">
          <Label htmlFor="slot" className="time-slots-label flex items-center gap-1">
            <Clock className="time-slots-icon h-4 w-4" /> Available Time Slots *
            {loadingSlots && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 ml-2"></div>}
          </Label>
          <div className="time-slots-grid">
            {loadingSlots ? (
              <p className="text-sm text-gray-500 mt-2">Loading available slots...</p>
            ) : doctorInfo?.availability?.slots?.length > 0 ? (
              doctorInfo.availability.slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <Button
                    key={slot}
                    type="button"
                    variant="outline" // Always "outline"
                    className={cn(
                      "time-slot",
                      isBooked && "time-slot-booked",
                      selectedSlot === slot && "time-slot-selected" // Apply selected class
                    )}
                    onClick={() => onSlotClick(slot)}
                    disabled={!selectedDate || isBooked || loadingSlots}
                  >
                    {slot}
                    {isBooked && (
                      <span className="booked-indicator text-xs ml-1">(Booked)</span>
                    )}
                  </Button>
                );
              })
            ) : selectedDoctorId ? (
              <p className="text-sm text-red-500 mt-2">
                No time slots found for this doctor.
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Select a doctor to see time slots.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Renders the Patient Information input card
 */
const PatientInfoForm = ({ formData, isAIMode, aiSource, onFieldChange }) => {
  const { patientName, patientPhone, patientEmail, symptoms } = formData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Patient Information
        </CardTitle>
        <CardDescription>Enter your contact details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div className="form-group">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" placeholder="Enter full name" value={patientName}
            onChange={(e) => onFieldChange("patientName", e.target.value)} required />
        </div>
        {/* Phone */}
        <div className="form-group">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" type="tel" placeholder="Enter phone number" value={patientPhone}
            onChange={(e) => onFieldChange("patientPhone", e.target.value)} required />
        </div>
        {/* Email */}
        <div className="form-group">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" placeholder="Enter email address" value={patientEmail}
            onChange={(e) => onFieldChange("patientEmail", e.target.value)} required />
        </div>
        {/* Symptoms */}
        <div className="form-group">
          <Label htmlFor="symptoms">Symptoms Description *</Label>
          <Textarea
            id="symptoms"
            placeholder={isAIMode ? "AI has pre-filled symptoms..." : "Describe symptoms..."}
            value={symptoms}
            onChange={(e) => onFieldChange("symptoms", e.target.value)}
            rows={4}
            required
            className={isAIMode ? "bg-gray-100" : ""}
            disabled={isAIMode}
          />
          {isAIMode && (
            <p className="form-note text-xs">
              Symptoms based on AI consultation.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Renders the final submission card with Terms and Submit Button
 */
const BookingSubmit = ({ isLoading, isAIMode, termsChecked, onTermsChange }) => (
  <Card className="mt-6">
    <CardContent className="submit-container pt-6">
      <div className="submit-content flex flex-col items-center">
        {/* Terms Checkbox */}
        <div className="terms-checkbox-container mb-4 flex items-center">
          <input
            type="checkbox"
            id="terms"
            required
            className="mr-2 h-4 w-4"
            checked={termsChecked}
            onChange={(e) => onTermsChange(e.target.checked)}
          />
          <Label htmlFor="terms" className="text-xs text-gray-600">
            I agree to the{" "}
            <a href="/terms" target="_blank" className="text-primary hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank"className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </Label>
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="submit-button w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
            </>
          ) : (
            <>
              {isAIMode ? "Confirm AI Booking" : "Book Appointment"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <p className="submit-text text-xs text-gray-500 mt-2">
          Confirmation details will be sent to your email.
        </p>
      </div>
    </CardContent>
  </Card>
);

export default BookingNew;