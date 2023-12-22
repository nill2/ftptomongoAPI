import { ApolloServer, gql } from 'apollo-server-express';
import mongoose from 'mongoose';
import express, { Application } from 'express';

const app = express();
const PORT = 3000;

// MongoDB Connection URI (replace with your actual URI)
const mongoURI = 'your-mongodb-uri';

// Define a MongoDB model
const DocumentModel = mongoose.model('Document', new mongoose.Schema({
  name: String,
  createdAt: Date
}));

// Connect to MongoDB
mongoose.connect(mongoURI);

// GraphQL Resolver
const resolvers = {
  Query: {
    latestDocument: async () => {
      try {
        const latestDocument = await DocumentModel.findOne().sort({ _id: -1 }).exec();
        return latestDocument;
      } catch (error) {
        console.error('Error retrieving the latest document:', error);
        throw new Error('Internal Server Error');
      }
    },
  },
};

// Apollo Server
const typeDefs = gql`
  # Your GraphQL schema (contents of src/schema.graphql)
`;

const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware to Express
server.applyMiddleware({ app } as any);


// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
