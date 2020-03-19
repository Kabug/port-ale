import React from "react";
import Orders from "./Orders";
import styled from "styled-components";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const Styles = styled.div`

  h1{
    margin: 2em;
  }

  .btn{
    margin-bottom: 1em;
    width: 15em;
    height: 3em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .ordersStyles{
    max-height: 92vh;
    overflow-y: auto;
  }
`;

const QUERY_ARCHIVED_ORDERS = gql`
  query filteredOrders($orderCategory: String!) {
    filteredOrders(orderCategory: $orderCategory) {
      id
      orderSimplexId
      orderDateCreated
      orderDateApproved
      orderCreatedBy
      orderCreatedByEmail
      orderNewHire
      orderRecipient
      orderHireStartDate
      orderHireName
      orderApprovalManager
      orderBusinessUnit
      orderAttention
      orderShippingAddress
      orderItem
      orderTotal
      orderComments
      orderCategory
      orderSla
      orderItam{
        id
        itamOwner{
          id
          userName
        }
        itamStatus
        itamVerificationEmailSent
        itamProductSource
        itamOldAssetTag
        itamOldModel
        itamMonitorModel
        itamMonitorNum
        itamConnectorTypes
        itamOrderPendingEmail
        itamConfirmedNewHire
        itamPoOrderId
        itamDellOrderId
        itamDellEmailNotif
      }
      orderTech{
        id
        techOwner{
          id
          userName
        }
        techStatus
        techConfirmedUser
        techCostCenter
        techServiceTag
        techInitialEmail
        techDateFollowupTemp
        techFollowupEmailSent
        techDateCompleted
      }
    }
  }
`;

class DeleteArchives extends React.Component{
  render () {
    return (
      <Styles>
        <div class="container-fluid ordersStyles">
          <div class="row">
            <div class="col-sm-12">
              <h1>List of Archives</h1>
            </div>
          </div>
          <div class="row">
            <Query
              query={QUERY_ARCHIVED_ORDERS}
              variables={{ orderCategory: "Archived" }}
            >
              {({ loading, error, data }) => {
                if ( loading ) { return <div className="col-sm-12">Fetching</div>;}
                if ( error ) { return <div className="col-sm-12">Error</div>;}
                const ordersToRender = data.filteredOrders;
                return (
                  <div className="col-sm-12">
                    {ordersToRender.slice( 0 ).map( (order) =>
                        <Orders
                          key={order.id}
                          orders={order}
                          archive={true}
                        />
                    )}
                  </div>
                );
              }}
            </Query>
            </div>
        </div>
      </Styles>
    );
  }

}

export default DeleteArchives;
