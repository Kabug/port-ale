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
    min-height: 91.3vh;
  }

  .heading{
    border-bottom: 1px solid;
    background-color: #393733;
  }

  .usersList{
    max-height: 83.1vh;
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

  .ordersList{
    max-height: 29.9vh;
    overflow-y: auto;
  }

  .ordersList :nth-child(even){
    background-color: rgba(255, 204, 0, 0.4);
  }
`;

const QUERY_USERS = gql`
  {
    users{
      id
      userName
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($userName: String!) {
    createUser(userName: $userName){
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
  mutation updateUser($id: ID!, $userName: String!){
    updateUser(id: $id, userName: $userName){
      id
      userName
    }
  }
`;

const QUERY_USERS_ORDERS = gql`
  query filteredUsersQueryTest(
    $userName: String!
    $newhire: String!
    $prioritydeployment: String!
    $cancelled: String!
  ) {
    filteredUsers(userName: $userName) {
      userName
      id
      userItamOrders {
        itamStatus
        itamOrder {
          orderSimplexId
          orderCategory
          orderRecipient
          orderItem
        }
      }
      userTechOrders {
        techStatus
        techOrder(
          where: { orderCategory_in: [$newhire, $prioritydeployment, $cancelled] }
        ) {
          orderSimplexId
          orderCategory
          orderRecipient
          orderItem
        }
      }
    }
  }
`;

class Users extends React.Component{
  constructor(props) {
    super( props );
    this.state = {
      originalName: "Unassigned",
      userName: null,
      userID: null,
      createUser: true,
      isDeletable: false,
      buttonClicked: false,
      isUnassigned: false
    };
  }

  setUser = (name, id) => {
    if ( name === "Unassigned" ) {
      this.setState({ isUnassigned: true, originalName: name });
      id = null;
      name = null;
    } else if ( name === "" ) {
      this.setState({
        originalName: "Unassigned",
        userName: name,
        userID: id,
        isDeletable: false,
        isUnassigned: false }, );
    } else {
      this.setState({
        originalName: name,
        userName: name,
        userID: id,
        isDeletable: false,
        isUnassigned: false });
    }

    if ( id == null ) {
      this.setState({ createUser: true });
    } else {
      this.setState({ createUser: false });
    }
  };

  verifyDelete = () => {
    this.setState({ isDeletable: true });
  };

  render() {
    const {
      userName,
      originalName,
      userID
    } = this.state;

    return (
      <Styles>
        <div className="container-fluid">
          <div className="row usersDiv">
            <div className="col-sm-6 mainTwoColumns">
              <div className="row">
                <div className="col-sm-12 heading">
                  <h3 className="titleText">Users</h3>
                </div>
                <div className="col-sm-12 createUserDiv" onClick={() => this.setUser("", null )}>
                  <h4>Create User</h4>
                </div>
              </div>
                <Query query={QUERY_USERS}>
                  {({ loading, error, data }) => {
                    if ( loading ) { return <div className="col-sm-12">Fetching</div>;}
                    if ( error ) { return <div className="col-sm-12">Error</div>;}
                    const usersToRender = data.users;
                    return (
                      <div className="row usersList">
                      {usersToRender.slice( 0 ).map( users =>
                        <div
                          className="col-sm-12 name"
                          key={users.id}
                          users={users}
                          onClick={() =>
                            this.setUser( users.userName, users.id
                          )}>
                          <h4>{users.userName}</h4>
                        </div>
                      )}
                        </div>
                    );
                  }}
                </Query>
            </div>
            <div className="col-sm-6 mainTwoColumns">
              <div className="row">
                <div className="col-sm-12 heading">
                  <h3 className="titleText">Info</h3>
                </div>
                <div className="col-sm-12" style={{
                  display: `${this.state.isUnassigned ? "none" : "inline" }` } }
                >
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="name">Name</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name Here"
                      aria-label="name"
                      aria-describedby="name"
                      value={userName}
                      onChange={e=>this.setState({ userName: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="row buttons">
                <div
                  className="col-sm-12"
                  style={
                    { display:
                      `${this.state.createUser * !this.state.isUnassigned ? "inline" : "none"}`
                    }
                  }
                  >
                  <Mutation mutation={CREATE_USER} variables={ { userName: this.state.userName }}>
                    {createUser =>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          this.setState({ buttonClicked: true });
                          createUser();
                          window.location.reload();
                        }}
                        disabled={this.state.buttonClicked}
                      >
                      Create
                      </button>
                    }
                  </Mutation>
                </div>
                <div
                  className="col-sm-6"
                  style={ { display: `${this.state.createUser ? "none" : "inline"}` }}
                >
                  <Mutation
                    mutation={UPDATE_USER}
                    variables={ { id: this.state.userID, userName: this.state.userName }}
                  >
                    {updateUser =>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          updateUser();
                          window.location.reload();
                        }}
                      >
                      Update
                      </button>
                    }
                  </Mutation>
                </div>
                <div
                  className="col-sm-6"
                  style={ { display: `${this.state.createUser ? "none" : "inline"}` }}
                >
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.verifyDelete}
                    style={ { display: `${this.state.isDeletable ? "none" : "inline"}` }}
                  >
                  Delete
                  </button>
                  <div style={ { display: `${this.state.isDeletable ? "inline" : "none"}` }}>
                    <Mutation mutation={DELETE_USER} variables={ { id: this.state.userID }}>
                      {deleteUser =>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {deleteUser(); window.location.reload();}}
                        >
                        Permanently Delete
                        </button>
                      }
                    </Mutation>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 heading">
                  <h3 className="titleText">Displaying: {this.state.originalName}</h3>
                </div>
              </div>
              <Query
                query={QUERY_USERS_ORDERS}
                errorPolicy="all"
                variables={{
                  userName: originalName,
                  newhire: "New Hire",
                  prioritydeployment: "Priority Deployment",
                  cancelled: "Cancelled"
                }}
              >
                {({ loading, error, data }) => {
                  if ( loading ) { return <div>Fetching</div>;}
                  if ( error ) { return <div>Error</div>;}
                  var ordersToRender = [];
                  ordersToRender = data.filteredUsers;
                  var hasTechOrder = false;
                  if ( ordersToRender[ 0 ].userTechOrders ) {
                    for ( var index in ordersToRender[ 0 ].userTechOrders ) {
                      if (
                        ordersToRender[ 0 ].userTechOrders[ index ].techOrder === null ||
                        ordersToRender[ 0 ].userTechOrders[ index ].techOrder === undefined ) {
                        delete ordersToRender[ 0 ].userTechOrders[ index ];
                      } else {
                        hasTechOrder = true;
                      }
                    }
                  }
                  if ( hasTechOrder == false ) {
                    return (
                      <div className="row">
                        <div className="col-sm-12 heading">
                          <h5 className="titleText">ITAM Orders:</h5>
                        </div>
                        <div className="col-sm-12">
                          <div className="row ordersList">
                            {ordersToRender[ 0 ].userItamOrders.slice( 0 ).reverse().map( orders =>
                              <div className="col-sm-12">
                                {orders.itamOrder.orderSimplexId} |
                                {orders.itamOrder.orderCategory} |
                                {orders.itamOrder.orderItem} |
                                {orders.itamOrder.orderRecipient}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-sm-12 heading">
                          <h5 className="titleText">Tech Orders:</h5>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="row">
                      <div className="col-sm-12 heading">
                        <h5 className="titleText">ITAM Orders:</h5>
                      </div>
                      <div className="col-sm-12">
                        <div className="row ordersList">
                          {ordersToRender[ 0 ].userItamOrders.slice( 0 ).reverse().map( orders =>
                            <div className="col-sm-12">
                              {orders.itamOrder.orderSimplexId} |
                              {orders.itamOrder.orderCategory} |
                              {orders.itamOrder.orderItem} |
                              {orders.itamOrder.orderRecipient}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-12 heading">
                        <h5 className="titleText">Tech Orders:</h5>
                      </div>
                      <div className="col-sm-12">
                        <div className="row ordersList">
                          {ordersToRender[ 0 ].userTechOrders.slice( 0 ).reverse().map( orders =>
                            <div className="col-sm-12">
                              {orders.techOrder.orderSimplexId} |
                              {orders.techOrder.orderCategory} |
                              {orders.techOrder.orderItem} |
                              {orders.techOrder.orderRecipient}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Query>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}

export default Users;
