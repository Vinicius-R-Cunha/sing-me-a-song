import { faker } from "@faker-js/faker";

Cypress.Commands.add('resetDB', () => {
    cy.request("POST", "http://localhost:5000/reset", {})
});

Cypress.Commands.add('createRecommendation', () => {
    const videoData = {
        name: faker.name.firstName(),
        url: "https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes"
    };

    cy.get("#input-name").type(videoData.name);
    cy.get("#input-url").type(videoData.url);

    cy.intercept("POST", "http://localhost:5000/recommendations").as("createRecommendation");

    cy.get("#send-url-button").click();

    cy.wait("@createRecommendation");
});