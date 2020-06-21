/* eslint-disable no-unused-vars */
import { uniq } from 'lodash';
import insane from 'insane';
import jsonp from 'jsonp';
import { apiKey, url, sayHi } from './src/config';

import User, { createUrl, gravatar } from './src/user';

const user = new User('David Martinez', 'davy.martinez@gmail.com', 'davymartinez.com');
console.log(user);

const profile = createUrl(user.name);
console.log(profile);

const image = gravatar(user.email);
console.log(image);