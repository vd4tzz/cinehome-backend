import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Concession Entity - Bắp nước, combo
 */
@Entity()
export class Concession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // e.g., "Combo Bắp Nước", "Coca Cola", "Popcorn Caramel"

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  price: number; // VND

  @Column({ type: 'varchar', length: 50, default: 'AVAILABLE' })
  status: string; // AVAILABLE, OUT_OF_STOCK

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null; // DRINK, SNACK, COMBO

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
