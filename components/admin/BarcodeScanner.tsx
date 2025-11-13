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

      // Use the first available camera (usually back camera on mobile)
      const selectedDeviceId = videoInputDevices[0].deviceId;

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

          {/* Help text */}
          <div className="mt-4 text-sm text-charcoal/60 text-center">
            <p>
              Point your camera at the ISBN barcode on the back of your book.
              The scan will happen automatically.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

