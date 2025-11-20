import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sprout } from 'lucide-react';

export const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">{t('app.title')}</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/news" className="text-foreground hover:text-primary transition-colors">
            {t('nav.news')}
          </Link>
          <Link to="/schemes" className="text-foreground hover:text-primary transition-colors">
            {t('nav.schemes')}
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
          
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('nav.language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
              <SelectItem value="te">తెలుగు</SelectItem>
              <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
              <SelectItem value="mr">मराठी</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
};
