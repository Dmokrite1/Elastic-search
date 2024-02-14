/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client } from '@elastic/elasticsearch';
import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/lib/sync';
import fs from 'fs';
import express from 'express';

const client = new Client({
    // URL du serveur Elasticsearch
    node: 'https://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'IJ9DMkHrIcgDQgHNwsws'
    },
    tls: {
        ca: await readFile('http_ca.crt')
    }
});

async function init() {
    // Lire le fichier CSV des membres
    const membersCsv = fs.readFileSync('./data/members.csv', 'utf8');
    const members = parse(membersCsv, { columns: true });

    // Lire le fichier CSV des spécialités
    const specialitiesCsv = fs.readFileSync('./data/specialities.csv', 'utf8');
    const specialities = parse(specialitiesCsv, { columns: true });

    // Mapping Elasticsearch
    const mapping: any = {
        mappings: {
            properties: {
                name: { type: "text" },
                speciality: { type: "text" }
            }
        }
    };

    // Créer l'index avec le mapping
    async function createIndex() {
        await client.indices.create({
            index: 'members_index',
            body: mapping
        });
    }

    // Injecter les données des membres dans Elasticsearch
    async function indexMembers() {
        const body = members.flatMap((doc: any) => [{ index: { _index: 'members_index' } }, doc]);
        await client.bulk({ refresh: true, body });
    }

    // Injecter les données des spécialités dans Elasticsearch
    async function indexSpecialities() {
        const body = specialities.flatMap((doc: any) => [{ index: { _index: 'members_index' } }, doc]);
        await client.bulk({ refresh: true, body });
    }

    // Appeler les fonctions pour créer l'index et injecter les données
    async function main() {
        await createIndex();
        await indexMembers();
        await indexSpecialities();
    }

    main().catch(console.error);
}

const app = express();

app.get('/member/search', async (req, res) => {
    const q: string | undefined = req.query.q as string | undefined;
  const body = await client.search({
    index: 'members_index',
    body: {
      query: {
        match: {
            name: q
        }
      }
    }
  });

  res.json(body.hits.hits);
});

app.listen(5601, () => {
  console.log('Serveur démarré sur le port 5601');
});

// Lancer l'initialisation
// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
