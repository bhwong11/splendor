# splendor
based on board game [splendor](https://boardgamegeek.com/boardgame/148228/splendor)

live link: https://splendor-new.vercel.app/

# Start frontend
```
cd splendor-frontend
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# start server
* This server connects to a Mongo Atlas database and you will need a ATLAS URI to [connect](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)

to start the server run the following commands from the root directory

```bash
cd server
node index.js
```