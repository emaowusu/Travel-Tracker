import { jest } from "@jest/globals";
import { checkVisited, getCurrentUser } from "../app.js";

describe("Unit tests - Travel App helpers", () => {
  const mockPool = {
    query: jest.fn()
  };

  beforeEach(() => {
    mockPool.query.mockReset();
  });

  test("checkVisited returns list of countries", async () => {
    mockPool.query.mockResolvedValue({ rows: [{ country_code: "US" }, { country_code: "CA" }] });

    const countries = await checkVisited(1, mockPool);
    expect(countries).toEqual(["US", "CA"]);
    expect(mockPool.query).toHaveBeenCalledWith(
      "SELECT country_code FROM visited_countries WHERE user_id = $1",
      [1]
    );
  });

  test("getCurrentUser returns correct user", async () => {
    mockPool.query.mockResolvedValue({
      rows: [
        { id: 1, name: "Sam", color: "teal" },
        { id: 2, name: "Dennis", color: "blue" }
      ]
    });

    const user = await getCurrentUser(2, mockPool);
    expect(user).toEqual({ id: 2, name: "Dennis", color: "blue" });
    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM users");
  });
});

