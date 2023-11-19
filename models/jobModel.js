const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateJobInputs:
 *      type: object
 *      required:
 *        - project_type
 *        - job_title
 *        - project_description
 *        - amount
 *        - installment
 *        - client_name
 *        - client_mobile
 *      properties:
 *        project_type:
 *          type: string
 *          default: sewing
 *        job_title:
 *          type: string
 *          default: sewing of 10 shirts
 *        project_description:
 *          type: string
 *          default: the colors where red and black
 *        amount:
 *          type: string
 *          default: 10000
 *        installment:
 *          type: string
 *          default: 2
 *        client_name:
 *          type: string
 *          default: Jane Deo
 *        client_mobile:
 *          type: string
 *          default: +2348033459665
 *    CreateJobResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        project_type:
 *          type: string
 *        job_title:
 *          type: string
 *        project_description:
 *          type: string
 *        amount:
 *          type: string
 *        installment:
 *          type: string
 *        client_namr:
 *          type: string
 *        client_mobile:
 *          type: string
 *
 *    EditJobsInputs:
 *      type: object
 *      properties:
 *        project_type:
 *          type: string
 *          default: sewing
 *        job_title:
 *          type: string
 *          default: sewing of 10 shirts
 *        project_description:
 *          type: string
 *          default: the colors where red and black
 *        amount:
 *          type: string
 *          default: 10000
 *        installment:
 *          type: string
 *          default: 2
 *        client_name:
 *          type: string
 *          default: Jane Deo
 *        client_mobile:
 *          type: string
 *          default: +2348033459665
 *
 *    TrackJobsInputs:
 *      type: object
 *      properties:
 *        trackingId:
 *          type: string
 *          default: DS2XDDNKY4FM
 *
 * */

const jobSchema = new mongoose.Schema(
  {
    project_type: {
      type: String,
      required: true,
      enum: ['laundry', 'logistics', 'sewing'],
    },
    job_title: {
      type: String,
      required: true,
    },
    project_description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    installment: {
      type: String,
      required: [true, 'this feild cannot be empty'],
    },
    client_name: {
      type: String,
      trim: true,
      required: true,
    },
    client_mobile: {
      type: Number,
      required: true,
    },
    jobStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'in progress', 'cancelled', 'completed'],
    },
    trackingId: {
      type: String,
      required: [true, 'this field cannot be empty'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    employeeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
jobSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: ['fullname', 'department'],
  });
  next();
});
const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
