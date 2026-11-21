-- Additive only. Creates classroom_videos and seeds days 1-30 from the preview catalogue.
-- Does not alter any existing table or policy.
-- Public clients may SELECT. Writes are service-role only, after /api/classroom-videos checks the admin login.

CREATE TABLE public.classroom_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day integer NOT NULL CHECK (day >= 1 AND day <= 100),
  section text NOT NULL CHECK (section IN ('quran', 'hadith', 'dua', 'lesson', 'doctor', 'expert', 'naat', 'quiz')),
  position integer NOT NULL CHECK (position >= 1 AND position <= 3),
  url text NOT NULL,
  platform text NOT NULL DEFAULT 'Link',
  title text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT 'neutral' CHECK (tag IN ('shia', 'sunni', 'neutral')),
  review_pending boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (day, section, position)
);

ALTER TABLE public.classroom_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read classroom videos"
  ON public.classroom_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.classroom_videos TO anon, authenticated;
GRANT ALL ON public.classroom_videos TO service_role;

INSERT INTO public.classroom_videos (day, section, position, url, platform, title, tag, review_pending)
VALUES
  (1, 'quran', 1, 'https://www.youtube.com/watch?v=sRYo5YSpPqE', 'YouTube', 'Surah - 98 - Al-Bayyinah - Accurate Tajweed recitation of Quran - Mahmoud Khaleel Al-Hussary', 'neutral', false),
  (1, 'hadith', 1, 'https://www.youtube.com/watch?v=Pz8z6d6PFEE', 'YouTube', 'Sahih al-Bukhari - Volume 1, Book 1, Hadith 1 | Revelation', 'neutral', false),
  (1, 'lesson', 1, 'https://www.youtube.com/watch?v=35s1bifIeqs', 'YouTube', 'Intention of Hajj - حج کی نیت | Maulana Ilyas Qadri | Hajj Special', 'sunni', false),
  (1, 'lesson', 2, 'https://www.youtube.com/watch?v=n1mcNozJjBs', 'YouTube', 'Introduction to Hajj Series | Hajj w/ Sayed Ahmed Qazwini', 'shia', false),
  (1, 'doctor', 1, 'https://www.youtube.com/watch?v=yCu43qBV0RY', 'YouTube', 'DOCTOR''S ADVICE TO ALL HAJIS | HAJJ 2026 | @drfaisalsays', 'neutral', false),
  (1, 'expert', 1, 'https://www.youtube.com/watch?v=x_Wszcyb2UQ', 'YouTube', 'Namaz, Roze, Hajj Ki Niyat Ka Tariqa By Adv. Faiz Syed', 'neutral', false),
  (1, 'naat', 1, 'https://www.youtube.com/watch?v=J76Dtc0MePA', 'YouTube', 'New Hajj Naat 2025 | Hajj Kalam 2025 | Ary Hajion Tm Haram Jarhe Ho | Zaki Ahmad | Emotional Naat', 'neutral', false),
  (2, 'quran', 1, 'https://www.youtube.com/watch?v=xX18qS2lVqA', 'YouTube', 'Short Tilawat e Quran | Surah Al Baqarah | Ayat 197 - 199 | Mohaddis Media', 'neutral', false),
  (2, 'hadith', 1, 'https://www.youtube.com/watch?v=-wbcEd2VEWU', 'YouTube', 'Sahih Bukhari Hadees No 1838', 'neutral', false),
  (2, 'lesson', 1, 'https://www.youtube.com/watch?v=oQd1bnEi32U', 'YouTube', 'Hajj 2026 : एहराम क्या है? हज में इसका महत्व और नियम आसान भाषा में समझें', 'neutral', false),
  (2, 'doctor', 1, 'https://www.youtube.com/watch?v=sVXL2MnB-nQ', 'YouTube', 'Prickly Heat - British Hajj Delegation', 'neutral', false),
  (2, 'doctor', 2, 'https://www.youtube.com/watch?v=Eb--MldbiZk', 'YouTube', 'Lanacane gel short — Mufti Abdur-Rahman ibn Yusuf Mangera', 'neutral', false),
  (2, 'expert', 1, 'https://www.youtube.com/watch?v=iJO0foorhmU', 'YouTube', 'Hikmat e Hajj - 21st June 2023 - Hajj 2023 - ARY Qtv', 'neutral', false),
  (2, 'naat', 1, 'https://www.youtube.com/watch?v=e3dQC9VQId4', 'YouTube', 'Naat Sahil Raza Qadri | New Hajj Naat 2026 | Naat Sharif', 'neutral', false),
  (3, 'quran', 1, 'https://www.youtube.com/watch?v=B3znd7yKKTc', 'YouTube', 'Surah-2 Al baqarah Ayat No 189-196 Ruku No 24 Word by word learning Quran in video in 4K', 'neutral', false),
  (3, 'hadith', 1, 'https://www.youtube.com/watch?v=13ScRL5nHss', 'YouTube', 'Sahih Bukhari Hadees No.1521-1525 | Hadees in Urdu/Hindi | Bukhari Shareef', 'neutral', false),
  (3, 'lesson', 1, 'https://www.youtube.com/watch?v=GDOImlXnQiM', 'YouTube', 'Meeqat kya Hai aur Iske Ahkam kya hain? | Mufti Akmal | ARY Qtv', 'neutral', false),
  (3, 'doctor', 1, 'https://www.youtube.com/watch?v=xfkKfZjlgvk', 'YouTube', '2 घंटे से ज्यादा बैठना पड़ सकता है खतरनाक! | DVT Prevention During Travel | Dr Ashank Bansal', 'neutral', false),
  (3, 'expert', 1, 'https://www.youtube.com/watch?v=YVfBS0FiCmk', 'YouTube', 'Miqats explained', 'neutral', false),
  (3, 'naat', 1, 'https://www.youtube.com/watch?v=oYEeOKQ5pRQ', 'YouTube', 'Hajj Ki Arzoo Dil Mein Phir Se Gud Gudai Hai | Hajj Special Kalam 2026 | Maulana Ubaid Raza Attari', 'neutral', false),
  (4, 'quran', 1, 'https://www.youtube.com/watch?v=29Vc1mAzz98', 'YouTube', 'Surah Al-Imran 96-97 | Ayah on Hajj | Reciter Abdullah Al Mousa', 'neutral', false),
  (4, 'hadith', 1, 'https://www.youtube.com/watch?v=Rvt7QlCqbCM', 'YouTube', 'Sahih Al Bukhari Hadees Number 08', 'neutral', false),
  (4, 'lesson', 1, 'https://www.youtube.com/watch?v=f7lmuh5EFPQ', 'YouTube', 'Haj kin Logo par Farz hota hai ? | हज किन लोगों पर फर्ज़ होता है ? | Mufti A M Qasmi', 'neutral', false),
  (4, 'doctor', 1, 'https://www.youtube.com/watch?v=rVAVvNgZpXo', 'YouTube', 'Complete Heart Patient Travel Guide for Hajj & Umrah | Precautions, Checkup & Safety Tips', 'neutral', false),
  (4, 'expert', 1, 'https://www.youtube.com/watch?v=56AcJypuayY', 'YouTube', 'हज किस पर फ़र्ज़ है? | Maulana Ilyas Qadri Shahab | Deen Ki Baatein', 'neutral', false),
  (4, 'naat', 1, 'https://www.youtube.com/watch?v=K6XGIbSyihY', 'YouTube', 'Hajj Pe Jana Mubarak | Hajj Naat Sharif | Emotional Hajj Kalam | Raja Azhar Official', 'neutral', false),
  (5, 'quran', 1, 'https://www.youtube.com/watch?v=x-0Zm232sWc', 'YouTube', 'Abdul Rahman Al Ossi - Surah Al-Hajj (22) Verses 27-28', 'neutral', false),
  (5, 'hadith', 1, 'https://www.youtube.com/watch?v=13ScRL5nHss', 'YouTube', 'Sahih Bukhari Hadees No.1521-1525 | Hadees in Urdu/Hindi | Bukhari Shareef', 'neutral', false),
  (6, 'quran', 1, 'https://www.youtube.com/watch?v=rdStEdqDzZM', 'YouTube', 'Surah At-Tawbah | Verse 36 | @alafasy', 'neutral', false),
  (6, 'lesson', 1, 'https://www.youtube.com/watch?v=j_scRjYGw5A', 'YouTube', 'What to do in first ten days of Dhul Hijjah?', 'neutral', false),
  (6, 'doctor', 1, 'https://www.youtube.com/watch?v=5ybxy5ht7Rw', 'YouTube', 'Makkah Ki Garmi Skin Ko Kaise Jalati Hai? Hujjaj Yeh Video Zaroor Dekhein! | Dr. Tayyab Qazi', 'neutral', false),
  (6, 'expert', 1, 'https://www.youtube.com/watch?v=IHM57-2FnKw', 'YouTube', 'The Important Acts & Deeds to be Done during the First 10 Days of Dhul Hijjah – Dr Zakir Naik', 'neutral', false),
  (7, 'quran', 1, 'https://www.youtube.com/watch?v=RhvpagEVk6U', 'YouTube', 'Tilawat Surah An-Nahl 16 to 50 | 14. Rubama By Muhammad Waseem Siddiqui', 'neutral', false),
  (7, 'hadith', 1, 'https://www.youtube.com/watch?v=3bkQJmk6omE', 'YouTube', 'Jami at-Tirmidhi, Hadith: 889, The Book on Hajj', 'neutral', false),
  (7, 'lesson', 1, 'https://www.youtube.com/watch?v=elamvWTA1iI', 'YouTube', 'अगर आप Hajj करने जा रहे हैं तो जान लें सभी अरकान और सही तरीका। How to perform Hajj?', 'neutral', false),
  (7, 'doctor', 1, 'https://www.youtube.com/watch?v=draMW7EzROA', 'YouTube', 'Essential Medicines You MUST Carry for Hajj 2025! | Stay Safe and Healthy | Dr. Tayyab Qazi', 'neutral', false),
  (8, 'lesson', 1, 'https://www.youtube.com/watch?v=o8XoQoVgzhQ', 'YouTube', 'HAJJ ki Qismen | three Types of HAJJ | Mufti Saeed Majadari', 'sunni', false),
  (9, 'lesson', 1, 'https://www.youtube.com/watch?v=Dx8geAT6Rng', 'YouTube', 'Part 13 of 14 | Story of Prophet Ibrahim | Building the Ka''bah', 'sunni', false),
  (9, 'lesson', 2, 'https://www.youtube.com/watch?v=tY55IE31JfU', 'YouTube', 'When Prophet Ibrahim Built the Kabaa - Sayed Saleh Qazwini', 'shia', false),
  (10, 'lesson', 1, 'https://www.youtube.com/watch?v=klC1XGkMs5Y', 'YouTube', 'Hajj Mabroor Ki Nishaniyan | Hajj Mabroor Karny Ka Tareeka Aur Fazilat | Mufti Qasim Attari', 'sunni', false),
  (11, 'lesson', 1, 'https://www.youtube.com/watch?v=YmSil4TmtmI', 'YouTube', 'Zindagi Sanwarain Episode 29 | Tauba Ke Fazail | Haji Fuzail Raza Attari', 'sunni', false),
  (11, 'expert', 1, 'https://www.youtube.com/watch?v=-HDRpdpoKzg', 'YouTube', 'Repentance - Sayyid Ahmad Qazwini', 'shia', false),
  (12, 'hadith', 1, 'https://www.youtube.com/watch?v=KTsNpEvlrbE', 'YouTube', 'Sabeel Media | Risalat al-Huquq | Treatise of Rights | Imam Zain ul Abideen', 'shia', false),
  (12, 'expert', 1, 'https://www.youtube.com/watch?v=pChA0GuTNPk', 'YouTube', 'Logo Ke Huqooq | Haqooq Ul Ibaad | Shaykh Mufti Tauqeer', 'sunni', false),
  (13, 'expert', 1, 'https://www.youtube.com/watch?v=3Kuq92HAgYE', 'YouTube', 'Qarz Ke Paiso Se Hajj Aur Umrah Karna Jaiz Hai Ya Nahi? | Islamic Bayan | Raham TV', 'sunni', false),
  (13, 'expert', 2, 'https://www.youtube.com/watch?v=c8AFNEn256w', 'YouTube', 'Can I Go to Hajj with an Outstanding Mortgage? | Hajj w/ Sayed Ahmed Qazwini', 'shia', false),
  (14, 'lesson', 1, 'https://www.youtube.com/watch?v=Fr6YD1RW5-s', 'YouTube', 'Write Your Will (Wasiya) Before Going to Hajj | Hajj w/ Sayed Ahmed Qazwini', 'shia', false),
  (14, 'expert', 1, 'https://www.youtube.com/watch?v=cP5OV8pItPo', 'YouTube', 'Khutba Hajjatul Wida - Waris kay liye Wasiyat Karna Kesa - Mufti Qasim Attari', 'sunni', false),
  (15, 'expert', 1, 'https://www.dailymotion.com/video/x9jkcu2', 'Dailymotion', 'Deen aur Khawateen - Topic : Ahkam e Hajj - 15 May 2025 - ARY Qtv', 'sunni', false),
  (16, 'expert', 1, 'https://www.youtube.com/watch?v=iq3aaGYMgCw', 'YouTube', 'Maa Bap Ki Ahmiyat | Maa Baap Achy ya Bure | Walidain - Parents | Maulana Imran Attari About Family', 'sunni', false),
  (16, 'expert', 2, 'https://al-islam.org/media/four-rights-father-parents-islam', 'Al-Islam.org', 'Four Rights Of The Father - Parents In Islam', 'shia', false),
  (17, 'expert', 1, 'https://www.youtube.com/watch?v=4aGY0ezo1K8', 'YouTube', 'Haraam Kamai se Hajj Aur Umrah Karna - Molana Ishaq Madni', 'sunni', false),
  (17, 'expert', 2, 'https://www.youtube.com/watch?v=VynBLauYuEs', 'YouTube', 'Khums: An Important Obligation Before Going to Hajj | Hajj w/ Sayed Ahmed Qazwini', 'shia', false),
  (18, 'lesson', 1, 'https://www.youtube.com/watch?v=VViRV15Lgww', 'YouTube', 'Wuzu ka Tareeqa | Practical | وضوکا طریقہ @Mufti Obaid Shareef Sahab', 'sunni', false),
  (18, 'lesson', 2, 'https://www.youtube.com/watch?v=s-wjVYxNxrw', 'YouTube', 'How to perform Wudhu? (Ablution) According to Shia Islam', 'shia', false),
  (19, 'lesson', 1, 'https://www.youtube.com/watch?v=FcwmK-9t3lY', 'YouTube', 'Namaz Ki Ahmiyat | Mufti Tariq Masood', 'sunni', false),
  (19, 'expert', 1, 'https://www.youtube.com/watch?v=cmvES7JJ0m4', 'YouTube', 'The Secrets of Salah Workshop | Sayed Ahmed Qazwini | MYC', 'shia', false),
  (20, 'dua', 1, 'https://www.youtube.com/watch?v=0PWpwJpsjwc', 'YouTube', 'Youm e Arfa ki Dua | 9 Zilhajj ki Dua | Hajj Ki Masnoon Duain', 'sunni', false),
  (20, 'dua', 2, 'https://www.dailymotion.com/video/x9kay7q', 'Dailymotion', 'مناجاة الإمام الجواد عليه السلام بطلب الحج — Imam Jawad a.s', 'shia', false),
  (21, 'expert', 1, 'https://www.youtube.com/watch?v=x2TOeszLIuo', 'YouTube', 'Haj Suvidha App 2026 | Complete Guide for Pilgrims | Features, Benefits & How to Use', 'neutral', false),
  (22, 'doctor', 1, 'https://www.youtube.com/watch?v=dtRllYRn5uo', 'YouTube', 'Jemaah Haji Vaksin Meningitis Sebelum Berangkat', 'neutral', false),
  (23, 'expert', 1, 'https://www.youtube.com/watch?v=eqz6fLkxnEs', 'YouTube', 'تمارين للحج ونصائح للاستعداد لمنع الاصابات والالام العضلية', 'neutral', false),
  (24, 'expert', 1, 'https://www.youtube.com/watch?v=Ylf9ACcMAKU', 'YouTube', 'Hajj Ka Samaan | Hajj Packing | Hajj Ka Luggage | Haj Ka Safar | Mufti Shahjahan Qasmi Madanapalle', 'sunni', false),
  (24, 'expert', 2, 'https://www.youtube.com/watch?v=lJ1n9om6UzU', 'YouTube', 'Precautions for Choosing Luggage Bag for Hajj | Abdul Habib Attari | Madani Channel English', 'neutral', false),
  (25, 'expert', 1, 'https://www.youtube.com/watch?v=Ol2Pjr7LtUI', 'YouTube', 'Maal Kharch Karne Ke Aadab - Etiquetts of Spending Money In Islam By Adv. Faiz Syed', 'sunni', false),
  (26, 'expert', 1, 'https://www.youtube.com/watch?v=tmDfBA9qoy4', 'YouTube', 'Ekram Aldyf Hajj 1447 Information Webinar', 'neutral', false),
  (27, 'expert', 1, 'https://www.youtube.com/watch?v=vB3VYJLhgu4', 'YouTube', 'الحرص على صحبة الأخيار في السفر إلى الحج - الشيخ عبد الرزاق البدر', 'sunni', false),
  (27, 'expert', 2, 'https://www.youtube.com/watch?v=aZqL9AklMb8', 'YouTube', '10 Islamic Etiquette/Recommendations for Travelling | Sheikh Mohammed Al-Hilli', 'shia', false),
  (28, 'expert', 1, 'https://www.youtube.com/watch?v=Ngz4a2C9F5c', 'YouTube', 'Sabr Ki Ahmiyat Aur Fayde By Noorul Hasan Salafi', 'sunni', false),
  (28, 'expert', 2, 'https://www.youtube.com/watch?v=LFe2Oi53cek', 'YouTube', 'The Power of Patience: How do I Master it? | Muharram 2024 Night 7 | Sheikh Mohammed Al-Hilli', 'shia', false),
  (29, 'expert', 1, 'https://www.youtube.com/watch?v=A-TTxfgG4pQ', 'YouTube', 'Tawakkal In Islam | Mufti Muhammad Khurram Rehmani | Tawakkal Ke Faide | ARY Qtv', 'sunni', false),
  (29, 'expert', 2, 'https://www.youtube.com/watch?v=fgeSz7N-r5I', 'YouTube', 'Lecture#9 Tawakul - Sayed Hossein Qazwini (Ramadhan 1445AH)', 'shia', false),
  (30, 'lesson', 1, 'https://www.youtube.com/watch?v=OVEX4xXMd8s', 'YouTube', 'Safar-e-Hajj par rawangi | Mufti Abdul Raheem', 'sunni', false)
ON CONFLICT (day, section, position) DO NOTHING;
