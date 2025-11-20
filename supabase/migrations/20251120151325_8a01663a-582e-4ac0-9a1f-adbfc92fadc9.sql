-- Create news articles table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  state TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schemes table
CREATE TABLE IF NOT EXISTS public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  state TEXT,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  application_link TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- News policies (public read, admin write)
CREATE POLICY "News are viewable by everyone" 
  ON public.news FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert news" 
  ON public.news FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update news" 
  ON public.news FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete news" 
  ON public.news FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Schemes policies (public read, admin write)
CREATE POLICY "Schemes are viewable by everyone" 
  ON public.schemes FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert schemes" 
  ON public.schemes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update schemes" 
  ON public.schemes FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete schemes" 
  ON public.schemes FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Chat messages policies
CREATE POLICY "Anyone can insert chat messages" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own chat messages" 
  ON public.chat_messages FOR SELECT 
  USING (true);

-- Profiles policies
CREATE POLICY "Profiles are viewable by owner" 
  ON public.profiles FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (user_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at
  BEFORE UPDATE ON public.schemes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for news
INSERT INTO public.news (title, summary, content, category, state, language, image_url) VALUES
('New Subsidy for Organic Farming', 'Government announces major support for organic farmers', 'The government has announced a new subsidy program to encourage organic farming practices. Farmers can receive up to ₹50,000 per hectare for converting to organic methods. This initiative aims to promote sustainable agriculture and improve soil health across the country.', 'farming', 'Maharashtra', 'en', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'),
('जैविक खेती के लिए नई सब्सिडी', 'सरकार ने जैविक किसानों के लिए बड़े समर्थन की घोषणा की', 'सरकार ने जैविक खेती प्रथाओं को प्रोत्साहित करने के लिए एक नई सब्सिडी कार्यक्रम की घोषणा की है। किसान जैविक तरीकों में परिवर्तित करने के लिए प्रति हेक्टेयर ₹50,000 तक प्राप्त कर सकते हैं।', 'farming', 'Maharashtra', 'hi', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'),
('Monsoon Forecast 2024', 'IMD predicts normal rainfall this season', 'The India Meteorological Department (IMD) has forecasted normal monsoon rainfall for the 2024 season. This is good news for farmers planning their kharif crops. The department expects rainfall to be around 96-104% of the long period average.', 'weather', 'All India', 'en', 'https://images.unsplash.com/photo-1502083896352-259ab9e342d7?w=800');

-- Insert seed data for schemes
INSERT INTO public.schemes (title, description, benefits, eligibility, state, category, language, application_link) VALUES
('PM-KISAN Scheme', 'Direct income support to farmers', 'Financial assistance of ₹6,000 per year in three equal installments directly transferred to bank accounts', 'All landholding farmers families across the country', 'All India', 'financial', 'en', 'https://pmkisan.gov.in/'),
('पीएम-किसान योजना', 'किसानों को प्रत्यक्ष आय सहायता', 'बैंक खातों में सीधे स्थानांतरित तीन समान किस्तों में प्रति वर्ष ₹6,000 की वित्तीय सहायता', 'देश भर में सभी भूमिधारी किसान परिवार', 'All India', 'financial', 'hi', 'https://pmkisan.gov.in/'),
('Soil Health Card Scheme', 'Promote soil test based nutrient management', 'Free soil testing and recommendations for appropriate dosage of nutrients', 'All farmers in India', 'All India', 'agriculture', 'en', 'https://soilhealth.dac.gov.in/');