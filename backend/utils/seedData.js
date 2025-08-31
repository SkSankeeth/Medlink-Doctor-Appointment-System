// backend/utils/seedData.js
import Doctor from "../models/DoctorSchema.js";


// Fetch doctors dynamically
export const getSeedDoctors = async () => {
try {
const doctors = await Doctor.find({ isApproved: "approved" }).select("-password");
return doctors;
} catch (error) {
console.error("Error fetching doctors:", error.message);
throw new Error("Failed to fetch doctors from database");
}
};