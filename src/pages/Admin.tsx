import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, FileText, Settings, Users } from 'lucide-react';

const Admin = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'farming',
    state: '',
    language: 'en',
    image_url: ''
  });
  const [schemeForm, setSchemeForm] = useState({
    title: '',
    description: '',
    benefits: '',
    eligibility: '',
    category: 'farming',
    state: '',
    language: 'en',
    application_link: ''
  });
  const [analytics, setAnalytics] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
    fetchAnalytics();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Access Denied",
          description: "Please login to access admin panel",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const hasAdminAccess = roles?.some(r => r.role === 'admin' || r.role === 'moderator');
      
      if (!hasAdminAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Admin check error:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from('chat_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setAnalytics(data || []);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('news').insert([newsForm]);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "News article created successfully",
      });
      
      setNewsForm({
        title: '',
        summary: '',
        content: '',
        category: 'farming',
        state: '',
        language: 'en',
        image_url: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    }
  };

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('schemes').insert([schemeForm]);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Scheme created successfully",
      });
      
      setSchemeForm({
        title: '',
        description: '',
        benefits: '',
        eligibility: '',
        category: 'farming',
        state: '',
        language: 'en',
        application_link: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scheme",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-primary">{t('admin.title')}</h1>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('admin.addNews')}
            </TabsTrigger>
            <TabsTrigger value="schemes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('admin.addScheme')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.newsForm.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsSubmit} className="space-y-4">
                  <div>
                    <Label>{t('admin.newsForm.titleField')}</Label>
                    <Input
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('admin.newsForm.summary')}</Label>
                    <Textarea
                      value={newsForm.summary}
                      onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('admin.newsForm.content')}</Label>
                    <Textarea
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('admin.newsForm.category')}</Label>
                      <Select
                        value={newsForm.category}
                        onValueChange={(value) => setNewsForm({ ...newsForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farming">Farming</SelectItem>
                          <SelectItem value="weather">Weather</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t('admin.newsForm.language')}</Label>
                      <Select
                        value={newsForm.language}
                        onValueChange={(value) => setNewsForm({ ...newsForm, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="kn">Kannada</SelectItem>
                          <SelectItem value="gu">Gujarati</SelectItem>
                          <SelectItem value="ml">Malayalam</SelectItem>
                          <SelectItem value="pa">Punjabi</SelectItem>
                          <SelectItem value="od">Odia</SelectItem>
                          <SelectItem value="as">Assamese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{t('admin.newsForm.imageUrl')}</Label>
                    <Input
                      type="url"
                      value={newsForm.image_url}
                      onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">{t('admin.newsForm.submit')}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.schemeForm.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSchemeSubmit} className="space-y-4">
                  <div>
                    <Label>{t('admin.schemeForm.titleField')}</Label>
                    <Input
                      value={schemeForm.title}
                      onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('admin.schemeForm.description')}</Label>
                    <Textarea
                      value={schemeForm.description}
                      onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('admin.schemeForm.benefits')}</Label>
                    <Textarea
                      value={schemeForm.benefits}
                      onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('admin.schemeForm.eligibility')}</Label>
                    <Textarea
                      value={schemeForm.eligibility}
                      onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('admin.schemeForm.category')}</Label>
                      <Select
                        value={schemeForm.category}
                        onValueChange={(value) => setSchemeForm({ ...schemeForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farming">Farming</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t('admin.schemeForm.language')}</Label>
                      <Select
                        value={schemeForm.language}
                        onValueChange={(value) => setSchemeForm({ ...schemeForm, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="kn">Kannada</SelectItem>
                          <SelectItem value="gu">Gujarati</SelectItem>
                          <SelectItem value="ml">Malayalam</SelectItem>
                          <SelectItem value="pa">Punjabi</SelectItem>
                          <SelectItem value="od">Odia</SelectItem>
                          <SelectItem value="as">Assamese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{t('admin.schemeForm.applicationLink')}</Label>
                    <Input
                      type="url"
                      value={schemeForm.application_link}
                      onChange={(e) => setSchemeForm({ ...schemeForm, application_link: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">{t('admin.schemeForm.submit')}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {analytics.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(item.created_at).toLocaleString()} | {item.language}
                      </div>
                      <div className="mb-2">
                        <strong>User:</strong> {item.user_query}
                      </div>
                      <div>
                        <strong>AI:</strong> {item.ai_response}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
