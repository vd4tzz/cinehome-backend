import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryResponse } from "./cloudinary-response";
import * as streamifier from "streamifier";

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "cinehome" }, (error, result) => {
        if (error) return reject(new Error(error.message));
        resolve(result!);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}
