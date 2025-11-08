import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auditorium } from '../../theaters/entities/auditorium.entity';

/**
 * Seat: ghế cố định trong phòng chiếu (giản lược, không có auditorium ở MVP).
 * - rowLabel: hàng (A,B,C...)
 * - number: số ghế
 * - type: loại ghế (NORMAL/VIP) -> để pricing sau này
 */
@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() rowLabel: string;
  @Column() number: number;
  @Column({ default: 'NORMAL' }) type: string;

  @ManyToOne(() => Auditorium, { nullable: true })
  auditorium: Auditorium | null;
}
