const database = require("mongoose");
const is_qoddi = process.env.IS_QODDI || false;

const databaseName = "lab_example"
const qoddiURI = process.env.MONGODB_URL;
const localURI ="mongodb://localhost/lab_example?authSource=admin&retryWrites=true&w=majority"
if (is_qoddi) {
database.connect(qoddiURI, {useNewUrlParser: true, useUnifiedTopology: true});
}
else {
database.connect(localURI, {useNewUrlParser: true, useUnifiedTopology: true});
}