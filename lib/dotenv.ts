// Load environment variables for database operations
import { config } from "dotenv";

// Load environment variables for database operations
config({ path: ".env.local", override: true });

export default config;
