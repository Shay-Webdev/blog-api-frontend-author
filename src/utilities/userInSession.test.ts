import { userInSession } from "./userInSession";
test("returns null", () => {
  expect(userInSession()).toBe(null);
});
