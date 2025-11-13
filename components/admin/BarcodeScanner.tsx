'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import Button from '@/components/ui/Button';
import { FaCamera, FaTimes } from 'react-icons/fa';

interface BarcodeScannerProps {
  onScan: (isbn: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    startScanning();

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError('');

      const codeReader = new BrowserMultiFormatReader();
      readerRef.current = codeReader;

      // Get available video devices
      const videoInputDevices = await codeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        setError('No camera found. Please connect a camera and try again.');
        setIsScanning(false);
        return;
      }

      setCameras(videoInputDevices);

      // Prefer back camera on mobile
      let selectedDeviceId = selectedCamera || videoInputDevices[0].deviceId;
      
      if (!selectedCamera) {
        // Try to find back/rear/environment camera (main camera on phones)
        const backCamera = videoInputDevices.find(device => {
          const label = device.label.toLowerCase();
          return label.includes('back') || 
                 label.includes('rear') ||
                 label.includes('environment') ||
                 label.includes('main');
        });
        
        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
          setSelectedCamera(selectedDeviceId);
          console.log('✅ Using back camera:', backCamera.label);
        } else {
          // Use last camera (often the back camera)
          selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
          setSelectedCamera(selectedDeviceId);
          console.log('📷 Using camera:', videoInputDevices[videoInputDevices.length - 1].label);
        }
      }

      // Start decoding from video device
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const isbn = result.getText();
            // Validate ISBN format (10 or 13 digits)
            if (/^\d{10}(\d{3})?$/.test(isbn.replace(/[-\s]/g, ''))) {
              onScan(isbn);
              stopScanning();
            }
          }

          if (error && !(error instanceof NotFoundException)) {
            console.error('Scanning error:', error);
          }
        }
      );
    } catch (err: any) {
      console.error('Scanner initialization error:', err);
      setError('Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rose/20">
          <div className="flex items-center gap-3">
            <FaCamera className="text-dusty text-2xl" />
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              Scan Book Barcode
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Video Preview */}
        <div className="p-6">
          <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />

            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-gold w-64 h-32 rounded-lg">
                  <div className="absolute inset-0 border-2 border-gold/50 animate-pulse" />
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white bg-black/70 inline-block px-4 py-2 rounded-lg text-sm">
                Position the barcode within the frame
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Camera Selector */}
          {cameras.length > 1 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Select Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => {
                  setSelectedCamera(e.target.value);
                  stopScanning();
                  setTimeout(() => startScanning(), 100);
                }}
                className="input"
              >
                {cameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Help text */}
          <div className="mt-4 text-sm text-charcoal/60 text-center space-y-2">
            <p className="font-medium">
              📱 Point your camera at the ISBN barcode on the back of your book.
            </p>
            <p>
              The scan will happen automatically when the barcode is in focus.
            </p>
            <p className="text-xs text-charcoal/50">
              💡 Make sure there's good lighting and the barcode is flat.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xs text-charcoal/50">
              Having trouble? Try entering the ISBN manually.
            </p>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

