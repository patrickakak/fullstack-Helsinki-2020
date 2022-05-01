phonebook backend app

need to install extension `REST Client` first if you use vscode<br>
`node -v`: 16.14.0<br>
`npm -v`: 8.3.1<br>

use platform Heroku for deploying the whole phonebook app to internet.<br>

**steps recap** (assume that you're in folder .../phonebookBackend and you have a Heroku account and logged-in already):
1. `git init`
2. `git add .`
3. `git commit –m 'commit msg'`
4. `heroku create` and get the random_id of your app
5. `git push heroku main` if you're in branch main
6. (`heroku logs -t` to check your app's traffic if you like)

or, since the package.json file already has `npm run deploy:full` script, when you have some files updated and need to redeploy your app, just type this command<br>

my phonebook online app link: https://tranquil-lake-45868.herokuapp.com/
