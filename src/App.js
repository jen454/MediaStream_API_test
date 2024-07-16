import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('api');
        setData(response.data.data); // response.data.data 안의 배열을 설정
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      {data.length > 0 ? (
        data.map((item, index) => (
          <Item key={index}>
            {Object.keys(item).map((key) => (
              <DataRow key={key}>
                <Key>{key}:</Key> {item[key]}
              </DataRow>
            ))}
          </Item>
        ))
      ) : (
        <div>No data available</div>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Item = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
`;

const DataRow = styled.div`
  margin-bottom: 5px;
`;

const Key = styled.strong`
  margin-right: 10px;
`;

export default App;
