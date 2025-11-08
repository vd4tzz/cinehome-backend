import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';
import {Show} from '../../shows/entities/show.entity';
import {BookingItem} from './booking-item.entity';
import {User} from '../../users/user.entity';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

@Entity()
@Index(['idempotencyKey'], {unique:true })
export class Booking {
    @PrimaryGeneratedColumn('uuid') id: string;
    
    @ManyToOne(() => User) user: User;
    @ManyToOne(() => Show) show: Show;

    @Column({ type: 'int'}) totalAmount: number; // VND
    @Column({ type: 'varchar', length: 16, default: 'PENDING'}) status: BookingStatus;
    
    @Column({ type: 'varchar', length: 128, nullable: true})
    idempotencyKey: string | null;
    
    @OneToMany(() => BookingItem, (bi) => bi.booking, { cascade: true})
    items: BookingItem[];
    
    @Column({ type: 'jsonb', nullable: true}) meta: any;

    @CreateDateColumn() createAt: Date;
    @UpdateDateColumn() updateAt: Date;

}