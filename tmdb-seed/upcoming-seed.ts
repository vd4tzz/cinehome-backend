/* eslint-disable */

import "reflect-metadata";
import { In } from "typeorm";
import { Movie, MovieState } from "../src/movie/entity/movie.entity";
import AppDataSource from "./data-source";
import { Genre } from "../src/movie/entity/genre.entity";
import path from "path";
import fs from "fs/promises";

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzIyMmRmZDZmM2M5NTdkOGE2YWZjNDMxYmI3MjBjZSIsIm5iZiI6MTc1OTEzMDkxOC4wODA5OTk5LCJzdWIiOiI2OGRhMzUyNjA2ZGM4MDdmNThlMWM5Y2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vmBAmHK0Iq1MCkZ_OUE7Tojsqr3MIV9FifnlTrs04FY";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
};

async function fetchNowPlayingMovies() {
  const res = await fetch(
    "https://api.themoviedb.org/3/movie/upcoming?language=vi-VN&page=1&region=VN",
    options
  );
  const data = await res.json();

  const movies = await Promise.all(
    data.results.map(async (film: any) => {
      // Lấy credits (đạo diễn + diễn viên)
      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${film.id}/credits?language=vi-VN`,
        options
      );
      const creditsData = await creditsRes.json();

      // Lấy chi tiết phim để có runtime (thời lượng)
      const detailRes = await fetch(
        `https://api.themoviedb.org/3/movie/${film.id}?language=vi-VN`,
        options
      );
      const detailData = await detailRes.json();

      const directorObj = creditsData.crew.find((c: any) => c.job === "Director");
      const topActors = creditsData.cast.slice(0, 5).map((c: any) => c.name);

      return {
        originalTitle: film.original_title,
        vietnameseTitle: film.title,
        overview: film.overview,
        releaseDate: film.release_date,
        duration: detailData.runtime ?? null, // ✅ thời lượng thật
        posterUrl: film.poster_path
          ? "https://image.tmdb.org/t/p/original" + film.poster_path
          : null,
        backdropUrl: film.backdrop_path
          ? "https://image.tmdb.org/t/p/original" + film.backdrop_path
          : null,
        director: directorObj ? directorObj.name : "",
        actors: topActors,
        country: detailData.origin_country.join(","),
        genreIds: film.genre_ids,
      };
    })
  );

  return movies;
}


const MOVIE_FILE_PATH = path.resolve(__dirname, "upcoming.json");

async function getMoviesForSeeding(fetchNowPlayingMovies: () => Promise<any[]>) {
  const today = new Date().toISOString().split("T")[0];

  // Thử đọc file
  try {
    const content = await fs.readFile(MOVIE_FILE_PATH, "utf-8");
    const fileData = JSON.parse(content);

    if (fileData.date === today && Array.isArray(fileData.movies)) {
      console.log("📂 Loading movies from file...");
      return fileData.movies;
    }
  } catch (err) {
    // File chưa tồn tại hoặc lỗi parse, bỏ qua
  }

  // Nếu không có file hoặc ngày khác hôm nay, fetch API
  console.log("🌐 Fetching movies from TMDb...");
  const movies = await fetchNowPlayingMovies();

  // Ghi file kèm ngày hôm nay
  await fs.writeFile(
    MOVIE_FILE_PATH,
    JSON.stringify({ date: today, movies }, null, 2),
    "utf-8"
  );
  console.log(`✅ Movies saved to file (${MOVIE_FILE_PATH})`);

  return movies;
}

async function seedMovies() {
  await AppDataSource.initialize();
  const movieRepository = AppDataSource.getRepository(Movie);
  const genreRepository = AppDataSource.getRepository(Genre);

  const movies = await getMoviesForSeeding(fetchNowPlayingMovies);

  for (const m of movies) {
    const genres = await genreRepository.findBy({ id: In(m.genreIds) });

    const movie = movieRepository.create({
      vietnameseTitle: m.vietnameseTitle,
      originalTitle: m.originalTitle,
      releaseDate: m.releaseDate,
      overview: m.overview,
      duration: m.duration,
      posterUrl: m.posterUrl,
      backdropUrl: m.backdropUrl,
      director: m.director,
      actors: m.actors,
      country: m.country,
      genres,
      state: MovieState.PUBLISHED,
    });

    await movieRepository.save(movie);
    console.log(`✅ Saved: ${movie.vietnameseTitle}`);
  }

  console.log("🎉 Done seeding movies from TMDb!");
  await AppDataSource.destroy();
}

seedMovies().catch((err) => {
  console.error("❌ Seed failed:", err);
  AppDataSource.destroy();
});
