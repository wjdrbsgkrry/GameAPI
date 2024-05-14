import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://wjdrbsgkrry:aaaa4321@express-mongo.cj91sqc.mongodb.net/?retryWrites=true&w=majority&appName=express-mongo',
      {
        dbName: 'character',
      }
    )
    .catch((err) => console.log(err))
    .then(() => console.log('데이터베이스 접근 완료'));
};

mongoose.connection.on('error', (err) => {
  console.log('데이터베이스 접근 실패', err);
});

export default connect;
