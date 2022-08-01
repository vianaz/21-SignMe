import { execSync } from "child_process";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";

const endPoint = {
  base: "/recommendations",
  random: "/random",
  getTop: "/top/:amount",
  downvote: "/:id/downvote",
};

describe("Insert Router", () => {
  beforeAll(() => {
    execSync("yarn prisma migrate reset --force");
  });
  it("should return 201 (insert recommedation)", async () => {
    const response = await supertest(app).post(endPoint.base).send({
      name: faker.name.firstName(),
      youtubeLink: "https://www.youtube.com/watch?v=FV-hMoqHtcU",
    });

    expect(response.status).toBe(201);
  });
  it("should return 422 (wrong schema)", async () => {
    const response = await supertest(app).post(endPoint.base).send({
      name: faker.name.firstName(),
      youtubeLink: "https://www.google.com/watch?v=FV-hMoqHtcU",
    });

    expect(response.status).toBe(422);
  });

  afterAll(() => {
    prisma.$disconnect();
  });
});

describe("Upvote Route", () => {
  it("should return 200 (upvote recommendation)", async () => {
    const upvoteEndPoint = "/1/upvote";
    const response = await supertest(app).post(
      `${endPoint.base}${upvoteEndPoint}`,
    );

    expect(response.status).toBe(200);
  });
  it("should return 404 (not found recommendation to upvote)", async () => {
    const upvoteEndPoint = "/10/upvote";
    const response = await supertest(app).post(
      `${endPoint.base}${upvoteEndPoint}`,
    );

    expect(response.status).toBe(404);
  });
});

describe("Downvote Route", () => {
  it("should return 200 (downvote recommendation)", async () => {
    const downvoteEndPoint = "/1/downvote";
    const response = await supertest(app).post(
      `${endPoint.base}${downvoteEndPoint}`,
    );

    expect(response.status).toBe(200);
  });
  it("should return 404 (not found recommendation to downvote)", async () => {
    const downvoteEndPoint = "/10/downvote";
    const response = await supertest(app).post(
      `${endPoint.base}${downvoteEndPoint}`,
    );

    expect(response.status).toBe(404);
  });
});

describe("Get by ID Route", () => {
  it("should return 200 (get by id)", async () => {
    const getByIdEndPoint = "/1";
    const response = await supertest(app).get(
      `${endPoint.base}${getByIdEndPoint}`,
    );

    expect(response.status).toBe(200);
  });

  it("should return 404 (not found recommendation id)", async () => {
    const getByIdEndPoint = "/20";
    const response = await supertest(app).get(
      `${endPoint.base}${getByIdEndPoint}`,
    );

    expect(response.status).toBe(404);
  });
});
