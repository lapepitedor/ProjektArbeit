// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAdENYvQg1gI_1pONInILcbQNX_Ji4Bss8',
    authDomain: 'expense-tracker-e0028.firebaseapp.com',
    databaseURL: 'https://expense-tracker-e0028.firebaseio.com',
    projectId: 'expense-tracker-e0028',
    storageBucket: 'expense-tracker-e0028.appspot.com',
    messagingSenderId: '927113629451'
  }
};
