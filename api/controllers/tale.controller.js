import fetch from 'node-fetch';
import environment from '../config/environment.js';
import Tale from '../models/tale.model.js';
import versionStatus from '../models/status.enum.js';

// minor issue at Talepreter. certificate is not so strong so systems sometimes complain about it
import https from 'https';
const agent = new https.Agent({
  rejectUnauthorized: false,
});

// NOTE: right now Talepreter backend does not store list of tales, there was no requirement or use case so it was skipped
// until that is implemented we return hardcoded known tales
export function getTales(req, res) {
  console.debug('API:Tale.getTales...');
  res.json({
    message: 'Success',
    data: [
      new Tale('Vorania (Current)', '468389c6-b62d-43df-a24f-268bd067fc00'),
      new Tale('Vorania (Abandoned Attempt#2)', '71505a33-f4e3-460b-ac94-bc36060f4675'),
      new Tale('Luthrenass (Abandoned Attempt#1)', '0a329aa3-b90c-4738-a800-c1e463538525'),
    ],
  });
}

export async function getVersions(req, res) {
  const taleId = req.params.taleId;
  try {
    console.debug(`API:Tale.getVersions: ${taleId}...`);

    if (taleId === null || taleId == '') {
      res.json({
        message: 'Failure',
        data: 'Empty tale id',
      });
      return;
    }

    const response = await fetch(environment.talepreterEndpoint + `/api/tale/${taleId}/versions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      agent,
    }); // workaround until certificate is fixed
    const result = await response.json();
    const versions = result.versions;

    var responseData = [];
    await Promise.all(
      versions.map(async (versionId) => {
        const summaryResponse = await fetch(environment.talepreterEndpoint + `/api/tale/${taleId}/${versionId}/summary`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          agent,
        }); // workaround until certificate is fixed
        const summary = await summaryResponse.json();
        responseData.push({
          id: versionId,
          status: versionStatus(summary.status),
          lastPage: {
            chapter: summary.lastPage.chapter,
            page: summary.lastPage.page,
          },
        });
      }),
    );

    res.json({
      message: 'Success',
      data: responseData,
    });
  } catch (error) {
    console.error(`ERR:Tale.getVersions: ${taleId}, ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}
