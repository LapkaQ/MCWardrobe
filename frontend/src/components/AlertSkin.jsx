import { useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as skinview3d from "skinview3d";

const AlertSkin = ({ open, setOpen, skinUrl, result, handleDownload }) => {
  const alertCanvasRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!open || !skinUrl || !result?.image) return;

    const initializeViewer = () => {
      if (!alertCanvasRef.current) return;

      if (viewerRef.current) {
        viewerRef.current.dispose();
      }

      const viewer = new skinview3d.SkinViewer({
        canvas: alertCanvasRef.current,
        width: 200,
        height: 200,
        skin: `data:image/png;base64,${result.image}`,
      });

      viewer.autoRotate = true;
      viewer.zoom = 0.9;
      viewer.animation = new skinview3d.WalkingAnimation();
      viewer.playAnimation();

      viewerRef.current = viewer;
    };

    const timeoutId = setTimeout(initializeViewer, 50);

    return () => {
      clearTimeout(timeoutId);
      if (viewerRef.current) {
        viewerRef.current.dispose();
      }
    };
  }, [open, skinUrl, result?.image]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Success!</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="grid grid-cols-2">
          {result && (
            <>
              <div className="flex justify-center items-center">
                <img
                  src={`data:image/png;base64,${result.image}`}
                  className="w-full pixelated sm:w-full md:w-3/4 lg:w-3/4 xl:w-3/4 object-cover rounded mt-4"
                />
              </div>
              <div className="flex justify-center items-center">
                <canvas
                  ref={alertCanvasRef}
                  key={open}
                  className="w-full pixelated sm:w-full md:w-3/4 lg:w-3/4 xl:w-3/4 object-cover rounded mt-4"
                />
              </div>
            </>
          )}
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              handleDownload(result);
            }}
          >
            Download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertSkin;
