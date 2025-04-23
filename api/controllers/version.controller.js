import settlementSchema from '../models/settlement.model.js';
import worldSchema from '../models/world.model.js';
import cacheSchema from '../models/cache.model.js';
import actorSchema, { fetchActorProjection } from '../models/actor.model.js';
import { groupSchema, groupSummaryProjection, timelineProjection, groupActorSummaryProjection } from '../models/group.model.js';
import personSchema from '../models/person.model.js';
import mongoose from 'mongoose';
import { anecdoteSchema, loadRootsProjection, expandAnecdoteProjection, searchAnecdoteProjection, fetchAnecdoteProjection } from '../models/anecdote.model.js';

function validate(req, res) {
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;

  if (taleId === null || taleId == '') {
    res.json({
      message: 'Failure',
      data: 'Empty tale id',
    });
    return false;
  }
  if (versionId === null || versionId == '') {
    res.json({
      message: 'Failure',
      data: 'Empty version id',
    });
    return false;
  }

  return true;
}

function getCollectionName(taleId, versionId) {
  const taleIdStipped = taleId.replaceAll('-', '');
  const versionIdStipped = versionId.replaceAll('-', '');
  return `T${taleIdStipped}.P${versionIdStipped}`;
}

// world

export async function getWorld(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getWorld: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const worlds = mongoose.model('WorldModel', worldSchema, getCollectionName(taleId, versionId));
    const results = await worlds.find({ DocumentType: 'World' }).limit(1).lean().exec();
    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'World object could not be retrieved',
      });
      return;
    }

    const world = results[0];
    const lastChapter = world.Chapters.reduce((a, b) => (a._id > b._id ? a : b));
    const lastPage = lastChapter?.Pages.reduce((a, b) => (a._id > b._id ? a : b));
    var today = lastPage?.StartDate ?? 0;
    today += lastPage?.StayAtLocationDays ?? 0;

    var currentLocation = `~~${lastPage.Location.Settlement}~~`;
    if (lastPage.Location.Extension !== null) currentLocation = lastPage.Location.Extension.replace('<SETTLEMENT>', `~~${lastPage.Location.Settlement}~~`);
    if (lastPage.Travel != null) {
      today += lastPage.Travel.Days;
      if (lastPage.Travel.Destination != null) {
        currentLocation = `~~${lastPage.Travel.Destination.Settlement}~~`;
        if (lastPage.Travel.Destination.Extension !== null)
          currentLocation = lastPage.Travel.Destination.Extension.replace('<SETTLEMENT>', `~~${lastPage.Travel.Destination.Settlement}~~`);
      }
    }

    res.json({
      message: 'Success',
      data: {
        era: world.Era,
        focusedGroup: world.FocusedGroupName,
        today,
        currentChapter: lastChapter._id,
        currentPage: lastPage._id,
        currentLocation,
      },
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getGroup(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getGroup: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const collectionName = getCollectionName(taleId, versionId);
    const groups = mongoose.model('WorldModel', worldSchema, collectionName);
    const results = await groups
      .aggregate([
        {
          $match: { DocumentType: 'World' },
        },
        {
          $lookup: {
            localField: 'FocusedGroupDocumentId',
            from: collectionName,
            foreignField: '_id',
            as: 'tempC',
          },
        },
      ])
      .unwind('tempC')
      .replaceRoot('tempC')
      .exec();
    if (results == null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'Focused Group object could not be retrieved or does not exist',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getGroupSummary(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const groupName = req.body.groupName;
  if (groupName == '') {
    res.json({
      message: 'Failure',
      data: 'Group name is empty',
    });
    return;
  }

  const logId = `Version.getGroupSummary: ${taleId}/${versionId}/${groupName}`;
  const collectionName = getCollectionName(taleId, versionId);

  try {
    console.debug(`API:${logId}...`);
    const groupSummary = mongoose.model('GroupModel', groupSchema, collectionName);
    const results = await groupSummary.aggregate(groupSummaryProjection(groupName, collectionName)).exec(); // << this projection is just too big and merged into the model itself so it is at another file

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getSettlements(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getSettlements: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const settlements = mongoose.model('SettlementModel', settlementSchema, getCollectionName(taleId, versionId));
    const results = await settlements
      .find({ DocumentType: 'Settlement', State: 1, IsOutskirts: false, DocumentId: { $regex: '[A-Z].*' } })
      .select('DocumentId Shops Type Description FirstVisited LastVisited Faction ShopExpireOn')
      .lean()
      .exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getChapters(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getChapters: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const worlds = mongoose.model('WorldModel', worldSchema, getCollectionName(taleId, versionId));
    const results = await worlds.find({ DocumentType: 'World' }).limit(1).select('Era Chapters').lean().exec();
    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'World object could not be retrieved',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getTimeline(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getTimeline: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const worlds = mongoose.model('WorldModel', worldSchema, getCollectionName(taleId, versionId));
    const results = await worlds.aggregate(timelineProjection()).exec(); // << this projection is just too big and merged into the model itself so it is at another file

    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'World object could not be retrieved',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getCaches(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getCaches: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const caches = mongoose.model('CacheModel', cacheSchema, getCollectionName(taleId, versionId));
    const results = await caches.find({ DocumentType: 'Cache' }).lean().exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

// actors

export async function getActors(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.getActors: ${taleId}/${versionId}`;

  try {
    console.debug(`API:${logId}...`);
    const actors = mongoose.model('ActorModel', actorSchema, getCollectionName(taleId, versionId));
    const results = await actors.find({ DocumentType: 'Actor', State: 1 }, { _id: 1, DocumentId: 1, Group: 1, IsGroupActor: 1, Order: 1 }).lean().exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getActorDetails(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const actorId = req.body.actorId;
  if (actorId == '') {
    res.json({
      message: 'Failure',
      data: 'Actor id is empty',
    });
    return;
  }

  const logId = `Version.getActorDetails: ${taleId}/${versionId}, ${actorId}`;

  try {
    console.debug(`API:${logId}...`);
    const collectionName = getCollectionName(taleId, versionId);
    const actors = mongoose.model('ActorModel', actorSchema, collectionName);
    const results = await actors.aggregate(fetchActorProjection(actorId, collectionName)).exec();

    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'Actor object could not be retrieved',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getGroupActorDetails(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const groupName = req.body.groupName;
  if (groupName == '') {
    res.json({
      message: 'Failure',
      data: 'Group actor id is empty',
    });
    return;
  }

  const logId = `Version.getGroupActorDetails: ${taleId}/${versionId}, ${groupName}`;

  try {
    console.debug(`API:${logId}...`);
    const collectionName = getCollectionName(taleId, versionId);
    const actors = mongoose.model('ActorModel', actorSchema, collectionName);
    const results = await actors.aggregate(groupActorSummaryProjection(groupName, collectionName)).exec();

    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'Actor object could not be retrieved',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

// persons

export async function searchPersons(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const searchPattern = req.body.searchPattern;
  const searchInContent = req.body.searchInContent;
  const skipDead = req.body.skipDead;
  const skipDummies = req.body.skipDummies;
  const searchInChapter = req.body.searchInChapter;
  const currentChapter = req.body.currentChapter;
  const logId = `Version.searchPersons: ${taleId}/${versionId}, '${searchPattern}', ${searchInContent}, ${skipDead}, ${skipDummies}, ${searchInChapter}, ${currentChapter}`;

  try {
    console.debug(`API:${logId}...`);
    const persons = mongoose.model('PersonModel', personSchema, getCollectionName(taleId, versionId));
    var baseFilter = { DocumentType: 'Person' }; // default filter
    var filters = [];
    filters.push(baseFilter);
    if (searchPattern != '') {
      const regx = { $regex: `.*${searchPattern}.*`, $options: 'i' };

      if (searchInContent == true) {
        filters.push({
          $or: [
            {
              $and: [
                { IsDummy: false },
                { $or: [{ DocumentId: regx }, { Notes: { $elemMatch: { Content: regx } } }, { TagEntries: regx }, { ContentLookup: regx }] },
              ],
            },
            {
              $and: [{ IsDummy: true }, { $or: [{ DocumentId: regx }, { Notes: { $elemMatch: { $and: [{ Content: regx }, { Chapter: currentChapter }] } } }] }],
            },
          ],
        });
      } else {
        filters.push({ DocumentId: regx });
      }
    }
    if (skipDummies) {
      filters.push({ IsDummy: false });
    }
    if (skipDead) {
      filters.push({ 'AgingInfo.DiedAt': null });
    }
    if (searchInChapter > 0) {
      filters.push({ 'DiplomacyEntries.Chapter': searchInChapter });
    }

    const results = await persons.find().and(filters).lean().exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function searchDummies(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const searchPattern = req.body.searchPattern;
  const searchInContent = req.body.searchInContent;
  const currentChapter = req.body.currentChapter;
  const logId = `Version.searchDummies: ${taleId}/${versionId}, '${searchPattern}', ${searchInContent}, ${currentChapter}`;

  try {
    console.debug(`API:${logId}...`);
    const persons = mongoose.model('PersonModel', personSchema, getCollectionName(taleId, versionId));
    var baseFilter = { DocumentType: 'Person', IsDummy: true };
    var filters = [];
    filters.push(baseFilter);

    if (searchPattern != '') {
      const regx = { $regex: `.*${searchPattern}.*`, $options: 'i' };

      if (searchInContent == true) {
        filters.push({ $or: [{ DocumentId: regx }, { Notes: { $elemMatch: { $and: [{ Content: regx }, { Chapter: currentChapter }] } } }] });
      } else {
        filters.push({ DocumentId: regx });
      }
    }

    const results = await persons.find().and(filters).lean().exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function getDeathbed(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const today = parseInt(req.body.today ?? '0');
  const logId = `Version.getDeathbed: ${taleId}/${versionId}.${today}`;

  const limit = today + 2 * 365; // last two years

  try {
    console.debug(`API:${logId}...`);
    const persons = mongoose.model('PersonModel', personSchema, getCollectionName(taleId, versionId));
    const results = await persons
      .find({
        DocumentType: 'Person',
        IsDummy: false,
        'AgingInfo.DiedAt': null,
        $and: [
          {
            'AgingInfo.ExpectedToDieAt': {
              $ne: null,
            },
          },
          {
            'AgingInfo.ExpectedToDieAt': {
              $lte: limit,
            },
          },
          {
            'AgingInfo.ExpectedToDieAt': {
              $gt: today,
            },
          },
        ],
      })
      .lean()
      .exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

// anecdotes

export async function loadRoots(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const logId = `Version.loadRoots: ${taleId}/${versionId}`;
  const collectionName = getCollectionName(taleId, versionId);

  try {
    console.debug(`API:${logId}...`);
    const anecdotes = mongoose.model('AnecdoteModel', anecdoteSchema, collectionName);
    const results = await anecdotes.aggregate(loadRootsProjection(collectionName)).exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function expandAnecdote(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const anecdoteId = req.body.anecdoteId;

  if (anecdoteId == '') {
    res.json({
      message: 'Failure',
      data: 'Anecdote id is empty',
    });
    return;
  }

  const logId = `Version.expandAnecdote: ${taleId}/${versionId}, ${anecdoteId}`;
  const collectionName = getCollectionName(taleId, versionId);

  try {
    console.debug(`API:${logId}...`);
    const anecdotes = mongoose.model('AnecdoteModel', anecdoteSchema, collectionName);
    const results = await anecdotes.aggregate(expandAnecdoteProjection(anecdoteId, collectionName)).exec();

    res.json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function searchAnecdote(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const searchPattern = req.body.searchPattern;
  const searchInContent = req.body.searchInContent;
  const searchInChapter = req.body.searchInChapter;

  const logId = `Version.searchAnecdote: ${taleId}/${versionId}, ${searchPattern}, ${searchInContent}, ${searchInChapter}`;
  const collectionName = getCollectionName(taleId, versionId);

  try {
    console.debug(`API:${logId}...`);
    const anecdotes = mongoose.model('AnecdoteModel', anecdoteSchema, collectionName);
    const results = await anecdotes.aggregate(searchAnecdoteProjection(searchPattern, searchInContent, searchInChapter, collectionName)).exec();
    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'Search results is inconsistent or could not be retrieved',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}

export async function fetchAnecdote(req, res) {
  if (!validate(req, res)) return;
  const taleId = req.params.taleId;
  const versionId = req.params.versionId;
  const anecdoteId = req.body.anecdoteId;

  if (anecdoteId == '') {
    res.json({
      message: 'Failure',
      data: 'Anecdote id is empty',
    });
    return;
  }

  const logId = `Version.fetchAnecdote: ${taleId}/${versionId}, ${anecdoteId}`;
  const collectionName = getCollectionName(taleId, versionId);

  try {
    console.debug(`API:${logId}...`);
    const anecdotes = mongoose.model('AnecdoteModel', anecdoteSchema, collectionName);
    const results = await anecdotes.aggregate(fetchAnecdoteProjection(anecdoteId, collectionName)).exec();
    if (results === null || results.length != 1) {
      res.json({
        message: 'Failure',
        data: 'Search results is inconsistent or could not be retrieved',
      });
      return;
    }

    res.json({
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    console.error(`ERR:${logId}: ${error}`);
    res.json({
      message: 'Failure',
      data: error,
    });
  }
}
