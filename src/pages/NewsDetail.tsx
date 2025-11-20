import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      setArticle(data);
    };
    fetchArticle();
  }, [id]);

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {article.image_url && (
          <img src={article.image_url} alt={article.title} className="w-full h-96 object-cover rounded-lg mb-8" />
        )}
        <h1 className="text-4xl font-bold mb-4 text-primary">{article.title}</h1>
        <p className="text-xl text-muted-foreground mb-8">{article.summary}</p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
      </article>
    </div>
  );
};

export default NewsDetail;
