import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialData1634647911479 implements MigrationInterface {
  name = 'InitialData1634647911479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."team_cluster" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cluster_id" uuid, "team_id" uuid, CONSTRAINT "PK_eba7573848c9e79cc926bb4907e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "team_cluster_pkey" ON "public"."team_cluster" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."team" ("teamId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, CONSTRAINT "PK_1e816553126a0b0c924cb9111b4" PRIMARY KEY ("teamId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "team_pkey" ON "public"."team" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."team_db" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "database_id" uuid, "team_id" uuid, CONSTRAINT "PK_5218e41107bbe3991e7af1144b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "team_db_pkey" ON "public"."team_db" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."database" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "connection_string" character varying, "status" character varying, "platform" character varying, "environment" character varying, "mode" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "cluster_id" uuid, CONSTRAINT "PK_a5377573f692f00c3fced268ddf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "database_pkey" ON "public"."database" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."cluster" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "connection_string" character varying, "status" character varying, "platform" character varying, "environment" character varying, "mode" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, CONSTRAINT "PK_2c829a3dabfcf651445de2d3b5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "cluster_pkey" ON "public"."cluster" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."database_credential" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "purpose" character varying, "expiration" TIMESTAMP WITH TIME ZONE, "status" character varying, "connection_string" character varying, "access_level" character varying, "username" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "cluster_id" uuid, "creator_id" uuid, "database_id" uuid, CONSTRAINT "PK_c0e2ea421b366d6171c6173c0ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "database_credential_pkey" ON "public"."database_credential" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "name" character varying, "username" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, CONSTRAINT "PK_c80f15de3f88d70ff6c89976854" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "member_pkey" ON "public"."member" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "member_email_idx" ON "public"."member" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."permission" ("key" character varying NOT NULL, "type" character varying, "name" character varying, CONSTRAINT "PK_4036c4cdc4667c700687516f65f" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "permission_pkey" ON "public"."permission" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."permission_member_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiration" TIMESTAMP WITH TIME ZONE, "status" character varying, "metadata" jsonb, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "parent" uuid, "permission_key" character varying, "team_member_role_id" uuid, CONSTRAINT "PK_ad7ecfb46a8afe858388f743392" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "permission_member_role_pkey" ON "public"."permission_member_role" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."role" ("id" character varying NOT NULL, "name" character varying, CONSTRAINT "PK_ab841b6a976216a286c10c117f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "role_pkey" ON "public"."role" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."team_member_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "member_id" uuid, "role" character varying, "team_id" uuid, CONSTRAINT "PK_96a85f0ba0b3973c32b4f43b56f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "team_member_role_pkey" ON "public"."team_member_role" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "actor_id" uuid, CONSTRAINT "PK_c7ab403a9cb0e8248ebd7c09296" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "audit_log_pkey" ON "public"."audit_log" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_cluster" ADD CONSTRAINT "FK_eb57b8b09aa74068a09d91c8a7f" FOREIGN KEY ("cluster_id") REFERENCES "public"."cluster"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_cluster" ADD CONSTRAINT "FK_2584e81db65bb6990315e4a040b" FOREIGN KEY ("team_id") REFERENCES "public"."team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_db" ADD CONSTRAINT "FK_93db2aaf8f332e49c7f47bacaa5" FOREIGN KEY ("database_id") REFERENCES "public"."database"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_db" ADD CONSTRAINT "FK_bfde5c8f9e6eb54b0cbaff98324" FOREIGN KEY ("team_id") REFERENCES "public"."team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database" ADD CONSTRAINT "FK_5ee21fea311d0105832cc7b9c9c" FOREIGN KEY ("cluster_id") REFERENCES "public"."cluster"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database_credential" ADD CONSTRAINT "FK_7fb64647a4fec8b3fc45b37fd43" FOREIGN KEY ("cluster_id") REFERENCES "public"."cluster"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database_credential" ADD CONSTRAINT "FK_3b4a54f27504f025c68d1d6b82a" FOREIGN KEY ("creator_id") REFERENCES "public"."team_member_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database_credential" ADD CONSTRAINT "FK_8ff144f91a9f8f53f2111871062" FOREIGN KEY ("database_id") REFERENCES "public"."database"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."permission_member_role" ADD CONSTRAINT "FK_614834b11d9fdb84791f4b81b5f" FOREIGN KEY ("parent") REFERENCES "public"."permission_member_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."permission_member_role" ADD CONSTRAINT "FK_d5210ed2501d59f8739703d7659" FOREIGN KEY ("permission_key") REFERENCES "public"."permission"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."permission_member_role" ADD CONSTRAINT "FK_a96a5d40561d36bb6dcd68b4f35" FOREIGN KEY ("team_member_role_id") REFERENCES "public"."team_member_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_member_role" ADD CONSTRAINT "FK_6be83721efc93183dae6e781624" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_member_role" ADD CONSTRAINT "FK_ce5993ae8a686db20b9ee44c4b2" FOREIGN KEY ("role") REFERENCES "public"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_member_role" ADD CONSTRAINT "FK_499f3ccf18d5f92d2d617600e27" FOREIGN KEY ("team_id") REFERENCES "public"."team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."audit_log" ADD CONSTRAINT "FK_3315dfc4250fd61d62792df8698" FOREIGN KEY ("actor_id") REFERENCES "public"."team_member_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."audit_log" DROP CONSTRAINT "FK_3315dfc4250fd61d62792df8698"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_member_role" DROP CONSTRAINT "FK_499f3ccf18d5f92d2d617600e27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_member_role" DROP CONSTRAINT "FK_ce5993ae8a686db20b9ee44c4b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_member_role" DROP CONSTRAINT "FK_6be83721efc93183dae6e781624"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."permission_member_role" DROP CONSTRAINT "FK_a96a5d40561d36bb6dcd68b4f35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."permission_member_role" DROP CONSTRAINT "FK_d5210ed2501d59f8739703d7659"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."permission_member_role" DROP CONSTRAINT "FK_614834b11d9fdb84791f4b81b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database_credential" DROP CONSTRAINT "FK_8ff144f91a9f8f53f2111871062"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database_credential" DROP CONSTRAINT "FK_3b4a54f27504f025c68d1d6b82a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database_credential" DROP CONSTRAINT "FK_7fb64647a4fec8b3fc45b37fd43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."database" DROP CONSTRAINT "FK_5ee21fea311d0105832cc7b9c9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_db" DROP CONSTRAINT "FK_bfde5c8f9e6eb54b0cbaff98324"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_db" DROP CONSTRAINT "FK_93db2aaf8f332e49c7f47bacaa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_cluster" DROP CONSTRAINT "FK_2584e81db65bb6990315e4a040b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."team_cluster" DROP CONSTRAINT "FK_eb57b8b09aa74068a09d91c8a7f"`,
    );
    await queryRunner.query(`DROP INDEX "public"."audit_log_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."audit_log"`);
    await queryRunner.query(`DROP INDEX "public"."team_member_role_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."team_member_role"`);
    await queryRunner.query(`DROP INDEX "public"."role_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."role"`);
    await queryRunner.query(
      `DROP INDEX "public"."permission_member_role_pkey"`,
    );
    await queryRunner.query(`DROP TABLE "public"."permission_member_role"`);
    await queryRunner.query(`DROP INDEX "public"."permission_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."permission"`);
    await queryRunner.query(`DROP INDEX "public"."member_email_idx"`);
    await queryRunner.query(`DROP INDEX "public"."member_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."member"`);
    await queryRunner.query(`DROP INDEX "public"."database_credential_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."database_credential"`);
    await queryRunner.query(`DROP INDEX "public"."cluster_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."cluster"`);
    await queryRunner.query(`DROP INDEX "public"."database_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."database"`);
    await queryRunner.query(`DROP INDEX "public"."team_db_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."team_db"`);
    await queryRunner.query(`DROP INDEX "public"."team_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."team"`);
    await queryRunner.query(`DROP INDEX "public"."team_cluster_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."team_cluster"`);
  }
}
