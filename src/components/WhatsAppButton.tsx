import { MessageCircle } from "lucide-react";
import { t } from "@/lib/translations";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = () => {
  const { data: settings } = useSiteSettings();
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(t('whatsappMessage'));
    
    // Usar o número configurado no painel admin
    const phoneNumber = settings?.whatsapp_number || "34XXXXXXXXX";
    
    // Remover caracteres especiais e espaços do número
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
    
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-float group"
      aria-label={t('whatsappTooltip')}
    >
      <MessageCircle className="w-7 w-7 text-white group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {t('whatsappTooltip')}
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
      </div>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20"></div>
    </button>
  );
};

export default WhatsAppButton;