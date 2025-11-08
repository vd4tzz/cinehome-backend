import {Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn, 
    UpdateDateColumn,
    Index } from 'typeorm';
      
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({type :'varchar', length: 255})
  email: string;

  //! chỉ luu hash khong luu password plaintext 
  @Column({type :'varchar', length: 255})
  passwordHash: string;

  @Column({type :'boolean', default: false})
  isEmailVerified:boolean;

  @Column({ type: 'varchar', length: 500 , nullable: true})
  refreshTokenHash: string | null;

  @Column({type: 'varchar', length: 200, nullable:true})
  emailVerificationToken: string | null;

  @Column({type: 'varchar', length: 50, array: true, default: () => "ARRAY['USER']"})
    roles: string[];

  @CreateDateColumn()
    createAT: Date;


  @UpdateDateColumn()
    updatedAT: Date;
}
