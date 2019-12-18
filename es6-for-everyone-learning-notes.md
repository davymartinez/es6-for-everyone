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

## Function Improvements: Arrows and Default Arguments

### Arrow Functions Introduction

Three key benefits of arrow functions:

- They're more concise than regular functions
- They have implicit returns, which allows for one-liners
- They don't rebind the value of `this`, which is really useful when you embed an arrow function inside of another function

#### Arrow function examples:

```javascript
const namesArray = ['Herman', 'Lily', 'Eddie', 'Grandpa', 'Marylin'];

// regular function
const fullNames = namesArray.map(function(name) {
  return `${name} Munster`;
});

// arrow function
const fullNames2 = namesArray.map((name) => {
  return `${name} Munster`;
});

// arrow function without parenthesized argument
const fullNames3 = namesArray.map(name => {
  return `${name} Munster`;
});

// arrow function with implicit return
const fullNames4 = namesArray.map(name => `${name} Munster`);

// all of the above functions return the exact same array
// [ "Herman Munster", "Lily Munster", "Eddie Munster", "Grandpa Munster", "Marylin Munster" ]

// arrow function without argument
// returns [ "The Munsters", "The Munsters", "The Munsters", "The Munsters", "The Munsters" ]

const fullNames5 = namesArray.map(() => `The Munsters`);
```

Arrow functions are always anonymous, as opposed to named functions:

```javascript
// named function:
function sayMyName(name) {
  alert(`Hello ${name}`);
}

// arrow function:
const sayMyName = name => alert(`Hello ${name}`);
```

### More Arrow Function Examples

Example of implicit return to object literal:

```javascript
const race = '100m Dash';
const winners = ['Java\'s Crypt','Zinga Son', 'Payne Diaz'];

const win = winners.map((winner, i) => ({name: winner, race, place: i + 1}));

// returns:
[
  {
    name: 'Java\'s Crypt',
    race: '100m Dash',
    place: 1
  },
  {
    name: 'Zinga Son',
    race: '100m Dash',
    place: 2
  },
  {
    name: 'Payne Diaz',
    race: '100m Dash',
    place: 3
  },
]
```

### Arrow Functions and `this`

Inside arrow functions `this` does not get rebound. It inherits the parent's scope. There are times when you need `this` to reference the scope of the function where it's being called -- in those cases, use regular functions.

Do notice that in embedded functions, that is, a function inside another function, the embedded one can be an arrow function, since it will inherit the scope of `this`.

### Default Function Arguments

Default arguments let us declare values that will be used as a default if we don't pass any arguments to a function. For example:

```javascript
function calculateBill(total, tax=0.13, tip=0.15) {
  return total + (total * tax) + (total * tip);
}

const totalBill = (100);

// returns 128
```

In the above function, both `tax` and `tip` get default values of `0.13` and `0.15` respectively, whereas we're passing just `100`, which corresponds to `total`.

Notice you can still pass other values to `tax` and `tip`, which will override the default values. You can also pass `undefined` to any one of the values if you're passing two other values, as in:

```javascript
const totalBill = (100, undefined, 0.10);

// returns 110
```

### When NOT to Use an Arrow Function

- **When you really need `this`**: see "Arrow Functions and `this`" above

- **When you need a method to bind to an object**: that is, anytime you need to have a method declared inside an object

- **When you need to add a prototype method**: that is, when you need to define a `constructor` method inside a `class`

- **When you need arguments object**: for example, from an `Array.from(arguments)` call inside a function

## Template Strings

Use backticks to create template literals, enclosing variables inside `${ }`. You can also evaluate expressions inside template literals:

```javascript
const name = 'Snickers';
const age = 2;
const sentence = `My dog ${name} is ${age * 7} years old.`
console.log(sentence);
// outputs: My dog Snickers is 14 yars old.
```

### Creating HTML Fragments with Template Literals

Template literals are quite useful to create HTML fragments and assign them to variables:

```javascript
const person = {
  name: 'David',
  job: 'Music Metadata Senior Editor',
  city: 'Buenos Aires',
  bio: 'David is just a cool guy that loves music and got to work classifying it!'
}

const markup = `
  <div class="person">
    <h2>
      ${person.name}
      <span class="job">${person.job}</span>
    </h2>
    <p class="location">${person.city}</p>
    <p class="bio">${person.bio}</p>
  </div>
`;

document.body.innerHTML = markup;
```

You can also embed template literals inside other literals, for example, to create a list out of an array with elements, use a map function:

```javascript
const dogs = [
  {name: 'Snickers', age: 2},
  {name: 'Ugo', age: 8},
  {name: 'Sonny', age: 1}
];

const markup = `
  <ul class="dogs">
    ${dogs.map(dog => `
      <li>
        ${dog.name} is ${dog.age} years old
      </li>`).join('')}
  </ul>
`;

document.body.innerHTML = markup;
```

You can also use ternary operators inside template literals for conditional rendering:

```javascript
const song = {
  name: 'Dying to live',
  artist: 'Tupac',
  featuring: 'Biggie Smalls'
};

const markup = `
  <div class="song">
    <p>
      ${song.name} - ${song.artist} ${song.featuring ? `(Feat. ${song.featuring})` : ''}
    </p>
  </div>
`;

// The above will only render the featured artists if there's one in the song object

document.body.innerHTML = markup;
```

You can run functions inside template literals:

```javascript
const beer = {
  name: 'Belgian Wit',
  brewery: 'Steam Whistle Brewery',
  keywords: ['pale', 'cloudy', 'spiced', 'crisp']
}

function renderKeywords(keywords) {
  return `
    <ul>
      ${keywords.map(keyword => `<li>${keyword}</li>`).join('')}
    </ul>
  `
}

const markup = `
  <div class="beer">
    <h2>
      ${beer.name}
    </h2>
    <p class="brewery">
      ${beer.brewery}
    </p>
    ${renderKeywords(beer.keywords)}
  </div>
`
document.body.innerHTML = markup;
```

### Tagged Template Literals

Tagged template literals are basically *syntactic sugar* that allows us to parse, or break down, a template literal into several arguments: an array of the plain text, and then the template literal expressions in the same order than they appear. For example:

```javascript
<script>
  // in the function below, 'strings' is the array of text
  // ...values is the rest operator that takes in the rest of the arguments
  function highlight(strings, ...values) {
    let str = '';
    // we loop through the array and concatenate the strings and values
    strings.forEach((string, i) => {
      str =+ `${string} <span class="hl">${values[i] || ''}</span>`;
    });
    return str;
  }

  const name = 'Snickers';
  const age = 100;

  // here comes the tagged template literal:
  const sentence = highlight`My dog's name is ${name} and he is ${age} years old.`;
  document.body.innerHTML = sentence;
</script>
```
