import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">{t('about.title')}</h1>
        
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">{t('about.mission')}</h2>
          <p className="text-muted-foreground">{t('about.missionText')}</p>
        </Card>

        <h2 className="text-2xl font-semibold mb-6">{t('about.features')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t('about.feature1')}</h3>
            <p className="text-muted-foreground">{t('about.feature1Text')}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t('about.feature2')}</h3>
            <p className="text-muted-foreground">{t('about.feature2Text')}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t('about.feature3')}</h3>
            <p className="text-muted-foreground">{t('about.feature3Text')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
