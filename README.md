# port-ale
Webapp redo of ITAM Portal Orders Spreadsheet

# Stack
### React, Apollo, GraphQL, Prisma

Create Order Mutation
```
mutation order{
	createOrder(data:{
    orderid: 1
    datecreated: "1234-12-10"
    dateapproved: "1234-12-10"
		createdby: "Bob Bobert"
		createdbyemail: "Bob.Bobert@totallyrealcompany.com" 
		recipient: "Bobby Bobert" 
		newhire: false 
		hirename:"" 
		hiredate: null
		approvalmanager: "Big Bob" 
		businessunit: "Facility: D15, Cost Center: 4582SO" 
		attention: "Bobby Bobert" 
		shippingaddress:"123 Cookie Street" 
		items: "1 Taco please"
		total:1807.00 
		comments:"No comment" 
    itam: {
      create:{
        status: "Not Started"
      }
    }
    tech: {
      create:{
        status: "Not Started"
      }
    }
  }){
    id
  }
}
```
