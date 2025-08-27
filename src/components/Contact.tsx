import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useStaggeredReveal } from "@/hooks/useScrollReveal";
import { t } from "@/lib/translations";
import { useValidation, ValidationSchemas } from "@/lib/validation";
import { useFormSubmit } from "@/hooks/useAsync";
import { ErrorHandler } from "@/lib/errors";
import { ContactFormData } from "@/lib/types";

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const { validate, hasError, getError, clearFieldError } = useValidation(ValidationSchemas.contactForm);

  // Mock submit function - in real app, this would send to backend
  const submitContactForm = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const { submit, loading } = useFormSubmit(submitContactForm, {
    onSuccess: () => {
      toast({
        title: t('messageSent'),
        description: t('messageSuccessDescription'),
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    },
    onError: (error) => {
      ErrorHandler.handle(error, 'Failed to send message. Please try again.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = validate(formData);
    if (!validationResult.isValid) {
      return;
    }

    await submit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (hasError(name)) {
      clearFieldError(name);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('phone'),
      content: "+34 XXX XXX XXX",
      description: "Llámanos"
    },
    {
      icon: Mail,
      title: t('email'),
      content: "contacto@galreforms.com",
      description: t('sendEmail')
    },
    {
      icon: MapPin,
      title: t('location'),
      content: t('madrid'),
      description: "Atendemos toda la región"
    },
    {
      icon: Clock,
      title: t('hours'),
      content: t('businessHours'),
      description: "Sáb: 9h - 14h"
    }
  ];

  const [staggerRef, visibleItems] = useStaggeredReveal(contactInfo.length, 150);

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimatedSection animation="fade-in-up">
          <div className="text-center mb-16">
            <h2 className="text-display mb-6">
              {t('getInTouch')} <span className="text-gradient-gold">{t('contact')}</span>
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              {t('contactDescription')}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <AnimatedSection animation="fade-in-left">
            <div className="lg:col-span-1 space-y-6">
              <div ref={staggerRef}>
                {contactInfo.map((info, index) => (
                  <Card 
                    key={index} 
                    className={`hover-lift transition-all duration-500 bg-card/90 backdrop-blur-sm ${
                      visibleItems[index] 
                        ? 'opacity-100 transform translate-x-0' 
                        : 'opacity-0 transform translate-x-8'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{info.description}</p>
                          <p className="font-medium text-foreground">{info.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <Card className="bg-[#25D366]/5 border-[#25D366]/20 hover-lift animate-bounce-in">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('whatsappContact')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Habla con nosotros directamente por WhatsApp para respuestas más rápidas.
                  </p>
                  <Button 
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white hover-glow transition-all duration-300"
                    onClick={() => window.open(`https://wa.me/34XXXXXXXXX?text=${encodeURIComponent(t('whatsappMessage'))}`, '_blank')}
                  >
                    Llamar por WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection animation="fade-in-right" delay={200}>
            <div className="lg:col-span-2">
              <Card className="shadow-elegant hover-lift transition-all duration-500 bg-card/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-display text-foreground">
                    {t('requestQuote')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <Label htmlFor="name" className="text-foreground font-medium">{t('fullName')} *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`focus:ring-primary focus:border-primary transition-all duration-300 focus:scale-105 ${
                            hasError('name') ? 'border-destructive' : ''
                          }`}
                          placeholder="Tu nombre completo"
                        />
                        {hasError('name') && (
                          <p className="text-sm text-destructive mt-1">{getError('name')}</p>
                        )}
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="email" className="text-foreground font-medium">{t('email')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="focus:ring-primary focus:border-primary transition-all duration-300 focus:scale-105"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <Label htmlFor="phone" className="text-foreground font-medium">{t('phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="focus:ring-primary focus:border-primary transition-all duration-300 focus:scale-105"
                          placeholder="+34 XXX XXX XXX"
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="subject" className="text-foreground font-medium">{t('subject')} *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Ej: Reforma de cocina, Construcción nueva..."
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="focus:ring-primary focus:border-primary transition-all duration-300 focus:scale-105"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="message" className="text-foreground font-medium">{t('message')} *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe tu proyecto y tus necesidades..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold hover-glow transition-all duration-300 transform hover:scale-105"
                    >
                      {loading ? 'Enviando...' : t('sendMessage')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;