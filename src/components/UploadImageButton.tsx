import React, { useState, ChangeEvent, DragEvent } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWalletAddress } from 'bitcoin-wallet-adapter';
import { v4 as uuidv4 } from "uuid";
import { processInscriptions, generatePrivateKey } from '@/app/api/upload/route';



const UploadImageButton: React.FC = () => {
  const walletDetails = useWalletAddress();
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ name: string; size: number; type: string ; dataURL: string} | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('pending');
  const [orderId, setOrderId] = useState<string | null>(null); 
  const [feeRate, setFeeRate] = useState<number>(0); // State for fee rate input

  const handleFeeRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFeeRate(Number(event.target.value));
  };

  
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds the limit of 2MB');
      return;
    }
    setImageFile(URL.createObjectURL(file));
    setImageInfo({ 
      name: file.name, 
      size: file.size, 
      type: file.type,
      dataURL: URL.createObjectURL(file)
    });
    convertToBase64(file); // Convert the file to base64 here
  };
  
  
  const convertToBase64 = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setBase64Image(fileReader.result as string); // Set the base64Image state after the file is converted
    };
  };
  

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds the limit of 2MB');
      return;
    }
    setImageFile(URL.createObjectURL(file));
    setImageInfo({ name: file.name, size: file.size, type: file.type , dataURL: file.type});
    convertToBase64(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImageInfo(null);
    setBase64Image(null);
  };



  const handleUploadImage = async () => {
    
    if (!base64Image) {
      alert('Please select an image first');
      return;
    }
  
    if (!imageInfo || !imageInfo.size) {
      alert('Image size information is missing');
      return;
    }
     if (!feeRate || isNaN(feeRate)) {
    alert('Please enter a valid fee rate');
    return;
  }
  
    try {
      const orderId = uuidv4();
      setOrderId(orderId);
  
      const processInscriptionsData = await processInscriptions(orderId, imageInfo, feeRate); // Update this line
  
      const dataToSave = {
        ...processInscriptionsData,
      };
  
      console.log(dataToSave);
  
      const body = {
        wallet: walletDetails?.wallet,
        dataURI: base64Image,
        orderId: orderId,
        file_type: imageInfo.type,
        cardinal_address: walletDetails?.cardinal_address,
        ordinal_address: walletDetails?.ordinal_address,
        cardinal_pubkey: walletDetails?.cardinal_pubkey,
        status: status,
        leaf: processInscriptionsData.leaf,
        tap_key: processInscriptionsData.tapkey,
        cblock: processInscriptionsData.cblock,
        inscription_address: processInscriptionsData.inscription_address,
        inscription_fee: processInscriptionsData.inscription_fee,
        fee_rate: feeRate
      };
  
      console.log(body);
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      console.log(data);
  
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };
  
  return walletDetails ? (
    <div className="flex flex-col items-center mt-8 mb-4">
      <div
        className="bg-black border border-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center"
        style={{ width: '500px', height: '500px' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!imageFile && (
          <div className="text-white flex flex-col items-center">
            <CloudUploadIcon fontSize="large" className="mb-4" />
          </div>
        )}
        {imageFile && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={imageFile}
              alt="Uploaded"
              className="max-w-full max-h-[400px] object-contain"
            />
            {imageInfo && (
              <div className="mt-2 text-white flex items-center">
                <p>
                  Name: {imageInfo.name} | Size:{' '}
                  {(imageInfo.size / 1024 / 1024).toFixed(2)} MB | Type:{' '}
                  {imageInfo.type}
                </p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                  onClick={handleDeleteImage}
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center mt-4">
        <label className="bg-gray-700 text-white py-2 px-4 rounded-lg cursor-pointer border border-purple-400">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          Choose File
        </label>
        <input
          type="number"
          value={feeRate}
          onChange={handleFeeRateChange}
          placeholder="Enter fee rate"
          className="bg-gray-700 text-white py-2 px-4 rounded-lg ml-4 border border-purple-400"
        />
        <button
          className="bg-purple-600 text-white py-2 px-4 rounded-lg ml-4"
          onClick={handleUploadImage}
        >
          Upload Image
        </button>
      </div>
    </div>
  ) : null;
};

export default UploadImageButton;
