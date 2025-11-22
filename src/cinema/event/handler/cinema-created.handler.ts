import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CinemaCreatedEvent } from "../cinema-created.event";
import { DataSource } from "typeorm";
import { AudienceSurcharge } from "../../entity/audience-surcharge.entity";
import { Audience } from "../../entity/audience.entity";
import { DayOfWeekType } from "../../entity/day-of-week-type.entity";
import { DayOfWeekTypeSurcharge } from "../../entity/day-of-week-type-surcharge.entity";
import { Format } from "../../entity/format.entity";
import { FormatSurcharge } from "../../entity/format-surcharge.entity";
import { TimeSlot } from "../../entity/time-slot.entity";
import { TimeSlotSurcharge } from "../../entity/time-slot-surcharge.entity";
import { SeatType } from "../../entity/seat-type.entity";
import { SeatTypeSurcharge } from "../../entity/seat-type-surcharge.entity";

@Injectable()
export class CinemaCreatedHandler {
  constructor(private dataSource: DataSource) {}

  @OnEvent("cinema.created")
  async handleCinemaCreated(event: CinemaCreatedEvent) {
    const { cinemaId } = event;

    return this.dataSource.transaction(async (manager) => {
      const [
        audienceRepo,
        audienceSurchargeRepo,
        dayTypeRepo,
        dayTypeSurchargeRepo,
        formatRepo,
        formatSurchargeRepo,
        timeSlotRepo,
        timeSlotSurchargeRepo,
        seatTypeRepo,
        seatTypeSurchargeRepo,
      ] = [
        manager.getRepository(Audience),
        manager.getRepository(AudienceSurcharge),
        manager.getRepository(DayOfWeekType),
        manager.getRepository(DayOfWeekTypeSurcharge),
        manager.getRepository(Format),
        manager.getRepository(FormatSurcharge),
        manager.getRepository(TimeSlot),
        manager.getRepository(TimeSlotSurcharge),
        manager.getRepository(SeatType),
        manager.getRepository(SeatTypeSurcharge),
      ];

      const [audiences, dayTypes, formats, timeSlots, seatTypes] = await Promise.all([
        audienceRepo.find(),
        dayTypeRepo.find(),
        formatRepo.find(),
        timeSlotRepo.find(),
        seatTypeRepo.find(),
      ]);

      const defaultSurcharge = "-1";

      const audienceSurcharges = audiences.map((a) => ({
        cinemaId,
        audienceId: a.id,
        surcharge: defaultSurcharge,
      }));

      const dayTypeSurcharges = dayTypes.map((d) => ({
        cinemaId,
        dayTypeId: d.id,
        surcharge: defaultSurcharge,
      }));

      const formatSurcharges = formats.map((f) => ({
        cinemaId,
        formatId: f.id,
        surcharge: defaultSurcharge,
      }));

      const timeSlotSurcharges = timeSlots.map((t) => ({
        cinemaId,
        timeSlotId: t.id,
        surcharge: defaultSurcharge,
      }));

      const seatTypeSurcharges = seatTypes.map((s) => ({
        cinemaId,
        seatTypeId: s.id,
        surcharge: defaultSurcharge,
      }));

      await Promise.all([
        audienceSurchargeRepo.insert(audienceSurcharges),
        dayTypeSurchargeRepo.insert(dayTypeSurcharges),
        formatSurchargeRepo.insert(formatSurcharges),
        timeSlotSurchargeRepo.insert(timeSlotSurcharges),
        seatTypeSurchargeRepo.insert(seatTypeSurcharges),
      ]);
    });
  }
}
