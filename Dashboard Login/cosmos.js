require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const client = new CosmosClient({ endpoint, key });

const database = client.database(process.env.DATABASE_ID);
const container = database.container(process.env.CONTAINER_ID);

module.exports = { container };

async function addUser(email, password) {
    // Check if a user with the given email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);
  
    const { resource } = await container.items.create({
      id: email,  // Use email as the document ID
      email,
      password: hashedPassword,
    });
  
    return resource;
  }
  
  async function getUserByEmail(email) {
    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @email",
        parameters: [{ name: "@email", value: email }],
      })
      .fetchAll();
  
    return resources[0];
  }
  
  
    async function getUser(email) {
    const { resources } = await container.items.query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email }],
    })
    .fetchAll();

    return resources[0];
    }

    const bcrypt = require('bcryptjs');

    async function loginUser(email, password) {
    const user = await getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
        return { success: true, message: 'Login successful', user: user };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
    }

module.exports = { addUser, getUser, loginUser };