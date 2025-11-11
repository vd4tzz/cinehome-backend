import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { PageQuery } from "../common/pagination/page-query";
import { AudienceSurcharge } from "./entity/audience-surcharge.entity";
import { GetAudienceSurchargeResponse } from "./dto/get-audience-surcharge-response";
import { DayTypeSurcharge } from "./entity/day-type-surcharge.entity";
import { FormatSurcharge } from "./entity/format-surcharge.entity";
import { SeatTypeSurcharge } from "./entity/seat-type-surcharge.entity";
import { TimeSlotSurcharge } from "./entity/time-slot-surcharge.entity";
import { GetDayTypeSurchargeResponse } from "./dto/get-day-type-surcharge-response";
import { GetFormatSurchargeResponse } from "./dto/get-format-surcharge-response";
import { GetSeatTypeSurchargeResponse } from "./dto/get-seat-type-surcharge-response";
import { GetTimeSlotSurchargeResponse } from "./dto/get-time-slot-surcharge-response";
import { UpdateAudienceSurchargeRequest } from "./dto/update-audience-surcharge-request";
import { UpdateDayTypeSurchargeRequest } from "./dto/update-day-type-surcharge-request";
import { UpdateFormatSurchargeRequest } from "./dto/update-format-surcharge-request";
import { UpdateSeatTypeSurchargeRequest } from "./dto/update-seat-type-surcharge-request";
import { UpdateTimeSlotSurchargeRequest } from "./dto/update-time-slot-surcharge-request";

@Injectable()
export class SurchargeService {
  constructor(private dataSource: DataSource) {}

  async getAudienceSurcharge(cinemaId: number): Promise<GetAudienceSurchargeResponse> {
    const audienceSurchargeRepository = this.dataSource.getRepository(AudienceSurcharge);
    const audienceSurcharges = await audienceSurchargeRepository.find({
      where: { cinemaId: cinemaId },
      relations: {
        audience: true,
      },
    });

    const dtos = audienceSurcharges.map((surcharge) => ({
      cinemaId: surcharge.cinemaId,
      audienceId: surcharge.audienceId,
      audienceType: surcharge.audience.type,
      surcharge: surcharge.surcharge,
    }));

    // return new Page(dtos, pageParam, total);
    return {
      audienceSurcharges: dtos,
    };
  }

  async updateAudienceSurcharge(cinemaId: number, updateAudienceSurchargeRequest: UpdateAudienceSurchargeRequest) {
    await this.dataSource.transaction(async (manager) => {
      const audienceSurchargeRepository = manager.getRepository(AudienceSurcharge);
      const { audienceSurcharges } = updateAudienceSurchargeRequest;

      // ensure all belong to the same cinema
      const allSameCinema = audienceSurcharges.every((dto) => dto.cinemaId === cinemaId);
      if (!allSameCinema) {
        throw new BadRequestException();
      }

      // avoid duplicate audienceId
      const uniqueIds = new Set<number>();
      for (const dto of audienceSurcharges) {
        if (uniqueIds.has(dto.audienceId)) {
          throw new BadRequestException("duplicate audienceId");
        }
        uniqueIds.add(dto.audienceId);
      }

      const audienceIds: number[] = [...uniqueIds];
      const existingEntities = await audienceSurchargeRepository.findBy({
        cinemaId,
        audienceId: In(audienceIds),
      });

      if (existingEntities.length !== audienceIds.length) {
        throw new NotFoundException();
      }

      // build a lookup map: audienceId → existing entity
      const existingMap = new Map(existingEntities.map((e) => [e.audienceId, e]));

      // iterate through all surcharge DTOs, find the corresponding entity in existingMap by audienceId,
      // update its surcharge value, and collect all updated entities
      const updatedEntities: AudienceSurcharge[] = [];
      for (const dto of audienceSurcharges) {
        const entity = existingMap.get(dto.audienceId);
        if (!entity) {
          throw new InternalServerErrorException();
        }

        entity.surcharge = dto.surcharge;
        updatedEntities.push(entity);
      }

      await audienceSurchargeRepository.save(updatedEntities);
    });

    return this.getAudienceSurcharge(cinemaId);
  }

  async getDayTypeSurcharge(cinemaId: number): Promise<GetDayTypeSurchargeResponse> {
    const dayTypeSurchargeRepository = this.dataSource.getRepository(DayTypeSurcharge);
    const dayTypeSurcharges = await dayTypeSurchargeRepository.find({
      where: { cinemaId: cinemaId },
      relations: {
        dayType: true,
      },
    });

    const dtos = dayTypeSurcharges.map((surcharge) => ({
      cinemaId: surcharge.cinemaId,
      dayTypeId: surcharge.dayTypeId,
      dayTypeCode: surcharge.dayType.code,
      surcharge: surcharge.surcharge,
    }));

    return {
      dayTypeSurcharges: dtos,
    };
  }

  async updateDayTypeSurcharge(cinemaId: number, updateDayTypeSurchargeRequest: UpdateDayTypeSurchargeRequest) {
    await this.dataSource.transaction(async (manager) => {
      const dayTypeSurchargeRepository = manager.getRepository(DayTypeSurcharge);
      const { dayTypeSurcharges } = updateDayTypeSurchargeRequest;

      // ensure all belong to same cinema
      const allSameCinema = dayTypeSurcharges.every((dto) => dto.cinemaId === cinemaId);
      if (!allSameCinema) {
        throw new BadRequestException();
      }

      // avoid duplicate dayTypeId
      const uniqueIds = new Set<number>();
      for (const dto of dayTypeSurcharges) {
        if (uniqueIds.has(dto.dayTypeId)) {
          throw new BadRequestException("duplicate dayTypeId");
        }
        uniqueIds.add(dto.dayTypeId);
      }

      const dayTypeIds: number[] = [...uniqueIds];
      const existingEntities = await dayTypeSurchargeRepository.findBy({
        cinemaId,
        dayTypeId: In(dayTypeIds),
      });

      if (existingEntities.length !== dayTypeIds.length) {
        throw new NotFoundException();
      }

      // build a lookup map: dayTypeId → existing entity
      const existingMap = new Map(existingEntities.map((e) => [e.dayTypeId, e]));

      // iterate through all surcharge DTOs, find the corresponding entity in existingMap by dayTypeId,
      // update its surcharge value, and collect all updated entities
      const updatedEntities: DayTypeSurcharge[] = [];
      for (const dto of dayTypeSurcharges) {
        const entity = existingMap.get(dto.dayTypeId);
        if (!entity) {
          throw new InternalServerErrorException();
        }

        entity.surcharge = dto.surcharge;
        updatedEntities.push(entity);
      }

      await dayTypeSurchargeRepository.save(updatedEntities);
    });

    return this.getDayTypeSurcharge(cinemaId);
  }

  async getFormatSurcharge(cinemaId: number): Promise<GetFormatSurchargeResponse> {
    const formatSurchargeRepository = this.dataSource.getRepository(FormatSurcharge);
    const formatSurcharges = await formatSurchargeRepository.find({
      where: { cinemaId: cinemaId },
      relations: {
        format: true,
      },
    });

    const dtos = formatSurcharges.map((formatSurcharge) => ({
      cinemaId: formatSurcharge.cinemaId,
      formatId: formatSurcharge.formatId,
      formatCode: formatSurcharge.format.code,
      surcharge: formatSurcharge.surcharge,
    }));

    return {
      formatSurcharges: dtos,
    };
  }

  async updateFormatSurcharge(cinemaId: number, updateFormatSurchargeRequest: UpdateFormatSurchargeRequest) {
    await this.dataSource.transaction(async (manager) => {
      const formatSurchargeRepository = manager.getRepository(FormatSurcharge);
      const { formatSurcharges } = updateFormatSurchargeRequest;

      // ensure all belong to same cinema
      const allSameCinema = formatSurcharges.every((dto) => dto.cinemaId === cinemaId);
      if (!allSameCinema) {
        throw new BadRequestException();
      }

      // avoid duplicate formatId
      const uniqueIds = new Set<number>();
      for (const dto of formatSurcharges) {
        if (uniqueIds.has(dto.formatId)) {
          throw new BadRequestException("duplicate formatId");
        }
        uniqueIds.add(dto.formatId);
      }

      const formatIds: number[] = [...uniqueIds];
      const existingEntities = await formatSurchargeRepository.findBy({
        cinemaId,
        formatId: In(formatIds),
      });

      if (existingEntities.length !== formatIds.length) {
        throw new NotFoundException();
      }

      // build a lookup map: formatId → existing entity
      const existingMap = new Map(existingEntities.map((e) => [e.formatId, e]));

      // iterate through all surcharge DTOs, find the corresponding entity in existingMap by formatId,
      // update its surcharge value, and collect all updated entities
      const updatedEntities: FormatSurcharge[] = [];
      for (const dto of formatSurcharges) {
        const entity = existingMap.get(dto.formatId);
        if (!entity) {
          throw new InternalServerErrorException();
        }

        entity.surcharge = dto.surcharge;
        updatedEntities.push(entity);
      }

      await formatSurchargeRepository.save(updatedEntities);
    });

    return this.getFormatSurcharge(cinemaId);
  }

  async getSeatTypeSurcharge(cinemaId: number): Promise<GetSeatTypeSurchargeResponse> {
    const seatTypeSurchargeRepository = this.dataSource.getRepository(SeatTypeSurcharge);
    const seatTypeSurcharges = await seatTypeSurchargeRepository.find({
      where: { cinemaId: cinemaId },
      relations: {
        seatType: true,
      },
    });

    const dtos = seatTypeSurcharges.map((seatTypeSurcharge) => ({
      cinemaId: seatTypeSurcharge.cinemaId,
      seatTypeId: seatTypeSurcharge.seatTypeId,
      seatTypeCode: seatTypeSurcharge.seatType.code,
      surcharge: seatTypeSurcharge.surcharge,
    }));

    return {
      seatTypeSurcharges: dtos,
    };
  }

  async updateSeatTypeSurcharge(cinemaId: number, updateSeatTypeSurchargeRequest: UpdateSeatTypeSurchargeRequest) {
    await this.dataSource.transaction(async (manager) => {
      const seatTypeSurchargeRepository = manager.getRepository(SeatTypeSurcharge);
      const { seatTypeSurcharges } = updateSeatTypeSurchargeRequest;

      // ensure all belong to same cinema
      const allSameCinema = seatTypeSurcharges.every((dto) => dto.cinemaId === cinemaId);
      if (!allSameCinema) {
        throw new BadRequestException();
      }

      // avoid duplicate seatTypeId
      const uniqueIds = new Set<number>();
      for (const dto of seatTypeSurcharges) {
        if (uniqueIds.has(dto.seatTypeId)) {
          throw new BadRequestException("duplicate seatTypeId");
        }
        uniqueIds.add(dto.seatTypeId);
      }

      const seatTypeIds: number[] = [...uniqueIds];
      const existingEntities = await seatTypeSurchargeRepository.findBy({
        cinemaId,
        seatTypeId: In(seatTypeIds),
      });

      if (existingEntities.length !== seatTypeIds.length) {
        throw new NotFoundException();
      }

      // build a lookup map: seatTypeId → existing entity
      const existingMap = new Map(existingEntities.map((e) => [e.seatTypeId, e]));

      // iterate through all surcharge DTOs, find the corresponding entity in existingMap by seatTypeId,
      // update its surcharge value, and collect all updated entities
      const updatedEntities: SeatTypeSurcharge[] = [];
      for (const dto of seatTypeSurcharges) {
        const entity = existingMap.get(dto.seatTypeId);
        if (!entity) {
          throw new InternalServerErrorException();
        }

        entity.surcharge = dto.surcharge;
        updatedEntities.push(entity);
      }

      await seatTypeSurchargeRepository.save(updatedEntities);
    });

    return this.getSeatTypeSurcharge(cinemaId);
  }

  async getTimeSlotSurcharge(cinemaId: number): Promise<GetTimeSlotSurchargeResponse> {
    const timeSlotSurchargeRepository = this.dataSource.getRepository(TimeSlotSurcharge);

    const timeSlotSurcharges = await timeSlotSurchargeRepository.find({
      where: { cinemaId },
      relations: {
        timeSlot: true,
      },
    });

    const dtos = timeSlotSurcharges.map((timeSlotSurcharge) => ({
      cinemaId: timeSlotSurcharge.cinemaId,
      timeSlotId: timeSlotSurcharge.timeSlotId,
      startTime: timeSlotSurcharge.timeSlot.startTime,
      endTime: timeSlotSurcharge.timeSlot.endTime,
      surcharge: timeSlotSurcharge.surcharge,
    }));

    return {
      timeSlotSurcharges: dtos,
    };
  }

  async updateTimeSlotSurcharge(cinemaId: number, updateTimeSlotSurchargeRequest: UpdateTimeSlotSurchargeRequest) {
    await this.dataSource.transaction(async (manager) => {
      const timeSlotSurchargeRepository = manager.getRepository(TimeSlotSurcharge);
      const { timeSlotSurcharges } = updateTimeSlotSurchargeRequest;

      // ensure all belong to same cinema
      const allSameCinema = timeSlotSurcharges.every((dto) => dto.cinemaId === cinemaId);
      if (!allSameCinema) {
        throw new BadRequestException();
      }

      // avoid duplicate timeSlotId
      const uniqueIds = new Set<number>();
      for (const dto of timeSlotSurcharges) {
        if (uniqueIds.has(dto.timeSlotId)) {
          throw new BadRequestException("duplicate timeSlotId");
        }
        uniqueIds.add(dto.timeSlotId);
      }

      const timeSlotIds: number[] = [...uniqueIds];
      const existingEntities = await timeSlotSurchargeRepository.findBy({
        cinemaId,
        timeSlotId: In(timeSlotIds),
      });

      if (existingEntities.length !== timeSlotIds.length) {
        throw new NotFoundException();
      }

      // build a lookup map: timeSlotId → existing entity
      const existingMap = new Map(existingEntities.map((e) => [e.timeSlotId, e]));

      // iterate through all surcharge DTOs, find the corresponding entity in existingMap by timeSlotId,
      // update its surcharge value, and collect all updated entities
      const updatedEntities: TimeSlotSurcharge[] = [];
      for (const dto of timeSlotSurcharges) {
        const entity = existingMap.get(dto.timeSlotId);
        if (!entity) {
          throw new InternalServerErrorException();
        }

        entity.surcharge = dto.surcharge;
        updatedEntities.push(entity);
      }

      await timeSlotSurchargeRepository.save(updatedEntities);
    });

    return this.getTimeSlotSurcharge(cinemaId);
  }
}
