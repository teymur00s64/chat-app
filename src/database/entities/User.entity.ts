import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { UserGender, UserRole } from 'src/shared/enum/user.enum';
import { ImageEntity } from './Image.entity';

import * as bcrypt from 'bcrypt';
import { Follow } from './Follow.entity';

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

  @Column({default: 0})
  followedCount: number;

  @Column({default: 0})
  followerCount: number;

  @Column({default: false})
  isPrivate: boolean;

  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column({ nullable: true })
  activationToken: string;

  @Column({ nullable: true })
  activationExpire: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
  })
  roles: UserRole[];

  @OneToMany(() => Follow, (follow) => follow.followedUser)
  followeds: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followerUser)
  followers: Follow[];

  @BeforeInsert()
  beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
