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
import { DatabaseCredential } from './database-credential';

@Index('database_pkey', ['id'], { unique: true })
@Entity('database', { schema: 'public' })
export class Database {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @Column('character varying', { name: 'description', nullable: true })
  description: string | null;

  @Column('character varying', { name: 'connection_string', nullable: true })
  connectionString: string | null;

  @Column('character varying', { name: 'status', nullable: true })
  status: string | null;

  @Column('character varying', { name: 'platform', nullable: true })
  platform: string | null;

  @Column('character varying', { name: 'environment', nullable: true })
  environment: string | null;

  @Column('character varying', { name: 'mode', nullable: true })
  mode: string | null;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted?: Date;

  @OneToMany(() => TeamDb, (teamDb) => teamDb.database)
  teamDbs: TeamDb[];

  @OneToMany(
    () => DatabaseCredential,
    (databaseCredential) => databaseCredential.database,
  )
  databaseCredentials: DatabaseCredential[];
}
