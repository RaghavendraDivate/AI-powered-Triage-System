import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar.jsx';
import { hospitalAPI } from '@/services/api.js';
import { departments } from '@/data/hospitalData.js';
import './Confirmation.css';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Badge } from '@/components/ui/badge.jsx';

const Confirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointment = async () => {
      // Load appointment from MongoDB using the ID from URL
      if (!id) {
        setIsLoading(false);
        navigate('/');
        return;
      }

      try {
        // Fetch appointment from MongoDB
        const appointmentData = await hospitalAPI.getAppointmentById(id);
        
        if (appointmentData) {
          // Transform MongoDB format to match component expectations
          const transformedAppointment = {
            id: appointmentData.appointment_id,
            patientName: appointmentData.patient_name,
            patientPhone: appointmentData.patient_phone,
            patientEmail: appointmentData.patient_email,
            doctorName: appointmentData.doctor_name,
            doctorSpecialization: appointmentData.department,
            doctorLevel: appointmentData.doctor_level,
            department: appointmentData.department,
            appointmentDate: appointmentData.appointment_date,
            appointmentTime: appointmentData.appointment_time,
            symptoms: appointmentData.symptoms,
            mode: appointmentData.mode,
            status: appointmentData.status
          };
          setAppointment(transformedAppointment);
        } else {
          console.error('Appointment not found with ID:', id);
        }
      } catch (error) {
        console.error('Error loading appointment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointment();
  }, [id, navigate]);

  if (isLoading) {
    return null;
  }

  if (!appointment) {
    return (
      <div className="confirmation-container">
        <Navbar />
        <div className="confirmation-content">
          <div className="confirmation-header">
            <div className="confirmation-icon-container">
              <AlertCircle className="confirmation-icon" />
            </div>
            <h1 className="confirmation-title">Missing Appointment Data</h1>
            <p className="confirmation-description">
              We couldn't find the appointment details. Please book again.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Button onClick={() => navigate('/book')} size="lg">
                Go to Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find department info for prep instructions
  const department = departments.find(d => d.name === appointment.department || d.id === appointment.department);

  // Generate appointment prep instructions based on department
  const getPrepInstructions = (deptId) => {
    const instructions = {
      cardiology: [
        "Bring a list of all current medications",
        "Avoid caffeine 2 hours before your appointment",
        "Wear comfortable, loose-fitting clothing",
        "Bring your insurance card and ID"
      ],
      neurology: [
        "Get a good night's sleep before your appointment",
        "Bring a list of your symptoms and when they occur",
        "Bring any previous test results or scans",
        "Consider bringing a family member for support"
      ],
      orthopedics: [
        "Wear loose, comfortable clothing",
        "Bring any X-rays or MRI results",
        "List all medications including pain relievers",
        "Note what activities worsen your symptoms"
      ],
      dermatology: [
        "Avoid makeup on the day of your appointment",
        "Bring a list of skincare products you use",
        "Note any recent changes in your skin",
        "Wear comfortable clothing for examination"
      ],
      pediatrics: [
        "Bring your child's vaccination records",
        "List any medications or supplements",
        "Bring comfort items for your child",
        "Prepare questions about development milestones"
      ],
      gynecology: [
        "Schedule appointment for after your menstrual period if possible",
        "Avoid douching or using vaginal medications 24 hours before",
        "Bring a list of your medications",
        "Note your last menstrual period date"
      ],
      emergency: [
        "Arrive 15 minutes early for urgent cases",
        "Bring all relevant medical documents",
        "Have emergency contact information ready",
        "Bring insurance information and ID"
      ]
    };
    
    return instructions[deptId] || instructions.emergency;
  };

  const handleAddToCalendar = () => {
    // Parse the appointment date and time
    const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
    const timeMatch = appointment.appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)/);
    
    if (!timeMatch) {
      // Invalid time format, skip calendar creation
      return;
    }
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3];
    
    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create Date objects
    const startTime = new Date(year, month - 1, day, hours, minutes);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
    
  // Generate calendar event
    const event = {
      title: `Appointment with ${appointment.doctorName}`,
      description: `Medical appointment at MediCare Hospital\nDepartment: ${department.name}\nSymptoms: ${appointment.symptoms}`,
      location: 'MediCare Hospital',
      startTime,
      endTime
    };

    // Create calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${event.endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleNewBooking = () => {
    navigate('/');
  };

  return (
    <div className="confirmation-container">
      <Navbar />
      
      <div className="confirmation-content">
        <div className="confirmation-header">
          <div className="confirmation-icon-container">
            <CheckCircle className="confirmation-icon" />
          </div>
          <h1 className="confirmation-title">
            Appointment Confirmed!
          </h1>
          <p className="confirmation-description">
            Your appointment has been successfully booked.
          </p>
        </div>

        <div className="confirmation-grid">
          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="content-group">
              <div className="doctor-info">
                <Avatar className="doctor-avatar">
                  <AvatarFallback className="doctor-avatar-fallback">
                    {appointment.doctorName?.split(' ').map(n => n[0]).join('') || 'DR'}
                  </AvatarFallback>
                </Avatar>
                <div className="doctor-details">
                  <p className="doctor-name">{appointment.doctorName}</p>
                  <p className="doctor-specialization">{appointment.doctorSpecialization}</p>
                  <Badge variant={appointment.doctorLevel === 'senior' ? 'default' : 'secondary'}>
                    {appointment.doctorLevel === 'senior' ? 'Senior' : 'Junior'} Doctor
                  </Badge>
                </div>
              </div>

              <div className="info-group">
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <span className="info-text">
                    {appointment.appointmentDate}
                  </span>
                </div>
                <div className="info-item">
                  <Clock className="info-icon" />
                  <span className="info-text">
                    {appointment.appointmentTime}
                  </span>
                </div>
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <span className="info-text">{department?.name} Department</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="content-group">
              <div className="info-group">
                <div className="info-item">
                  <User className="info-icon" />
                  <span className="info-text">{appointment.patientName || appointment.patient_name}</span>
                </div>
                <div className="info-item">
                  <Phone className="info-icon" />
                  <span className="info-text">{appointment.patientPhone || appointment.patient_phone}</span>
                </div>
                <div className="info-item">
                  <Mail className="info-icon" />
                  <span className="info-text">{appointment.patientEmail || appointment.patient_email}</span>
                </div>
              </div>

              {appointment.mode === 'ai' && (
                <div className="ai-notice">
                  <div className="ai-notice-header">
                    <AlertCircle className="ai-notice-icon" />
                    <span className="ai-notice-title">AI-Recommended Booking</span>
                  </div>
                  <p className="ai-notice-text">
                    This appointment was booked based on AI analysis of your symptoms.
                  </p>
                </div>
              )}

              {/* Symptoms */}
              <div>
                <div className="symptoms-header">
                  <FileText className="info-icon" />
                  <span className="symptoms-title">Symptoms</span>
                </div>
                <p className="symptoms-text">
                  {appointment.symptoms}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preparation Instructions */}
          <Card className="confirmation-grid-full">
            <CardHeader>
              <CardTitle>Preparation Instructions</CardTitle>
              <CardDescription>
                Please follow these instructions before your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prep-section">
                <div>
                  <h4 className="prep-title">Before Your Visit:</h4>
                  <ul className="prep-list">
                    {department && getPrepInstructions(department.id).map((instruction, index) => (
                      <li key={index} className="prep-item">
                        <CheckCircle className="prep-icon" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="prep-title">Important Notes:</h4>
                  <ul className="notes-list">
                    <li className="notes-item">• Arrive 15 minutes early for check-in</li>
                    <li className="notes-item">• Bring a valid photo ID and insurance card</li>
                    <li className="notes-item">• Parking is available in the main hospital lot</li>
                    <li className="notes-item">• Contact us if you need to reschedule</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="confirmation-grid-full">
            <CardContent className="card-content-spacing">
              <div className="action-buttons">
                <Button onClick={handleAddToCalendar} variant="outline" size="lg">
                  <Download className="action-button-icon" />
                  Add to Calendar
                </Button>
                <Button onClick={handleNewBooking} size="lg">
                  Go to home page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;