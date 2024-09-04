import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { UserGender, UserRole } from 'src/shared/enum/user.enum';
import { ImageEntity } from './Image.entity';

import * as bcrypt from 'bcrypt';

@Entity()
export class User extends CommonEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @OneToOne(() => ImageEntity, { eager: true })
  @JoinColumn()
  profilePicture: ImageEntity;

  @Column()
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
  })
  roles: UserRole[];

  @BeforeInsert()
  beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
