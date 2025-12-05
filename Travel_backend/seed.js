// seed.js
/*const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const { User, Policy } = require("./modules"); // make sure modules/index.js exports all models

(async () => {
  try {
    // Drop & recreate tables
    await sequelize.sync({ force: true });

    // Hash passwords
    const adminPass = await bcrypt.hash("admin123", 10);
    const managerPass = await bcrypt.hash("manager123", 10);
    const employeePass = await bcrypt.hash("employee123", 10);

    // Create Users
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@corp.com",
      password: adminPass,
      role: "admin",
      department: "HR",
    });

    const manager = await User.create({
      name: "John Manager",
      email: "manager@corp.com",
      password: managerPass,
      role: "manager",
      department: "Sales",
    });

    const employee = await User.create({
      name: "Emily Employee",
      email: "employee@corp.com",
      password: employeePass,
      role: "employee",
      department: "Marketing",
    });

    // Create Default Travel Policy
    const defaultPolicy = await Policy.create({
      policyName: "Default Travel Policy",
      travelPurpose: "Business",
      bookingRules: { class: "Economy", advanceBookingDays: 14 },
      safetyRules: { insurance: true, riskAssessment: true },
      expenseRules: { perDiem: 50, receiptDeadlineDays: 7 },
    });

    console.log("✅ Seed data inserted successfully!");
    console.log("---- Login Credentials ----");
    console.log("Admin -> admin@corp.com / admin123");
    console.log("Manager -> manager@corp.com / manager123");
    console.log("Employee -> employee@corp.com / employee123");
    console.log("Default Policy:", defaultPolicy.toJSON());

    process.exit();
  } catch (err) {
    console.error("❌ Error inserting seed data:", err);
    process.exit(1);
  }
})();
*/

// seed.js
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const { Users: User, Policy } = require("./modules"); // Ensure all models are exported

(async () => {
  try {
    const forceSync = process.argv.includes("--force"); // Run with node seed.js --force to drop tables

    console.log(`🔄 Starting seed process (force: ${forceSync})...`);
    await sequelize.sync({ force: forceSync });

    console.log("🔑 Hashing passwords...");
    const adminPass = await bcrypt.hash("admin123", 10);
    const managerPass = await bcrypt.hash("manager123", 10);
    const employeePass = await bcrypt.hash("employee123", 10);

    console.log("👤 Creating users...");
    const users = [
      {
        name: "Super Admin",
        email: "admin@corp.com",
        password: adminPass,
        role: "admin",
        department: "HR",
      },
      {
        name: "John Manager",
        email: "manager@corp.com",
        password: managerPass,
        role: "manager",
        department: "Sales",
      },
      {
        name: "Emily Employee",
        email: "employee@corp.com",
        password: employeePass,
        role: "employee",
        department: "Marketing",
      },
    ];

    for (const userData of users) {
      try {
        const user = await User.create(userData);
        console.log(`✅ Created user: ${user.email}`);
      } catch (err) {
        console.error(`❌ Failed to create user ${userData.email}:`, err.message);
      }
    }

    console.log("📜 Creating default travel policy...");
    const defaultPolicy = await Policy.create({
      policyName: "Default Travel Policy",
      travelPurpose: "Business",
      bookingRules: { class: "Economy", advanceBookingDays: 14 },
      safetyRules: { insurance: true, riskAssessment: true },
      expenseRules: { perDiem: 50, receiptDeadlineDays: 7 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Seed data inserted successfully!");
    console.log("---- Login Credentials ----");
    console.log("Admin    -> admin@corp.com / admin123");
    console.log("Manager  -> manager@corp.com / manager123");
    console.log("Employee -> employee@corp.com / employee123");
    console.log("Default Policy:", defaultPolicy.toJSON());

    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting seed data:", err);
    process.exit(1);
  }
})();
