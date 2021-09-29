import './App.css';
import React, { useCallback, useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const searchRef = React.createRef();

  useEffect(() => {
    fetch('http://localhost:8000/users').then((res) => res.json()).then((res) => {
      if (res.status === 200) {
        setUsers(res.users);
        setFiltered(res.users);
      }
    });
  }, []);

  const globalFilter = useCallback((items, key)=>{
    let filtered = items.filter((user)=>{
      return user.name.toLowerCase().includes(key.toLowerCase()) ||
      user.email.toLowerCase().includes(key.toLowerCase()) || 
      getFormattedAddress(user.address).toLowerCase().includes(key.toLowerCase()) || 
      user.phone.toLowerCase().includes(key.toLowerCase()) || 
      user.company.name.toLowerCase().includes(key.toLowerCase());
    });
    setFiltered(filtered);
  }, []);

  const onSearch = () => {
    if(searchRef.current.value){
      globalFilter(users, searchRef.current.value);
    }
  }

  const getFormattedAddress = (address) => {
    return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
  }

  return (
    <div className="App">
      <div className="header">
        <div>Users</div>
        <div>
          <input type="text" placeholder="search" ref={searchRef} onChange={onSearch}/>
          {/* <button onClick={onSearch}>Search</button> */}
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.company.name}</td>
                  <td>{user.phone}</td>
                  <td>{getFormattedAddress(user.address)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
