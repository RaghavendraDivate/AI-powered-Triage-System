import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useToast } from "@/hooks/use-toast.js";
import Navbar from "@/components/Navbar.jsx";
import { Brain, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate form data
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real application, you would send this data to a server
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Show success toast
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="contact-info-icon" />,
      title: "Our Location",
      details: "123 Healthcare Avenue, Medical District, CA 90210",
    },
    {
      icon: <Phone className="contact-info-icon" />,
      title: "Phone Number",
      details: "+1 (555) 123-4567",
    },
    {
      icon: <Mail className="contact-info-icon" />,
      title: "Email Address",
      details: "contact@medicare-ai.com",
    },
    {
      icon: <Clock className="contact-info-icon" />,
      title: "Working Hours",
      details: "24/7   Support Available",
    },
  ];

  const faqs = [
    {
      question: "How does the AI triage system work?",
      answer:
        "Our AI system analyzes your symptoms and medical history to determine the appropriate level of care and specialist you need to see. It uses advanced algorithms to match you with the right doctor based on urgency and specialty.",
    },
    {
      question: "Is my medical data secure?",
      answer:
        "Yes, we take data security very seriously. All your medical information is encrypted and stored securely in compliance with HIPAA regulations. We never share your data with third parties without your explicit consent.",
    },
    {
      question: "Can I change my appointment after booking?",
      answer:
        "Yes, you can reschedule or cancel your appointment up to 24 hours before the scheduled time without any penalty. Simply log in to your account and manage your appointments.",
    },
    {
      question: "What insurance plans do you accept?",
      answer:
        "We accept most major insurance plans including Medicare, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact us directly to verify if your specific plan is accepted.",
    },
  ];

  return (
    <div className="contact-container">
      <Navbar />

      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">
            Get in <span className="contact-hero-highlight">Touch</span>
          </h1>
          <p className="contact-hero-description">
            Have questions about our services? Our team is here to help you.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-section">
        <div className="contact-section-container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <Card key={index} className="contact-info-card">
                <CardContent className="contact-info-content">
                  <div className="contact-info-icon-container">{info.icon}</div>
                  <h3 className="contact-info-title">{info.title}</h3>
                  <p className="contact-info-details">{info.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-section-container">
          <div className="contact-form-container">
            <div className="contact-form-content">
              <h2 className="contact-form-title">Send Us a Message</h2>
              <p className="contact-form-description">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form-group">
                  <label htmlFor="name" className="contact-form-label">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email" className="contact-form-label">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject" className="contact-form-label">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message" className="contact-form-label">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your inquiry in detail..."
                    required
                    className="contact-form-textarea"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="contact-form-button">
                  <Send className="contact-form-button-icon" />
                  Send Message
                </Button>
              </form>
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.24372372392132!3d34.05204997283688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c648d9808fbd%3A0xb79dfbc6ae338c12!2sCalifornia%20Hospital%20Medical%20Center!5e0!3m2!1sen!2sus!4v1698765432109!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hospital Location"
                className="contact-map-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section">
        <div className="contact-section-container">
          <h2 className="contact-section-title">Frequently Asked Questions</h2>
          <div className="contact-faq-grid">
            {faqs.map((faq, index) => (
              <Card key={index} className="contact-faq-card">
                <CardContent className="contact-faq-content">
                  <h3 className="contact-faq-question">{faq.question}</h3>
                  <p className="contact-faq-answer">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta-section">
        <div className="contact-cta-container">
          <h2 className="contact-cta-title">
            Need Immediate Medical Attention?
          </h2>
          <p className="contact-cta-description">
            Use our AI symptom checker to get routed to the right specialist
          </p>
          <div className="contact-cta-buttons">
            <Button
              onClick={() => navigate("/chat")}
              size="lg"
              className="contact-cta-button"
            >
              <Brain className="contact-cta-button-icon" />
              Start Symptom Check
            </Button>
            <Button
              onClick={() => navigate("/doctors")}
              size="lg"
              variant="outline"
              className="contact-cta-button-outline"
            >
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
          <p className="footer-text">Intelligent appointment scheduling system</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
