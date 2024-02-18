import { app } from "./app";

import config from "./configs/config";

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}!`);
});
