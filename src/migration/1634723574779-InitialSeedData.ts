import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSeedData1634723574779 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: ubuntu
--

INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('e29dc4da-9179-45dd-aab8-23423d505eef', 'abhishek@prodbkit.co', 'Abhishek Khanna', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('f965adcb-f774-4169-aadd-d674a35aa820', 'saurav@prodbkit.co', 'Saurav Arora', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('b1ca6c97-66d5-417d-9102-97f712a7511e', 'raju@prodbkit.co', 'Raju Gangadhar', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('44e751aa-65d0-4f45-a684-cb27e8739a81', 'abhishek-user-2@prodbkit.co', 'Abhishek Khanna', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('81f32999-8d22-44f5-8809-6139f473015e', 'saurav-user-2@prodbkit.co', 'Saurav Arora', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('ccbd6b84-3ab7-4383-8532-7c064f45274c', 'raju-user-2@prodbkit.co', 'Raju Gangadhar', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('a71a562c-de9b-4bbb-a1f0-a04a1d2fd429', 'abhishek-user-3@prodbkit.co', 'Abhishek Khanna', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('a994513f-1ca9-49a0-9b4a-75693bd867f2', 'saurav-user-3@prodbkit.co', 'Saurav Arora', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('0777edb6-c915-4283-804b-9a58db0f1d64', 'raju-user-3@prodbkit.co', 'Raju Gangadhar', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('8edb81bb-96a9-484b-887b-03f7eab4401b', 'abhishek-user-4@prodbkit.co', 'Abhishek Khanna', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('dcb9992c-e46a-4133-91fa-915b0c97ffbe', 'saurav-user-4@prodbkit.co', 'Saurav Arora', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('09613986-b848-47e2-a768-fea915794a39', 'raju-user-4@prodbkit.co', 'Raju Gangadhar', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('658967ee-7b17-4f71-ae84-8005eaf47c35', 'abhishek-user-@prodbkit.co', 'Abhishek Khanna', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('e3ab0f6f-f09a-4eb7-b6ba-b2c34e37c1b4', 'saurav-user-5@prodbkit.co', 'Saurav Arora', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.member (id, email, name, username, created, updated, deleted) VALUES ('d2e88dce-15e1-4d7d-a086-fcb992954639', 'raju-user-5@prodbkit.co', 'Raju Gangadhar', NULL, '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);

--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: ubuntu
--

INSERT INTO public.role (id, name) VALUES ('TL', 'Technical Lead');
INSERT INTO public.role (id, name) VALUES ('ADMIN', 'Administrator');
INSERT INTO public.role (id, name) VALUES ('DEV', 'Developer');


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: ubuntu
--

INSERT INTO public.team ("teamId", name, created, updated, deleted, description) VALUES ('681d0cfb-62df-4357-b6ca-d3176615ded7', 'Payments', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'Payments Team');
INSERT INTO public.team ("teamId", name, created, updated, deleted, description) VALUES ('8d5ecf9b-d25b-4045-9528-354d751712f7', 'Dev Platform', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'Dev toolings, RFCs, Core Technologies');
INSERT INTO public.team ("teamId", name, created, updated, deleted, description) VALUES ('61e8e9b0-b713-4153-919d-655f7f41aa89', 'API', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'API Team');


--
-- Data for Name: team_member_role; Type: TABLE DATA; Schema: public; Owner: ubuntu
--

INSERT INTO public.team_member_role (id, created, updated, deleted, member_id, role, team_id) VALUES ('79ea4855-d16b-47ca-a303-af525d1d0b58', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'e29dc4da-9179-45dd-aab8-23423d505eef', 'ADMIN', '681d0cfb-62df-4357-b6ca-d3176615ded7');
INSERT INTO public.team_member_role (id, created, updated, deleted, member_id, role, team_id) VALUES ('a9c91d8e-d57d-44c9-8c53-2316c20dba0f', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'e29dc4da-9179-45dd-aab8-23423d505eef', 'ADMIN', '8d5ecf9b-d25b-4045-9528-354d751712f7');
INSERT INTO public.team_member_role (id, created, updated, deleted, member_id, role, team_id) VALUES ('689e5cec-6982-4e96-b40f-61295170bbbf', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'e29dc4da-9179-45dd-aab8-23423d505eef', 'ADMIN', '61e8e9b0-b713-4153-919d-655f7f41aa89');
INSERT INTO public.team_member_role (id, created, updated, deleted, member_id, role, team_id) VALUES ('6eb3e433-53d2-47da-aaf8-74c759095392', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'f965adcb-f774-4169-aadd-d674a35aa820', 'ADMIN', '681d0cfb-62df-4357-b6ca-d3176615ded7');
INSERT INTO public.team_member_role (id, created, updated, deleted, member_id, role, team_id) VALUES ('b25fac84-9224-417c-8d05-087ca86cde1d', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'f965adcb-f774-4169-aadd-d674a35aa820', 'ADMIN', '8d5ecf9b-d25b-4045-9528-354d751712f7');
INSERT INTO public.team_member_role (id, created, updated, deleted, member_id, role, team_id) VALUES ('b8607b94-cc8d-4c38-b20c-9b2fd8faacbd', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL, 'f965adcb-f774-4169-aadd-d674a35aa820', 'ADMIN', '61e8e9b0-b713-4153-919d-655f7f41aa89');


--
-- Data for Name: database; Type: TABLE DATA; Schema: public; Owner: ubuntu
--

INSERT INTO public.database (id, name, description, connection_string, status, platform, environment, mode, created, updated, deleted) VALUES ('f6d7a1b3-4259-4501-817f-18dbdc120d07', 'postgres', NULL, 'some-random-cluster.ap-southeast-1.rds.amazonaws.com', 'available', 'aurora-postgresql', 'production', 'live', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.database (id, name, description, connection_string, status, platform, environment, mode, created, updated, deleted) VALUES ('2345c2e9-17fb-4385-90e1-858f6fab118c', 'postgres', NULL, 'some-random-cluster.ap-southeast-1.rds.amazonaws.com', 'available', 'aurora-postgresql', 'production', 'live', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);
INSERT INTO public.database (id, name, description, connection_string, status, platform, environment, mode, created, updated, deleted) VALUES ('d84326c2-5be7-4439-83af-8b14b4b4ae8f', 'postgres', NULL, 'some-random-cluster.ap-southeast-1.rds.amazonaws.com', 'available', 'aurora-postgresql', 'production', 'live', '2021-09-02 15:54:59.199017', '2021-09-02 15:54:59.199017', NULL);

--
-- Data for Name: team_db; Type: TABLE DATA; Schema: public; Owner: ubuntu
--

INSERT INTO public.team_db (id, database_id, team_id) VALUES ('2088069f-97c2-4f62-b915-eb16a651a922', 'f6d7a1b3-4259-4501-817f-18dbdc120d07', '8d5ecf9b-d25b-4045-9528-354d751712f7');
INSERT INTO public.team_db (id, database_id, team_id) VALUES ('64e506db-89f2-48b9-a374-0eaedc1eeb89', '2345c2e9-17fb-4385-90e1-858f6fab118c', '681d0cfb-62df-4357-b6ca-d3176615ded7');
INSERT INTO public.team_db (id, database_id, team_id) VALUES ('76518072-4a8d-49af-ae6c-3e9e1e4ff882', 'd84326c2-5be7-4439-83af-8b14b4b4ae8f', '61e8e9b0-b713-4153-919d-655f7f41aa89');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      SET foreign_key_checks = 0;
      DROP TABLE IF EXISTS team, member, database, role, team_member_role, team_db;
      SET foreign_key_checks = 1;
      `,
    );
  }
}
