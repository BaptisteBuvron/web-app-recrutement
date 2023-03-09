import React, {useEffect, useState} from 'react';
import './App.css';




function App() {

    const [data, setData] = useState( "Hello World" );

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:8000');
            const json = await result.json();
            setData(json);
        };
        fetchData();
    }, [data]);

  return (
   <p>{data}</p>
  );
}

export default App;
