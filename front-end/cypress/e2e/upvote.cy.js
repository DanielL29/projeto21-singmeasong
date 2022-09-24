import { faker } from '@faker-js/faker'

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/e2e/reset', {})
})

describe('Upvote Recommendation', () => {
  it('should increse one to recommendation score', () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
    }

    cy.visit('http://localhost:3000')

    cy.createRecommendation(recommendation)

    cy.get(`[data-cy-name="${recommendation.name}"]`).should('contain.text', recommendation.name)

    cy.intercept('GET', `/recommendations`).as('getRecommendation')

    cy.get(`[data-cy-score="${recommendation.name}-0"]`).should('contain.text', `0`)

    cy.get(`[data-cy-upvote="${recommendation.name}-upvote"]`).click()

    cy.wait('@getRecommendation')

    cy.get(`[data-cy-score="${recommendation.name}-1"]`).should('contain.text', `1`)
  })
})