const {gql} = require("apollo-server");
const dbWorks = require("../dbWorks");

const typeDefs = gql`
    type Equipment{
        id: String
        used_by: String
        count: Int
        new_or_used: String
    }
`
const resolvers = {
    Query:{
       equipments: (parent, args) => dbWorks.getEquipment(args),
    },
    Mutation:{
        deleteEquipment: (parent, args) => dbWorks.deleteItem('equipments',args),
    }
}    

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}