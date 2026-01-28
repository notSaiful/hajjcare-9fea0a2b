import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react";
import { compressImage, needsCompression } from "@/lib/imageCompression";

interface DocumentReuploadProps {
  applicationId: string;
  currentStatus: string;
  language: string;
  onSuccess?: () => void;
}

const content = {
  en: {
    title: "Update Proof Document",
    description: "Upload a new document to replace your current proof",
    proofType: "Document Type",
    uploadHint: "Upload Masjid Certificate (PDF or image, max 2MB)",
    upload: "Upload New Document",
    uploading: "Uploading...",
    success: "Document updated successfully!",
    cancel: "Cancel",
    masjidCert: "Masjid Certificate",
    selfVideo: "Self Video",
    notAllowed: "Document updates are only allowed for applications that are Applied or Under Review",
  },
  ur: {
    title: "ثبوتی دستاویز اپ ڈیٹ کریں",
    description: "اپنے موجودہ ثبوت کی جگہ نئی دستاویز اپ لوڈ کریں",
    proofType: "دستاویز کی قسم",
    uploadHint: "مسجد سرٹیفکیٹ اپ لوڈ کریں (PDF یا تصویر، زیادہ سے زیادہ 2MB)",
    upload: "نئی دستاویز اپ لوڈ کریں",
    uploading: "اپ لوڈ ہو رہا ہے...",
    success: "دستاویز کامیابی سے اپ ڈیٹ ہو گئی!",
    cancel: "منسوخ",
    masjidCert: "مسجد سرٹیفکیٹ",
    selfVideo: "سیلف ویڈیو",
    notAllowed: "دستاویز اپ ڈیٹ صرف ان درخواستوں کے لیے ہے جو 'درخواست دی گئی' یا 'جائزہ میں' ہیں",
  },
  hi: {
    title: "प्रमाण दस्तावेज़ अपडेट करें",
    description: "अपने मौजूदा प्रमाण की जगह नया दस्तावेज़ अपलोड करें",
    proofType: "दस्तावेज़ प्रकार",
    uploadHint: "मस्जिद प्रमाणपत्र अपलोड करें (PDF या छवि, अधिकतम 2MB)",
    upload: "नया दस्तावेज़ अपलोड करें",
    uploading: "अपलोड हो रहा है...",
    success: "दस्तावेज़ सफलतापूर्वक अपडेट हो गया!",
    cancel: "रद्द करें",
    masjidCert: "मस्जिद प्रमाणपत्र",
    selfVideo: "सेल्फ वीडियो",
    notAllowed: "दस्तावेज़ अपडेट केवल 'आवेदन किया गया' या 'समीक्षा में' आवेदनों के लिए है",
  },
  ar: {
    title: "تحديث مستند الإثبات",
    description: "قم بتحميل مستند جديد ليحل محل الإثبات الحالي",
    proofType: "نوع المستند",
    uploadHint: "حمّل شهادة المسجد (PDF أو صورة، بحد أقصى 2 ميجابايت)",
    upload: "تحميل مستند جديد",
    uploading: "جاري التحميل...",
    success: "تم تحديث المستند بنجاح!",
    cancel: "إلغاء",
    masjidCert: "شهادة المسجد",
    selfVideo: "فيديو ذاتي",
    notAllowed: "تحديث المستندات مسموح فقط للطلبات في حالة 'تم التقديم' أو 'قيد المراجعة'",
  },
};

export const DocumentReupload = ({
  applicationId,
  currentStatus,
  language,
  onSuccess,
}: DocumentReuploadProps) => {
  const t = content[language as keyof typeof content] || content.en;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const proofType = "Masjid Certificate";

  // Only allow re-upload for Applied or Under Review status
  const canReupload = currentStatus === "Applied" || currentStatus === "Under Review";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - only PDF and images allowed
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed");
      return;
    }

    // For images, try to compress if too large
    if (file.type.startsWith('image/') && needsCompression(file, 2)) {
      try {
        toast.info("Compressing image...");
        const compressed = await compressImage(file, 2);
        if (compressed.size / 1024 / 1024 > 2) {
          toast.error("Image could not be compressed under 2MB. Please use a smaller image.");
          return;
        }
        toast.success("Image compressed successfully");
        setSelectedFile(compressed);
        return;
      } catch (err) {
        console.error("Compression error:", err);
        toast.error("Failed to compress image");
        return;
      }
    }

    // For PDFs or small images, check size directly
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${applicationId}/${Date.now()}.${fileExt}`;
      
      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('proof-documents')
        .upload(filePath, selectedFile);
      
      if (uploadError) throw uploadError;

      // Update applicant record with new proof URL and type
      // Using the public view to verify the application exists first
      const { data: statusData, error: checkError } = await supabase
        .from("applicants_status_check" as any)
        .select("status")
        .eq("application_id", applicationId)
        .maybeSingle();

      if (checkError || !statusData) {
        throw new Error("Application not found");
      }

      // Get current session for authenticated API call
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("You must be logged in to update documents");
      }

      // Call edge function to update proof with authentication
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-proof-document`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            applicationId,
            proofUrl: filePath,
            proofType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update document');
      }

      setIsSuccess(true);
      toast.success(t.success);
      onSuccess?.();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("Failed to update document");
    } finally {
      setIsUploading(false);
    }
  };

  if (!canReupload) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
        {t.notAllowed}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="p-4 bg-primary/10 rounded-lg text-center space-y-2">
        <CheckCircle className="w-8 h-8 text-primary mx-auto" />
        <p className="text-sm font-medium text-primary">{t.success}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
      <div>
        <h4 className="font-medium text-sm">{t.title}</h4>
        <p className="text-xs text-muted-foreground">{t.description}</p>
      </div>


      <div 
        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        {selectedFile ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground truncate max-w-[180px]">
              {selectedFile.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">{t.uploadHint}</p>
          </>
        )}
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading}
        className="w-full"
        size="sm"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.uploading}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {t.upload}
          </>
        )}
      </Button>
    </div>
  );
};
