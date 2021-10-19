import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Database } from './database';
import { Team } from './team';

@Index('team_db_pkey', ['id'], { unique: true })
@Entity('team_db', { schema: 'public' })
export class TeamDb {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Database, (database) => database.teamDbs)
  @JoinColumn([{ name: 'database_id', referencedColumnName: 'id' }])
  database: Database;

  @ManyToOne(() => Team, (team) => team.teamDbs)
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'teamId' }])
  team: Team;
}
