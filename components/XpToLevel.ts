// Define an interface for User
interface User {
    level: number;
    xp: number;
}

// Function to calculate experience needed to level up
function XpToLevel(user: User): number {
    // The experience needed increases as the level increases
    return user.level * 100; // Example: 100 * level
}
export default XpToLevel;


