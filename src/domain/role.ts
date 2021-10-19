import { Column, Entity, Index, OneToMany } from 'typeorm';
import { TeamMemberRole } from './team-member-role';

@Index('role_pkey', ['id'], { unique: true })
@Entity('role', { schema: 'public' })
export class Role {
  @Column('character varying', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @OneToMany(() => TeamMemberRole, (teamMemberRole) => teamMemberRole.role)
  teamMemberRoles: TeamMemberRole[];
}
