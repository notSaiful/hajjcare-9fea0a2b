export interface HajInspector {
  id: string;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  state: string;
  cbtMarks: number;
  interviewMarks: number;
  totalMarks: number;
  result: 'Selected' | 'Waitlisted';
  quota: string;
  category: string;
}

export const HAJ_INSPECTORS: HajInspector[] = [
  // Andaman and Nicobar Islands
  { id: '25102903107356', name: 'KHALID', fatherName: 'PARAKKAL KUTTYBAWA ABOOBACKER', gender: 'Male', state: 'Andaman and Nicobar Islands', cbtMarks: 130, interviewMarks: 38, totalMarks: 168, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110503111044', name: 'MOHAMMED RAFIQUE', fatherName: 'NALAKATH RASHEED', gender: 'Male', state: 'Andaman and Nicobar Islands', cbtMarks: 137, interviewMarks: 26, totalMarks: 163, result: 'Waitlisted', quota: '50% Open Quota', category: 'Fresher' },

  // Andhra Pradesh
  { id: '25103002103512', name: 'MASTAN VALI', fatherName: 'SHAIK JOHN SAHEB', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 146, interviewMarks: 48, totalMarks: 194, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25101602103538', name: 'ATAULLA', fatherName: 'KAREEMULLA SHAIK', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 140, interviewMarks: 46, totalMarks: 186, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102102104111', name: 'MOHAMMED AAQIB RAHMAN', fatherName: 'MOHAMMED HABEEB UR RAHMAN', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 143, interviewMarks: 41, totalMarks: 184, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102802103333', name: 'USMAN PASHA', fatherName: 'HUSSAIN PASHA SHAIK', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 139, interviewMarks: 45, totalMarks: 184, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25103102107688', name: 'FIRDOUSE', fatherName: 'SHAIK BILAL', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 141, interviewMarks: 41, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102702104084', name: 'ZIKRIYA BASHA', fatherName: 'RAHAMTHULLA SHAIK', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 136, interviewMarks: 46, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25103002105361', name: 'NAZEER AHAMED', fatherName: 'PINJARI DASTAGIRI SAHEB', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 137, interviewMarks: 43, totalMarks: 180, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102602103734', name: 'IMRAN', fatherName: 'SHAIK MOHAMMED KHADER BASHA', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 141, interviewMarks: 39, totalMarks: 180, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102302105200', name: 'RIYAZ AHAMMAD', fatherName: 'SHAIK KAMAL BASHA', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 130, interviewMarks: 48, totalMarks: 178, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '2511030210392', name: 'MOHAMMED JUNAID', fatherName: 'ANSAR BASHA RAICHUR', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 130, interviewMarks: 45, totalMarks: 175, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25103102106199', name: 'RABBANI', fatherName: 'GOUSE MOHAMMAD', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 138, interviewMarks: 36, totalMarks: 174, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25101702104354', name: 'ABDUL SALEEM BASHA', fatherName: 'SHAIK ABDUL KAREEM', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 132, interviewMarks: 42, totalMarks: 174, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102102103303', name: 'IMRAN', fatherName: 'ABDUL SHUKUR MULLA', gender: 'Male', state: 'Andhra Pradesh', cbtMarks: 116, interviewMarks: 42, totalMarks: 158, result: 'Selected', quota: '5% Reserved Quota', category: 'SHC/Waqf Employee' },

  // Assam
  { id: '25102901107807', name: 'MONOWAR HUSSAIN', fatherName: 'HUSSAIN', gender: 'Male', state: 'Assam', cbtMarks: 141, interviewMarks: 32, totalMarks: 173, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110101103371', name: 'FAYZUL ISLAM', fatherName: 'ISLAM', gender: 'Male', state: 'Assam', cbtMarks: 145, interviewMarks: 27, totalMarks: 172, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110301110607', name: 'MD AASHIF IKBAL AHMED', fatherName: 'AHMED', gender: 'Male', state: 'Assam', cbtMarks: 140, interviewMarks: 27, totalMarks: 167, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110301110882', name: 'SAHAB UDDIN AHMED CHOUDHURY', fatherName: 'CHOUDHURY', gender: 'Male', state: 'Assam', cbtMarks: 139, interviewMarks: 26, totalMarks: 165, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25101801105042', name: 'JOYNAL ABDIN MAZUMDER', fatherName: 'MAZUMDER', gender: 'Male', state: 'Assam', cbtMarks: 139, interviewMarks: 26, totalMarks: 165, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25103101108307', name: 'HAFIZ MOHAMMAD SHABBIR AHMED', fatherName: 'AHMED', gender: 'Male', state: 'Assam', cbtMarks: 136, interviewMarks: 28, totalMarks: 164, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102801108447', name: 'MAKSUD AHMED LASKAR', fatherName: 'LASKAR', gender: 'Male', state: 'Assam', cbtMarks: 134, interviewMarks: 28, totalMarks: 162, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102401105341', name: 'SADIKUL ISLAM BARBHUIYA', fatherName: 'BARBHUIYA', gender: 'Male', state: 'Assam', cbtMarks: 137, interviewMarks: 25, totalMarks: 162, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102601107761', name: 'FAKRUL ALAM', fatherName: 'ALAM', gender: 'Male', state: 'Assam', cbtMarks: 133, interviewMarks: 28, totalMarks: 161, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102101105933', name: 'MOHAMMED ABDUL HANNAN', fatherName: 'HANNAN', gender: 'Male', state: 'Assam', cbtMarks: 133, interviewMarks: 27, totalMarks: 160, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102401106883', name: 'MUHAMMAD KABIR HUSSAIN', fatherName: 'HUSSAIN', gender: 'Male', state: 'Assam', cbtMarks: 129, interviewMarks: 28, totalMarks: 157, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110101109075', name: 'CHARIFUL ISLAM', fatherName: 'ISLAM', gender: 'Male', state: 'Assam', cbtMarks: 129, interviewMarks: 26, totalMarks: 155, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102301106124', name: 'MUSTAK AHMED CHOUDHURY', fatherName: 'CHOUDHURY', gender: 'Male', state: 'Assam', cbtMarks: 133, interviewMarks: 27, totalMarks: 160, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102501104384', name: 'DILWAR HUSSAIN', fatherName: 'HUSSAIN', gender: 'Male', state: 'Assam', cbtMarks: 124, interviewMarks: 28, totalMarks: 152, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102701106412', name: 'MOFIZ UDDIN CHOUDHURY', fatherName: 'CHOUDHURY', gender: 'Male', state: 'Assam', cbtMarks: 122, interviewMarks: 26, totalMarks: 148, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },

  // Rajasthan
  { id: '25102725106607', name: 'MOHAMMED AARIF', fatherName: 'MOHAMMED HUSSAIN', gender: 'Male', state: 'Rajasthan', cbtMarks: 140, interviewMarks: 45, totalMarks: 185, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25103125109108', name: 'MEHBOOB', fatherName: 'MEHPHOOL KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 139, interviewMarks: 45, totalMarks: 184, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110725111489', name: 'SHAHNAZ', fatherName: 'YASIN ALI QURESHI', gender: 'Female', state: 'Rajasthan', cbtMarks: 138, interviewMarks: 45, totalMarks: 183, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102925108732', name: 'NASRUDDIN', fatherName: 'JAMALUDDIN KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 138, interviewMarks: 45, totalMarks: 183, result: 'Selected', quota: '50% Open Quota', category: 'SHC/Waqf Employee' },
  { id: '25102525105464', name: 'RIYAZAT', fatherName: 'MAHBOOB ALI KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 141, interviewMarks: 40, totalMarks: 181, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110325105230', name: 'MOHAMMED ASIF', fatherName: 'AHMED NOOR', gender: 'Male', state: 'Rajasthan', cbtMarks: 135, interviewMarks: 45, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102825107968', name: 'GAFFAR KHAN', fatherName: 'SAIBADI KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 135, interviewMarks: 45, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102925106716', name: 'MUKHTAR', fatherName: 'BUNDA KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 135, interviewMarks: 45, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '2511032511053', name: 'MOHAMMED ARIF', fatherName: 'MAJEED KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 134, interviewMarks: 45, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25103025105952', name: 'MOHSIN IQBAL', fatherName: 'MOHAMMED IQBAL', gender: 'Male', state: 'Rajasthan', cbtMarks: 139, interviewMarks: 40, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102825107480', name: 'SALEEMUDDIN KHAN', fatherName: 'ALLADDIN KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 134, interviewMarks: 45, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110325103723', name: 'MOHAMMAD JAHIR', fatherName: 'SATTAR MOHAMMAD', gender: 'Male', state: 'Rajasthan', cbtMarks: 134, interviewMarks: 45, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102525103818', name: 'IMRAN', fatherName: 'ABDUL AZIZ', gender: 'Male', state: 'Rajasthan', cbtMarks: 139, interviewMarks: 40, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110325109847', name: 'ALTAF', fatherName: 'MOHAMMED SWALEH', gender: 'Male', state: 'Rajasthan', cbtMarks: 133, interviewMarks: 45, totalMarks: 178, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110125106442', name: 'SHAHARUKH', fatherName: 'SHABBIR KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 137, interviewMarks: 40, totalMarks: 177, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110225109635', name: 'SALMA', fatherName: 'RAZZAK KHAN', gender: 'Female', state: 'Rajasthan', cbtMarks: 129, interviewMarks: 45, totalMarks: 174, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102825108055', name: 'ARIF', fatherName: 'ABDUL HAFEEZ', gender: 'Male', state: 'Rajasthan', cbtMarks: 139, interviewMarks: 35, totalMarks: 174, result: 'Selected', quota: '25% Reserved Quota', category: 'Fresher' },
  { id: '25102325103948', name: 'IMRAN KHAN', fatherName: 'AMIN KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 133, interviewMarks: 40, totalMarks: 173, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102525104454', name: 'SARFARAJ', fatherName: 'LIYAKAT ALI', gender: 'Male', state: 'Rajasthan', cbtMarks: 137, interviewMarks: 35, totalMarks: 172, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110325105172', name: 'AFRAJ', fatherName: 'ABDUL SALAM', gender: 'Male', state: 'Rajasthan', cbtMarks: 131, interviewMarks: 40, totalMarks: 171, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '2511022510408e', name: 'GULAM MUSTAFFA', fatherName: 'SHAR MOHAMMAD', gender: 'Male', state: 'Rajasthan', cbtMarks: 131, interviewMarks: 40, totalMarks: 171, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110325110897', name: 'ASLAM', fatherName: 'MUMTAJ KHAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 130, interviewMarks: 40, totalMarks: 170, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110325108391', name: 'ULFAN', fatherName: 'PEER MOHAMMAD', gender: 'Male', state: 'Rajasthan', cbtMarks: 128, interviewMarks: 40, totalMarks: 168, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110725111535', name: 'BASHIR AHMED', fatherName: 'QASIM ALI', gender: 'Male', state: 'Rajasthan', cbtMarks: 133, interviewMarks: 35, totalMarks: 168, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110725111171', name: 'SYED RAZZAK', fatherName: 'SYED MUBARAK ALI', gender: 'Male', state: 'Rajasthan', cbtMarks: 133, interviewMarks: 35, totalMarks: 168, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '2511022510561', name: 'MOHAMMED SABIR', fatherName: 'ABDUL AZIZ REHMANI', gender: 'Male', state: 'Rajasthan', cbtMarks: 129, interviewMarks: 35, totalMarks: 164, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102025105510', name: 'MOHAMMED AASIF', fatherName: 'MOHAMMED ASLAM', gender: 'Male', state: 'Rajasthan', cbtMarks: 128, interviewMarks: 35, totalMarks: 163, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25103025105576', name: 'MOHAMMED JAVED', fatherName: 'HAJI MOHAMMED ZAKIR', gender: 'Male', state: 'Rajasthan', cbtMarks: 126, interviewMarks: 35, totalMarks: 161, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110625109641', name: 'JULEKHA MASARAT', fatherName: 'MOHAMMAD SABIR', gender: 'Female', state: 'Rajasthan', cbtMarks: 125, interviewMarks: 35, totalMarks: 160, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110325108488', name: 'ABDUL HAFEEZ', fatherName: 'ABDUL RAHMAN', gender: 'Male', state: 'Rajasthan', cbtMarks: 94, interviewMarks: 40, totalMarks: 134, result: 'Selected', quota: '5% Reserved Quota', category: 'SHC/Waqf Employee' },

  // Tamil Nadu
  { id: '25103130106715', name: 'MOHAMED YUSUFF SHAH S', fatherName: 'SHAHUL HAMEED S M', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 145, interviewMarks: 50, totalMarks: 195, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102130103493', name: 'AJMALKHAN', fatherName: 'KAMALDEEN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 144, interviewMarks: 49, totalMarks: 193, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102430107211', name: 'MUHAMMED IMRAN', fatherName: 'HYDER ALI', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 139, interviewMarks: 50, totalMarks: 189, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110330110735', name: 'MOHAMED ALI', fatherName: 'MOHAMED SYED', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 138, interviewMarks: 50, totalMarks: 188, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102730107948', name: 'AMEERKHAN', fatherName: 'GHAFFARKHAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 139, interviewMarks: 49, totalMarks: 188, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102930108815', name: 'ABUBACKAR SIDIQUE', fatherName: 'MOHAIDEEN ABDUL KADAR', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 136, interviewMarks: 50, totalMarks: 186, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102930105080', name: 'ABDUL HAFIZ', fatherName: 'ABDUL HAMEED K', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 137, interviewMarks: 49, totalMarks: 186, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25103130107863', name: 'ZAKIRA KANAM', fatherName: 'MOHAMMED FAROOK M', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 140, interviewMarks: 45, totalMarks: 185, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102930103978', name: 'KALVATH SYETH ABDUL KADHAR', fatherName: 'RASOOL MOHIDHEEN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 141, interviewMarks: 43, totalMarks: 184, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25103130109482', name: 'RAHIMAN', fatherName: 'O.S. HASSAN MIA', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 143, interviewMarks: 40, totalMarks: 183, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102930105734', name: 'SALMA', fatherName: 'SHAHUL HAMEED KHAN', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 133, interviewMarks: 50, totalMarks: 183, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110330108981', name: 'BARGATHULLA S', fatherName: 'SULAIMAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 137, interviewMarks: 45, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110330110348', name: 'FAROOK KHAN', fatherName: 'HASMATHULLA KHAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 134, interviewMarks: 48, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110230110106', name: 'MOHAMED IQBAL', fatherName: 'JAMALUDEEN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 134, interviewMarks: 48, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102630105277', name: 'FAIZULLAH', fatherName: 'V.S.NIYAMATHULLAH', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 132, interviewMarks: 50, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110130108133', name: 'SHEIK MOHAMMED', fatherName: 'THAJUDEEN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 132, interviewMarks: 47, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102930107404', name: 'MUJEEB RAHMAN', fatherName: 'KATHER MAIDEEN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 128, interviewMarks: 50, totalMarks: 178, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110230103634', name: 'FAYAZ G', fatherName: 'GULAB JAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 126, interviewMarks: 50, totalMarks: 176, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102530105703', name: 'HUSSAIN AHMED', fatherName: 'V M KALILUR RAHMAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 129, interviewMarks: 47, totalMarks: 176, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102230104597', name: 'MUBARAK RAHMAN', fatherName: 'MOHAMED IBRAHIM', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 131, interviewMarks: 45, totalMarks: 176, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102930105295', name: 'SYEDHALI FATHIMA', fatherName: 'SHAMSUDEEN', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 136, interviewMarks: 40, totalMarks: 176, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110230110326', name: 'JABEEN TAJ', fatherName: 'SAABITH ALI.B.', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 126, interviewMarks: 48, totalMarks: 174, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25102130105854', name: 'MOHAMED FROSKHAN', fatherName: 'SYED ABDUL KADER', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 124, interviewMarks: 50, totalMarks: 174, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25101930104699', name: 'SULTHAN IBRAHIM', fatherName: 'MOHAMED SULAIMAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 125, interviewMarks: 49, totalMarks: 174, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25101730104181', name: 'MOHAMED RIYALDEEN', fatherName: 'MOHAMED MUSTHABA', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 127, interviewMarks: 45, totalMarks: 172, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102830107179', name: 'SYED ABTHUL KAREEM', fatherName: 'SAHUL HAMEED', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 128, interviewMarks: 35, totalMarks: 163, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102930103786', name: 'WAHEEDHA FATHIMA', fatherName: 'ABDUL RAHMAN M', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 128, interviewMarks: 35, totalMarks: 163, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102330103917', name: 'JAVEED', fatherName: 'SUUKKUR.S.A', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 114, interviewMarks: 48, totalMarks: 162, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25101930103531', name: 'MAHATHUM IRFAN', fatherName: 'HAMEED RASVI', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 131, interviewMarks: 29, totalMarks: 160, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25103130106732', name: 'GHAZALI BASHA', fatherName: 'MOHAMMED ISMATH', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 126, interviewMarks: 31, totalMarks: 157, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110230110233', name: 'RIZWANULLA SHARIFF', fatherName: 'ABDUL KHADER M A', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 121, interviewMarks: 35, totalMarks: 156, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102230104969', name: 'JANNATHUL BIRTHOUSE', fatherName: 'ABDUL MAJEETH', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 106, interviewMarks: 50, totalMarks: 156, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25101630103474', name: 'SYED BILAL AHMAD', fatherName: 'SYED IBRAHIM', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 128, interviewMarks: 28, totalMarks: 156, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110130104356', name: 'MOHAMED USMAN', fatherName: 'MOHAMED IBRAHIM M', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 132, interviewMarks: 35, totalMarks: 167, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102230106601', name: 'YASIR AHMED', fatherName: 'SHAFEEULLAH', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 129, interviewMarks: 38, totalMarks: 167, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110730111215', name: 'KHATHIJA UMAMA', fatherName: 'MOHAMMED MYDHEEN', gender: 'Female', state: 'Tamil Nadu', cbtMarks: 116, interviewMarks: 45, totalMarks: 161, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25101730103905', name: 'SADIQ BASHA', fatherName: 'ANSAR BASHA', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 103, interviewMarks: 45, totalMarks: 148, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25103130108072', name: 'HABIBUR RAHMAN', fatherName: 'MOHAMED ABDUL KADER', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 90, interviewMarks: 45, totalMarks: 135, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110730111536', name: 'AMEENULLAH KHAN', fatherName: 'JAFARULLA KHAN', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 84, interviewMarks: 48, totalMarks: 132, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102230104160', name: 'ABDUL RAFI', fatherName: 'ABDUL SATHAR', gender: 'Male', state: 'Tamil Nadu', cbtMarks: 112, interviewMarks: 50, totalMarks: 162, result: 'Selected', quota: '5% Reserved Quota', category: 'SHC/Waqf Employee' },

  // Telangana
  { id: '25102841105482', name: 'ABDUL MUSAVVER', fatherName: 'MOHAMMED ABDUL AZIZ', gender: 'Male', state: 'Telangana', cbtMarks: 141, interviewMarks: 50, totalMarks: 191, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102341104164', name: 'ABDUL QAYYUM', fatherName: 'KHALIQ', gender: 'Male', state: 'Telangana', cbtMarks: 140, interviewMarks: 50, totalMarks: 190, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25101741103473', name: 'ARIF ALI', fatherName: 'MOHAMMED AZMATH ALI', gender: 'Male', state: 'Telangana', cbtMarks: 140, interviewMarks: 50, totalMarks: 190, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25103141109604', name: 'ABDUL QUDDUS', fatherName: 'MOHAMMED ABDUL GAFOOR', gender: 'Male', state: 'Telangana', cbtMarks: 135, interviewMarks: 50, totalMarks: 185, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25101741104266', name: 'ABDUL AZEEZ', fatherName: 'MOHD ABDUL KHADER', gender: 'Male', state: 'Telangana', cbtMarks: 135, interviewMarks: 50, totalMarks: 185, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110441110972', name: 'SABIR', fatherName: 'MOHAMMED JAFFAR', gender: 'Male', state: 'Telangana', cbtMarks: 133, interviewMarks: 50, totalMarks: 183, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110341110552', name: 'SHAIK MOHAMMED ALI', fatherName: 'SHAIK ALI SABRI', gender: 'Male', state: 'Telangana', cbtMarks: 132, interviewMarks: 50, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102541105495', name: 'HAKEEM', fatherName: 'MOHAMMAD ABDUL RAHEEM', gender: 'Male', state: 'Telangana', cbtMarks: 132, interviewMarks: 50, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110241106283', name: 'MIRZA AFZAL', fatherName: 'AMAN BAIG MIRZA', gender: 'Male', state: 'Telangana', cbtMarks: 132, interviewMarks: 50, totalMarks: 182, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25110341110583', name: 'MOHAMMAD', fatherName: 'MOHAMMAD SARWAR HUSSAIN', gender: 'Male', state: 'Telangana', cbtMarks: 131, interviewMarks: 50, totalMarks: 181, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102941108874', name: 'MUKTAR', fatherName: 'BASHEER AHAMED', gender: 'Male', state: 'Telangana', cbtMarks: 131, interviewMarks: 50, totalMarks: 181, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110441108280', name: 'KHAJA PASHA', fatherName: 'SYED LATHEEF', gender: 'Male', state: 'Telangana', cbtMarks: 130, interviewMarks: 50, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25110341108933', name: 'MANZOOR AHMED', fatherName: 'MOHAMMED GHOUSE', gender: 'Male', state: 'Telangana', cbtMarks: 130, interviewMarks: 50, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25102141105029', name: 'ASIFUDDIN', fatherName: 'MOHAMMED MOINUDDIN', gender: 'Male', state: 'Telangana', cbtMarks: 130, interviewMarks: 50, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25110141105229', name: 'MOHAMMED SHABUDDIN', fatherName: 'SHAIK MAHBOOB', gender: 'Male', state: 'Telangana', cbtMarks: 130, interviewMarks: 50, totalMarks: 180, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25102741108156', name: 'HYDER ALI', fatherName: 'IBRAHIM ALI', gender: 'Male', state: 'Telangana', cbtMarks: 129, interviewMarks: 50, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102241104204', name: 'MOHAMMED KHAJA MUJTAHIDUDDIN', fatherName: 'MOHAMMED KHAJA MOHSINUDDIN', gender: 'Male', state: 'Telangana', cbtMarks: 129, interviewMarks: 50, totalMarks: 179, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102441107088', name: 'MOHAMMED SHARIF', fatherName: 'MOHAMMED HABEEB', gender: 'Male', state: 'Telangana', cbtMarks: 128, interviewMarks: 50, totalMarks: 178, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25102441104922', name: 'MOHAMMED JAVEED HILAL', fatherName: 'MOHAMMED ABDUL QUAYYUM', gender: 'Male', state: 'Telangana', cbtMarks: 128, interviewMarks: 50, totalMarks: 178, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110641111015', name: 'SYED ABDUL RAWOOF', fatherName: 'SYED ABDUL SHUKOOR', gender: 'Male', state: 'Telangana', cbtMarks: 127, interviewMarks: 50, totalMarks: 177, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110241110356', name: 'FAHIM', fatherName: 'AKHTAR HUSSSAIN', gender: 'Male', state: 'Telangana', cbtMarks: 126, interviewMarks: 50, totalMarks: 176, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25101741103346', name: 'AZEEM UDDIN', fatherName: 'MOHAMMED ALEEM UDDIN', gender: 'Male', state: 'Telangana', cbtMarks: 136, interviewMarks: 40, totalMarks: 176, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102141104112', name: 'MOMAMMED AHMED PASHA', fatherName: 'MOHAMMED SHAREEF', gender: 'Male', state: 'Telangana', cbtMarks: 121, interviewMarks: 50, totalMarks: 171, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102541106312', name: 'SHAHID ALI THABREZ', fatherName: 'AHMED ALI', gender: 'Male', state: 'Telangana', cbtMarks: 130, interviewMarks: 40, totalMarks: 170, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110341104934', name: 'SYED', fatherName: 'SYED IQBAL', gender: 'Male', state: 'Telangana', cbtMarks: 132, interviewMarks: 35, totalMarks: 167, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110341104948', name: 'YASEEN ALI', fatherName: 'ALI HUSSAIN', gender: 'Male', state: 'Telangana', cbtMarks: 114, interviewMarks: 50, totalMarks: 164, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110341109124', name: 'MOHAMMED OSMAN OWAIS', fatherName: 'MOHAMMED GHOUSE', gender: 'Male', state: 'Telangana', cbtMarks: 135, interviewMarks: 28, totalMarks: 163, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102541104789', name: 'MOHAMMED', fatherName: 'MD MASOOD ALI (LATE)', gender: 'Male', state: 'Telangana', cbtMarks: 135, interviewMarks: 27, totalMarks: 162, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25103141103438', name: 'IMTHIYAZ', fatherName: 'LATE SYED HAZRATH ALI', gender: 'Male', state: 'Telangana', cbtMarks: 134, interviewMarks: 25, totalMarks: 159, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102441106919', name: 'AKBAR TABREZ', fatherName: 'MOHAMMED ABDUL QAYYUM', gender: 'Male', state: 'Telangana', cbtMarks: 108, interviewMarks: 50, totalMarks: 158, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25103041107770', name: 'KHAJA MOINUDDIN', fatherName: 'GOUSUDDIN', gender: 'Male', state: 'Telangana', cbtMarks: 122, interviewMarks: 35, totalMarks: 157, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102941104905', name: 'MD IRFAN SHAIK', fatherName: 'SHAIK AHMED', gender: 'Male', state: 'Telangana', cbtMarks: 128, interviewMarks: 28, totalMarks: 156, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102741104595', name: 'MOHAMMED SAMI', fatherName: 'MOHAMMED SUBHAN', gender: 'Male', state: 'Telangana', cbtMarks: 123, interviewMarks: 50, totalMarks: 173, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110141109740', name: 'MOHAMMED IDRIS AHMED', fatherName: 'KHAJA MOIN UDDIN', gender: 'Male', state: 'Telangana', cbtMarks: 121, interviewMarks: 50, totalMarks: 171, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102041104852', name: 'SYED NADEEM', fatherName: 'SYED HAFEEZ', gender: 'Male', state: 'Telangana', cbtMarks: 121, interviewMarks: 50, totalMarks: 171, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110341110703', name: 'ABDUL SAMI', fatherName: 'MOHAMMED ABUL MUKHTAR KATIB', gender: 'Male', state: 'Telangana', cbtMarks: 118, interviewMarks: 50, totalMarks: 168, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110341106604', name: 'MOINUDDIN', fatherName: 'MOHAMMED KHURSHEED ALI', gender: 'Male', state: 'Telangana', cbtMarks: 126, interviewMarks: 40, totalMarks: 166, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110541111102', name: 'SHAIK', fatherName: 'SK MAQBOOL', gender: 'Male', state: 'Telangana', cbtMarks: 133, interviewMarks: 30, totalMarks: 163, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102341106867', name: 'WAJIHUDDIN HAMEED', fatherName: 'MOHAMMED MOIZUDDIN HQQANI', gender: 'Male', state: 'Telangana', cbtMarks: 133, interviewMarks: 27, totalMarks: 160, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110341110777', name: 'RAFEE', fatherName: 'ABDUL JALEEL', gender: 'Male', state: 'Telangana', cbtMarks: 123, interviewMarks: 35, totalMarks: 158, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102041104489', name: 'MAHAMMED AYUB', fatherName: 'KATEEB HAMEED BASHA', gender: 'Male', state: 'Telangana', cbtMarks: 126, interviewMarks: 30, totalMarks: 156, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25103141108859', name: 'YOUSUF PASHA', fatherName: 'TAYYAB PASHA', gender: 'Male', state: 'Telangana', cbtMarks: 125, interviewMarks: 50, totalMarks: 175, result: 'Selected', quota: '5% Reserved Quota', category: 'SHC/Waqf Employee' },
  { id: '25110341110709', name: 'FAZLUL RAHEMAN', fatherName: 'MOHAMMED RABBANI', gender: 'Male', state: 'Telangana', cbtMarks: 115, interviewMarks: 50, totalMarks: 165, result: 'Selected', quota: '5% Reserved Quota', category: 'SHC/Waqf Employee' },

  // Uttarakhand
  { id: '25110227109334', name: 'RAIS AHMAD', fatherName: 'INTIZAR HUSAIN', gender: 'Male', state: 'Uttarakhand', cbtMarks: 130, interviewMarks: 44, totalMarks: 174, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102227105992', name: 'SADAQAT HUSAIN', fatherName: 'LIYAQAT HUSAIN', gender: 'Male', state: 'Uttarakhand', cbtMarks: 132, interviewMarks: 41, totalMarks: 173, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25102927105602', name: 'MUHAMMAD GULZAR', fatherName: 'MUHAMMAD ILYAS', gender: 'Male', state: 'Uttarakhand', cbtMarks: 133, interviewMarks: 40, totalMarks: 173, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110127109516', name: 'MOHAMMED MOHSIN', fatherName: 'MOHD SHABBIR', gender: 'Male', state: 'Uttarakhand', cbtMarks: 128, interviewMarks: 41, totalMarks: 169, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25103027108232', name: 'MOHD JAVED', fatherName: 'GULAM SABIR SHEIKH', gender: 'Male', state: 'Uttarakhand', cbtMarks: 130, interviewMarks: 39, totalMarks: 169, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102127105796', name: 'GULSANOOBER', fatherName: 'MOHAMMAD AYYOOB', gender: 'Male', state: 'Uttarakhand', cbtMarks: 123, interviewMarks: 44, totalMarks: 167, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25103127109380', name: 'TARIQ HUSAIN ANWAR', fatherName: 'RAMJAN MOHAMMAD', gender: 'Male', state: 'Uttarakhand', cbtMarks: 117, interviewMarks: 33, totalMarks: 150, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110327106773', name: 'SHAKEEL AHMAD', fatherName: 'ABDUL MAJID', gender: 'Male', state: 'Uttarakhand', cbtMarks: 95, interviewMarks: 37, totalMarks: 132, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },

  // West Bengal
  { id: '25110229109892', name: 'MD ASIF', fatherName: 'MD MASIHUZZAMAN', gender: 'Male', state: 'West Bengal', cbtMarks: 136, interviewMarks: 45, totalMarks: 181, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110329109045', name: 'MD ZAKI', fatherName: 'MD KALAM', gender: 'Male', state: 'West Bengal', cbtMarks: 137, interviewMarks: 38, totalMarks: 175, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25101929103646', name: 'SYED ZAHID', fatherName: 'SYED WALIUL HAQUE', gender: 'Male', state: 'West Bengal', cbtMarks: 126, interviewMarks: 49, totalMarks: 175, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25101729104060', name: 'MD SHAHNAWAZ', fatherName: 'MD IRFAN', gender: 'Male', state: 'West Bengal', cbtMarks: 139, interviewMarks: 35, totalMarks: 174, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25103129109018', name: 'MD MASIHUR', fatherName: 'MD SAFIUR RAHAMAN', gender: 'Male', state: 'West Bengal', cbtMarks: 136, interviewMarks: 38, totalMarks: 174, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25110329104198', name: 'MOBIN', fatherName: 'MAZAHAR HOSSAIN', gender: 'Male', state: 'West Bengal', cbtMarks: 135, interviewMarks: 38, totalMarks: 173, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25102529104492', name: 'TANWEER ASHRAF', fatherName: 'ASHRAF ALI', gender: 'Male', state: 'West Bengal', cbtMarks: 133, interviewMarks: 40, totalMarks: 173, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25102129105461', name: 'WASIM RAJA', fatherName: 'GOLAM MOHIUDDIN MOLLA', gender: 'Male', state: 'West Bengal', cbtMarks: 129, interviewMarks: 43, totalMarks: 172, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25101929105035', name: 'MOHAMMAD AMJAD', fatherName: 'MOHAMMAD IBRAHIM SHAH', gender: 'Male', state: 'West Bengal', cbtMarks: 136, interviewMarks: 35, totalMarks: 171, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110329108748', name: 'SABIR ALI', fatherName: 'ROSTAM ALI SEKH', gender: 'Male', state: 'West Bengal', cbtMarks: 128, interviewMarks: 40, totalMarks: 168, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25110329106209', name: 'JAHIRUL', fatherName: 'BAZLE HAQUE', gender: 'Male', state: 'West Bengal', cbtMarks: 132, interviewMarks: 35, totalMarks: 167, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25110229104746', name: 'FAIZAN', fatherName: 'MD ASLAM', gender: 'Male', state: 'West Bengal', cbtMarks: 126, interviewMarks: 40, totalMarks: 166, result: 'Selected', quota: '50% Open Quota', category: 'Fresher' },
  { id: '25102429104165', name: 'SK ASIF HOSSAIN', fatherName: 'SK MAHAMMAD HANIF', gender: 'Male', state: 'West Bengal', cbtMarks: 137, interviewMarks: 29, totalMarks: 166, result: 'Selected', quota: '50% Open Quota', category: 'Fresher with Haj' },
  { id: '25101729103373', name: 'TAYABUL', fatherName: 'ABDUL HANNAN', gender: 'Male', state: 'West Bengal', cbtMarks: 137, interviewMarks: 29, totalMarks: 166, result: 'Selected', quota: '50% Open Quota', category: 'Repeater' },
  { id: '25110129105526', name: 'MOHAMMAD MAHBOOB', fatherName: 'MOHAMMAD ISRAIL', gender: 'Male', state: 'West Bengal', cbtMarks: 140, interviewMarks: 25, totalMarks: 165, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110129104961', name: 'MD ANOWAR ALI', fatherName: 'MD TALEB ALI MOLLA', gender: 'Male', state: 'West Bengal', cbtMarks: 139, interviewMarks: 25, totalMarks: 164, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25101729103712', name: 'MOHAMMAD EZAZ', fatherName: 'MD MOHSIN', gender: 'Male', state: 'West Bengal', cbtMarks: 137, interviewMarks: 25, totalMarks: 162, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25101729103671', name: 'SYED TOHIDUL ISLAM', fatherName: 'SYED SOHIDUR RAHMAN', gender: 'Male', state: 'West Bengal', cbtMarks: 131, interviewMarks: 29, totalMarks: 160, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110329108223', name: 'SK MD SANAULLAH', fatherName: 'SEKH MOHAMMAD SHAHIDULLAH', gender: 'Male', state: 'West Bengal', cbtMarks: 133, interviewMarks: 25, totalMarks: 158, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25110229110097', name: 'SEKH NAWAB ALI', fatherName: 'SEKH NAWSHER ALI', gender: 'Male', state: 'West Bengal', cbtMarks: 128, interviewMarks: 25, totalMarks: 153, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25102729107872', name: 'AQEEL AHMED', fatherName: 'MOHAMMAD NEZAMUDDIN ANSARI', gender: 'Male', state: 'West Bengal', cbtMarks: 125, interviewMarks: 25, totalMarks: 150, result: 'Selected', quota: '25% Reserved Quota', category: 'Repeater' },
  { id: '25103129108215', name: 'MD MOHIT', fatherName: 'MD MANSOOR KHAN', gender: 'Male', state: 'West Bengal', cbtMarks: 103, interviewMarks: 40, totalMarks: 143, result: 'Selected', quota: '25% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110129105758', name: 'MD TAHER', fatherName: 'MOHAMMED FIDA HUSSAIN', gender: 'Male', state: 'West Bengal', cbtMarks: 125, interviewMarks: 25, totalMarks: 150, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102929108677', name: 'MOHAMMAD SABIR HOSSAIN', fatherName: 'NOOR HOSSAIN MOLLA', gender: 'Male', state: 'West Bengal', cbtMarks: 122, interviewMarks: 26, totalMarks: 148, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110329107269', name: 'SHAMSUN NAHAR', fatherName: 'MD ABDUR RAHMAN', gender: 'Female', state: 'West Bengal', cbtMarks: 122, interviewMarks: 25, totalMarks: 147, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110429104546', name: 'ENAYET', fatherName: 'HUMAYUN KABIR', gender: 'Male', state: 'West Bengal', cbtMarks: 122, interviewMarks: 25, totalMarks: 147, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25110329106524', name: 'WAHID', fatherName: 'MD SHAMSUDDIN', gender: 'Male', state: 'West Bengal', cbtMarks: 120, interviewMarks: 25, totalMarks: 145, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
  { id: '25102529107496', name: 'MATIUR RAHAMAN', fatherName: 'SAMSUL HUDA ANSARY', gender: 'Male', state: 'West Bengal', cbtMarks: 119, interviewMarks: 25, totalMarks: 144, result: 'Selected', quota: '20% Reserved Quota', category: 'Fresher with Haj' },
];

// Get unique states from data
export const INSPECTOR_STATES = [...new Set(HAJ_INSPECTORS.map(i => i.state))].sort();

// Stats per state
export const getStateStats = (state: string) => {
  const inspectors = HAJ_INSPECTORS.filter(i => i.state === state);
  const selected = inspectors.filter(i => i.result === 'Selected').length;
  const waitlisted = inspectors.filter(i => i.result === 'Waitlisted').length;
  const male = inspectors.filter(i => i.gender === 'Male').length;
  const female = inspectors.filter(i => i.gender === 'Female').length;
  return { total: inspectors.length, selected, waitlisted, male, female };
};
