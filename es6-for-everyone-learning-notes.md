# Wes Bos' ES6 for Everyone learning notes

This is a collection of my key takeaways on the excellent "ES6 for Everyone" course by Wes Bos, available at [ES6.io](https://es6.io).

## New Variables

### var Scoping Refresher

There are three types of variables in JavaScript:

- `var`
- `let`
- `const`

`var` can be reassigned and it is function- and block-scoped -- that is, it only works within the scope of the particular function/block where it is created and assigned (blocks can be if, for, while statements and the like). If it is created outside a function, its scope is global.

On the other hand, `let` and `const` are block-scoped and cannot be reassigned (more on that below).

### let Vs const

As stated above, both `let` and `const` are block-scoped and cannot be reassigned.

The following example shows block-scoping for `let`:

```javascript
let points = 50;
let winner = false;
if (points > 40) {
  let winner = true;
}
```

If you `console.log(winner)` it will still output `false`, as the `winner` variable you're logging to console is the one outside the `if` block. The one inside the block remains `true`, but won't be logged to console unless you include the `console.log(winner)` statement inside the `if` block.

Of course, you can change the value of a `let`, as in:

```javascript
let points = 50;
points = 60;
```

But not redeclare it:

```javascript
let points = 50;
let points = 60;

// throws SyntaxError: redeclaration of let points
```

In the case of `const` you cannot either reassign it nor redeclare it, it is a *constant* for all purposes:

```javascript
const name = 'David';
name = 'David Martinez';

// throws TypeError: invalid assignment to const `name'
```

However, objects can be assigned to `const` variables and their properties can be reassigned to different values -- they will still be the same objects:

```javascript
const person = {
  name: 'David',
  age: 42
}

person.age = 43;
```

What you cannot do is reassign the whole object to a different thing as in:

```javascript
const person = {
  name: 'David',
  age: 42
}

person = {age: 43};

// throws TypeError: Assignment to constant variable.
```

### let and const in the Real World

Both `let` and `const` variables are useful for replacing IIFEs ([immediately invoked function expressions](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)). Variables within IIFEs cannot be accessed from the outside (even if it's a `var`), therefore, `let` and `const` variables will do the same whenever they're inside a code block, with no need to create a whole IIFE.

`let` variables are also useful in for-loops as the looping variable (`let i = 0`) since they don't leak into the global (or window) scope.

### Temporal Dead Zone

`var` variables can be accessed before they're declared and assigned, however, they will return `undefined` in that case.

`let` and `const` will throw an `Uncaught ReferenceError` whenever they're tried to be accessed before being declared and assigned.

### Is var Dead? What Should I Use?

From [ES2015 const is not about immutability](https://mathiasbynens.be/notes/es6-const) by Mathias Bynens, who says that `const` does not indicate that a value is immutable, only its *binding*:

- use `const` by default
- only use `let` if rebinding is needed
- `var` shouldn't be used in ES6

From Kyle Simpson on an article that [no longer seems to be online](https://blog.getify.com/constantly-confusing-const/):

- Use `var` for top-level variables that are shared across many (especially larger) scopes.
- Use `let` for localized variables in smaller scopes.
- Refactor `let` to `const` only after some code has to be written, and you're reasonably sure that you've got a case where there shouldn't be variable reassignment.
