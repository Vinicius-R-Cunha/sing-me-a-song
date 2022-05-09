/// <reference types="cypress" />

describe('main page test', () => {
    beforeEach(() => {
        cy.resetDB()
        cy.visit('http://localhost:3000')
    })

    it('should rank a video with score 3 higher than a score 1 and higher than a score 0', () => {
        for (let i = 0; i < 3; i++) {
            cy.createRecommendation()
        }

        cy.intercept(
            'POST',
            'http://localhost:5000/recommendations/*/upvote'
        ).as('upVote')
        cy.get('article').first().find('#up-vote').click()
        cy.wait('@upVote')

        for (let i = 0; i < 3; i++) {
            cy.intercept(
                'POST',
                'http://localhost:5000/recommendations/*/upvote'
            ).as('upVote')
            cy.get('article').last().find('#up-vote').click()
            cy.wait('@upVote')
        }

        cy.visit('http://localhost:3000/top')

        cy.get('article').first().find('#score').contains('3')
        cy.get('article').last().find('#score').contains('0').end()
    })
})
