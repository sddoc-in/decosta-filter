
export default function isValidRole(role:string): boolean {
    const validRoles = ["supreme_leader", "party_leader", "community_managers"];
    return validRoles.includes(role);
}