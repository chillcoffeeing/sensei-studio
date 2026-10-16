import type { TeamProfileLink } from '@/shared/ui/types';
import type { TeamMember, TeamProfileLabels } from './schema';

/** Traduce los perfiles de un integrante al contrato de TeamCard: descarta los que no tienen URL. */
export function profileLinks(member: TeamMember, labels: TeamProfileLabels): TeamProfileLink[] {
  return member.profiles
    .filter((profile) => profile.url !== '')
    .map((profile) => ({
      network: profile.network,
      href: profile.url,
      label: `${labels.label.replaceAll('{name}', member.name).replaceAll('{network}', labels.networks[profile.network])} ${labels.newTab}`,
    }));
}
