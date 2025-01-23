import { Injectable, UploadedFile } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
@Injectable()
export class FirebaseService {
  private firebaseApp: FirebaseApp;
  constructor() {
    const firebaseConfig = {
      apiKey: process.env.APIKEY,
      authDomain: process.env.AUTHDOMAIN,
      projectId: process.env.PROJECTID,
      storageBucket: process.env.STORAGEBUCKET,
      messagingSenderId: process.env.SENDERID,
      appId: process.env.APPID,
    };

    this.firebaseApp = initializeApp(firebaseConfig);
  }

  async uploudFile(@UploadedFile() file): Promise<string> {
    const storage = getStorage(this.firebaseApp);
    const uniqueFileName = `${Date.now()}_${file.originalname}`;
    const storageRef = ref(storage, `uploads/${uniqueFileName}`);
    await uploadBytes(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  async deleteFile(urlImage: string) {
    const storage = getStorage(this.firebaseApp);
    const filePath = await this.getFilePathFromUrl(urlImage);
    const refFile = ref(storage, filePath);
    try {
      await getMetadata(refFile);
      await deleteObject(refFile);
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        console.error('File does not exist.');
      } else {
        console.error('Error deleting file:', error);
      }
    }
  }
  async getFilePathFromUrl(urlImage: string) {
    const baseUrl = process.env.FIREBASE_BASEURL;
    if (!baseUrl) {
      throw new Error('FIREBASE_BASEURL is not defined');
    }

    const parts = urlImage.split(baseUrl)[1]?.split('?')[0];
    if (!parts) {
      throw new Error('Invalid URL format');
    }

    const filePath = decodeURIComponent(parts);

    return filePath;
  }

  getApp(): FirebaseApp {
    return this.firebaseApp;
  }
}
