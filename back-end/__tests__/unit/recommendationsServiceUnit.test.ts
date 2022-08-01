import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";

describe("Insert Recommendation", () => {
  const findByNameMock = jest
    .spyOn(recommendationRepository, "findByName")
    .mockImplementationOnce((name): any => {
      if (name === "true") return true;
      return false;
    });
  const createMock = jest.spyOn(recommendationRepository, "create");

  it("should insert recommendation", async () => {
    createMock.mockImplementationOnce(null);

    await recommendationService.insert({ name: "test", youtubeLink: "test" });

    expect(createMock).toBeCalledTimes(1);
  });

  it("should throw error if recommendation already exists", async () => {
    await expect(
      recommendationService.insert({ name: "true", youtubeLink: "test" }),
    ).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
});

describe("Upvote Recommendation", () => {
  const updateScoreMock = jest.spyOn(recommendationRepository, "updateScore");
  const getByIdOrFailMock = jest.spyOn(recommendationRepository, "find");

  it("should do nothing, just call the functions", async () => {
    await recommendationService.upvote(1);

    expect(updateScoreMock).toBeCalledTimes(1);
  });
});

describe("Downvote Recommendation", () => {
  const updateScoreMock = jest.spyOn(recommendationRepository, "updateScore");
  const getByIdOrFailMock = jest.spyOn(recommendationService, "getById");
  const findMock = jest.spyOn(recommendationRepository, "find");
  const removeMock = jest.spyOn(recommendationRepository, "remove");

  it("should do nothing, just call the functions", async () => {
    await recommendationService.downvote(1);

    expect(removeMock).not.toBeCalled();
  });

  it("should remove recommendation if score is below -5", async () => {
    getByIdOrFailMock.mockImplementationOnce(null);
    updateScoreMock.mockImplementationOnce((): any => {
      return { score: -6 };
    });
    removeMock.mockImplementationOnce(null);

    await recommendationService.downvote(1);

    expect(removeMock).toBeCalledTimes(1);
  });
});

describe("Get by id or Fail", () => {
  const findMock = jest.spyOn(recommendationRepository, "find");

  it("should just call the functions", async () => {
    findMock.mockImplementationOnce((id: number): any => {
      return id === 1;
    });

    await recommendationService.getById(1);

    expect(findMock).toBeCalledTimes(3);
  });

  it("should return not found error", async () => {
    await expect(recommendationService.getById(2)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("Get All", () => {
  const findAllMock = jest.spyOn(recommendationRepository, "findAll");
  it("should call all functions", async () => {
    await recommendationService.get();

    expect(findAllMock).toBeCalledTimes(1);
  });
});

describe("Get Top", () => {
  const getAmountByScoreMock = jest.spyOn(
    recommendationRepository,
    "getAmountByScore",
  );
  it("should call all functions", async () => {
    await recommendationService.getTop(1);

    expect(getAmountByScoreMock).toBeCalledTimes(1);
  });
});

// describe("Get Random", () => {
//   const findAllMock = jest.spyOn(recommendationRepository, "findAll");
//   jest
//     .spyOn(recommendationService, "getScoreFilter")
//     .mockImplementation((random): any => {
//       if (random < 0.7) {
//         return "gt";
//       }

//       return "lte";
//     });
//   const getByScoreMock = jest.spyOn(recommendationService, "getByScore");

//   it("should call functions", async () => {
//     getByScoreMock.mockImplementationOnce((score): any => {
//       return [{ id: 1 }];
//     });

//     expect(findAllMock).toBeCalledTimes(1);
//     expect(await recommendationService.getRandom()).not.toBeNull();
//   });

//   it("should return not found error", async () => {
//     getByScoreMock.mockImplementationOnce((score): any => {
//       return [];
//     });

//     expect(findAllMock).toBeCalledTimes(3);

//     await expect(recommendationService.getRandom()).rejects.toEqual({
//       message: "",
//       type: "not_found",
//     });
//   });
// });
