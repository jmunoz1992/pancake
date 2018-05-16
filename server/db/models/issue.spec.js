const { expect } = require("chai");
const db = require("../db");
const Issue = db.model("issue");

describe("Issue model", () => {
    beforeEach(() => {
        return db.sync({ force: true });
    });

    describe("Null Value Tests", () => {
        it("Will not create an issue without being passed an issue number", async () => {
            try {
                await Issue.create();
            } catch (err) {
                expect(err.message).to.be.equal("notNull Violation: issue.number cannot be null");
            }
        });
    });
});
