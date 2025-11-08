import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, VersionColumn, Index } from 'typeorm';
import { Show} from './show.entity';
import {Seat} from '../../seats/entities/seat.entity';

export type ShowSeatStatus = 'AVAILABLE' | 'HOLD' | 'SOLD';

@Entity()
@Index(['show', 'seat'], {unique: true})
export class ShowSeat {
    @PrimaryGeneratedColumn('uuid') id: string;

    @ManyToOne(() => Show, (s) => s.seats) show: Show;
    @ManyToOne(() => Seat) seat:Seat;

    @Column({type: 'varchar', length: 16, default: 'AVAILABLE'})
    status: ShowSeatStatus;

    @Column({type: 'uuid', nullable: true}) holdId: string | null;
    @Column({type: 'uuid', nullable: true}) bookingId: string | null;

    @VersionColumn() version: number;

}
