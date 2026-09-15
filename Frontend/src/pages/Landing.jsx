import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import Navbar from "@/components/Navbar.jsx";
import { Brain, Calendar, MessageCircle, Bot, Star } from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: "🩺",
      title: "Expert Medical Care",
      description: "Access to highly qualified doctors across 8 specialized departments"
    },
    {
      icon: "⏰",
      title: "24/7 Availability",
      description: "Emergency cases get immediate priority with senior specialists"
    },
    {
      icon: "📅",
      title: "Smart Booking",
      description: "AI-powered doctor matching based on symptom severity"
    },
    {
      icon: "⚕️",
      title: "Multi-Specialty",
      description: "Comprehensive care from General Medicine to specialized departments"
    }
  ];

  const departments = [
    { name: "General Medicine", icon: "🩺", specialists: "Primary healthcare" },
    { name: "Cardiology", icon: "❤️", specialists: "Heart specialists" },
    { name: "Neurology", icon: "🧠", specialists: "Brain & nervous system" },
    { name: "Pulmonology", icon: "🌬️", specialists: "Lung & respiratory" },
    { name: "Gastroenterology", icon: "🧫", specialists: "Digestive system" },
    { name: "Dermatology", icon: "🧴", specialists: "Skin conditions" },
    { name: "Infectious Diseases", icon: "🦠", specialists: "Viral/bacterial infections" },
    { name: "Orthopedics", icon: "🦴", specialists: "Bones & joints" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "The AI symptom checker accurately routed me to a cardiologist when I was experiencing chest pains. Saved me valuable time!",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Senior Neurologist",
      content: "This system ensures I only see patients who truly need my specialized care. Much more efficient than traditional triage.",
      rating: 4
    },
    {
      name: "Raj Patel",
      role: "Patient",
      content: "Got matched with a junior dermatologist for my mild rash - perfect level of care without unnecessary specialist wait times.",
      rating: 5
    }
  ];

  return (
    <div className="landing-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Precision Care <span className="hero-highlight">Powered by AI</span>
          </h1>
          <p className="hero-description">
            Our intelligent system matches your symptoms with the right specialist based on medical urgency
          </p>
          
          <div className="hero-buttons">
            <Button 
              size="lg" 
              variant="secondary"
              className="hero-button"
              onClick={() => navigate('/chat')}
            >
              <Brain className="h-6 w-6" />
              <span>Describe Your Symptoms</span>
              <span className="hero-button-text">AI-powered triage</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="hero-button hero-button-outline"
              onClick={() => navigate('/book?mode=manual')}
            >
              <Calendar className="h-6 w-6" />
              <span>Book Directly</span>
              <span className="hero-button-text">Choose department</span>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              How Our AI Triage Works
            </h2>
            <p className="section-description">
              Confidence-based routing ensures you see the right doctor
            </p>
          </div>
          
          <div className="grid-cols-1 grid-cols-3">
            <div className="feature-item">
              <div className="feature-icon-container">
                <MessageCircle className="feature-icon" />
              </div>
              <h3 className="feature-title">1. Symptom Analysis</h3>
              <p className="feature-description">
                Describe your symptoms through our conversational interface
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <Bot className="feature-icon" />
              </div>
              <h3 className="feature-title">2. Smart Routing</h3>
              <p className="feature-description">
               AI-powered system intelligently routes patients to the right department and recommends the optimal specialist level based on medical severity.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <Calendar className="feature-icon" />
              </div>
              <h3 className="feature-title">3. Priority Booking</h3>
              <p className="feature-description">
                Urgent cases get senior specialists, mild cases see Junior Specialists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-alt">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Our Healthcare Advantages
            </h2>
            <p className="section-description">
              Combining medical expertise with intelligent technology
            </p>
          </div>
          
          <div className="grid-cols-1 grid-cols-2 grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card">
                <CardContent className="feature-card-content">
                  <div className="feature-card-icon">{feature.icon}</div>
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <p className="feature-card-description">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="section section-alt">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Our Medical Departments
            </h2>
            <p className="section-description">
              Specialized care with confidence-based doctor assignment
            </p>
          </div>
          
          <div className="grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4">
            {departments.map((dept, index) => (
              <Card key={index} className="department-card">
                <CardContent className="department-card-content">
                  <div className="department-card-icon">
                    {dept.icon}
                  </div>
                  <h3 className="department-card-title">{dept.name}</h3>
                  <p className="department-card-description">{dept.specialists}</p>
                  <Badge variant="secondary" className="department-card-badge">
                    { "4 Specialists"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="section-action">
            <Button className='section-action-button' asChild size="lg">
              <Link to="/doctors">View All Departments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              What Our Patients Say
            </h2>
            <p className="section-description">
              Trusted by thousands for accurate medical routing
            </p>
          </div>
          
          <div className="grid-cols-1 grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card">
                <CardContent className="testimonial-card-content">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="testimonial-star filled" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="testimonial-star" />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* CTA Section */}
        <section className="cta-section">
          {/* Simple Animated Background */}
          <div className="cta-animated-bg"></div>
          
          {/* Subtle Floating Particles */}
          <div className="cta-particle"></div>
          <div className="cta-particle"></div>
          <div className="cta-particle"></div>
          <div className="cta-particle"></div>
          
          <div className="cta-container">
            <h2 className="cta-title">
              Need Medical Attention?
            </h2>
            <p className="cta-description">
              Let our AI guide you to the right specialist based on your symptoms
            </p>
            <div className="cta-buttons">
              <Button onClick={() => navigate('/chat')} size="lg" className="cta-button">
                <Brain className="cta-button-icon" />
                Start Symptom Check
              </Button>
              <Button onClick={() => navigate('/doctors')} size="lg" variant="outline" className="cta-button-outline">
                Browse Departments
              </Button>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="footer-logo-icon">⚕️</div>
            <span className="footer-logo-text">MediCare AI</span>
          </div>
          <p className="footer-text">
            Intelligent appointment scheduling system
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;