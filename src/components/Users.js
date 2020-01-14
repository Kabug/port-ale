import React from "react";
import styled from "styled-components";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";

const Styles = styled.div`

  .usersDiv{
    border-style: solid;
    border-width: 1px;
    border-color: #393733;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .mainTwoColumns{
    border-style: solid;
    border-width: 1px;
    min-height: 50vh;
  }

  .heading{
    border-bottom: 1px solid;
    background-color: #393733;
  }

  .usersList{
    max-height: 50vh;
    overflow-y: auto;
  }

  .usersList :nth-child(even){
    background-color: rgba(255, 204, 0, 0.4);
  }

  .createUserDiv{
    color: lightblue;
    cursor: pointer;
    background-color: gray;
  }

  .createUserDiv :hover{
    color: #FFCC00;
  }

  .col-sm-12{
    border-bottom: 1px solid;
  }

  .col-sm-6{
    border-bottom: 1px solid;
  }

  .name{
    cursor: pointer;
  }

  .name :hover{
    color: #FFCC00;
  }

  .titleText{
    color: white;
  }

  .mb-3{
    margin-top: 1em;
  }

  .btn{
    margin-top: 1em;
    margin-bottom: 1em;
    width: 15em;
    height: 3em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .buttons{
    background-color: #393733;
  }
`;

const QUERY_USERS = gql`
  {
    users{
      id
      name
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($name: String!) {
    createUser(name: $name){
      id
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($id:ID!, $name: String!){
    updateUser(id: $id, name: $name){
      id
      name
    }
  }
`;

const QUERY_USERS_ORDERS = gql`
  {
    users{
      id
      name
    }
  }
`;

class Users extends React.Component{
  constructor(props){
    super(props);
    this.state={
      originalName: null,
      userName: null,
      userID: null,
      createUser: true,
      isDeletable: false,
      buttonClicked: false,
      isUnassigned: false
    }
  }

  setUser = (name, id) => {
    if(name === "Unassigned"){
      this.setState({isUnassigned: true, originalName: name});
      id = null;
      name = null;
    }
    else{
      this.setState({originalName: name, userName: name, userID: id, isDeletable: false, isUnassigned: false})
    }

    if(id == null){
      this.setState({createUser: true});
    }
    else{
      this.setState({createUser: false});
    }
  }

  verifyDelete = () => {
    this.setState({isDeletable: true});
  }

  render(){
    const {
      userName,
      userID
    } = this.state;

    return (
      <Styles>
        <div class="container-fluid">
          <div class="row usersDiv">
            <div class="col-sm-6 mainTwoColumns">
              <div class="row">
                <div class="col-sm-12 heading">
                  <h3 class="titleText">Users</h3>
                </div>
                <div class="col-sm-12 createUserDiv" onClick={() => this.setUser("", null)}>
                  <h4> Create User</h4>
                </div>
              </div>
                <Query query={QUERY_USERS}>
                  {({loading, error, data}) => {
                    if (loading) return <div class="col-sm-12">Fetching</div>
                    if (error) return <div class="col-sm-12">Error</div>
                    const usersToRender = data.users
                    return(
                      <div class="row usersList">
                      {usersToRender.slice(0).map(users => <div class="col-sm-12 name" key={users.id} users={users} onClick={() => this.setUser(users.name, users.id)}><h4>{users.name}</h4></div>)}
                      </div>
                    )
                  }}
                </Query>
            </div>
            <div class="col-sm-6 mainTwoColumns">
              <div class="row">
                <div class="col-sm-12 heading">
                  <h3 class="titleText">Info</h3>
                </div>
                <div class="col-sm-12">
                  <h3>Original Name: {this.state.originalName}</h3>
                </div>
                <div class="col-sm-12" style={{display: `${this.state.isUnassigned ? "none":"inline"}`}}>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="name">Name</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Enter Name Here" aria-label="name" aria-describedby="name" value={userName} onChange={e=>this.setState({userName: e.target.value})}/>
                  </div>
                </div>
              </div>
              <div class="row buttons">
                <div class="col-sm-12" style={{display: `${this.state.createUser * !this.state.isUnassigned ? "inline":"none"}`}}>
                  <Mutation mutation={CREATE_USER} variables={{name: this.state.userName}}>
                    {createUser => <button type="button" class="btn btn-success" onClick={() =>{this.setState({buttonClicked: true}); createUser(); window.location.reload();}} disabled={this.state.buttonClicked}>Create</button>}
                  </Mutation>
                </div>
                <div class="col-sm-6"  style={{display: `${this.state.createUser ? "none":"inline"}`}} >
                  <Mutation mutation={UPDATE_USER} variables={{id: this.state.userID, name: this.state.userName}}>
                    {updateUser => <button type="button" class="btn btn-success" onClick={() =>{updateUser(); window.location.reload();}}>Update</button>}
                  </Mutation>
                </div>
                <div class="col-sm-6"  style={{display: `${this.state.createUser ? "none":"inline"}`}} >
                  <button type="button" class="btn btn-danger" onClick={this.verifyDelete} style={{display: `${this.state.isDeletable ? "none":"inline"}`}}>Delete</button>
                  <div style={{display: `${this.state.isDeletable ? "inline":"none"}`}}>
                    <Mutation mutation={DELETE_USER} variables={{id: this.state.userID}}>
                      {deleteUser => <button type="button" class="btn btn-danger" onClick={() => {deleteUser(); window.location.reload();}}>Permanently Delete</button>}
                    </Mutation>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}

export default Users;
