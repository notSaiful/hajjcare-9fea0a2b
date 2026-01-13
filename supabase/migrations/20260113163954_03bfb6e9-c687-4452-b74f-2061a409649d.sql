-- Add embarkation_point column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN embarkation_point text;