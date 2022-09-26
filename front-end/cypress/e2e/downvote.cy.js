import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/e2e/reset', {});
});

describe('Downvote Recommendation', () => {
  it('should decrease one to recommendation score', () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`
    };

    cy.visit('http://localhost:3000');

    cy.createRecommendation(recommendation);

    cy.get(`[data-cy-name="${recommendation.name}"]`).should('contain.text', recommendation.name);

    cy.intercept('GET', `/recommendations`).as('getRecommendation');

    cy.get(`[data-cy-score="${recommendation.name}-0"]`).should('contain.text', `0`);

    cy.get(`[data-cy-downvote="${recommendation.name}-downvote"]`).click();
    cy.wait('@getRecommendation');

    cy.get(`[data-cy-score="${recommendation.name}--1"]`).should('contain.text', `-1`);
  });

  it('should delete a recommendation when score is less than -5', () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
    };

    cy.visit('http://localhost:3000');

    cy.createRecommendation(recommendation);

    cy.get(`[data-cy-name="${recommendation.name}"]`).should('contain.text', recommendation.name);

    for (let i = 0; i < 6; i++) {
      cy.intercept('GET', `/recommendations`).as('getRecommendation');
      cy.get(`[data-cy-score="${recommendation.name}-${0 - i}"]`).should('contain.text', `${0 - i}`);
      cy.get(`[data-cy-downvote="${recommendation.name}-downvote"]`).click();
      cy.wait('@getRecommendation');
    }

    cy.get('[data-cy=none-recommendations]').should('contain.text', 'No recommendations yet! Create your own :)');
  });
});