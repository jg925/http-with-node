const axios = require('axios');
const fs = require('fs');

const getMetadata = () => {
  return axios.get('http://localhost:8080/metadata?id=1');
};
const getMetadataAgain = () => {
  return axios.get('http://localhost:8080/metadata?id=1');
};

axios.all([getMetadata(), getMetadataAgain()]).then((responseArray) => {
  console.log(responseArray[0].data.description);
  console.log(responseArray[1].data.description);
});

/*axios({
  method: 'post',
  url: 'http://localhost:8080/users',
  data: {
    userName: 'dannyt100',
  },
  transformRequest: (data, headers) => {
    const newData = {
      userName: data.userName + '!',
    };
    return JSON.stringify(newData);
  },
})
  .then((res) => {
    res.data.pipe(fs.createWriteStream('google.html'));
  })
  .catch((err) => {
    console.error(err);
  });*/
