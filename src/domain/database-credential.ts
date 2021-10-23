import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Database } from './database';
import { TeamMemberRole } from './team-member-role';

@Index('database_credential_pkey', ['id'], { unique: true })
@Entity('database_credential', { schema: 'public' })
export class DatabaseCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @Column('character varying', { name: 'purpose', nullable: true })
  purpose: string | null;

  @Column('timestamp with time zone', { name: 'expiration', nullable: true })
  expiration: Date | null;

  @Column('character varying', { name: 'status', nullable: true })
  status: string | null;

  @Column('character varying', { name: 'connection_string', nullable: true })
  connectionString: string | null;

  @Column('character varying', { name: 'access_level', nullable: true })
  accessLevel: string | null;

  @Column('character varying', { name: 'username', nullable: true })
  username: string | null;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted?: Date;

  @ManyToOne(
    () => TeamMemberRole,
    (teamMemberRole) => teamMemberRole.databaseCredentials,
  )
  @JoinColumn([{ name: 'creator_id', referencedColumnName: 'id' }])
  creator: TeamMemberRole;

  @ManyToOne(() => Database, (database) => database.databaseCredentials)
  @JoinColumn([{ name: 'database_id', referencedColumnName: 'id' }])
  database: Database;
}
