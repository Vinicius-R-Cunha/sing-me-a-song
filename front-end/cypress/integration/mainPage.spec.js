/// <reference types="cypress" />

describe("main page test", () => {
    beforeEach(() => {
        cy.resetDB();
        cy.visit("http://localhost:3000");
    });

    it("should add a video with 0 score", () => {
        const videoData = {
            name: 'Não - Tim Bernardes',
            url: "https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes"
        };

        cy.get("#input-name").type(videoData.name);
        cy.get("#input-url").type(videoData.url);

        cy.intercept("POST", "http://localhost:5000/recommendations").as("createRecommendation");

        cy.get("#send-url-button").click();

        cy.wait("@createRecommendation");

        cy.get('article').first().find('iframe').should('be.visible').should('not.be.undefined').end()
    });

    it("should upvote when up arrow is clicked", () => {
        cy.createRecommendation();

        cy.intercept("POST", "http://localhost:5000/recommendations/*/upvote").as("upVote");

        cy.get("#up-vote").click();

        cy.wait("@upVote");

        cy.contains(1);
    });

    it("should downvote when down arrow is clicked", () => {
        cy.createRecommendation();

        cy.intercept("POST", "http://localhost:5000/recommendations/*/downvote").as("downVote");

        cy.get("#down-vote").click();

        cy.wait("@downVote");

        cy.contains(-1);
    });

    it("should remove recommendation when score is less then -5", () => {
        cy.createRecommendation();

        for (let i = 0; i < 6; i++) {
            cy.intercept("POST", "http://localhost:5000/recommendations/*/downvote").as("downVote");

            cy.get("#down-vote").click();

            cy.wait("@downVote");
        }

        cy.contains('No recommendations yet! Create your own :)');
    });
});