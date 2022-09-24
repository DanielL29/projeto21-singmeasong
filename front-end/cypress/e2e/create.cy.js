import { faker } from '@faker-js/faker'

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/e2e/reset', {})
})

describe('Create Recommendation', () => {
  it('should create a recommendation', () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
    }

    cy.visit('http://localhost:3000')

    cy.get('[data-cy-post=name]').type(recommendation.name)
    cy.get('[data-cy-post=youtubeLink]').type(recommendation.youtubeLink)

    cy.intercept('POST', '/recommendations').as('postRecommendation')

    cy.get('[data-cy=create]').click()

    cy.wait('@postRecommendation')

    cy.get(`[data-cy-name="${recommendation.name}"]`).should('contain.text', recommendation.name)
  })

  it('should show an alert when try to register a recommendation already inserted', () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
    }

    cy.createRecommendation(recommendation)

    cy.visit('http://localhost:3000')

    cy.get('[data-cy-post=name]').type(recommendation.name)
    cy.get('[data-cy-post=youtubeLink]').type(recommendation.youtubeLink)

    cy.intercept('POST', '/recommendations').as('postRecommendation')

    cy.get('[data-cy=create]').click()

    cy.wait('@postRecommendation')

    cy.on('window:alert', (str) => {
      expect(str).to.equal(`Error creating recommendation!`)
    })
  })
})