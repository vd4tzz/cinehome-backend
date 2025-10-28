import { SetMetadata } from "@nestjs/common";

export const CHECK_CINEMA_OWNERSHIP = "CHECK_CINEMA_OWNERSHIP";
export const CinemaOwnership = (enable = true) => SetMetadata(CHECK_CINEMA_OWNERSHIP, enable);
