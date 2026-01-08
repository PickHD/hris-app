import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  MapPin,
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useClock } from "@/features/attendance/hooks/useAttendance";

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "check-in" | "check-out";
}

export function AttendanceDialog({
  open,
  onOpenChange,
  type,
}: AttendanceDialogProps) {
  const webcamRef = useRef<Webcam>(null);
  const [step, setStep] = useState<"scan" | "preview">("scan");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: clock, isPending } = useClock();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      setStep("preview");
      getLocation();
    }
  }, [webcamRef]);

  const getLocation = () => {
    setIsLoading(true);
    setErrorMsg(null);

    const options = {
      enableHighAccuracy: true, // Paksa gunakan GPS hardware jika ada
      timeout: 20000, // Beri waktu lebih lama (20 detik) untuk lock satelit
      maximumAge: 0, // PENTING: Jangan gunakan cache sama sekali (0ms)
    };

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = position.coords.accuracy;
        console.log("Location Accuracy:", accuracy, "meters");

        if (accuracy > 200) {
          toast.warning("Sinyal GPS lemah", {
            description: `Akurasi sekitar ${Math.round(
              accuracy
            )} meter. Sebaiknya cari area terbuka.`,
          });
        }

        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
        toast.success("Location acquired!");
      },
      (error) => {
        setIsLoading(false);
        let msg = "Unable to retrieve your location";
        if (error.code === 1)
          msg = "Location permission denied. Please enable GPS.";
        setErrorMsg(msg);
        toast.error("Location Error", { description: msg });
      },
      options
    );
  };

  const retake = () => {
    setImgSrc(null);
    setStep("scan");
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!imgSrc || !location) return;

    setIsLoading(true);
    try {
      clock(
        {
          latitude: location.lat,
          longitude: location.lng,
          image_base64: imgSrc,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            setImgSrc(null);
            setStep("scan");
          },
        }
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || "Attendance Failed";
      toast.error("Failed to submit attendance", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    type === "check-in" ? "Clock In Attendance" : "Clock Out Attendance";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please ensure your face is visible and location is enabled.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg overflow-hidden border-2 border-slate-200 shadow-inner">
            {step === "scan" ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
                onUserMediaError={() => setErrorMsg("Camera permission denied")}
              />
            ) : (
              <img
                src={imgSrc!}
                alt="Attendance Preview"
                className="w-full h-full object-cover"
              />
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                <RefreshCw className="animate-spin h-8 w-8" />
              </div>
            )}
          </div>

          {errorMsg && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {location && step === "preview" && !errorMsg && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                Location Locked: {location.lat.toFixed(6)},{" "}
                {location.lng.toFixed(6)}
              </span>
            </div>
          )}

          <div className="flex gap-3 w-full mt-2">
            {step === "scan" ? (
              <Button onClick={capture} className="w-full" size="lg">
                <Camera className="mr-2 h-4 w-4" /> Capture Photo
              </Button>
            ) : (
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  onClick={retake}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Retake
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending || !location}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm{" "}
                      {type === "check-in" ? "In" : "Out"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
