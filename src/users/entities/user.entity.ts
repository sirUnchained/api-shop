import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'string', unique: true })
  username: string;

  @Column({ type: 'string', unique: true })
  email: string;

  @Column({ type: 'string', unique: true })
  phone: string;
}
