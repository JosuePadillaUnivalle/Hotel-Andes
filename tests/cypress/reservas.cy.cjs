const future = (offset) => {
  const date = new Date(); date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};
const dates = { checkIn: future(130), checkOut: future(132) };
function search() {
  cy.get('[aria-label="Fecha de llegada"]').clear().type(dates.checkIn);
  cy.get('[aria-label="Fecha de salida"]').clear().type(dates.checkOut);
  cy.contains('button', 'Ver disponibilidad').click();
  cy.get('.search-result').should('contain', 'Disponibilidad para');
}
describe('Aceptación BDD Hotel Andes', () => {
  beforeEach(() => cy.visit('/'));
  afterEach(() => {
    // Cancela únicamente las reservas del visitante aislado de esta prueba.
    cy.request('/api/reservations').then(({ body }) => {
      body.reservations.filter(r => r.status === 'confirmed').forEach(r => {
        cy.request({ method: 'PATCH', url: `/api/reservations/${r.id}`, body: {} });
      });
    });
  });
  it('CY01 Dadas fechas válidas cuando busco entonces veo disponibilidad', () => {
    search();
    cy.get('.room-card').should('have.length', 3);
    cy.get('.availability').each(el => cy.wrap(el).should('contain', 'disponible'));
    cy.screenshot('CY01-disponibilidad', { capture: 'viewport' });
  });
  it('CY02 Dados cuatro huéspedes cuando busco entonces solo ofrece familiar', () => {
    cy.get('[aria-label="Número de huéspedes"]').select('4'); search();
    cy.get('.room-card').should('have.length', 1).and('contain', 'Refugio Familiar');
  });
  it('CY03 Dados datos válidos cuando confirmo entonces obtengo código y total', () => {
    search(); cy.get('[aria-label="Reservar Habitación Andina"]').click();
    cy.get('[name="guestName"]').type('Visitante Cypress');
    cy.get('[name="email"]').type('cypress@example.test');
    cy.contains('button', 'Confirmar reserva').click();
    cy.get('[aria-label="Reserva confirmada"]').should('be.visible');
    cy.get('.confirmation-code strong').invoke('text').should('match', /^AND-[A-F0-9]{8}$/);
    cy.get('.confirmation-details b').should('contain', '1.040');
    cy.screenshot('CY03-confirmacion', { capture: 'viewport' });
    cy.contains('button', 'Descargar comprobante').click();
    cy.get('.confirmation-code strong').invoke('text').then(code => {
      cy.readFile(`evidence/cypress/downloads/Reserva-${code}.txt`).should('contain', code).and('contain', 'DEMOSTRACIÓN');
    });
  });
  it('CY04 Dada una reserva cuando cancelo entonces se muestra cancelada', () => {
    cy.request('POST', '/api/reservations', {
      ...dates, guests: 2, roomType: 'andina', guestName: 'Cancelacion Cypress',
      email: 'cancelar@example.test', idempotencyKey: crypto.randomUUID(),
    }).its('status').should('eq', 201);
    cy.get('.header .my-reservations').click();
    cy.contains('button', 'Cancelar reserva').click();
    cy.contains('button', 'Sí, cancelar').click();
    cy.get('.status-label').should('contain', 'Cancelada');
    cy.get('.cancel-confirm').should('not.exist');
    cy.screenshot('CY04-cancelacion', { capture: 'viewport' });
  });
  it('CY05 Dado correo inválido cuando envío entonces el servidor lo rechaza', () => {
    cy.request({ method: 'POST', url: '/api/reservations', failOnStatusCode: false, body: {
      ...dates, guests: 2, roomType: 'andina', guestName: 'Validacion Cypress',
      email: 'sin-arroba', idempotencyKey: crypto.randomUUID(),
    }}).then(r => { expect(r.status).to.eq(400); expect(r.body.error).to.contain('correo'); });
  });
  it('CY06 Dada salida igual a llegada cuando consulto entonces se rechaza', () => {
    cy.request({url: `/api/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkIn}&guests=2`, failOnStatusCode: false})
      .then(r => { expect(r.status).to.eq(400); expect(r.body.error).to.contain('posterior'); });
  });
});
