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
import { TeamDb } from './team-db';
import { TeamMemberRole } from './team-member-role';

@Index('team_pkey', ['teamId'], { unique: true })
@Entity('team', { schema: 'public' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  teamId: string;

  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @Column('character varying', { name: 'description', nullable: true })
  description: string | null;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted?: Date;

  @OneToMany(() => TeamDb, (teamDb) => teamDb.team)
  teamDbs: TeamDb[];

  @OneToMany(() => TeamMemberRole, (teamMemberRole) => teamMemberRole.team)
  teamMemberRoles: TeamMemberRole[];
}
