import { Controller, Get } from "@nestjs/common";
import { GenreService } from "./genre.service";

@Controller("api/genres")
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  async getGenres() {
    return this.genreService.getGenres();
  }
}
