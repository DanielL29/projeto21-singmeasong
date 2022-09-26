import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/e2e/reset', {});
});

describe('Get All Recommendations', () => {
  it('should get all(10) recommendations', () => {
    let recommendations = [];

    for (let i = 0; i < 10; i++) {
      const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
      }

      recommendations.push(recommendation);

      cy.createRecommendation(recommendation);
    }

    cy.visit('http://localhost:3000');

    cy.intercept('GET', `/recommendations`).as('getRecommendations');

    cy.wait('@getRecommendations');

    for (let i = 0; i < recommendations.length; i++) {
      cy.get(`[data-cy-name="${recommendations[i].name}"]`).should('contain.text', recommendations[i].name);
    }
  });
});