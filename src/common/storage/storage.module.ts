import { Module } from "@nestjs/common";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { StorageService } from "./storage.service";

@Module({
  imports: [CloudinaryModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
