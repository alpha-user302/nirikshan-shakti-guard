import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendN8NAlert } from '@/utils/n8nAlert';
import { supabase } from '@/integrations/supabase/client';

export function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [violationDetected, setViolationDetected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string>('');

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const analyzeFrame = async () => {
    if (isAnalyzing) return;
    
    const frame = captureFrame();
    if (!frame) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('detect-ppe', {
        body: { imageBase64: frame }
      });

      if (error) throw error;

      console.log('AI Analysis Result:', data);
      setLastAnalysis(JSON.stringify(data, null, 2));

      if (data.overall_compliance === 'violations_detected' && data.violations?.length > 0) {
        setViolationDetected(true);
        
        // Store violations in database
        for (const violation of data.violations) {
          const missingPPE = violation.missing_ppe.join(', ');
          
          const { error: insertError } = await supabase
            .from('violations')
            .insert({
              worker_name: violation.worker_description || 'Unknown Worker',
              violation_type: 'ppe_violation',
              missing_ppe: missingPPE,
              location: 'Devbhoomi University Construction Site',
              camera_zone: 'Zone A',
              severity: violation.missing_ppe.length > 2 ? 'high' : 'medium',
              salary_deduction: 500,
              holiday_deduction: 0.5
            });

          if (insertError) {
            console.error('Error storing violation:', insertError);
          }

          // Send N8N alert
          sendN8NAlert(violation.worker_description || 'Unknown Worker', missingPPE);
        }

        toast.error(`PPE Violations Detected!`, {
          description: `${data.violations.length} worker(s) missing required PPE`,
          duration: 5000,
        });
      } else if (data.overall_compliance === 'compliant') {
        setViolationDetected(false);
        toast.success('All workers compliant with PPE requirements');
      }

    } catch (error) {
      console.error('Error analyzing frame:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
        setViolationDetected(false);
        toast.success('AI-powered PPE detection started');
        
        // Start periodic AI analysis every 10 seconds
        detectionIntervalRef.current = window.setInterval(() => {
          analyzeFrame();
        }, 10000);

        // Run first analysis after 3 seconds
        setTimeout(() => {
          analyzeFrame();
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setIsStreaming(false);
      setViolationDetected(false);
      toast.info('Camera stopped');
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [stream]);

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Live Camera Feed - Zone A
        </CardTitle>
        <div className="flex gap-2">
          {!isStreaming ? (
            <Button onClick={startCamera} size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} size="sm" variant="destructive" className="gap-2">
              <VideoOff className="h-4 w-4" />
              Stop Camera
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <VideoOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">AI PPE Detection Ready</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Start Camera" to begin real-time AI monitoring
                  </p>
                </div>
              </div>
            )}
            {isStreaming && (
              <>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE AI DETECTION
                  </div>
                  {isAnalyzing && (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Analyzing...
                    </div>
                  )}
                </div>
                {violationDetected && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-sm font-medium animate-pulse border-2 border-white">
                    ⚠️ PPE VIOLATION DETECTED
                  </div>
                )}
              </>
            )}
          </div>
          
          {lastAnalysis && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Last AI Analysis:</p>
              <pre className="text-xs overflow-auto max-h-32">{lastAnalysis}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
