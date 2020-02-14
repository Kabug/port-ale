import React from "react";
import styled from "styled-components";
import CSVDownload from "react-json-to-csv";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const Styles = styled.div`

  .csv-output{
    border-style: dashed;
    border-radius: 20px;
    border-color: black;
    padding: 1%;
    padding-left: 5%;
    padding-right: 5%;
    background-color: #FFCC00;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    font-weight: 500;
    font-size: 20px;
  }

  .csv-output:hover{
    color: white;
    border-color: white;
  }

  .col-sm-12{
    margin-top: 2em;
  }

`;

const QUERY_ORDERS = gql`
  query Orders{
    orders{
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

class Export extends React.Component{
  render () {
    return (
      <Styles>
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-12">
              <h1>Export to CSV</h1>
            </div>
            <div class="col-sm-12">
              <Query query={QUERY_ORDERS} variables={{
              }}>
                {({ loading, error, data }) => {
                  if ( loading ) { return <div>Fetching</div>;}
                  if ( error ) { return <div>Error</div>;}
                  const ordersToRender = data.orders;
                  let flattenedOrders = [];
                  let i = 0;
                  for ( let order in ordersToRender ) {
                    flattenedOrders[ i ] = {
                      orderSimplexId: ordersToRender[ order ].orderSimplexId,
                      orderDateCreated: ordersToRender[ order ].orderDateCreated,
                      orderDateApproved: ordersToRender[ order ].orderDateApproved,
                      orderCreatedBy: ordersToRender[ order ].orderCreatedBy,
                      orderCreatedByEmail: ordersToRender[ order ].orderCreatedByEmail,
                      orderNewHire: ordersToRender[ order ].orderNewHire,
                      orderRecipient: ordersToRender[ order ].orderRecipient,
                      orderHireStartDate: ordersToRender[ order ].orderHireStartDate,
                      orderHireName: ordersToRender[ order ].orderHireName,
                      orderApprovalManager: ordersToRender[ order ].orderApprovalManager,
                      orderBusinessUnit: ordersToRender[ order ].orderBusinessUnit,
                      orderAttention: ordersToRender[ order ].orderAttention,
                      orderShippingAddress: ordersToRender[ order ].orderShippingAddress,
                      orderItem: ordersToRender[ order ].orderItem,
                      orderTotal: ordersToRender[ order ].orderTotal,
                      orderComments: ordersToRender[ order ].orderComments,
                      orderCategory: ordersToRender[ order ].orderCategory,
                      orderSla: ordersToRender[ order ].orderSla,
                      itamOwner: ordersToRender[ order ].orderItam.itamOwner.userName,
                      itamStatus: ordersToRender[ order ].orderItam.itamStatus,
                      itamVerificationEmailSent:
                        ordersToRender[ order ].orderItam.itamVerificationEmailSent,
                      itamProductSource: ordersToRender[ order ].orderItam.itamProductSource,
                      itamOldAssetTag: ordersToRender[ order ].orderItam.itamOldAssetTag,
                      itamOldModel: ordersToRender[ order ].orderItam.itamOldModel,
                      itamMonitorModel: ordersToRender[ order ].orderItam.itamMonitorModel,
                      itamMonitorNum: ordersToRender[ order ].orderItam.itamMonitorNum,
                      itamConnectorTypes: ordersToRender[ order ].orderItam.itamConnectorTypes,
                      itamOrderPendingEmail:
                        ordersToRender[ order ].orderItam.itamOrderPendingEmail,
                      itamConfirmedNewHire: ordersToRender[ order ].orderItam.itamConfirmedNewHire,
                      itamPoOrderId: ordersToRender[ order ].orderItam.itamPoOrderId,
                      itamDellOrderId: ordersToRender[ order ].orderItam.itamDellOrderId,
                      itamDellEmailNotif: ordersToRender[ order ].orderItam.itamDellEmailNotif,
                      techOwner: ordersToRender[ order ].orderTech.techOwner.userName,
                      techStatus: ordersToRender[ order ].orderTech.techStatus,
                      techConfirmedUser: ordersToRender[ order ].orderTech.techConfirmedUser,
                      techCostCenter: ordersToRender[ order ].orderTech.techCostCenter,
                      techServiceTag: ordersToRender[ order ].orderTech.techServiceTag,
                      techInitialEmail: ordersToRender[ order ].orderTech.techInitialEmail,
                      techDateFollowupTemp: ordersToRender[ order ].orderTech.techDateFollowupTemp,
                      techFollowupEmailSent:
                        ordersToRender[ order ].orderTech.techFollowupEmailSent,
                      techDateCompleted: ordersToRender[ order ].orderTech.techDateCompleted
                    };
                    i++;
                  }
                  flattenedOrders = JSON.parse( JSON.stringify( flattenedOrders ) );
                  return (
                    <CSVDownload
                      class="csv-output"
                      data={flattenedOrders}
                      filename={
                        "Orders Export - " + new Date().toISOString().split("T")[ 0 ] + ".csv"
                      }
                    />
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

export default Export;
