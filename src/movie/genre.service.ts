import { DataSource } from "typeorm";
import { Genre } from "./entity/genre.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenreService {
  constructor(private dataSource: DataSource) {}

  async getGenres() {
    const genres = await this.dataSource.getRepository(Genre).find();

    const dtos = genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
    }));

    return {
      genres: dtos,
    };
  }
}
