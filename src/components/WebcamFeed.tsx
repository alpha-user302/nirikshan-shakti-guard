import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { sendN8NAlert } from '@/utils/n8nAlert';

export function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [violationDetected, setViolationDetected] = useState(false);

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
        toast.success('Camera started successfully');
        
        // Simulate AI detection after 2-3 seconds
        setTimeout(() => {
          detectViolation();
        }, 2500);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const detectViolation = () => {
    const violation = {
      worker: 'Unknown',
      missingPPE: 'Helmet & Chest Guard',
      timestamp: new Date().toISOString()
    };

    // Store violation in localStorage for AI Monitoring
    const existingViolations = JSON.parse(localStorage.getItem('camera_violations') || '[]');
    existingViolations.push(violation);
    localStorage.setItem('camera_violations', JSON.stringify(existingViolations));

    // Send N8N alert
    sendN8NAlert(violation.worker, violation.missingPPE);

    // Show toast notification
    toast.error(`PPE Violation Detected: ${violation.missingPPE} not wearing`, {
      description: `Worker: ${violation.worker}`,
      duration: 5000,
    });

    setViolationDetected(true);
  };

  const stopCamera = () => {
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
        <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center">
                <VideoOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Camera not started</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Start Camera" to begin live monitoring
                </p>
              </div>
            </div>
          )}
          {isStreaming && (
            <>
              <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
              {violationDetected && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-sm font-medium animate-pulse border-2 border-white">
                  ⚠️ PPE VIOLATION DETECTED
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
