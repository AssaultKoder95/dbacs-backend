import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DatabaseCredential } from './database-credential';
import { Member } from './member';
import { Role } from './role';
import { Team } from './team';

@Index('team_member_role_pkey', ['id'], { unique: true })
@Entity('team_member_role', { schema: 'public' })
export class TeamMemberRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted?: Date;

  @ManyToOne(() => Member, (member) => member.teamMemberRoles)
  @JoinColumn([{ name: 'member_id', referencedColumnName: 'id' }])
  member: Member;

  @ManyToOne(() => Role, (role) => role.teamMemberRoles)
  @JoinColumn([{ name: 'role', referencedColumnName: 'id' }])
  role: Role;

  @ManyToOne(() => Team, (team) => team.teamMemberRoles)
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'teamId' }])
  team: Team;

  @OneToMany(
    () => DatabaseCredential,
    (databaseCredential) => databaseCredential.creator,
  )
  databaseCredentials: DatabaseCredential[];
}
