import { useClinicSettings } from '../../hooks/useClinicSettings';
import { Card, CardContent } from './Card';
import { Phone, Mail, MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function ClinicContactCard() {
  const { settings, isLoading, error } = useClinicSettings();

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg border-border-color shadow-md animate-pulse">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4 h-48">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-text-light font-medium">Loading clinic details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !settings) {
    return (
      <Card className="w-full max-w-lg border-red-200 shadow-md">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-3 h-48 bg-red-50 text-error rounded-xl">
          <AlertCircle className="h-8 w-8" />
          <p className="font-medium text-center">Unable to load clinic configuring.</p>
          <p className="text-sm opacity-80 text-center">Please check your database connection.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg border-border-color shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
      <div className="bg-primary/5 border-b border-border-color p-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-text-heading mb-1">
          {settings.clinic_name || "Dr. Rohit Bhadwal's Dental & Implant Centre"}
        </h2>
        {settings.tagline && (
          <p className="text-sm font-medium text-primary uppercase tracking-wide">
            {settings.tagline}
          </p>
        )}
      </div>
      
      <CardContent className="p-6 space-y-5">
        
        {/* Phone */}
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
            <Phone size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text-light uppercase tracking-wider">Phone</span>
            <span className="font-medium text-text-heading">{settings.phone || "Not available"}</span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
            <Mail size={18} />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-text-light uppercase tracking-wider">Email</span>
            <span className="font-medium text-text-heading truncate">{settings.email || "Not available"}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-start gap-4 group pt-1">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
            <MapPin size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text-light uppercase tracking-wider">Address</span>
            <span className="font-medium text-text-heading leading-tight pt-1">
              {settings.address || "123 Dental Clinic St, City, Country"}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
