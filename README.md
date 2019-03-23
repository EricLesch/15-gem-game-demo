# README

## Quick up and running instructions

1. Install Docker if you don't already have it
2. Go to the ```nginx``` directory
3. Run: 
```
docker build -t="hopscotch/15-gem-demo" .
```
4. Run: 
```
docker run -p 80:80 hopscotch/15-gem-demo
```

5. Go to http://localhost in a browser

## Development instructions

1. Install Docker and docker-compose

```
docker-compose up
```

You need to be running a recent(ish) version of node. This was tested using Node v10.15.1 LTS

In the nginx/html directory run:

```
npm install 
```

And then build the package (from the nginx/html directory):

```
npm run-script build
```


Navigate to http://localhost to have a look at the project.



