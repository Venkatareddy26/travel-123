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
const { Users: User, Policy, Trip } = require("./modules");

(async () => {
  try {
    const forceSync = process.argv.includes("--force");

    console.log(`🔄 Starting seed process (force: ${forceSync})...`);
    await sequelize.sync({ force: forceSync });

    console.log("🔑 Hashing passwords...");
    const adminPass = await bcrypt.hash("admin123", 10);
    const managerPass = await bcrypt.hash("manager123", 10);
    const employeePass = await bcrypt.hash("employee123", 10);

    console.log("👤 Creating users...");
    const usersData = [
      { name: "Super Admin", email: "admin@corp.com", password: adminPass, role: "admin", department: "HR" },
      { name: "John Manager", email: "manager@corp.com", password: managerPass, role: "manager", department: "Sales" },
      { name: "Emily Employee", email: "employee@corp.com", password: employeePass, role: "employee", department: "Marketing" },
      { name: "Alice Tester", email: "alice@corp.com", password: employeePass, role: "employee", department: "QA" },
      { name: "Bob Developer", email: "bob@corp.com", password: employeePass, role: "employee", department: "Engineering" },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      try {
        const [user] = await User.findOrCreate({ where: { email: userData.email }, defaults: userData });
        createdUsers.push(user);
        console.log(`✅ User: ${user.email}`);
      } catch (err) {
        console.error(`❌ Failed: ${userData.email}:`, err.message);
      }
    }

    console.log("📜 Creating policies...");
    await Policy.findOrCreate({
      where: { policyName: "Default Travel Policy" },
      defaults: {
        policyName: "Default Travel Policy",
        travelPurpose: "Business",
        bookingRules: { class: "Economy", advanceBookingDays: 14 },
        safetyRules: { insurance: true, riskAssessment: true },
        expenseRules: { perDiem: 50, receiptDeadlineDays: 7 },
      },
    });

    console.log("✈️ Creating sample trips...");
    const employeeUser = createdUsers.find(u => u.email === "employee@corp.com");
    const aliceUser = createdUsers.find(u => u.email === "alice@corp.com");
    const bobUser = createdUsers.find(u => u.email === "bob@corp.com");

    const tripsData = [
      { userId: employeeUser?.id || 3, employeeName: "Emily Employee", destination: "New York", purpose: "Client Meeting", startDate: "2025-12-15", endDate: "2025-12-18", status: "approved", budget: 5000 },
      { userId: employeeUser?.id || 3, employeeName: "Emily Employee", destination: "London", purpose: "Conference", startDate: "2025-12-20", endDate: "2025-12-25", status: "pending", budget: 8000 },
      { userId: aliceUser?.id || 4, employeeName: "Alice Tester", destination: "San Francisco", purpose: "Training", startDate: "2025-12-10", endDate: "2025-12-12", status: "approved", budget: 3000 },
      { userId: bobUser?.id || 5, employeeName: "Bob Developer", destination: "Tokyo", purpose: "Tech Summit", startDate: "2026-01-05", endDate: "2026-01-10", status: "pending", budget: 12000 },
      { userId: employeeUser?.id || 3, employeeName: "Emily Employee", destination: "Chicago", purpose: "Sales Meeting", startDate: "2025-12-28", endDate: "2025-12-30", status: "rejected", budget: 2500 },
    ];

    for (const tripData of tripsData) {
      try {
        await Trip.findOrCreate({ where: { destination: tripData.destination, startDate: tripData.startDate }, defaults: tripData });
        console.log(`✅ Trip: ${tripData.destination}`);
      } catch (err) {
        console.error(`❌ Trip failed: ${tripData.destination}:`, err.message);
      }
    }

    console.log("\n✅ Seed completed!");
    console.log("---- Login Credentials ----");
    console.log("Admin    -> admin@corp.com / admin123");
    console.log("Manager  -> manager@corp.com / manager123");
    console.log("Employee -> employee@corp.com / employee123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
