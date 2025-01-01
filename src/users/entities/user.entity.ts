import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import userRoles from '../enums/user.enums';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'string', unique: true, nullable: false })
  username: string;

  @Column({ type: 'string', unique: true, nullable: false })
  email: string;

  @Column({ type: 'string', unique: true, nullable: false })
  phone: string;

  @Column({ type: 'string', nullable: true })
  password: string;

  @Column({ type: 'enum', enum: userRoles, default: userRoles.user })
  role: userRoles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
