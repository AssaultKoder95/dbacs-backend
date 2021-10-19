import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamMemberRole } from './team-member-role';

@Index('member_email_idx', ['email'], { unique: true })
@Index('member_pkey', ['id'], { unique: true })
@Entity('member', { schema: 'public' })
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'email', nullable: true })
  email: string | null;

  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @Column('character varying', { name: 'username', nullable: true })
  username: string | null;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted?: Date;

  @OneToMany(() => TeamMemberRole, (teamMemberRole) => teamMemberRole.member)
  teamMemberRoles: TeamMemberRole[];
}
