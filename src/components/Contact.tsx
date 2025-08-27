import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { t } from "@/lib/translations";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            {t('getInTouch')} <span className="text-gold-gradient">{t('contact')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('contactDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover-lift animate-slide-up">
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

            {/* WhatsApp CTA */}
            <Card className="bg-[#25D366]/5 border-[#25D366]/20 hover-lift animate-scale-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t('whatsappContact')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Habla con nosotros directamente por WhatsApp para respuestas más rápidas.
                </p>
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                  onClick={() => window.open(`https://wa.me/34XXXXXXXXX?text=${encodeURIComponent(t('whatsappMessage'))}`, '_blank')}
                >
                  Llamar por WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant animate-scale-in">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-foreground">
                  {t('requestQuote')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('fullName')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('subject')} *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Ej: Reforma de cocina, Construcción nueva..."
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('message')} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe tu proyecto y tus necesidades..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold"
                  >
                    {t('sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;