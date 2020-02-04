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
		filteredOrders(parent, args, ctx, info) {
			return ctx.db.query.orders({ where: { ordercategory: args.ordercategory } }, info );
		},
		users(parent, args, ctx, info) {
			return ctx.db.query.users({}, info );
		},
		filteredUsers(parent, args, ctx, info) {
			return ctx.db.query.users({ where: { name: args.name } }, info );
		},
		order(parent, args, ctx, info) {
			return ctx.db.query.order({ where: { id: args.id } }, info );
		}
	},
	Mutation: {
		createOrder(parent, {
			orderid,
			datecreated,
			dateapproved,
			createdby,
			createdbyemail,
			recipient,
			newhire,
			hirename,
			hirestartdate,
			approvalmanager,
			businessunit,
			attention,
			shippingaddress,
			items,
			total,
			comments,
			ordercategory,
			sla,
			itam,
			tech
		}, ctx, info) {
			return ctx.db.mutation.createOrder({
					data: {
						orderid,
						datecreated,
						dateapproved,
						createdby,
						createdbyemail,
						recipient,
						newhire,
						hirename,
						hirestartdate,
						approvalmanager,
						businessunit,
						attention,
						shippingaddress,
						items,
						total,
						comments,
						ordercategory,
						sla,
						itam,
						tech
					}
				},
				info,
			);
		},
		createUser(parent, { name }, ctx, info) {
			return ctx.db.mutation.createUser({ data: {	name } }, info );
		},
		deleteOrder(parent, { id }, ctx, info) {
			return ctx.db.mutation.deleteOrder({ where: { id } }, info );
		},
		deleteUser(parent, { id }, ctx, info) {
			return ctx.db.mutation.deleteUser({ where: { id } }, info );
		},
		updateUser(parent, { id, name }, ctx, info) {
			return ctx.db.mutation.updateUser({ data: { name }, where: { id }, info });
		},
		updateEntireOrder(parent, {
		approvalManager,
		attention,
		businessUnit,
		comments,
		createdBy,
		createdByEmail,
		dateApproved,
		dateCreated,
		hireName,
		hireStartDate,
		id,
		item,
		newHire,
		orderCategory,
		orderID,
		recipient,
		shippingAddress,
		sla,
		total,
		ITAMConfirmedNewhire,
		ITAMConnectorType,
		ITAMDellEmailNotif,
		ITAMDellOrder,
		ITAMid,
		ITAMMonitorModel,
		ITAMMonitorNum,
		ITAMOldAssetTag,
		ITAMOldModel,
		ITAMOrderPendEmail,
		ITAMPOOrder,
		ITAMProductSource,
		ITAMStatus,
		ITAMVerificationEmailSent,
		ITAMName,
		TechConfirmedUser,
		TechCostCenter,
		TechDateSetupCompleted,
		TechDateFollowupTemp,
		TechFollowupEmail,
		Techid,
		TechEmailPCSent,
		TechServiceTag,
		TechStatus,
		TechName
		}, ctx, info) {
			// use props for where and state for update data
			ctx.db.mutation.updateOrder({ data: {
				approvalManager,
				attention,
				businessUnit,
				comments,
				createdBy,
				createdByEmail,
				dateApproved,
				dateCreated,
				hireName,
				hireStartDate,
				item,
				newHire,
				orderCategory,
				orderID,
				recipient,
				shippingAddress,
				sla,
				total
			}, where: { id }, info });
			ctx.db.mutation.updateITAMProgress({ data: {
				itamowner: { disconnect: true }
			}, where: { ITAMid }, info });
			ctx.db.mutation.updateITAMProgress({ data: {
				ITAMConfirmedNewhire,
				ITAMConnectorType,
				ITAMDellEmailNotif,
				ITAMDellOrder,
				ITAMMonitorModel,
				ITAMMonitorNum,
				ITAMOldAssetTag,
				ITAMOldModel,
				ITAMOrderPendEmail,
				ITAMPOOrder,
				ITAMProductSource,
				ITAMStatus,
				ITAMVerificationEmailSent
			}, where: { ITAMid }, info });
			ctx.db.mutation.updateTechnicianProgress({ data: {
				techowner: { disconnect: true }
			}, where: { Techid }, info });
			ctx.db.mutation.updateTechnicianProgress({ data: {
				TechConfirmedUser,
				TechCostCenter,
				TechDateSetupCompleted,
				TechDateFollowupTemp,
				TechFollowupEmail,
				TechEmailPCSent,
				TechServiceTag,
				TechStatus
			}, where: { Techid }, info });
			return TechName;
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
