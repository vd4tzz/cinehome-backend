import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieImagesRequest {
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
    required: false,
    description: "",
  })
  poster?: Express.Multer.File[];

  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
    required: false,
    description: "",
  })
  backdrop?: Express.Multer.File[];
}
