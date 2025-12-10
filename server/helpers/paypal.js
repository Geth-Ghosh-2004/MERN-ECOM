const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AaKAs9irL88iuhUsmFEX2cY7ZYlDBfi0SUBSOWBbMMfbsWlpxX8k4fCBVJeEz2C84YtCHIUrGrEzR1vG",
  client_secret:
    "EJJPPPTj5raneav-dgQgYUz7QLjnloxBB9myzlwKbkn7SSdLJLwqHNg1_MDgGn7BRVOY91nMkrqnrRM0",
});

module.exports = paypal;
