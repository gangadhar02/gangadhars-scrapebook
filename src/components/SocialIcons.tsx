
import { Twitter, Linkedin, Instagram, MessageCircle } from "lucide-react";

export const SocialIcons = () => {
  const socialLinks = [
    {
      name: "Twitter",
      url: "https://x.com/gangadhar__s",
      icon: Twitter,
      color: "hover:text-blue-400"
    },
    {
      name: "LinkedIn", 
      url: "https://www.linkedin.com/in/gangadhar02/",
      icon: Linkedin,
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/gangadhar__s/",
      icon: Instagram,
      color: "hover:text-pink-500"
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/916302966383",
      icon: MessageCircle,
      color: "hover:text-green-500"
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-scrapbook-yellow/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border-2 border-amber-200">
        <div className="flex items-center space-x-6">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-amber-800 ${social.color} transition-all duration-200 transform hover:scale-110`}
                aria-label={social.name}
              >
                <IconComponent size={24} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
