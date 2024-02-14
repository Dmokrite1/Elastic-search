import { parse } from 'csv-parse/sync';
import { readFile } from 'fs/promises';

export interface MembersMapping {
  code: string,
  first_name: string,
  last_name: string,
  diploma: string,
  diploma_nl: string,
  profession: string,
  profession_nl: string,
  email: string,
  website: string,
  phone: string,
  cellphone: string,
  lang: string,
  address: {
    street: string,
    town: string,
    zip: string,
    number: string,
  },
  specialties: {
    code: string,
    label: string,
    label_nl: string,
  }[],
}

export async function importCSV (): Promise<MembersMapping[]> {
  const members = await readFile('data/members.csv');
  const specialities = await readFile('data/specialities.csv');

  const membersParsed = parse(members, {
    delimiter: ';',
    columns: true,
  });
  const specialitiesParsed = parse(specialities, {
    delimiter: ';',
    columns: true,
  });

  return membersParsed.map((member: any) => {
    const specialties = member.specialites.split('|');

    return {
      code: member.code,
      first_name: member.prenom,
      last_name: member.nom,
      diploma_nl: member.diplome,
      diploma: member.diplome_neerlandais,
      email: member.email,
      website: member.website,
      cellphone: member.gsm,
      phone: member.telephone,
      lang: member.langue,
      address: {
        street: member.addresse_rue,
        number: member.adresse_numero,
        town: member.adresse_ville,
        zip: member.adresse_code_postal,
      },
      specialties: specialties.map((sid: string) => {
        const spec = specialitiesParsed.find(
          ({ code }: { code: string }) => code === sid,
        );

        if (!spec) {
          return {};
        }

        return {
          code: spec.code,
          label: spec.label,
          label_nl: spec.label_neerlandais,
        };
      }),
    } as MembersMapping;
  });
}
