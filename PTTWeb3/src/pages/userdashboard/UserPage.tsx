import React from 'react';
import { RouteComponentProps } from 'react-router';
import {User} from '../../types/UserInterface';
import {Project} from '../../types/ProjectInterface';
import {List, ListItem} from '@material-ui/core';

// match the id paremeter from the path.
interface MatchParam {
  id: string
}

interface UserPageProps extends RouteComponentProps<MatchParam> {

}

// store user data.
interface UserPageState {
  userId: number,
  user: User
}

class UserPage extends React.Component<UserPageProps> {

  state: UserPageState

  constructor(props: UserPageProps){
    super(props);
    this.state = {
      userId: parseInt(props.match.params.id, 10),
      user: {userId: 0, projects: []} as User,
    }
  }

  // this function will be called right before render function. 
  // make RESTful api calls here to populate data.
  componentWillMount(){
    // fetch user data in this function.
    setTimeout(() => {
      let userData: User = {} as User;
      let projects: Project[] = [];

      for(var i = 0; i < 10; i++){
        projects.push({
          projectId: i
        })
      }
      userData = {
        userId: this.state.userId,
        projects: projects
      }

      this.setState({
        user: userData
      })
    }, 2000);
  }

  render() {

    console.log(this.state);
    return (
      <div>
        <h2> User Page: {this.state.userId}</h2>
        <List>
          {this.state.user.projects.map((_, i) => <ListItem>i</ListItem> )}
        </List>
      </div>
    );
  }

}

export default UserPage;