// Hardcoded mock user for development — will be replaced with real auth
export const MOCK_USER = {
  id: "11111111-1111-1111-1111-111111111111",
  full_name: "Marcus Reeves",
  email: "marcus.reeves@coastalwealth.com",
  role: "junior" as const,
  region: "Tampa Bay",
  years_experience: 3,
  licensed_states: ["FL"],
};

// Hardcoded mock senior advisor for match testing
export const MOCK_SENIOR = {
  id: "aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  full_name: "Patricia Delgado",
  email: "patricia.delgado@coastalwealth.com",
  role: "senior" as const,
  region: "Tampa Bay",
  years_experience: 18,
  licensed_states: ["FL", "GA", "TX"],
};
