import React from 'react';
import {Link} from 'react-router-dom';


class HomePage extends React.Component {

  render() {
    return (
      <div>
        <h2> Home </h2>
        <Link to='/login'>LoginPage</Link>
      </div>
    );
  }

}

export default HomePage;