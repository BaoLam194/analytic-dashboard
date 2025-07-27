describe("Dashboard Page", () => {
  const email = "tranbaolam006@gmail.com";
  const password = "123456";

  beforeEach(() => {
    cy.visit("http://localhost:5173/auth/login");
  });

  it("logs in and redirects to dashboard", () => {
    // Fill out form
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get("form").submit();

    // Wait for redirect to "/"
    cy.url().should("eq", `http://localhost:5173/`);

    // Assert dashboard content
    cy.contains("DataLytics");
    cy.contains("Analytic");

    // Check username is visible
    cy.get("header").within(() => {
      cy.get("span").should("contain.text", "blisme"); // update if username differs
    });

    // Check DataDisplayer presence
    cy.get("div").should("exist");
  });

  it("logs out properly", () => {
    // Login first
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get("form").submit();

    cy.wait(5500);
    // Click logout
    cy.contains("Log out").click();

    // Should redirect to login or home
    cy.url().should("eq", "http://localhost:5173/"); // Adjust based on your redirect logic
  });
});
