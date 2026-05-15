import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: execute single raw SQL statement
const sql = (query) => prisma.$executeRawUnsafe(query);

// Auto-initialize database schema on startup
export async function initDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // Create enums
    await sql(`DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('customer', 'provider', 'admin'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
    await sql(`DO $$ BEGIN CREATE TYPE "OrderStatus" AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
    await sql(`DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('held', 'released', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$`);

    // User
    await sql(`CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "fullname" TEXT NOT NULL, "email" TEXT NOT NULL, "phone_number" TEXT, "password_hash" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'customer', "verification_status" BOOLEAN NOT NULL DEFAULT false, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "User_pkey" PRIMARY KEY ("id"))`);
    await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`);

    // Profile
    await sql(`CREATE TABLE IF NOT EXISTS "Profile" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "userId" TEXT NOT NULL, "bio" TEXT, "profile_picture" TEXT, "kyc_status" TEXT NOT NULL DEFAULT 'pending', "kyc_document" TEXT, "location" TEXT, "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Profile_pkey" PRIMARY KEY ("id"), CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
    await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userId_key" ON "Profile"("userId")`);

    // Service
    await sql(`CREATE TABLE IF NOT EXISTS "Service" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "providerId" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "price" DECIMAL(10,2) NOT NULL, "category" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Service_pkey" PRIMARY KEY ("id"), CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE)`);

    // Order
    await sql(`CREATE TABLE IF NOT EXISTS "Order" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "serviceId" TEXT NOT NULL, "customerId" TEXT NOT NULL, "providerId" TEXT NOT NULL, "status" "OrderStatus" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Order_pkey" PRIMARY KEY ("id"), CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON UPDATE CASCADE, CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON UPDATE CASCADE, CONSTRAINT "Order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON UPDATE CASCADE)`);

    // Transaction
    await sql(`CREATE TABLE IF NOT EXISTS "Transaction" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, "amount" DECIMAL(10,2) NOT NULL, "status" "PaymentStatus" NOT NULL DEFAULT 'held', "payment_method" TEXT, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"), CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON UPDATE CASCADE)`);
    await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_orderId_key" ON "Transaction"("orderId")`);

    // Review
    await sql(`CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, "reviewerId" TEXT NOT NULL, "reviewedUserId" TEXT NOT NULL, "rating" INTEGER NOT NULL, "review_text" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Review_pkey" PRIMARY KEY ("id"), CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON UPDATE CASCADE, CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON UPDATE CASCADE, CONSTRAINT "Review_reviewedUserId_fkey" FOREIGN KEY ("reviewedUserId") REFERENCES "User"("id") ON UPDATE CASCADE)`);

    // Notification
    await sql(`CREATE TABLE IF NOT EXISTS "Notification" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "message" TEXT NOT NULL, "is_read" BOOLEAN NOT NULL DEFAULT false, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"), CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE)`);

    // Message
    await sql(`CREATE TABLE IF NOT EXISTS "Message" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, "senderId" TEXT NOT NULL, "receiverId" TEXT NOT NULL, "message" TEXT NOT NULL, "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Message_pkey" PRIMARY KEY ("id"), CONSTRAINT "Message_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON UPDATE CASCADE, CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON UPDATE CASCADE, CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON UPDATE CASCADE)`);

    console.log('✅ Database schema verified/initialized');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
}

export default prisma;
