
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { departments } from "@/data/hospitalData.js";
import Navbar from "@/components/Navbar.jsx";
import { Link } from "react-router-dom";
import "./Doctors.css";

const Doctors = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0].id);

  const DoctorCard = ({ doctor }) => (
    <Card className="doctors-card">
      <div className="doctors-card-gradient"></div>
      <CardHeader className="doctors-card-header">
        <div className="doctors-card-badge">
          <Badge className={doctor.level === 'senior' ? 'doctors-senior-badge' : 'doctors-junior-badge'}>
            {doctor.level === 'senior' ? 'Senior Specialist' : 'Junior Specialist'}
          </Badge>
        </div>
        <div className="doctors-card-title">
          <CardTitle className="doctors-name">{doctor.name}</CardTitle>
          <CardDescription className="doctors-qualification">
            {doctor.qualification}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="doctors-card-content">
        <div className="doctors-info-grid">
          <div className="doctors-info-item">
            <div className="doctors-info-icon">🩺</div>
            <div>
              <p className="doctors-info-label">Experience</p>
              <p className="doctors-info-value">{doctor.experience} years</p>
            </div>
          </div>
          <div className="doctors-info-item">
            <div className="doctors-info-icon">⏱️</div>
            <div>
              <p className="doctors-info-label">Availability</p>
              <p className="doctors-info-value">{doctor.availability.hours}</p>
            </div>
          </div>
        </div>
        
        <div className="doctors-slots-section">
          <p className="doctors-section-title">Available Slots</p>
          <div className="doctors-time-slots-grid">
            {doctor.availability.slots.slice(0, 4).map((slot, index) => (
              <div key={index} className="doctors-time-slot">
                {slot}
              </div>
            ))}
            {doctor.availability.slots.length > 4 && (
              <div className="doctors-time-slot-more">
                +{doctor.availability.slots.length - 4}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="doctors-page">
      <Navbar />
      {/* <div className="doctors-header-image-container">
        <img src="/doctors-header.svg" alt="Medical Specialists" className="doctors-header-image" />
      </div> */}
      <div className="doctors-page-container">
        <Tabs 
          value={selectedDepartment} 
          onValueChange={setSelectedDepartment} 
          className="doctors-tabs-container"
        >
          <TabsList className="doctors-tabs">
            {departments.map((dept) => (
              <TabsTrigger 
                key={dept.id} 
                value={dept.id}
                className="doctors-tab"
              >
                <span className="doctors-tab-icon">{dept.icon}</span>
                <span className="doctors-tab-name">{dept.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {departments.map((dept) => (
            <TabsContent key={dept.id} value={dept.id} className="doctors-department-content">
              <div className="doctors-department-header">
                <div className="doctors-department-icon-container">
                  <span className="doctors-department-icon">{dept.icon}</span>
                </div>
                <div>
                  <h2 className="doctors-department-title">{dept.name} Department</h2>
                  <p className="doctors-department-description">{dept.description}</p>
                </div>
              </div>

              <div className="doctors-section">
                <div className="doctors-category">
                  <div className="doctors-category-header">
                    <Badge className="doctors-senior-badge">Senior Specialists</Badge>
                    <p className="doctors-category-subtitle">24/7 availability for urgent care</p>
                  </div>
                  <div className="doctors-grid">
                    {dept.doctors
                      .filter(doctor => doctor.level === 'senior')
                      .map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                      ))}
                  </div>
                </div>

                <div className="doctors-category">
                  <div className="doctors-category-header">
                    <Badge className="doctors-junior-badge">Junior Specialists</Badge>
                    <p className="doctors-category-subtitle">Daytime consultations (10AM-5PM)</p>
                  </div>
                  <div className="doctors-grid">
                    {dept.doctors
                      .filter(doctor => doctor.level === 'junior')
                      .map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="doctors-cta-section">
          <Card className="doctors-cta-card">
            <div className="doctors-cta-pattern"></div>
            <CardHeader className="doctors-cta-header">
              <CardTitle className="doctors-cta-title">Unsure which specialist you need?</CardTitle>
              <CardDescription className="doctors-cta-description">
                Our AI symptom checker can recommend the perfect doctor for your condition
              </CardDescription>
            </CardHeader>
            <CardContent className="doctors-cta-actions">
              <Button asChild className="doctors-cta-button">
                <Link to="/chat">Get AI Recommendation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Doctors;