---
trigger: always_on
---

## About the project:
This a forum app developed using Nuxt, as architecture use Domain Driven Desing following CodelyTV style.
The API is in ./server path and the application is in ./app path. Inside ./server/contexts are all the bounded contexts related to a forum. This is agnostic to framework.

## Code style guide:
* Always respond in Spanish, with clear and detailed answers.
* Use strategic and tactical Domain Driven Design (DDD) architecture.
* Follow TDD: Write tests first, then implementation
* Follow the architecture and code style of those github repositories: [title](https://github.com/CodelyTV/aggregates-course/tree/main/08-next_steps/1-design_canvas) and [title](https://github.com/CodelyTV/domain_modeling-errors-course/tree/main/09-our_take)
* Tests should check behavior to avoid unnecessary tests.
* Maintain compatibility with existing Strapi.
* The code must always be in English.
* Apply SRP (Single Responsibility Principle) principle.
* Apply DRY (Don't Repeat Yourself) principle.
* Apply ISP (Interface Segregation Principle) principle.
* Apply OCP (Open/Closed Principle) principle.
* Apply LSP (Liskov Substitution Principle) principle.
* Apply DIP (Dependency Inversion Principle) principle.
* Apply SOLID principles.
* Apply KISS (Keep It Simple, Stupid) principle.
* Apply YAGNI (You Aren't Gonna Need It) principle.
* Separation of interests principle.
* Reveal the intention in your code so that it is clear and expressive.
* Minimize complexity by keeping only what is necessary.
* Eliminate duplications that generate bugs and cost overruns.
* Ensure proper functioning with reliable and maintainable tests.
* Do not add comments in the generated code.
* Don't add console.log statements in the generated code.
* Only one level of indentation per method.
* Don't use the else keyword.
* Wrap primitives and strings in value objects.
* Use first-class collections.
* One dot per line (Law of Demeter).
* Don't abbreviate variable, methods, or class names.
* Keep all entities small.
* No classes with more than four instance variables.
* Keep aggregates small and focused

## Instructions to transform the bounded contexts to code:
You have to create:
* A module for the aggregate:
    * The module name should be the name of the aggregate in plural.
    * Should be written in $FOLDERS_CASE.
    * Should be inside the `contexts/$CONTEXT_NAME` directory.
* Every module contains 3 folders: `domain`, `application`, and `infrastructure`.
* Simple value objects will have a private property called “value” and a getter to access their primitive value from the outside. They will have a named constructor called createNone to create a value object with a null value whenever it can be nullable.
* Simple value objects will not have a method called fromPrimitive or fromPrimitives.
* Value objects that are not strings must have a toString method.
* Value objects, entities, and aggregates will have guard clauses as private methods that are used in the constructor to maintain data integrity. The name of the guard clauses will begin with the word `ensure`, for example `#ensureIsInteger`.
* Aggregates will have a method called toPrimitives that will return all value objects as primitives wrapped in a serialized object. They will have a named constructor when necessary.
* Aggregates will have a method called fromPrimitives that will create an object using default constructor hidden the value objects.
* Each bounded context must have its own ServiceProvider that registers specific dependencies for domain, application, and infrastructure services using `contexts/shared/infrastructure/dependency-container`.
* Inside the `domain` folder, you'll have to create:
    * An `$AGGREGATE_NAME.$FILES_FORMAT file that contains the aggregate class:
        * The file name should be the name of the aggregate in PascalCase.
        * The aggregate class should have the properties, invariants, policies, and events that the aggregate has.
        * You should take a look to other aggregates to see the format.
    * A `$DOMAIN_EVENT.$FILES_FORMAT file per every event that the aggregate emits:
        * The file name should be the name of the event in PascalCase.
        * The event should have only the mutated properties.
        * You should take a look to other events to see the format.
    * A `$DOMAIN_ERROR.$FILES_FORMAT file per every invariant that the aggregate enforces:
        * The file name should be the name of the invariant in PascalCase.
        * You should take a look to other errors to see the format.
    * A `$REPOSITORY.$FILES_FORMAT file that contains the repository interface:
        * The file name should be the name of the aggregate in PascalCase with the suffix `Repository`.
        * The repository should have the methods to save and retrieve the aggregate.
        * You should take a look to other repositories to see the format.
* Inside the `application` folder, you'll have to create:
    * A folder using $FOLDERS_CASE for every mutation that the aggregate has (inferred by the domain events) and for every query that the aggregate has.
    * Inside every query/mutation folder, you'll have to create an `$USE_CASE.$FILES_FORMAT file that contains the query/mutation use case.
        * The file name should be the name of the query/mutation in PascalCase in a service mode. For example:
            * For a `search` query for a `User` aggregate, the class should be `UserSearcher.$FILES_FORMAT.
            * For a `create` mutation for a `User` aggregate, the class should be `UserCreator.$FILES_FORMAT.
        * You should take a look to other queries/mutations to see the format.
* Inside the `infrastructure` folder, you'll have to create:
    * A `$REPOSITORY.$FILES_FORMAT file that contains the repository implementation:
        * The file name should be the name of the aggregate in PascalCase with the suffix `Repository`.
        * Also, the file should have an implementation prefix. For example, for a `User` aggregate and a Postgres implementation, the file should be `PostgresUserRepository.$FILES_FORMAT.
        * The repository should implement the repository interface from the domain layer.
        * You should take a look to other repositories to see the format and use the most used implementation.
* You'll have to create a test per every use case:
    * The test should be inside the `tests/contexts/$CONTEXT_NAME/$MODULE_NAME/application` directory.
    * You should create an Object Mother per every aggregate and value object that you create inside `tests/contexts/$CONTEXT_NAME/$MODULE_NAME/domain`.
    * Take a look inside the `tests/contexts` folder to see the format of the Object Mothers and the tests.
    * You should only create a test per every use case, don't create any extra test case.
* You should create a test for the repository implementation:
    * The test should be inside the `tests/contexts/$CONTEXT_NAME/$MODULE_NAME/infrastructure` directory.

## Framework and tools:
* Use Typescript by default.
* Learn and use Nuxt 4 [Nuxt](https://nuxt.com/docs/4.x/getting-started/installation).
* Learn and use Vitest [Vitest](https://vitest.dev/) as framework test following the best practice.
* Learn use Node 22.18.0