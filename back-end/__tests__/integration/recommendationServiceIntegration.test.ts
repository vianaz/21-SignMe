import { execSync } from "child_process";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";

const endPoint = {
  home: "/recommendation",
  random: "/random",
  getTop: "/top/:amount",
  getById: "/:id",
  upvote: "/:id/upvote",
  downvote: "/:id/downvote",
};

describe("Insert Router", () => {
  beforeAll(() => {
    execSync("yarn prisma migrate reset --force");
  });
  it("should insert recommedation", async () => {
    const response = await supertest(app).post(endPoint.home).send({
      name: faker.name.firstName(),
      youtubeLink: "https://www.youtube.com/watch?v=FV-hMoqHtcU",
    });

    expect(response.status).toBe(201);
  });

  afterAll(() => {
    prisma.$disconnect();
  });
});
