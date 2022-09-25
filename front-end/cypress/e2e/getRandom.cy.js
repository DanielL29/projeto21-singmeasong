import { faker } from '@faker-js/faker'

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/e2e/reset', {})
})

describe('Get Random Recommendation', () => {
  it('should get a random recommendations', () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
    }

    cy.createRecommendation(recommendation)

    cy.visit('http://localhost:3000/random')

    cy.intercept('GET', `/recommendations/random`).as('getRandomRecommendation')

    cy.wait('@getRandomRecommendation')

    cy.get(`[data-cy-name="${recommendation.name}"]`).should('contain.text', recommendation.name)
  })

  it('should stay in loading if have any recommendation', () => {
    cy.visit('http://localhost:3000/random')

    cy.intercept('GET', `/recommendations/random`).as('getRandomRecommendation')

    cy.wait('@getRandomRecommendation')

    cy.get('div').should('contain.text', 'Loading...')
  })
})