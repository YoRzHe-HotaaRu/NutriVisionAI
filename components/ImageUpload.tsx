import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SAMPLE_IMAGES } from '../constants';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const processUrl = async (url: string) => {
    // For sample images, we fetch and convert to base64 to simulate a real upload
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Error loading sample image", e);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelected(''); // clear in parent
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isAnalyzing}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-secondary rounded-full group-hover:bg-primary/10 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Upload Food Image</h3>
                <p className="text-muted-foreground text-sm mt-1">Drag & drop or click to browse</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Or try a sample</p>
             <div className="grid grid-cols-3 gap-3">
               {SAMPLE_IMAGES.map((url, idx) => (
                 <button 
                   key={idx}
                   onClick={() => processUrl(url)}
                   disabled={isAnalyzing}
                   className="relative aspect-square rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring"
                 >
                   <img src={url} alt="Sample" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                 </button>
               ))}
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="relative rounded-lg overflow-hidden aspect-video bg-muted group">
             <img src={preview} alt="Analyzed Food" className="w-full h-full object-contain" />
             
             {!isAnalyzing && (
               <button 
                onClick={clearImage}
                className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 border border-border"
               >
                 <X className="w-5 h-5" />
               </button>
             )}

             {isAnalyzing && (
               <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                 <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                 <span className="font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full text-sm">Processing Neural Networks...</span>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};