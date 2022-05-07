/// <reference types="cypress" />

describe("main page test", () => {
    beforeEach(() => {
        cy.resetDB();
        cy.visit("http://localhost:3000");
    });

    it("should display a video if there are one or more recommendations", () => {
        for (let i = 0; i < 3; i++) {
            cy.createRecommendation();
        }

        cy.visit("http://localhost:3000/random");

        cy.get('article').first().find('iframe').should('be.visible').should('not.be.undefined').end()
    });
});