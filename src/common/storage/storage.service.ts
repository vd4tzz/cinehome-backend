import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { extractPublicId } from "cloudinary-build-url";

@Injectable()
export class StorageService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File) {
    const res = await this.cloudinaryService.uploadFile(file);
    return res.secure_url as string;
  }

  async deleteFile(imageUrl: string) {
    const publicId = extractPublicId(imageUrl);
    await this.cloudinaryService.deleteFile(publicId);
  }
}
