import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  FileText,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  LogOut,
  Shield,
  Trash2,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/Navbar.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { hospitalAPI } from "@/services/api.js";
import "./MyAppointments.css";

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();
  
  const adminUsername = sessionStorage.getItem('admin_username') || 'Admin';

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          (apt.patientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (apt.doctorName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (apt.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
      );
    }
    if (filterStatus !== "all") {
      if (filterStatus === "upcoming") {
        filtered = filtered.filter((apt) => apt.status === "scheduled" || apt.status === "upcoming");
      } else {
        filtered = filtered.filter((apt) => apt.status === filterStatus);
      }
    }
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, filterStatus]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await hospitalAPI.getAppointments();
      
      if (response && response.appointments) {
        const transformedAppointments = response.appointments.map(apt => ({
          id: apt.appointment_id,
          patientName: apt.patient_name,
          patientPhone: apt.patient_phone,
          patientEmail: apt.patient_email,
          doctorName: apt.doctor_name,
          doctorSpecialization: apt.department,
          doctorLevel: apt.doctor_level,
          department: apt.department,
          appointmentDate: apt.appointment_date,
          appointmentTime: apt.appointment_time,
          symptoms: apt.symptoms,
          status: apt.status || 'scheduled',
          mode: apt.mode,
          bookingDate: apt.created_at || new Date().toISOString(),
        }));
        
        setAppointments(transformedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error loading appointments from MongoDB:", error);
      toast({
        title: "Error Loading Appointments",
        description: "Could not load appointments. Please try again.",
        variant: "destructive",
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: "badge-default", icon: CheckCircle, text: "Upcoming" },
      upcoming: { color: "badge-default", icon: CheckCircle, text: "Upcoming" },
      completed: {
        color: "badge-secondary",
        icon: CheckCircle,
        text: "Completed",
      },
      cancelled: {
        color: "badge-destructive",
        icon: XCircle,
        text: "Cancelled",
      },
      rescheduled: {
        color: "badge-outline",
        icon: AlertCircle,
        text: "Rescheduled",
      },
    };

    const config = statusConfig[status] || statusConfig.upcoming;
    const IconComponent = config.icon;

    return (
      <span className={`badge ${config.color}`}>
        <IconComponent className="icon-small" />
        {config.text}
      </span>
    );
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      await hospitalAPI.updateAppointmentStatus(appointmentId, "completed");
      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "completed" } : apt,
      );
      setAppointments(updatedAppointments);
      setSelectedAppointment(null);
      toast({
        title: "Appointment Updated",
        description: "Appointment marked as completed.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Update Failed",
        description: "Could not update appointment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setCancellingId(appointmentId);
      await hospitalAPI.updateAppointmentStatus(appointmentId, "cancelled");
      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt,
      );
      setAppointments(updatedAppointments);
      setSelectedAppointment(null);
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Cancellation Failed",
        description: error.message || "Could not cancel appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_username');
    navigate('/admin/login');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="appointments-page">
      <Navbar />
      <div className="appointments-container">
        <div className="appointments-header">
          <div>
            <h1>My Appointments</h1>
            <p>View and manage your hospital appointments</p>
          </div>
          <div className="admin-actions">
            <Badge variant="outline" className="admin-badge">
              <Shield size={14} className="mr-1" />
              {adminUsername}
            </Badge>

            {/* ✅ Show Analytics Button */}
            <Button
              variant="default"
              className="ml-2"
              onClick={() => setShowAnalytics(true)}
            >
              <BarChart3 size={16} className="mr-2" />
              Show Analytics
            </Button>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="search-card">
          <CardContent>
            <div className="search-filter-row">
              <div className="search-input-container">
                <Search className="search-icon" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-buttons">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "upcoming" ? "default" : "outline"}
                  onClick={() => setFilterStatus("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === "cancelled" ? "default" : "outline"}
                  onClick={() => setFilterStatus("cancelled")}
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="appointments-list">
          {isLoading ? (
            <Card className="empty-card">
              <CardContent className="empty-card-content">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p>Loading appointments...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card className="empty-card">
              <CardContent className="empty-card-content">
                <Calendar className="empty-calendar-icon" />
                <h3>No appointments found</h3>
                <p>
                  {appointments.length === 0
                    ? "You haven't booked any appointments yet."
                    : "No appointments match your current filters."}
                </p>
                <Button onClick={() => navigate("/book")}>
                  Book New Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => {
              return (
                <Card key={appointment.id} className="appointment-card">
                  <CardContent>
                    <div className="appointment-header">
                      <div className="doctor-info">
                        <Avatar className="doctor-avatar">
                          <AvatarFallback className="avatar-fallback">
                            {appointment.doctorName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "DR"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3>{appointment.doctorName || "Unknown Doctor"}</h3>
                          <p>{appointment.doctorSpecialization || appointment.department || "General Medicine"}</p>
                          <div className="badge-row">
                            {getStatusBadge(appointment.status)}
                            {appointment.mode === "ai" && (
                              <span className="badge badge-outline">
                                AI Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="appointment-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          <Eye className="icon-small" /> View
                        </Button>
                        {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={cancellingId === appointment.id}
                          >
                            <Trash2 className="icon-small" />
                            {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="appointment-details">
                      <div>
                        <Calendar className="icon-small" />{" "}
                        {formatDate(appointment.appointmentDate)}
                      </div>
                      <div>
                        <Clock className="icon-small" />{" "}
                        {appointment.appointmentTime || "Time not set"}
                      </div>
                      <div>
                        <MapPin className="icon-small" />{" "}
                        {appointment.department || "General"} Department
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Appointment Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAppointment(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="modal-body">
                <div className="modal-doctor-info">
                  <Avatar className="doctor-avatar-lg">
                    <AvatarFallback className="avatar-fallback-lg">
                      {selectedAppointment.doctorName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "DR"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{selectedAppointment.doctorName || "Unknown Doctor"}</h3>
                    <p>{selectedAppointment.doctorSpecialization || selectedAppointment.department || "General Medicine"}</p>
                    <div className="badge-row">
                      <span
                        className={`badge ${selectedAppointment.doctorLevel === "senior" ? "badge-default" : "badge-secondary"}`}
                      >
                        {selectedAppointment.doctorLevel === "senior"
                          ? "Senior"
                          : "Junior"}{" "}
                        Doctor
                      </span>
                      {getStatusBadge(selectedAppointment.status)}
                    </div>
                  </div>
                </div>

                <div className="modal-grid">
                  <div>
                    <div>
                      <Calendar className="icon-medium" />{" "}
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedAppointment.appointmentDate)}
                    </div>
                    <div>
                      <Clock className="icon-medium" /> <strong>Time:</strong>{" "}
                      {selectedAppointment.appointmentTime}
                    </div>
                    <div>
                      <MapPin className="icon-medium" />{" "}
                      <strong>Department:</strong>{" "}
                      {selectedAppointment.department}
                    </div>
                  </div>
                  <div>
                    <div>
                      <User className="icon-medium" /> <strong>Patient:</strong>{" "}
                      {selectedAppointment.patientName || "Unknown"}
                    </div>
                    <div>
                      <Phone className="icon-medium" /> <strong>Phone:</strong>{" "}
                      {selectedAppointment.patientPhone || "Not provided"}
                    </div>
                    <div>
                      <Mail className="icon-medium" /> <strong>Email:</strong>{" "}
                      {selectedAppointment.patientEmail || "Not provided"}
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <FileText className="icon-medium" />{" "}
                    <strong>Symptoms:</strong>
                  </div>
                  <p className="symptoms-box">{selectedAppointment.symptoms}</p>
                </div>

                <div className="booking-info">
                  <p>
                    Booked on: {formatDate(selectedAppointment.bookingDate)}
                  </p>
                  <p>
                    Booking method:{" "}
                    {selectedAppointment.mode === "ai"
                      ? "AI-Recommended"
                      : "Manual Selection"}
                  </p>
                </div>

                <div className="modal-actions">
                  {selectedAppointment.status !== "completed" && selectedAppointment.status !== "cancelled" && (
                    <>
                      <Button
                        className="mark-completed-btn"
                        onClick={() => handleMarkCompleted(selectedAppointment.id)}
                      >
                        <CheckCircle className="icon-small" /> Mark as Completed
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                        disabled={cancellingId === selectedAppointment.id}
                      >
                        <XCircle className="icon-small" />
                        {cancellingId === selectedAppointment.id ? 'Cancelling...' : 'Cancel Appointment'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Analytics Modal */}
        {showAnalytics && (
          <div className="modal-overlay analytics-modal">
            <div className="modal-content analytics-content">
              <div className="modal-header">
                <h2>Appointment Analytics </h2>
                <Button variant="outline" size="sm" onClick={() => setShowAnalytics(false)}>
                  ✕ Close
                </Button>
              </div>
              <div className="modal-body analytics-body">
                <iframe
                  width="100%"
                  height="600"
                  src="https://lookerstudio.google.com/embed/reporting/27763b10-6b9a-4c87-a0a5-3720299cd72d/page/TlJ0C"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
