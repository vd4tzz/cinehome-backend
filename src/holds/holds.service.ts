//kiểm tra trùng
import { from } from "rxjs";
import{Injectable, BadRequestException, ConflictException} from'@nestjs/common';
import{InjectRepository } from'@nestjs/typeorm';
import{ Repository, DataSource} from 'typeorm';
import{ ShowSeat} from'../shows/entities/show-seat.entity';
import{v4 as uuidv4} from 'uuid';
import type{ Cache} from 'cache-manager';
import{ Inject} from'@nestjs/common';

@Injectable()
export class HoldsService{
    private HOLD_TTL_SEC = 5 * 60; //5 phút

    constructor(
        @InjectRepository(ShowSeat) private readonly showSeatRepo: Repository<ShowSeat>,
        private readonly dataSource: DataSource,
        @Inject('CACHE_MANAGER') private cache: Cache,
    ) {}

    async createHold(showId: string, seatIds: string[], idempotencyKey: string) {
        const existing = await this.cache.get<string>(`idem:hold:${idempotencyKey}`);
        if(existing){
            //idempotent return
            const hold = await this.cache.get(`hold:${existing}`);
            if(hold) return hold;
        }

        //Verify seats are available
        const seats = await this.showSeatRepo.find({
            where: seatIds.map((sid) => ({ show: { id: showId }, seat: {id: sid} })),
            relations: ['show', 'seat'],
            lock: {mode: 'pessimistic_read'},
        });

        if(seats.length !== seatIds.length ) throw new BadRequestException('Some seats are invalid');

        if(seats.some((s) => s.status !== 'AVAILABLE'))
            throw new ConflictException('Some seats are not available');
        
        // Assign holdId& persist HOLD
        const holdId = uuidv4();
        await this.dataSource.transaction(async (mgr) => {
            for ( const s of seats){
                s.status = 'HOLD';
                s.holdId = holdId;
                await mgr.save(ShowSeat, s);
            }
        });

        //Write Redis locks per seat with TTL
        await Promise.all(
            seats.map((s) => this.cache.set(`hold:${showId}:${s.seat.id}`, holdId, this.HOLD_TTL_SEC)),
        );
        
        //Save hold package (for quick lookup)
        const holdPayload = { holdId, showId, seatIds, expiresIn: this.HOLD_TTL_SEC};
        await this.cache.set(`hold:${holdId}`, holdPayload, this.HOLD_TTL_SEC);
        await this.cache.set(`idem:hold:${idempotencyKey}`, holdId, this.HOLD_TTL_SEC); // 5 minutes
    
        return holdPayload;
    }

    async releaseHold(holdId: string) {
        const hold = ( await this.cache.get<any>(`hold:${holdId}`)) || null;
        if(!hold) return; //already expired

        const seats = await this.showSeatRepo.find({
            where: hold.seatIds.map((sid) => ({ show: { id: hold.showId }, seat: { id: sid} , holdId })),
            relations: ['show', 'seat'],
        });

    await this.dataSource.transaction(async (mgr) => {
        for(const s of seats){
            s.status = 'AVAILABLE';
            s.holdId = null;
            await mgr.save(ShowSeat, s);
            await this.cache.del(`hold:${hold.showId}:${s.seat.id}`);
        }
    });

    await this.cache.del(`hold:${holdId}`);
    }
}
