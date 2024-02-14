import type { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service.js';

export class SearchController {
  public static async search (req: Request, res: Response) {
    const lang = (req.query.lang as 'fr' | 'nl' | undefined) ?? 'fr';
    const q = req.query.q as string;

    const specFields = lang === 'fr' ? ['specialties.label'] : ['specialties.label_nl'];
    const memberFields = lang === 'fr' ? ['first_name', 'last_name', 'diploma'] : ['first_name', 'last_name', 'diploma_nl'];

    if (!q) {
      res.status(400);
      res.json({
        message: 'Please enter a q',
      });
      return;
    }

    const search = await DatabaseService.client?.search({
      index: 'abex',
      query: {
        bool: {
          should: [
            {
              nested: {
                path: 'specialties',
                query: {
                  multi_match: {
                    query: q,
                    fields: specFields,
                  },
                },
              },
            },
            {
              multi_match: {
                query: q,
                fields: memberFields,
              },
            },
          ],
        },
      },
    });

    res.json({
      result: search?.hits.hits,
    });
  }
}
