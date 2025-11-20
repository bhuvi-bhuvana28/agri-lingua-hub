import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';

const Schemes = () => {
  const { t, i18n } = useTranslation();
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('schemes')
        .select('*')
        .eq('language', i18n.language)
        .order('created_at', { ascending: false });
      setSchemes(data || []);
    };
    fetchSchemes();
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-primary">{t('schemes.title')}</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-primary">{scheme.title}</h3>
              <p className="text-muted-foreground mb-4">{scheme.description}</p>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">{t('schemes.benefits')}:</h4>
                <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">{t('schemes.eligibility')}:</h4>
                <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
              </div>
              {scheme.application_link && (
                <a href={scheme.application_link} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
                    {t('schemes.apply')} <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schemes;
