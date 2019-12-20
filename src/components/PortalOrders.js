import React from "react";
import Orders from "./Orders"
import CreateOrder from "./CreateOrder"
import styled from "styled-components";
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const Styles = styled.div`
  .btn{
    margin-bottom: 1em;
    width: 15em;
    height: 3em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .mainBtnDivStyles{
    margin-bottom: 2em;
  }

  h1{
    margin: 1em;
  }

  .btn-primary{
    background-color: #FFCC00 !important;
    border-color: #FFCC00 !important;

    &:hover{
      background-color: #F0B400 !important;
      border-color: #F5B800 !important;
    }
    &:active{
      box-shadow: 0px 0px 1px 3px rgba(255,204,0,0.7) !important;
    }

  }

  .btn-group{
    display: block !important;
  }
`
const orders_query = gql`
  {
    orders{
      id
      orderid
      datecreated
      dateapproved
      createdby
      createdbyemail
      recipient
      newhire
      hiredate
      hirename
      approvalmanager
      businessunit
      attention
      shippingaddress
      items
      total
      comments
      itemtype
      userstartdate
      sla
    }
  }
`

class PortalOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isITAM: false,
      isTech: false,
      isAll: true
    };
  }

  ITAMToggle = () =>{
    this.setState((state, props) => {
      return {isITAM: !this.state.isITAM};
    });
  }

  techToggle = () =>{
    this.setState((state, props) => {
      return {isTech: !this.state.isTech};
    });
  }

  allToggle = () =>{
    this.setState({isAll: !this.state.isAll})

    if(this.state.isAll){
      this.setState({isITAM: true})
      this.setState({isTech: true})
    }
    else{
      this.setState({isITAM: false})
      this.setState({isTech: false})
    }
  }

  render(){
    return (
      <Styles>
        <div class ="container-fluid">
          <h1>Portal Orders</h1>
          <div class="row mainBtnDivStyles">
            <div class="col-sm">
            <div class="btn-group btn-group-justified">
              <button type="button" class="btn btn-primary" onClick={this.ITAMToggle}>ITAM</button>
              <button type="button" class="btn btn-info" onClick={this.techToggle}>Tech</button>
              <button type="button" class="btn btn-dark" onClick={this.allToggle}>All</button>
            </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm ordersStyles">
            <CreateOrder/>
            <Query query={orders_query}>
              {({ loading, error, data }) => {
                if (loading) return <div>Fetching</div>
                if (error) return <div>Error</div>
                const ordersToRender = data.orders
                return(
                  <div>
                    {ordersToRender.slice(0).reverse().map(orders => <Orders key={orders.id} orders={orders} isITAM={this.state.isITAM} isTech={this.state.isTech}/>)}
                  </div>
                )
              }}
            </Query>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default PortalOrders;
