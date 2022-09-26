import { faker } from '@faker-js/faker'

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/e2e/reset', {})
})

describe('Get Top Recommendations', () => {
  it('should get top recommendations', () => {
    let recommendations = []

    for (let i = 0; i < 2; i++) {
      const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
      }

      recommendations.push(recommendation)

      cy.createRecommendation(recommendation)
    }

    cy.visit('http://localhost:3000/top')

    cy.intercept('GET', `/recommendations/top/10`).as('getTopRecommendations')

    cy.get(`[data-cy-upvote="${recommendations[0].name}-upvote"]`).click()

    cy.wait('@getTopRecommendations')

    cy.get(`[data-cy-score="${recommendations[0].name}-1"]`).should('contain.text', '1')
    cy.get(`[data-cy-score="${recommendations[1].name}-0"]`).should('contain.text', '0')
  })
})