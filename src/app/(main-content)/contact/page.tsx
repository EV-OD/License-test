
'use client';

import { useState } from 'react';
import { SITE_NAME, CONTACT_DETAILS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
// import { useLanguage } from '@/contexts/LanguageContext'; // Removed

export default function ContactPage() {
  // const { t } = useLanguage(); // Removed
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form submitted:", formData);
    
    toast({
      title: "सन्देश पठाइयो!",
      description: "हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद। हामी तपाईंलाई चाँडै जवाफ दिनेछौं।",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };


  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          हामीलाई सम्पर्क गर्नुहोस्
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          प्रश्न, प्रतिक्रिया, वा सहयोग चाहिन्छ? हामीलाई सम्पर्क गर्नुहोस्!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">हामीलाई सन्देश पठाउनुहोस्</CardTitle>
            <CardDescription>तलको फारम भर्नुहोस् र हामी तपाईंलाई सकेसम्म चाँडो जवाफ दिनेछौं।</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">पूरा नाम</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="तपाईंको नाम" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">इमेल ठेगाना</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">विषय</Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="हामी कसरी मद्दत गर्न सक्छौं?" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">सन्देश</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="तपाईंको सन्देश यहाँ लेख्नुहोस्..." rows={5} required />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'पठाउँदै...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    सन्देश पठाउनुहोस्
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">हाम्रो सम्पर्क जानकारी</CardTitle>
              <CardDescription>तपाईंले हामीलाई निम्न माध्यमबाट पनि सम्पर्क गर्न सक्नुहुन्छ।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold">इमेल</h3>
                  <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {CONTACT_DETAILS.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold">ठेगाना</h3>
                  <p className="text-muted-foreground">{CONTACT_DETAILS.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">हाम्रो कार्यालयमा आउनुहोस् (नक्सा)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">गुगल नक्साको लागि स्थान</p>
              </div>
               <p className="text-xs text-muted-foreground mt-2">नोट: यो एक प्लेसहोल्डर हो। यहाँ वास्तविक नक्सा इम्बेड गरिनेछ।</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
