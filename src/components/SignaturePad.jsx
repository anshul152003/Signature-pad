import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = () => {
  const sigRef = useRef();
  const [penColor, setPenColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(1);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [imageURL, setImageURL] = useState('');

  // Whenever bgColor changes, clear canvas and fill background
  useEffect(() => {
    if (!sigRef.current) return;
    const canvas = sigRef.current.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw existing signature if any
    const data = sigRef.current.toData();
    if (data) sigRef.current.fromData(data);
  }, [bgColor]);

  const clear = () => {
    sigRef.current.clear();
    // Fill background after clearing
    const canvas = sigRef.current.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setImageURL('');
  };

  const save = () => {
    const dataURL = sigRef.current.toDataURL();
    setImageURL(dataURL);
    localStorage.setItem('savedSignature', dataURL);

    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = dataURL;
    link.click();
  };

  const retrieve = () => {
    const saved = localStorage.getItem('savedSignature');
    if (saved) {
      setImageURL(saved);
      const img = new Image();
      img.onload = () => {
        const canvas = sigRef.current.getCanvas();
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = saved;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-gray-50 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Signature Pad</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 mb-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="penColor">Pen Color</label>
          <input
            id="penColor"
            type="color"
            value={penColor}
            onChange={e => {
              setPenColor(e.target.value);
              sigRef.current.penColor = e.target.value;
            }}
            className="w-16 h-10 cursor-pointer"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="lineWidth">Line Width</label>
          <select
            id="lineWidth"
            value={lineWidth}
            onChange={e => {
              const width = parseInt(e.target.value, 10);
              setLineWidth(width);
              sigRef.current.minWidth = width;
              sigRef.current.maxWidth = width;
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {[1, 3, 5, 10, 15, 20, 30].map(w => (
              <option key={w} value={w}>{w}px</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="bgColor">Background Color</label>
          <input
            id="bgColor"
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="w-16 h-10 cursor-pointer"
          />
        </div>
      </div>

      {/* Signature canvas */}
      <SignatureCanvas
        ref={sigRef}
        penColor={penColor}
        minWidth={lineWidth}
        maxWidth={lineWidth}
        canvasProps={{
          width: 800,
          height: 300,
          className: "border border-gray-400 rounded-md bg-white"
        }}
      />

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={clear}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Clear
        </button>
        <button
          onClick={save}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Save & Download
        </button>
        <button
          onClick={retrieve}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Retrieve
        </button>
      </div>

      {/* Display saved image */}
      {imageURL && (
        <div className="mt-6">
          <p className="font-semibold mb-2">Saved Signature Preview:</p>
          <img
            src={imageURL}
            alt="Saved signature"
            className="border border-gray-300 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
