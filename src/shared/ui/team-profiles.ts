// Redes profesionales que admite TeamCard (TEAM-V2): una por icono de src/assets/team/.
// Redes de trabajo, no redes sociales personales.
export const TEAM_PROFILE_NETWORKS = ['behance', 'dribbble', 'linkedin', 'github'] as const;

export type TeamProfileNetwork = (typeof TEAM_PROFILE_NETWORKS)[number];
