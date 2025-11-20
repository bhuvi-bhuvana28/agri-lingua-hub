import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, FileText, MessageCircle } from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <Link to="/news">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
            <Newspaper className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('news.title')}</h3>
            <p className="text-muted-foreground mb-4">Stay updated with the latest agricultural news and farming techniques</p>
            <Link to="/news">
              <Button variant="outline">Explore News</Button>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('schemes.title')}</h3>
            <p className="text-muted-foreground mb-4">Access government schemes and subsidies available for farmers</p>
            <Link to="/schemes">
              <Button variant="outline">View Schemes</Button>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
            <MessageCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('chat.title')}</h3>
            <p className="text-muted-foreground mb-4">Get instant answers to your farming queries with AI assistance</p>
            <Button variant="outline">Coming Soon</Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
