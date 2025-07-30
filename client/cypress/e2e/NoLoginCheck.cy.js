describe("Home Page", () => {
  it("loads the home page", () => {
    cy.visit("http://localhost:5173/");

    // Check logo and heading
    cy.get("nav").within(() => {
      cy.get('img[alt="logo"]').should("be.visible");
      cy.contains("h2", "DataLytics").should("be.visible");
    });

    // Check login and signup buttons
    cy.contains("button", "Log in").should("be.visible");
    cy.contains("button", "Sign up").should("be.visible");

    // Check headline text
    cy.contains("h1", "Transform Your Data Into Insights").should("be.visible");
    cy.contains(
      "p",
      "Upload, clean, transform, and visualize your data"
    ).should("be.visible");

    // Check main buttons
    cy.contains("button", "Get started now!").should("be.visible");
    cy.contains("button", "View demo").should("be.visible");

    // Check features section
    cy.contains("h1", "Powerful features").should("be.visible");
    cy.contains("div", "Data Upload").should("be.visible");
    cy.contains("div", "Visualization").should("be.visible");

    // Check footer
    cy.contains("footer", "Copyright@Orbital2025").should("be.visible");
  });
});

describe("Auth Page", () => {
  it("displays login form on /auth/login", () => {
    cy.visit("http://localhost:5173/auth/login");

    // Check heading and paragraph
    cy.contains("h2", "Welcome back").should("be.visible");
    cy.contains("p", "Sign in to your account to continue").should(
      "be.visible"
    );

    // Check login form fields
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.contains("button", "Log in").should("be.visible");

    // Check redirect link
    cy.contains("Don't have an account?").should("be.visible");
    cy.contains("Sign up").should("have.attr", "href", "/auth/signup");
  });

  it("displays signup form on /auth/signup", () => {
    cy.visit("http://localhost:5173/auth/signup");

    // Check heading and paragraph
    cy.contains("h2", "Create your account").should("be.visible");
    cy.contains("p", "Get started with your data analysis journey").should(
      "be.visible"
    );

    // Check signup form fields
    cy.get('input[name="userName"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="conf_password"]').should("exist");
    cy.contains("button", "Create an account").should("be.visible");

    // Check redirect link
    cy.contains("Already have an account?").should("be.visible");
    cy.contains("Log in").should("have.attr", "href", "/auth/login");
  });

  it("shows error if passwords do not match in signup", () => {
    cy.visit("http://localhost:5173/auth/signup");

    cy.get('input[name="userName"]').type("testuser");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="conf_password"]').type("different123");

    cy.contains("Please use the same password").should("be.visible");
  });
});

describe("Invalid route handling", () => {
  it("shows error page on unknown route", () => {
    cy.visit("http://localhost:5173/some/unknown/page", {
      failOnStatusCode: false,
    });

    // Check that the ErrorPage content appears
    cy.contains(
      "There is nothing here, maybe you have type in the url wrong."
    ).should("be.visible");
    cy.contains("Press here to come back home").should(
      "have.attr",
      "href",
      "/"
    );
  });
});
