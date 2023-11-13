const authController = require('./../controllers/authController');
const jobController = require('./../controllers/jobController');
const express = require('express');

const router = express.Router();

// where doc code will be

/**
 * @openapi
 *
 * /api/v1/jobs/createjob:
 *  post:
 *      tags:
 *      - Jobs
 *      summary: Create a job
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateJobInputs'
 *      responses:
 *          201:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateJobResponse'
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * '/api/v1/jobs/editjob/{jobId}':
 *  patch:
 *      tags:
 *      - Jobs
 *      summary: Updates created jobs by the jobId
 *      parameters:
 *      - name: jobId
 *      in: path
 *      description: The job id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/EditJobsInputs'
 *          404:
 *              description: Job not Found
 *
 * /api/v1/jobs/track:
 *  post:
 *      tags:
 *      - Jobs
 *      summary: Tracks a job
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TrackJobsInputs'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * /api/v1/jobs/laundry:
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Gets all job request on laundry
 *      description: This logs all laundry jobs in this system
 *      responses:
 *          200:
 *              description: App is up and running
 *
 * /api/v1/jobs/logistics:
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Gets all job request on logistics
 *      description: This logs all logistics jobs in this system
 *      responses:
 *          200:
 *              description: App is up and running
 *
 * /api/v1/jobs/sewing:
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Gets all job request on sewing
 *      description: This logs all sewing jobs in this system
 *      responses:
 *          200:
 *              description: App is up and running
 *
 * /api/v1/jobs/report:
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Generates report on the system
 *      description: This logs all job activity in this system
 *      responses:
 *          200:
 *              description: App is up and running
 *
 * /api/v1/jobs/jobqueue:
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Gets all jobs on this system
 *      description: This logs all job activity in this system
 *      responses:
 *          200:
 *              description: App is up and running
 *
 * '/api/v1/jobs/{acceptId}/accept':
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Accepts job by the acceptId
 *      parameters:
 *      - name: acceptId
 *      in: path
 *      description: The job id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/CreateJobInputs'
 *          404:
 *              description: Job not Found
 *
 *
 * '/api/v1/jobs/{acceptId}/cancel':
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Cancels job by the acceptId
 *      parameters:
 *      - name: acceptId
 *      in: path
 *      description: The job id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/CreateJobInputs'
 *          404:
 *              description: Job not Found
 *
 *
 * '/api/v1/jobs/{acceptId}/complete':
 *  get:
 *      tags:
 *      - Jobs
 *      summary: Marks the job complete by the acceptId
 *      parameters:
 *      - name: acceptId
 *      in: path
 *      description: The job id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/CreateJobInputs'
 *          404:
 *              description: Job not Found
 *
 *
 */

router.post('/createjob', authController.protect, jobController.createNewJob);
router.patch('/editjob/:jobId', jobController.updateAJob);

router.get('/laundry', jobController.jobQueueLaundry);
router.get('/logistics', jobController.jobQueueLogistics);
router.get('/sewing', jobController.jobQueueSewing);
router.get('/report', jobController.reportGeneration);
router.get('/jobqueue', jobController.getAllJobsForEdit);

router.get('/:acceptId/accept', jobController.acceptJob);
router.get('/:acceptId/cancel', jobController.cancelATask);

router.post('/track', jobController.trackJobProgress);

router.use(authController.protect, authController.restrictTo('superAdmin'));
router.get('/:acceptId/complete', jobController.completeATask);

module.exports = router;
