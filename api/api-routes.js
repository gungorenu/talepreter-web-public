// TODO: implement jwt
//import environment from './config/environment.js';
//import { expressjwt as jwt } from 'express-jwt';
//const jwtAuth = jwt({ secret: environment.secret ?? 'dabidobi', algorithms: ['HS256'] });

import { Router } from 'express';

// Set default API response
let router = Router();
router.get('/', function (req, res) {
  res.json({
    status: 'Talepreter Web API works',
    message: 'Welcome!',
  });
});

// tale controller
import { getTales as TC_getTales, getVersions as TC_getVersions } from './controllers/tale.controller.js';
router.route('/tales').get(TC_getTales);
router.route('/tale/:taleId/versions').get(TC_getVersions);

// version controller
import {
  getWorld as VC_getWorld,
  getGroup as VC_getGroup,
  getSettlements as VC_getSettlements,
  searchPersons as VC_searchPersons,
  getActors as VC_getActors,
  getDeathbed as VC_getDeathbed,
  searchDummies as VC_searchDummies,
  getGroupSummary as VC_getGroupSummary,
  getChapters as VC_getChapters,
  getTimeline as VC_getTimeline,
  getCaches as VC_getCaches,
  getActorDetails as VC_getActorDetails,
  getGroupActorDetails as VC_getGroupActorDetails,
  loadRoots as VC_getRootAnecdotes,
  expandAnecdote as VC_expandAnecdote,
  searchAnecdote as VC_searchAnecdote,
  fetchAnecdote as VC_fetchAnecdote,
} from './controllers/version.controller.js';
router.route('/version/:taleId/:versionId/world').get(VC_getWorld);
router.route('/version/:taleId/:versionId/group').get(VC_getGroup);
router.route('/version/:taleId/:versionId/summary').post(VC_getGroupSummary);
router.route('/version/:taleId/:versionId/settlements').get(VC_getSettlements);
router.route('/version/:taleId/:versionId/chapters').get(VC_getChapters);
router.route('/version/:taleId/:versionId/timeline').get(VC_getTimeline);
router.route('/version/:taleId/:versionId/caches').get(VC_getCaches);
router.route('/version/:taleId/:versionId/actors').get(VC_getActors);
router.route('/version/:taleId/:versionId/actorDetails').post(VC_getActorDetails);
router.route('/version/:taleId/:versionId/groupActorDetails').post(VC_getGroupActorDetails);
router.route('/version/:taleId/:versionId/persons').post(VC_searchPersons);
router.route('/version/:taleId/:versionId/deathbed').post(VC_getDeathbed);
router.route('/version/:taleId/:versionId/dummies').post(VC_searchDummies);
router.route('/version/:taleId/:versionId/anecdotes/root').get(VC_getRootAnecdotes);
router.route('/version/:taleId/:versionId/anecdotes/expand').post(VC_expandAnecdote);
router.route('/version/:taleId/:versionId/anecdotes/search').post(VC_searchAnecdote);
router.route('/version/:taleId/:versionId/anecdotes/fetch').post(VC_fetchAnecdote);

// Export API routes
export default router;
