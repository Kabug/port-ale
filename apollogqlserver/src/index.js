const { ApolloServer, gql } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { Prisma } = require("prisma-binding");
const typeDefsApollo = importSchema("./src/schema.graphql");
const typeDefsPrisma = importSchema("./src/generated/prisma.graphql");

const resolvers = {
	Query: {
		orders(parent, args, ctx, info) {
			return ctx.db.query.orders({}, info );
		},
		filteredOrders(parent, { orderCategory }, ctx, info) {
			return ctx.db.query.orders({ where: { orderCategory } }, info );
		},
		users(parent, args, ctx, info) {
			return ctx.db.query.users({}, info );
		},
		filteredUsers(parent, { userName }, ctx, info) {
			return ctx.db.query.users({ where: { userName } }, info );
		},
		order(parent, { id }, ctx, info) {
			return ctx.db.query.order({ where: { id } }, info );
		},
		nextOrders(parent, args, ctx, info) {
			if ( args.input.before === "" ) {
				return ctx.db.query.orders({
						where: { orderCategory: args.input.orderCategory },
						last: 20,
						orderBy: "id_ASC"
					},
					info
				);
			}
			return ctx.db.query.orders({
					where: { orderCategory: args.input.orderCategory },
					last: 20,
					before: args.input.before,
					orderBy: "id_ASC"
				},
				info
			);
		}
	},
	Mutation: {
		createOrder(parent, args, ctx, info) {
			if ( args.input.id ) {
				return ctx.db.mutation.createOrder({
						data: {
							id: args.input.id,
							orderSimplexId: args.input.orderSimplexId,
							orderDateCreated: args.input.orderDateCreated,
							orderDateApproved: args.input.orderDateApproved,
							orderCreatedBy: args.input.orderCreatedBy,
							orderCreatedByEmail: args.input.orderCreatedByEmail,
							orderNewHire: args.input.orderNewHire,
							orderRecipient: args.input.orderRecipient,
							orderHireStartDate: args.input.orderHireStartDate,
							orderHireName: args.input.orderHireName,
							orderApprovalManager: args.input.orderApprovalManager,
							orderBusinessUnit: args.input.orderBusinessUnit,
							orderAttention: args.input.orderAttention,
							orderShippingAddress: args.input.orderShippingAddress,
							orderItem: args.input.orderItem,
							orderTotal: args.input.orderTotal,
							orderComments: args.input.orderComments,
							orderCategory: args.input.orderCategory,
							orderSla: args.input.orderSla,
							orderItam: args.input.orderItam,
							orderTech: args.input.orderTech
						}
					},
					info,
				);
			}
			return ctx.db.mutation.createOrder({
					data: {
						orderSimplexId: args.input.orderSimplexId,
						orderDateCreated: args.input.orderDateCreated,
						orderDateApproved: args.input.orderDateApproved,
						orderCreatedBy: args.input.orderCreatedBy,
						orderCreatedByEmail: args.input.orderCreatedByEmail,
						orderNewHire: args.input.orderNewHire,
						orderRecipient: args.input.orderRecipient,
						orderHireStartDate: args.input.orderHireStartDate,
						orderHireName: args.input.orderHireName,
						orderApprovalManager: args.input.orderApprovalManager,
						orderBusinessUnit: args.input.orderBusinessUnit,
						orderAttention: args.input.orderAttention,
						orderShippingAddress: args.input.orderShippingAddress,
						orderItem: args.input.orderItem,
						orderTotal: args.input.orderTotal,
						orderComments: args.input.orderComments,
						orderCategory: args.input.orderCategory,
						orderSla: args.input.orderSla,
						orderItam: args.input.orderItam,
						orderTech: args.input.orderTech
					}
				},
				info,
			);
		},
		createUser(parent, { userName }, ctx, info) {
			return ctx.db.mutation.createUser({ data: {	userName } }, info );
		},
		deleteOrder(parent, { id }, ctx, info) {
			return ctx.db.mutation.deleteOrder({ where: { id } }, info );
		},
		deleteUser(parent, { id }, ctx, info) {
			return ctx.db.mutation.deleteUser({ where: { id } }, info );
		},
		updateUser(parent, { id, userName }, ctx, info) {
			return ctx.db.mutation.updateUser({
				data: { userName },
				where: { id },
				info
			});
		},
		updateCategory(parent, { id, orderCategory }, ctx, info) {
			return ctx.db.mutation.updateOrder({
				data: { orderCategory },
				where: { id },
				info
			});
		},
		updateEntireOrder(parent, args, ctx, info) {
			// use props for where and state for update data
			ctx.db.mutation.updateItamProgress({
				data: {
					itamOwner: { connect: { userName:  args.input.itamUserName } },
				  itamStatus: args.input.itamStatus,
				  itamVerificationEmailSent: args.input.itamVerificationEmailSent,
				  itamProductSource: args.input.itamProductSource,
				  itamOldAssetTag: args.input.itamOldAssetTag,
				  itamOldModel: args.input.itamOldModel,
				  itamMonitorModel: args.input.itamMonitorModel,
				  itamMonitorNum: args.input.itamMonitorNum,
				  itamConnectorTypes: args.input.itamConnectorTypes,
				  itamOrderPendingEmail: args.input.itamOrderPendingEmail,
				  itamConfirmedNewHire: args.input.itamConfirmedNewHire,
				  itamPoOrderId: args.input.itamPoOrderId,
				  itamDellOrderId: args.input.itamDellOrderId,
				  itamDellEmailNotif: args.input.itamDellEmailNotif
				},
				where: { id: args.input.itamId },
				info
			});
			ctx.db.mutation.updateTechProgress({
				data: {
					techOwner: { connect: { userName: args.input.techUserName } },
				  techStatus: args.input.techStatus,
				  techConfirmedUser: args.input.techConfirmedUser,
				  techCostCenter: args.input.techCostCenter,
				  techServiceTag: args.input.techServiceTag,
				  techInitialEmail: args.input.techInitialEmail,
				  techDateFollowupTemp: args.input.techDateFollowupTemp,
				  techFollowupEmailSent: args.input.techFollowupEmailSent,
				  techDateCompleted: args.input.techDateCompleted
				},
				where: { id: args.input.techId },
				info
			});
			return ctx.db.mutation.updateOrder({
				data: {
					orderSimplexId: args.input.orderSimplexId,
					orderDateCreated: args.input.orderDateCreated,
					orderDateApproved: args.input.orderDateApproved,
					orderCreatedBy: args.input.orderCreatedBy,
					orderCreatedByEmail: args.input.orderCreatedByEmail,
					orderNewHire: args.input.orderNewHire,
					orderRecipient: args.input.orderRecipient,
					orderHireStartDate: args.input.orderHireStartDate,
					orderHireName: args.input.orderHireName,
					orderApprovalManager: args.input.orderApprovalManager,
					orderBusinessUnit: args.input.orderBusinessUnit,
					orderAttention: args.input.orderAttention,
					orderShippingAddress: args.input.orderShippingAddress,
					orderItem: args.input.orderItem,
					orderTotal: args.input.orderTotal,
					orderComments: args.input.orderComments,
					orderCategory: args.input.orderCategory,
					orderSla: args.input.orderSla
				},
				where: { id: args.input.orderId },
				info
			});
		}
	}
};

const server = new ApolloServer({
	typeDefs: typeDefsApollo,
	resolvers,
	context: req => ({
		...req,
		db: new Prisma({
			// generated prisma db schema
			typeDefs: typeDefsPrisma,
			// endpoint of prisma db service
			endpoint: "http://localhost:4466",
			 // specified in database/prisma.yml
			secret: "supahsecret123",
			debug: true
		})
	})
});

server.listen().then( ({
	url
}) => {
	console.log( `Server is ready at ${url}` );
});
