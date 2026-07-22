https://gemini.google.com/app/c80c04a827e2bfa0?hl=en-IN
https://gemini.google.com/app/f9e63e0eb6e122bc?hl=en-IN
https://gemini.google.com/app/ac7989284f2d8e87?hl=en-IN

https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a4c6aa6-8204-83ee-ba45-ef22e5db6863

# Express + Typescript Setup

https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a4c7308-d130-83e8-90d2-63a047aa78b9

# Prisma + Postgres setup

https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a4c8c9c-4fd0-83ee-8575-ea1a19beef44

# Primsa schema definition

https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a4c8eb0-6db4-83e8-81de-041c021e77ec

# Prisma back relations

https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a4cb254-a3a0-83ee-9d29-044f2c6eb458

Prisma Migrate is the source of truth for schema changes. You don't manually create tables in Neon.

# Error Handling

https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a508ff1-22dc-83ee-8ff7-34622fce45a7

In JavaScript, private properties are created by prefixing the property name with a hash (#) symbol. This native syntax enforces strict encapsulation, ensuring the properties can only be read or modified inside the class that defines them.

How TypeScript Parameter Properties WorkIn TypeScript, adding an accessibility modifier (like public, private, or readonly) directly to a constructor parameter forces the compiler to do two things automatically:Declare the property on the class instance.Assign the argument value to that property when the object is instantiated.The TypeScript Shorthand (Single Location)

class User {
// No need to declare "public name" or "readonly id" up here!
constructor(
public name: string,
readonly id: number
) {
// No need to write "this.name = name" here either!
}
}

const user = new User("Alice", 101);
console.log(user.name); // "Alice"

What the Compiler Automatically Generates

class User {
constructor(name, id) {
this.name = name; // Created and assigned automatically
this.id = id; // Created and assigned automatically
}
}

Thus for error hadnling in express 5 what is needed a gloabal AppError and error middleware, error is propagated automatically in express5 and a error handler middleware

How to generate and use primsma client
https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a51a973-8808-83e8-b5e9-a3345b394c10

Typed Params
https://chatgpt.com/g/g-p-6a49c38571148191bf064b777151e370-software-engineering-upskilling-2026/c/6a58830b-0a20-83e8-9587-0d0d335e4922

'npx prisma migrate dev --create-only --name add_account_type'
Creates aan empty migration

after this you can add your manual constraint and then 'npx prisma migrate dev' - this command will execute the migration
![alt text](learnings_assets/image.png)
