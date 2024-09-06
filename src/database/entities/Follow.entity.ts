import { Column, Entity } from "typeorm";
import { CommonEntity } from "./Common.entity";

@Entity()
export class FollowEntity extends CommonEntity {
    
    @Column()
    followerId: number;

    @Column()
    followeId: number;

    @Column({default: false})
    isAccepted: boolean;
}