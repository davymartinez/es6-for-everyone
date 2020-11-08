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

If we `console.log(winner)` it will still output `false`, as the `winner` variable we're logging to console is the one outside the `if` block. The one inside the block remains `true`, but won't be logged to console unless we include the `console.log(winner)` statement inside the `if` block.

Of course, we can change the value of a `let`, as in:

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

In the case of `const` we cannot either reassign it nor redeclare it, it is a *constant* for all purposes:

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

What we cannot do is reassign the whole object to a different thing as in:

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
- Refactor `let` to `const` only after some code has to be written, and we're reasonably sure that we've got a case where there shouldn't be variable reassignment.

## Function Improvements: Arrows and Default Arguments

### Arrow Functions Introduction

Three key benefits of arrow functions:

- They're more concise than regular functions
- They have implicit returns, which allows for one-liners
- They don't rebind the value of `this`, which is really useful when we embed an arrow function inside of another function

#### Arrow function examples

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

Inside arrow functions `this` does not get rebound. It inherits the parent's scope. There are times when we need `this` to reference the scope of the function where it's being called -- in those cases, use regular functions.

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

Notice we can still pass other values to `tax` and `tip`, which will override the default values. We can also pass `undefined` to any one of the values if we're passing two other values, as in:

```javascript
const totalBill = (100, undefined, 0.10);

// returns 110
```

### When NOT to Use an Arrow Function

- **When we really need `this`**: see "Arrow Functions and `this`" above

- **When we need a method to bind to an object**: that is, anytime we need to have a method declared inside an object

- **When we need to add a prototype method**: that is, when we need to define a `constructor` method inside a `class`

- **When we need arguments object**: for example, from an `Array.from(arguments)` call inside a function

## Template Strings

Use backticks to create template literals, enclosing variables inside `${ }`. We can also evaluate expressions inside template literals:

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

We can also embed template literals inside other literals, for example, to create a list out of an array with elements, use a map function:

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

We can also use ternary operators inside template literals for conditional rendering:

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

We can run functions inside template literals:

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

### Sanitizing User Data with Tagged Templates

Tagged template literals can be useful in sanitizing HTML, that is, cleaning any potentially malicious HTML input code in order to prevent XSS attacks.

[DOMPurify](https://github.com/cure53/DOMPurify) is a library that can be used for this purpose. For example:

```javascript
...
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/0.8.2/purify.min.js"></script>
<script>
  function sanitize(strings, ...values) {
    const dirty = strings.reduce((prev, next, i) => `${prev}${next}${values[i] || ''}`, '');
    return DOMPurify.sanitize(dirty);
  }

  const first = 'David';
  const aboutMe = `I love to do evil <img src="http://unsplash.it/100/100?random" onload="alert('you got hacked');" />`;
  const html = sanitize`<h3>${first}</h3><p>${aboutMe}</p>`;

  const bio = document.querySelector('.bio');
  bio.innerHTML = html;
</script>
```

What we're doing here is tagging the `sanitize()` function to the `html` variable, which contains potentially malicious code. The function, in turn, runs everything through a reducer and feeds the `sanitize()` function from DOMPurify.

## Additional String Improvements

### New String Methods

Some new useful ES6 string methods include:

- `.startsWith()`: determines whether a string begins with the characters of a specified string, returns true or false.

- `.endsWith()`: determines whether a string ends with the characters of a specified string, returns true or false.

- `.includes()`: determines whether one string may be found within another string, returns true or false.

- `.repeat()`: constructs and returns a new string which contains the specified number of copies of the string on which it was called, concatenated together.

## Destructuring

Destructuring allows us to "unpack" values from an object or an array and assign these values to new variables:

### Destructuring Objects

Take this object, for example:

```javascript
const person = {
  firstName: 'David',
  lastName: 'Martinez',
  country: 'Argentina',
  city: 'Buenos Aires',
  twitter: '@OnlyApo'
}
```

Now we can destructure it, unpacking certain keys from it and assigning them to new variable, as follows:

```javascript
const { firstName, lastName, twitter } = person;

console.log(firstName); // 'David'
console.log(lastName);  // 'Martinez'
console.log(twitter);   // '@OnlyApo'
```

A way to look at this is as if we're saying: "give me a variable called `firstName`, another called `lastName`, and another called `twitter`, and take them from the `person` object."

We can also reach into nested values, like this:

```javascript
const person = {
  firstName: 'David',
  lastName: 'Martinez',
  links: {
    social: {
      twitter: 'https://twitter.com/OnlyApo',
      linkedIn: 'https://linkedin.com/in/davidmartinezgarcia'
    },
    web: {
      blog: 'https://davymartinez.com/posts'
    }
  }
}

const { twitter, linkedIn } = person.links.social;
```

We can also rename these variables when assigning them, like this:

```javascript
const { twitter: twtr, linkedIn: li } = person.links.social;
```

(Not that the above are great variable names, though, but they illustrate the point...)

Destructured assignments can also receive new variables, not originally included as keys in the object, with default values:

```javascript
const settings = { width: 300, color: 'black' };

const { width = 100, height = 100, color = 'blue', fontSize = 18 };
```

In the above example, neither `height` nor `fontSize` are destructured from the `settings` object, but they're declared anyway and given default values, so they won't be undefined. Note that both `width` and `color` get default values, but if we call them, they will give theh values from the object (`300` and `'black'`, resp.)

All of this can be combined as the following example of object destructuring with variable renaming and default values shows:

```javascript
const { w: width = 400, h: height = 500 } = { w: 800 };
```

What's happening here is that we're taking an object which originally only included a `w: 800` key-value pair, destructured into a new one with two variables, `width` and `height`, both of which have default values, and the first of them being additionally renamed from `w` to `width`.

### Destructuring Arrays

In order to destructure arrays, we proceed in the same way as with objects, but using, of course, square brackets (`[]`) instead of curly braces (`{}`):

```javascript
const details = ['David Martinez', 123, 'davymartinez.com'];
const [ name, id, website ] = details;
```

We can also create an array out of a string list and destructure it with the `.split()` method:

```javascript
const data = 'Baseball,Sports,90210,23';
const [ itemName, category, sku, inventory ] = data.split(',');
```

Use the rest operator with array destructuring as follows:

```javascript
const team = ['David', 'Ernst', 'Felicity', 'Gus', 'Harriet'];
const [captain, assistant, ...players] = team;
```

### Swapping Variables with Destructuring Arrays

Array destructuring lets us swap variable values without using the old 'temp' variable trick. That is, instead of using something like this:

```javascript
let inRing = 'Hulk Hogan';
let onSide = 'The Rock';
let tmp = '';

tmp = inRing;
inRing = onSide;
onSide = tmp;
```

We can use destructured arrays like so:

```javascript
let inRing = 'Hulk Hogan';
let onSide = 'The Rock';

[inRing, onSide] = [onSide, inRing];
```

### Destructuring Functions - Multiple returns and named defaults

With destructuring you can easily return individual values from inside an object nested inside a function:

```javascript
function convertCurrency(amount) {
  const converted = {
    USD: amount * 0.76,
    GBP: amount * 0.53,
    AUD: amount * 1.01,
    MEX: amount * 13.30
  };
  return converted;
}

const { USD, GBP, AUD, MEX } = convertCurrency(amount)
```

As for named defaults, with destructured objects we can make function parameters "order independent", that is, we no longer need to remember/know the exact order of the variables that make up such function parameters. This is achieved by making the function parameters an object, basically by wrapping the parameters inside curly braces.

To illustrate this, consider a tip calculator function:

```javascript
function tipCalc({ total, tip = 0.15, tax = 0.13 }) {
  return total + (tip * total) + (tax * total);
}

const bill = tipCalc({ tip: 0.20, total: 200 });
```

In the above example, when we skip `tax` it would still refer to the default `tax=0.13` value. We could even shuffle the values and `bill` would still work as intended, because the parameter is a destructured object:

```javascript
const bill = tipCalc({ total: 200, tip: 0.20 });
```

We could also just call `tipCalc()`, with no arguments, if all its values are default. However, we first have to also pass a default empty object so that it won't return `undefined`:

```javascript
function tipCalc({ total = 100, tip = 0.15, tax = 0.13 } = {}) {
  return total + (tip * total) + (tax * total);
}

const bill = tipCalc();
```

## Iterables and Looping

### The for...of Loop

The `for...of` loop is a useful statement for looping through iterables (anything that can be looped over: arrays, strings, maps, sets, generators).

It solves the following shortcomings of other looping statements:

- The standard `for` loop syntax can be confusing
- The `for each` loop cannot be aborted/resumed with `break`/`continue`
- The `for...in` loop returns enumerable properties, which might not be what we need

### The for...of loop in Action

With a `for...of` loop alone it is not possible to get the indexes of an array. However, we can still access those by using the `entries()` iterator:

```javascript
const cuts = ['Chuck', 'Brisket', 'Shank', 'Short Rib'];

for (const cut of cuts.entries()) {
  console.log(cut);
}

// Output:
// [ 0, 'Chuck' ]
// [ 1, 'Brisket' ]
// [ 2, 'Shank' ]
// [ 3, 'Short Rib' ]
```

We can also access both the index and the entry as independent variables by destructuring them:

```javascript
const cuts = ['Chuck', 'Brisket', 'Shank', 'Short Rib'];

for (const [i, cut] of cuts.entries()) {
  console.log(`${cut} is the ${i + 1} item`);
}

// Output:
// Chuck is the 1 item
// Brisket is the 2 item
// Shank is the 3 item
// Short Rib is the 4 item
```

`for...of` can also loop through an `arguments` iterator:

```javascript
function addUpNumbers() {
  let total = 0;
  for (const num of arguments) {
    total =+ num;
  }
  return total;
}

addUpNumbers(10, 23, 52, 34, 12, 13, 123);
// returns 267
```

### Using for...of with Objects

As of ES 2016, `for...of` is still not suitable for looping through objects, as these are not iterable (ES 2017 introduced `Object.entries()`). We can, however, we can use `Object.keys()`, which returns an array with the object's keys. We can also use a `for...in` to the same effect of extracting keys and values from an object.

Thus, with `for...of`:

```javascript
const apple = {
  color: 'Red',
  size: 'Medium',
  weight: 50,
  sugar: 10
}

for (const prop of Object.keys(apple)) {
  const value = apple[prop];
  console.log(`${prop}: ${value}`)
}
```

With `for...in`:

with `for...of`:

```javascript
const apple = {
  color: 'Red',
  size: 'Medium',
  weight: 50,
  sugar: 10
}

for (const prop in apple) {
  const value = apple[prop];
  console.log(`${prop}: ${value}`)
}
```

## An Array of Array Improvements

### Array.from() and Array.of()

`Array.from()` lets us create arrays from array-like or iterable objects.

Working with DOM elements provides opportunities to use `Array.from()`. For example:

```html
<div class="people">
  <p>Geddy</p>
  <p>Alex</p>
  <p>Neil</p>
</div>
<script>
  const people = Array.from(document.querySelectorAll('.people p'));
  const names = people.map(person => person.textContent);
</script>

<!--Output: ["Geddy", "Alex", "Neil"] ->
```

An alternative one-line declaration of the above script would be:

```javascript
const people = document.querySelectorAll('.people p');
const names = Array.from(people, person => { return person.textContent } );
```

We can also create arrays from an `arguments` iterator, like this:

```javascript
function sumAll() {
  const nums = Array.from(arguments);
  return nums.reduce((prev, next) => prev + next, 0);
}
sumAll(2, 23, 234, 2345, 23456, 65432, 5432, 432, 32, 2);
// returns 97390
```

As for `Array.of()` it simply creates an array from a list of arguments:

```javascript
const ages = Array.of(42, 41, 13, 8);
console.log(ages);
// outputs [42, 41, 13, 8];
```

### Array.find() and .findIndex()

 The `Array.find()` callback method is useful to find particular values inside an array (easier to use than regexes). Suppose we have an array of objects like the one below:

 ```javascript
const posts = [
  {
    "code":"BAcyDyQwcXX",
    "caption":"Lunch #hamont",
    "likes":56,
    "id":"1161022966406956503",
    "display_src":"https://scontent.cdninstagram.com/hphotos-xap1/t51.2885-15/e35/12552326_495932673919321_1443393332_n.jpg"
  },
  {
    "code":"BAcJeJrQca9",
    "caption":"Snow! ⛄️🌨❄️ #lifewithsnickers",
    "likes":59,
    "id":"1160844458347054781",
    "display_src":"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/12407344_1283694208323785_735653395_n.jpg"
  },
  {
    "code":"BAF_KY4wcRY",
    "caption":"Cleaned my office and mounted my recording gear overhead. Stoked for 2016!",
    "likes":79,
    "id":"1154606670337393752",
    "display_src":"https://scontent.cdninstagram.com/hphotos-xpf1/t51.2885-15/e35/923995_1704188643150533_1383710275_n.jpg"
  }
];
```

And we want to find a particular `code` in there, say `BAcJeJrQca9`. With `.find()`, we just do the following:

```javascript
const code = 'BAcJeJrQca9';
const post = posts.find(post => post.code === code);
console.log(post);
// logs:
// {
//     "code":"BAcJeJrQca9",
//     "caption":"Snow! ⛄️🌨❄️ #lifewithsnickers",
//     "likes":59,
//     "id":"1160844458347054781",
//     "display_src":"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/12407344_1283694208323785_735653395_n.jpg"
//   },
```

Whereas `.findIndex()`, as it name implies, returns the index:

```javascript
const code = 'BAcJeJrQca9';
const post = posts.findIndex(post => post.code === code);
console.log(post);
// returns 1
```

### Array.some() and .every()

The `Array.some()` method checks if at least one item in a given array passes a condition, returning `true`. If no item passes it, it returns `false`:

```javascript
const ages = [32, 15, 19, 21];

// is there at least one adult in the group?
const adultPresent = ages.some(age => age >= 18);
console.log(adultPresent);
// returns true
```

On the other hand, `Array.every()` only returns `true` if every item passes the given condition:

```javascript
// is everyone old enough to drink?
const allOldEnough = ages.every(age => age >= 18);
console.log(allOldEnough);
// returns false
```

## Say Hello to ...Spread and ...Rest

### Spread Operator Introduction

The spread operator lets us expand iterables. Easier with an example:

```javascript
const featured = ['Deep Dish', 'Peperoni', 'Hawaiian'];
const specialty = ['Meatzza', 'Spicy Mama', 'Margherita'];
// using spread:
const pizzas = [...featured, ...specialty];
console.log(pizzas);
// outputs ['Deep Dish', 'Peperoni', 'Hawaiian', 'Meatzza', 'Spicy Mama', 'Margherita']
```

The above example is an alternative to `.concat()`.

### More Spread Examples

We can use the spread operator as an alternative to `Array.from()`. Consider the following HTML snippet:

```html
<div class="people">
  <p>Lee</p>
  <p>Lifeson</p>
  <p>Peart</p>
</div>
```

We can then spread a `.querySelectorAll` node list into an array, like so:

```javascript
const people = [...document.querySelectorAll('.people')];
const lastNames = people.map(person => person.textContent);
// logs ["Lee", "Lifeson", "Peart"]
```

Do notice, though, that `Array.from()` might be often times more readable.

We can also deep-copy an array and paste it into another one:

```javascript
const deepDish = {
  pizzaName: 'Deep Dish',
  size: 'Medium',
  ingredients: ['Marinara', 'Italian Sausage', 'Dough', 'Cheese']
};
// lets add the ingredients' array into a new one:
const shoppingList = ['Milk', 'Flour', ...deepDish.ingredients];
// logs ['Milk', 'Flour', 'Marinara', 'Italian Sausage', 'Dough', 'Cheese']
```

The spread operator in conjunction with `.slice()` is also useful to "prune" entries from an array of objects.

Suppose we have the following array of comment objects and we want to delete a mean one:

```javascript
const comments = [
  {id: 209384, text: 'I love your dog!'},
  {id: 523423, text: 'Cuuute!'},
  {id: 632429, text: 'You are so dumb'},
  {id: 192834, text: 'Nice work on this!'}
];
// the offending comment is:
const id = 632429;
// we want to find its id:
const commentIndex = comments.findIndex(comment => comment.id === id);
// we slice and spread the returning arrays into a new array
// (if we don't spread them, this will become an array of arrays, and not an array of objects)
const newComments = [...comments.slice(0, commentIndex), ...comment.slice(commentIndex + 1)];
```

### Spreading into a Function

If we push an array into another array, the one we're pushing gets "embedded" as sub-array into the other one:

```javascript
const inventors = ['Einstein', 'Newton', 'Galileo'];
const newInventors = ['Musk', 'Jobs'];
inventors.push(newInventors);
console.log(inventors);
// outputs: ['Einstein', 'Newton', 'Galileo', ['Musk', 'Jobs']]
```

However, by using spread we get an extended, flattened array:

```javascript
const inventors = ['Einstein', 'Newton', 'Galileo'];
const newInventors = ['Musk', 'Jobs'];
inventors.push(...newInventors);
console.log(inventors);
// outputs: ['Einstein', 'Newton', 'Galileo', 'Musk', 'Jobs']
```

Similarly, we can spread array values into a function, like this:

```javascript
const name = ['David', 'Martinez'];

function sayHi(first, last) {
  alert(`Hi there, ${first} ${last}`);
}

sayHi(...name);
//alerts 'Hi there, David Martinez'
```

### The ...rest Param in Functions and Destructuring

The `...rest` parameters syntax works in the opposite fashion to the `...spread` operator: it literally allows us to take the rest of the parameters in a function call and pack them into an array.

The following function takes a given exchange rate (the first parameter) and applies it to the rest of the parameters, which are different amounts of a currency:

```javascript
function convertCurrency(rate, ...amounts) {
  return amounts.map(amount => amount * rate);
}

const amounts = convertCurrency(1.54, 10, 23, 52, 1, 56);
// returns [15.4, 35.42, 80.08, 1.54, 82.24000000000001]
```

We can also use rest parameters for destructuring arrays. In the example below, we assing `name` to  `'David'`, `id` to `123` and the rest of the values are assigned to `...runs`:

```javascript
const runner = ['David', 123, 5.5, 5, 4, 6, 35];
const [name, id, ...runs] = runner;
```

## Object Literal Upgrades

In ES6 we can declare object keys without a value if they are the same as variables declared alongside the object. An example makes it, hopefully, clearer.

Suppose we have the following `const` declarations:

```javascript
const first = 'Bully';
const last = 'Martinez';
const age = 2;
const breed = 'Bull Terrier';
```

Next, we'll declare an object that contains the keys that are the same as the above `const`'s:

```javascript
const dog = {
  first: first,
  last: last,
  age: age,
  breed: breed
}
```

We can avoid all this repetition by just declaring the keys:

```javascript
const dog = {
  first,
  last,
  age,
  breed
}
```

And it will work all the same.

We can, of course, add different keys with their corresponding values, but as long as there are keys named the same as other variables outside the object, they will work OK:

```javascript
const dog = {
  firstName: first,
  last,
  age,
  breed,
  pals: ['T-Bone', 'Linda']
}
```

Regardind method definitions inside an object, we can use a shorthand for functions, like this:

```javascript
const modal = {
  create(selector) {
    // method
  },
  open(content) {
    // method
  },
  close(file) {
    // method
  },
}
```

Notice that the functions above could have been defined as `create = function(selector){//}`.

## Promises

A good way to visualize the concept of a Promise in JavaScript is "something that will probably happen in the future, but just not immediately."

The [formal Promise definition from MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) is:

> A **Promise** is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers with an asynchronous action's eventual success value or failure reason. This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value, the asynchronous method returns a promise to supply the value at some point in the future.

A common use for Promises is to fetch data from APIs, normally in JSON format. They use the .fetch() and .then() methods to accomplish this. For example, the following code fetches data from a URL, formats it into JSON and logs it to console, while at the same time catching any possible errors:

```javascript
const postsPromise = fetch('https://wesbos.com/wp-json/wp/v2/posts');

postsPromise
  .then(data => data.json())
  .then(data => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
```

### Building your own Promises

We can use the Promise constructor to create our own promises, like this:

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Dave is cool');
  }, 1000);
});

p.then(data => {
  console.log(data);
})
```

The above code resolves the promise after 1000ms (1s) and console logs the `'Dave is cool'` text. Not too useful in practice but helps illustrate the point of how to declare a `new Promise()`.

The same code from above can be slightly refactored to throw an error, by rejecting instead of resolving:

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(Error('Dave isn\'t cool'));
  }, 1000);
});

p
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
```

### Chaining Promises and Flow Control

Querying a database via NodeJS is a common use case for chaining promises. In the example below we have two arrays of objects simulating two tables of a database. First we declare a function that finds a given post by its id, and then chain it to another function that "embeds" the author's data from the `authors` array into the post entry, a process called "hydration". We achieve this with promises:

```javascript
const posts = [
  {title: 'I love JavaScript', author: 'Wes Bos', id: 1},
  {title: 'CSS!', author: 'Chris Coyier', id: 2},
  {title: 'Dev Tools Tricks', author: 'Addy Osmani', id:3}
];

const authors = [
  {name: 'Wes Bos', twitter: '@wesbos', bio: 'Canadian developer'},
  {name: 'Chris Coyier', twitter: '@chriscoyier', bio: 'CSS Tricks and CodePen'},
  {name: 'Addy Osmani', twitter: '@addyosmani', bio: 'Googler'},
];

function getPostById(id) {
  // create a new promise
  return new Promise((resolve, reject) => {
    // using a setTimeout to mimic a database connection
    setTimeout(() => {
      // find the post we want
      const post = posts.find(post => post.id === id);
      if (post) {
        resolve(post); // send the post back
      } else {
        reject(Error('No post found!'));
      }
    }, 2000);
  });
};

function hydrateAuthor(post) {
  // create a new promise
  return new Promise((resolve, reject) => {
    // find the author
    const authorDetails = authors.find(person => person.name === post.author);
    if (authorDetails) {
      // "hydrate" the post object with the author object
      post.author = authorDetails;
      resolve(post);
    } else {
      reject(Error('Cannot find the author!'));
    }
  });
}

getPostById(2)
  .then(post => {
    return hydrateAuthor(post);
  })
  .then(post => {
    console.log(post);
  })
  .catch(err => {
    console.error(err);
  });

```

### Working with Multiple Promises

There are times when we don't need to chain promises in the "waterfall approach" of sorts of the example above. Instead, we need responses sent or fired up all at once, because they don't depend on one another. In those cases, we can work with multiple promises.

The first example below just sends two mock responses: one from a `Promise` containing an object with weather info and the other from a `Promise` containing an array with a couple of tweets. The weather info Promise has a 2000ms timeout, while the tweets `Promise` has a 500ms one. Then, instead of just chaining two `then()`'s, we just resolve a single `Promise`, as shown below:

```javascript
const weather = new Promise((resolve) => {
  setTimeout(() => {
    resolve({ temp: 29, conditions: 'Sunny with clouds' });
  }, 2000);
});

const tweets = new Promise((resolve) => {
  setTimeout(() => {
    resolve(['I like cake', 'BBQ is good two!']);
  }, 500);
});

Promise
  .all([weather, tweets])
  .then(responses => {
    // destructure it
    const [weatherInfo, tweetsInfo] = responses;
    console.log(weatherInfo, tweetsInfo);
  })
```

The following is another example using real data from a couple of APIs:

```javascript
// fetching data from two different APIs
const postsPromise = fetch('https://wesbos.com/wp-json/wp/v2/posts');
const streetCarsPromise = fetch('http://data.ratp.fr/api/datasets/1.0/search/?q=paris');

Promise
  // pass both initial promises
  .all([postsPromise, streetCarsPromise])
  .then(responses => {
    // map the responses into a JSON array
    return Promise.all(responses.map(res => res.json()));
  })
  .then(responses => {
    // return the data we need
    console.log(responses);
  });
```

## Symbols

### All About Symbols

JavaScript Symbols are a way to create unique identifiers and avoid "naming collisions". According to the [MDN entry on Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), their primary purpose is to be used as identifiers for object properties.

The following example shows a possible implementation of Symbols as object properties:

```javascript
const classRoom = {
  // two students share the same name, Olivia, but since they're declared as
  // Symbols, their actual values are unique
  [Symbol('Mark')]: { grade: 50, gender: 'male' },
  [Symbol('Olivia')]: { grade: 60, gender: 'female' },
  [Symbol('Olivia')]: { grade: 45, gender: 'female' }
}

// the following workaround lets us access the data contained inside Symbols

// create an array out the Symbols contained in the classRoom object
const syms = Object.getOwnPropertySymbols(classRoom);
// map the array and access the values of the corresponding Symbols
const data = syms.map(sym => classRoom[sym]);
```

## Classes

### Say Hello to Classes

Javascript classes are syntactic sugar used to implement prototypal inheritance in the language. For example, a function declaration with prototype methods such as the following:

```javascript
function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
};

Dog.prototype.bark = function() {
  console.log(`Bark! Bark! My name is ${this.name}`);
};

Dog.prototype.cuddle = function() {
  console.log(`I love you owner!`);
};

const snickers = new Dog('Snickers', 'King Charles');
const sunny = new Dog('Sunny', 'Golden Doodle');
```

Can be declared with a class as follows (with extra getters and setters):

```javascript
class Dog {
  constructor(name, breed) {
    this.name = name;
    this.breed = breed;
  }
  bark() {
    console.log(`Bark! Bark! My name is ${this.name}`);
  }
  cuddle() {
    console.log(`I love you owner!`);
  }
  static info() {
    console.log('A dog is 10x better than a cat.');
  }
  get description() {
    return `${this.name} is a ${this.breed} type of dog`;
  }
  set nicknames(value) {
    this.nick = value;
  }
  get nicknames() {
    return this.nick;
  }
}

const snickers = new Dog('Snickers', 'King Charles');
const sunny = new Dog('Sunny', 'Golden Doodle');
```

### Extending Classes and using super()

We can create more specific classes by using the `extends` keyword. Suppose that, from the previous example, we don't want to create a dog, but a general Animal class, like this:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
    this.thirst = 100;
    this.belly = [];
  }
  drink() {
    this.thirst -= 10;
    return this.thirst;
  }
  eat(food) {
    this.belly.push(food);
    return this.belly;
  }
}

const rhino = new Animal('Rhiney');
```

We can then extend this Animal class for a dog, which will let us reuse the class' methods as well as add new ones. In this case, we also use the `super()` method which basically calls the properties and methods of the Animal class so we can also use them for our new dog:

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() {
    console.log('Bark! Bark! I\'m a dog!');
  }
}

const snickers = new Dog('Snickers', 'King Charles');
```

### Extending Arrays with Classes for Custom Collections

ES6 allows us to extend built-in prototypes so that we can create our own classes with methods that better suit our purposes. Take for example the Array prototype and let's create a custom collection class by extending it, as follows:

```javascript
class MovieCollection extends Array {
  // the first item will always be a name, while the rest of them (...items) will be the actual movies
  constructor(name, ...items) {cd ..
    super(...items);
    this.name = name;
  }
  add(movie) {
    this.push(movie);
  }
  topRated(limit = 10) {
    // one-liner sort
    return this.sort((a, b) => (a.stars > b.stars ? -1 : 1)).slice(0, limit);
  }
}
const movies = new MovieCollection('Dave\'s Faves',
  { name: 'Shawshank Redemption', stars: 10 },
  { name: 'Natural Born Killers', stars: 9 },
  { name: 'The Fall', stars: 8 },
  { name: 'Metallica: Through the Never', stars: 5 }
);

movies.add({ name: 'Birdman', stars: 7});
```

## Generators

### Introducing Generators

In ES6, generators can be thought of as functions that we can "start/stop" or "pause" and then call or resume at a later time in our program. They are defined by using the `function*` declaration (notice the asterisk attached to the `function` keyword). They also return values using the keyword `yield`.

From the [MDN entry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) on `function*`:

> Generators are functions that can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances.
>
> Generators in JavaScript -- especially when combined with Promises -- are a very powerful tool for asynchronous programming as they mitigate -- if not entirely eliminate -- the problems with callbacks, such as Callback Hell and Inversion of Control. However, an even simpler solution to these problems can be achieved with async functions.

To better grasp the idea, consider the following example:

```javascript
function* listPeople() {
  yield 'Wes';
  yield 'Kait';
  yield 'Snickers';
}
// assign this generator function to a people const
const people = listPeople();
```

Calling the `people` const will initially yield an object with a `"suspended"` status:

```javascript
> people

listPeople {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window}
```

In order to yield the actual values, we have to use subsequent calls with `.next()`:

```javascript
people.next()
Object {value: "Wes", done: false}

people.next()
Object {value: "Kait", done: false}

people.next()
Object {value: "Snickers", done: false}

people.next()
Object {value: undefined, done: false}
```

Another example, iterating through an array:

```javascript
const inventors = [
  { first: 'Albert', last: 'Einstein', year: 1879 },
  { first: 'Isaac', last: 'Newton', year: 1643 },
  { first: 'Galileo', last: 'Galilei', year: 1564 },
  { first: 'Marie', last: 'Curie', year: 1867 },
  { first: 'Johannes', last: 'Kepler', year: 1571 },
  { first: 'Nicolaus', last: 'Copernicus', year: 1473 },
  { first: 'Max', last: 'Planck', year: 1858 },
];

// a generator function that loops through the above array
function* loop(arr) {
  console.log(inventors);
  for (const item of arr) {
    yield item;
  }
}

const inventorGen = loop(inventors);

// in order to get the values and not the whole object, we can use .next().value
inventorGen.next().value
Object {first: "Albert", last: "Einstein", year: 1879}

//...

inventorGen.next().value
Object {first: "Max", last: "Planck", year: 1858}

inventorGen.next().value
undefined

```

### Using Generators for Ajax Flow Control

A use case for generators involve waterfalling Ajax requests, that is, retrieving data from successive requests while avoiding issues such as "callback hell", since no requests are being nested into each other.

The following example makes three Ajax requests to three different APIs. For the example's sake, let's assume these three calls rely on each other, that is, each call depends on the previous one being completed and the data returned.

```javascript
function ajax(url) {
  fetch(url).then(data => data.json()).then(data => dataGen.next(data));
}

function* steps() {
  console.log('fetching beers');
  const beers = yield ajax('https://api.react.beer/v2/search?q=hops&type=beer'); // yield whatever the result of ajax()
  console.log(beers);
  
  console.log('fetching davy');
  const davy = yield ajax('https://api.github.com/users/davymartinez'); // this one will only run once we get the results of the previous one
  console.log(davy);
  
  console.log('fetching fat joe');
  const fatJoe = yield ajax('https://api.discogs.com/artists/51988'); // ditto
  console.log(fatJoe);
}

const dataGen = steps();
dataGen.next(); // kick it off
```

### Looping Generators with for...of

We can loop through a generator containing several yield statements with a for...of instead of calling each statement with a different `.next()` method.

```javascript
function* lyrics() {
  yield `I've powered up, get my program set`;
  yield `And turn my head toward the sun`;
  yield `Inside I know, I'm not a void`;
  yield `I'm automaton`;
}

const automaton = lyrics();

for (const line of automaton) {
  console.log(line);
}
```

The above example logs each line of the lyrics one line at a time.

## Proxies

### What are Proxies?

Proxies allows us to intercept, override, and/or determine the behavior of the operations of an object. From [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy):

> The `Proxy` object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.
> [...]
> A Proxy is created with two parameters:
>
> - target: the original object which you want to proxy
> - handler: an object that defines which operations will be intercepted and how to redefine intercepted operations.

Also, from [Javascript Tutorial](https://www.javascripttutorial.net/es6/javascript-proxy/), we have:

> A JavaScript Proxy is an object that wraps another object (target) and intercepts the fundamental operations of the target object.
>  
> The fundamental operations can be the property lookup, assignment, enumeration, and function invocations, etc.

The following example takes a `user` object and accesses its properties through a `proxyUser` object:

```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
};

const handler = {
  get(target, property) { // here, target is the user object above
    console.log(`Property $(property) has been read.`);
    return target[property];
  }
};

const proxyUser = new Proxy(user, handler);

console.log(proxyUser.firstName);
// Property firstName has been read.
// John
console.log(proxyUser.lastName);
// Property lastName has been read.
// Doe
```

### Proxy Traps

Handler functions are commonly referred to as "traps", since they intercept, or trap, calls to the target object. `get()` traps are used to access properties of the `target` object, while `set()` traps control the setting of properties of said object. Another frequently used one is the `apply()` trap, which is used for function calls.

#### get() Trap Example

Here, we get the `firstName` and `lastName` properties to create a new one, `fullName`:

```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',
}

const handler = {
  get(target, property) {
    return property === 'fullName' ?
      `${target.firstName} ${target.lastName}` :
      target[property];
  }
};

const proxyUser = new Proxy(user, handler);

console.log(proxyUser.fullName);

// John Doe
```

#### set() Trap Example

`set()` traps are useful for validating property values, like this:

```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',
  age: 20,
}

const handler = {
  set(target, property, value) {
    if (property === 'age') {
      if (typeof value !== 'number') {
        throw new Error('Age must be a number.');
      }
      if (value < 18) {
        throw new Error('The user must be 18 or older.');
      }
    }
    target[property] = value;
  }
};

const proxyUser = new Proxy(user, handler);

proxyUser.age = 'foo';
// Error: Age must be a number.

proxyUser.age = 16;
// Error: The user must be 18 or older.

proxyUser.age = 21;
// (No error occurs)
```

## Sets and WeakSets

### Sets

Sets in ES6 are like lists of items where we can add, delete and loop over. Every item in a Set is unique: it can only be added once. They're similar to arrays in a way, but are not index-based. Sets have their own API and methods, as we'll see below:

```javascript
const people = new Set();
people.add('Abe');
people.add('Beth');
people.add('Carl');

// > people
// > Set {"Abe", "Beth", "Carl"}
```

Sets have the `size` property (as in `people.size`), which lets us check the number of values inside the Set (not its length, as they're not zero-based).

Some useful methods of Sets are:

- `delete(value)`: removes the element associated to the "value"--in the example above it would be, for example, `people.delete('Carl')` (returns `true` if the elements was found and effectively deleted, otherwise it returns `false`)
- `clear()`: deletes everything inside the Set
- `values()`: returns an iterator object which allows us to iterate over the Set, like we do with Generators (see above)
- `keys()`: same as `values()`, returns an iterator
- `entries()`: also returns an iterator but containing an array of `[value, value]`
- `has(value)`: returns a boolean asserting if a Set has, or not, a given element

### WeakSets

WeakSets are collections of objects, that is, they're like Sets, but only for objects. Also, as with Sets, the elements inside a WeakSet are unique, occurring only once. Another important distinction is that WeakSets are not enumerable, they can't be looped over.

```javascript
let album1 = { title: '...And Justice for All', year: 1988 };
let album2 = { title: 'Death Magnetic', year: 2008 };

const albums = new WeakSet([album1, album2]);
```

WeakSets methods are `add(value)`, `delete(value)` and `has(value)`, all similar in function to the equally named methods of Sets, as described above.

## Map and WeakMap

### Maps

Maps are to objects as Sets are to arrays. The [definition from MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) says:

> The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.

We can iterate through Maps using `forEach` or `for...Hugoas follows10

```javascript
const dogs = new Map();

dogs.set('Snickers', 3);
dogs.set('Sunny', 2);
dogs.set('Hugo', 10);

dogs.forEach((val, key) => console.log(val, key));

// 3 "Snickers"
// 2 "Sunny"
// 10 "Hugo"

for (const dog of dogs) {
  console.log(dog);
}

// ["Snickers", 3]
// ["Sunny", 2]
// ["Hugo", 10]
```

The last example can also be destructured so we can log each key-value pair as individual variables:

```javascript
for (const [key, val] of dogs) {
  console.log(key, val);
}

// Snickers 3
// Sunny 2
// Hugo 10
```

### Map Metadata with DOM Node Keys

Maps are useful to implement "metadata dictionaries", that is, objects where we can store and manipulate data about other objects, without affecting the objects themselves. That is metadata: information about information, or data about data.

The following example keeps a count of how many times certain buttons on a webpage have been clicked:

```html
<html>
  <body>
    <button>Snakes 🐍</button>
    <button>Cry 😭</button>
    <button>Ice Cream 🍦</button>
    <button>Flamin' 🔥</button>
    <button>Dancer 🕺</button>
  </body>
  <script>
    const clickCounts = new Map();
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
      clickCounts.set(button, 0);
      button.addEventListener('click', function() {
        const val = clickCounts.get(this);
        clickCounts.set(this, val + 1);
        console.log(clickCounts);
      });
    });
  </script>
</html>

// Map {button {} => 1, button {} => 0, button {} => 0, button {} => 0, button {} => 0}

```

Every time we click on a button, the `clickCounts` variable increments by one and logs it to console inside a `Map` object (the example above shows one click of the "Snakes 🐍" button).

### WeakMaps

Just like WeakSets, WeakMaps do not have a size and are not enumerable. Also, items inside a WeakMap get garbage-collected when no longer in use in any other part of the application.

From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections#WeakMap_object):

> The WeakMap object is a collection of key/value pairs in which the keys are objects only and the values can be arbitrary values. The object references in the keys are held weakly, meaning that they are a target of garbage collection (GC) if there is no other reference to the object anymore. The WeakMap API is the same as the Map API.
>
> One difference to Map objects is that WeakMap keys are not enumerable (i.e., there is no method giving you a list of the keys). If they were, the list would depend on the state of garbage collection, introducing non-determinism.
>
> [...]
>
>One use case of WeakMap objects is to store private data for an object, or to hide implementation details.

## Async + Await Flow Control

### All About Async Await

With `async` + `await` we can call an asynchronous function and then, inside that function, we await for values. By using `async` + `await` we can avoid the need to configure promise chains.

In the context of JS, an asynchronous function executes its operations or tasks while other instructions are being called or run, as opposed to the regular synchronous mode of execution where every task waits for the previous one to finish before the task runs. In other words, `async` functions run in parallel to other functions.

The `async` keyword before a function makes the function return a promise, whereas `await` makes the function wait for a promise. Also, `await` cannot be "out in the open"--it must always be inside the scope of an `async` function.

The following code example shows a way of implementing `async` + `await` with a `setTimeout()` function:

```javascript
function breathe(amount) {
  return new Promise((resolve, reject) => {
    if (amount < 500) {
      reject('That is too small of a value');
    };
    setTimeout(() => resolve(`Done for ${amount} ms`), amount);
  });
}

async function go() {
  console.log('start');
  const res = await breathe(1000);
  console.log(res);
  const res2 = await breathe(600);
  console.log(res2);
  const res3 = await breathe(750);
  console.log(res3);
  const res4 = await breathe(900);
  console.log(res4);
}
```

### Async + Await Error Handling

The way error handling works with `async` + `await` is by simply wrapping our code in a `try...catch` block which will in turn catch the `reject()` of our promise. In that sense, the code from the previous example would look as follows:

```javascript
function breathe(amount) {
  return new Promise((resolve, reject) => {
    if (amount < 500) {
      reject('That is too small of a value');
    };
    setTimeout(() => resolve(`Done for ${amount} ms`), amount);
  });
}

async function go() {
  try {
    console.log('start');
    const res = await breathe(1000);
    console.log(res);
    const res2 = await breathe(600);
    console.log(res2);
    const res3 = await breathe(750);
    console.log(res3);
    const res4 = await breathe(900);
    console.log(res4);
  } catch(err) {
    console.log(err);
  }
}
```

One other way of approaching this error handling here is by using a higher order function (HOF), that is, a function that operates on other functions, either as arguments or by returning them. Thus, we could add a `catchErrors()` HOF to our example code above and implement it as follows:

```javascript
function breathe(amount) {
  return new Promise((resolve, reject) => {
    if (amount < 500) {
      reject('That is too small of a value');
    };
    setTimeout(() => resolve(`Done for ${amount} ms`), amount);
  });
}

// the fn argument is a function
function catchErrors(fn) {
  return function() {
    return fn().catch((err) => {
      console.error(err);
    })
  }
}

async function go() {
  console.log('start');
  const res = await breathe(1000);
  console.log(res);
  const res2 = await breathe(600);
  console.log(res2);
  const res3 = await breathe(750);
  console.log(res3);
  const res4 = await breathe(900);
  console.log(res4);
}

// go() becomes our passed argument to catchErrors()
const wrappedFunction = catchErrors(go);
```

### Waiting on Multiple Promises

Sometimes we need to fetch several different resources and return them together later on, after other tasks have been completed. In those cases we can use `Promise.all()`, which is a single `Promise` that returns an array of the results of the different fetches. The code below exemplifies that, as we run two fetches, assigning them to two different variables and then returning a single `Promise` containing the results inside an array:

```javascript
async function go() {
  const p1 = fetch('https://api.github.com/users/wesbos').then(r => r.json());
  const p2 = fetch('https://api.github.com/users/davymartinez').then(r => r.json());
  // wait for both of them to come back
  const res = await Promise.all([p1, p2]);
  console.log(res);
}

go();
```

Another way of dealing with this, without `then()`'s is by taking the array of promises and map over it:

```javascript
async function go() {
  const p1 = fetch('https://api.github.com/users/wesbos').then(r => r.json());
  const p2 = fetch('https://api.github.com/users/davymartinez').then(r => r.json());
  // wait for both of them to come back
  const res = await Promise.all([p1, p2]);
  const dataPromises = res.map(r => r.json());
  // destructure the array
  const [wes, davy] = await Promise.all(dataPromises);
  console.log(wes, davy);
}

go();
```

Yet another approach, more useful for dealing with a varying amount of fetches, is by passing an array of values to be fetched and then mapping over it at once:

```javascript
async function getData(names) {
  const promises = names.map(name => fetch(`https://api.github.com/users/${name}`).then(r => r.json()));
  const people = await Promise.all(promises);
  console.log(people);
}

getData(['wesbos', 'davymartinez', 'darcyclarke']);
```

### Promisifying Callback Based Functions

Whenever we have a callback based function, we can "promisify" it, that is, we can turn it into a promise based one by wrapping the function's logic into a `Promise()` and then calling it from an `async` function.

The example below shows a regular callback function that returns our geolocated position in coordinates:

```javascript
navigator.geolocation.getCurrentPosition(function pos() {
  console.log('it worked!');
  console.log(pos);
}, function err() {
  console.log('it failed!');
  console.log(err);
});
```

Promisifying it:

```javascript
function getCurrentPosition(...args) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(...args, resolve, reject);
  });
}

async function go() {
  console.log('starting');
  const pos = await getCurrentPosition();
  console.log(pos);
  console.log('finished');
}

go();
```
